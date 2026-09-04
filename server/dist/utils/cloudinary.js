"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudinaryConfigured = isCloudinaryConfigured;
exports.configureCloudinary = configureCloudinary;
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.downloadCloudinaryRawBuffer = downloadCloudinaryRawBuffer;
exports.destroyCloudinaryAsset = destroyCloudinaryAsset;
const cloudinary_1 = require("cloudinary");
function isCloudinaryConfigured() {
    return Boolean(process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
        process.env.CLOUDINARY_API_KEY?.trim() &&
        process.env.CLOUDINARY_API_SECRET?.trim());
}
function configureCloudinary() {
    if (!isCloudinaryConfigured()) {
        throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
    }
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
}
function folderPrefix() {
    return (process.env.CLOUDINARY_FOLDER ?? 'khayah').replace(/^\/+|\/+$/g, '');
}
async function uploadBufferToCloudinary(options) {
    configureCloudinary();
    const folder = `${folderPrefix()}/${options.kind === 'document' ? 'documents' : 'images'}`;
    const resourceType = options.kind === 'document' ? 'raw' : 'image';
    // public_id에 .pdf를 넣으면 Cloudinary delivery URL이 401이 나는 경우가 있음 → 확장자 제외
    const publicId = options.kind === 'document'
        ? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
        : undefined;
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: resourceType,
            ...(publicId ? { public_id: publicId } : {}),
            // 한글/특수문자 파일명은 public_id로 쓰지 않음 (Cloudinary 오류 방지)
            use_filename: false,
            unique_filename: !publicId,
            overwrite: false,
            type: 'upload',
            access_mode: 'public',
        }, (err, uploaded) => {
            if (err || !uploaded?.secure_url || !uploaded.public_id) {
                reject(err ?? new Error('Cloudinary upload failed'));
                return;
            }
            resolve(uploaded);
        });
        stream.end(options.buffer);
    });
    const filename = result.original_filename ?? result.public_id.split('/').pop() ?? options.originalName;
    return {
        url: result.secure_url,
        path: result.public_id,
        filename,
        publicId: result.public_id,
        bytes: result.bytes,
        resourceType: result.resource_type,
        format: result.format,
    };
}
/** public delivery가 401인 raw(특히 public_id에 .pdf 포함)용 인증 다운로드 */
async function downloadCloudinaryRawBuffer(publicId) {
    const id = publicId.trim();
    if (!id || !isCloudinaryConfigured())
        return null;
    configureCloudinary();
    const candidates = id.toLowerCase().endsWith('.pdf')
        ? [id, id.slice(0, -4)]
        : [id, `${id}.pdf`];
    for (const pid of candidates) {
        try {
            const dl = cloudinary_1.v2.utils.private_download_url(pid, '', {
                resource_type: 'raw',
                type: 'upload',
                expires_at: Math.floor(Date.now() / 1000) + 120,
            });
            const upstream = await fetch(dl, { redirect: 'follow' });
            if (!upstream.ok)
                continue;
            const buf = Buffer.from(await upstream.arrayBuffer());
            if (buf.length >= 5 && buf.subarray(0, 4).toString('utf8') === '%PDF')
                return buf;
        }
        catch (e) {
            console.warn('[cloudinary] private download failed', { publicId: pid, e });
        }
    }
    return null;
}
async function destroyCloudinaryAsset(publicId, resourceTypeHint) {
    if (!publicId.trim() || !isCloudinaryConfigured())
        return 'failed';
    configureCloudinary();
    const order = resourceTypeHint === 'image'
        ? ['image', 'raw']
        : resourceTypeHint === 'raw'
            ? ['raw', 'image']
            : ['raw', 'image'];
    let sawNotFound = false;
    for (const resource_type of order) {
        try {
            const r = await cloudinary_1.v2.uploader.destroy(publicId, {
                resource_type,
                type: 'upload',
                invalidate: true,
            });
            if (r?.result === 'ok')
                return 'ok';
            if (r?.result === 'not found') {
                sawNotFound = true;
                continue;
            }
        }
        catch (e) {
            console.warn('[cloudinary] destroy try failed', { publicId, resource_type, e });
        }
    }
    return sawNotFound ? 'not_found' : 'failed';
}
//# sourceMappingURL=cloudinary.js.map