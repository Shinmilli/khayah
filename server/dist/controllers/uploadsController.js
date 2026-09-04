"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImageUpload = exports.postDocumentUpload = void 0;
exports.deleteUpload = deleteUpload;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utils/cloudinary");
const supabaseStorage_1 = require("../utils/supabaseStorage");
const uploadFilename_1 = require("../utils/uploadFilename");
const storedMedia_1 = require("../utils/storedMedia");
const uploadSniff_1 = require("../utils/uploadSniff");
/** Cloudinary free ~10MB — larger files go to Supabase Storage */
const CLOUDINARY_MAX_BYTES = 10 * 1024 * 1024;
const memory = multer_1.default.memoryStorage();
function pdfFilter(_req, file, cb) {
    const okMime = file.mimetype === 'application/pdf';
    const okExt = path_1.default.extname(file.originalname ?? '').toLowerCase() === '.pdf';
    if (okMime || okExt)
        return cb(null, true);
    return cb(new Error('Only PDF files are allowed'));
}
function imageFilter(_req, file, cb) {
    if (/^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype))
        return cb(null, true);
    const ext = path_1.default.extname(file.originalname ?? '').toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext))
        return cb(null, true);
    return cb(new Error('Only JPEG, PNG, WebP, or GIF images are allowed'));
}
const uploadPdf = (0, multer_1.default)({
    storage: memory,
    fileFilter: pdfFilter,
    // Supabase Storage default max ~50MB
    limits: { fileSize: 50 * 1024 * 1024 },
});
const uploadImage = (0, multer_1.default)({
    storage: memory,
    fileFilter: imageFilter,
    limits: { fileSize: 15 * 1024 * 1024 },
});
function runMulter(middleware) {
    return (req, res, next) => {
        middleware(req, res, (err) => {
            if (!err)
                return next();
            if (err instanceof multer_1.default.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: '파일이 너무 큽니다. PDF는 최대 50MB까지 업로드할 수 있습니다.',
                });
            }
            const message = err instanceof Error ? err.message : 'Upload failed';
            return res.status(400).json({ error: message });
        });
    };
}
async function handleUpload(req, res, kind) {
    const file = req.file;
    if (!file?.buffer) {
        return res.status(400).json({ error: 'No file uploaded (field name: file)' });
    }
    // 이미지가 documents(raw)로 들어가는 사고 방지
    if (kind === 'document') {
        if ((0, uploadSniff_1.looksLikeImageBuffer)(file.buffer, file.mimetype, file.originalname)) {
            return res.status(400).json({
                error: '이미지 파일은 PDF 업로드로 올릴 수 없습니다. 표지/본문 이미지 업로드를 사용하세요.',
            });
        }
        if (!(0, uploadSniff_1.looksLikePdfBuffer)(file.buffer)) {
            return res.status(400).json({
                error: 'PDF 내용이 아닙니다. 올바른 PDF 파일인지 확인하세요.',
            });
        }
    }
    const resolvedKind = kind === 'image' || (0, uploadSniff_1.looksLikeImageBuffer)(file.buffer, file.mimetype, file.originalname)
        ? 'image'
        : 'document';
    if (kind === 'image' && resolvedKind !== 'image') {
        return res.status(400).json({ error: '이미지 파일만 업로드할 수 있습니다.' });
    }
    const originalName = (0, uploadFilename_1.decodeOriginalFilename)(file.originalname, resolvedKind === 'document' ? 'file.pdf' : 'image');
    const useSupabase = file.size > CLOUDINARY_MAX_BYTES;
    try {
        if (useSupabase) {
            if (!(0, supabaseStorage_1.isSupabaseStorageConfigured)()) {
                return res.status(503).json({
                    error: 'File is larger than 10MB but Supabase Storage is not configured',
                    required: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
                    hint: 'Create a public bucket named uploads in Supabase Storage, then set the env vars on Render.',
                });
            }
            const uploaded = await (0, supabaseStorage_1.uploadBufferToSupabase)({
                buffer: file.buffer,
                originalName,
                mimeType: file.mimetype,
                kind: resolvedKind,
            });
            return res.json({
                url: uploaded.url,
                path: uploaded.path,
                filename: uploaded.filename,
                originalName,
                mimeType: file.mimetype,
                size: uploaded.bytes || file.size,
                publicId: uploaded.publicId,
                resourceType: uploaded.resourceType,
                provider: 'supabase',
            });
        }
        if (!(0, cloudinary_1.isCloudinaryConfigured)()) {
            return res.status(503).json({
                error: 'Cloudinary is not configured',
                required: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
            });
        }
        const uploaded = await (0, cloudinary_1.uploadBufferToCloudinary)({
            buffer: file.buffer,
            originalName,
            mimeType: file.mimetype,
            kind: resolvedKind,
        });
        return res.json({
            url: uploaded.url,
            path: uploaded.path,
            filename: uploaded.filename,
            originalName,
            mimeType: file.mimetype,
            size: uploaded.bytes || file.size,
            publicId: uploaded.publicId,
            resourceType: uploaded.resourceType,
            provider: 'cloudinary',
        });
    }
    catch (e) {
        console.error('[uploads] error', e);
        const anyErr = e;
        const message = anyErr?.message || (e instanceof Error ? e.message : 'Upload failed');
        return res.status(500).json({
            error: message,
            http_code: anyErr?.http_code,
            provider: useSupabase ? 'supabase' : 'cloudinary',
        });
    }
}
exports.postDocumentUpload = [
    runMulter(uploadPdf.single('file')),
    (req, res) => {
        void handleUpload(req, res, 'document');
    },
];
exports.postImageUpload = [
    runMulter(uploadImage.single('file')),
    (req, res) => {
        void handleUpload(req, res, 'image');
    },
];
async function deleteUpload(req, res) {
    const body = req.body;
    const url = typeof body?.url === 'string' ? body.url.trim() : '';
    if (!url && !body?.publicId && !body?.path) {
        return res.status(400).json({ error: 'url, publicId, or path is required' });
    }
    try {
        await (0, storedMedia_1.deleteStoredMedia)({
            url,
            publicId: typeof body?.publicId === 'string' ? body.publicId : undefined,
            path: typeof body?.path === 'string' ? body.path : undefined,
            provider: typeof body?.provider === 'string' ? body.provider : undefined,
            resourceType: typeof body?.resourceType === 'string' ? body.resourceType : undefined,
        });
        return res.json({ ok: true });
    }
    catch (e) {
        console.error('[uploads] delete error', e);
        return res.status(500).json({ error: e instanceof Error ? e.message : 'Delete failed' });
    }
}
//# sourceMappingURL=uploadsController.js.map