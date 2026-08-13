"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImageUpload = exports.postDocumentUpload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utils/cloudinary");
const supabaseStorage_1 = require("../utils/supabaseStorage");
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
                originalName: file.originalname,
                mimeType: file.mimetype,
                kind,
            });
            return res.json({
                url: uploaded.url,
                path: uploaded.path,
                filename: uploaded.filename,
                originalName: file.originalname,
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
            originalName: file.originalname,
            mimeType: file.mimetype,
            kind,
        });
        return res.json({
            url: uploaded.url,
            path: uploaded.path,
            filename: uploaded.filename,
            originalName: file.originalname,
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
//# sourceMappingURL=uploadsController.js.map