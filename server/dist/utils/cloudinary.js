"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudinaryConfigured = isCloudinaryConfigured;
exports.configureCloudinary = configureCloudinary;
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
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
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: resourceType,
            // 한글/특수문자 파일명은 public_id로 쓰지 않음 (Cloudinary 오류 방지)
            use_filename: false,
            unique_filename: true,
            overwrite: false,
            // PDF raw도 공개 URL로 바로 열리게
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
//# sourceMappingURL=cloudinary.js.map