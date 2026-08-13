"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImageUpload = exports.postDocumentUpload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utils/cloudinary");
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
    limits: { fileSize: 25 * 1024 * 1024 },
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
async function handleCloudinaryUpload(req, res, kind) {
    if (!(0, cloudinary_1.isCloudinaryConfigured)()) {
        return res.status(503).json({
            error: 'Cloudinary is not configured',
            required: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
        });
    }
    const file = req.file;
    if (!file?.buffer) {
        return res.status(400).json({ error: 'No file uploaded (field name: file)' });
    }
    try {
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
        });
    }
    catch (e) {
        console.error('[uploads] Cloudinary error', e);
        const anyErr = e;
        const message = anyErr?.message ||
            (e instanceof Error ? e.message : 'Cloudinary upload failed');
        return res.status(500).json({
            error: message,
            http_code: anyErr?.http_code,
            hint: /File size too large|maximum|10.?MB|25.?MB/i.test(message)
                ? 'Cloudinary free tier often limits uploads to about 10MB. Try a smaller PDF.'
                : undefined,
        });
    }
}
exports.postDocumentUpload = [
    runMulter(uploadPdf.single('file')),
    (req, res) => {
        void handleCloudinaryUpload(req, res, 'document');
    },
];
exports.postImageUpload = [
    runMulter(uploadImage.single('file')),
    (req, res) => {
        void handleCloudinaryUpload(req, res, 'image');
    },
];
//# sourceMappingURL=uploadsController.js.map