"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDocumentUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
function getUploadsDir() {
    return process.env.UPLOADS_DIR ?? path_1.default.resolve(process.cwd(), 'uploads');
}
function ensureUploadsDirExists() {
    const dir = getUploadsDir();
    fs_1.default.mkdirSync(dir, { recursive: true });
}
function safeBaseName(name) {
    // keep: letters, numbers, dot, dash, underscore
    const base = name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return base.length > 0 ? base : 'file';
}
ensureUploadsDirExists();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, getUploadsDir());
    },
    filename: (_req, file, cb) => {
        const original = file.originalname ?? 'document.pdf';
        const ext = path_1.default.extname(original).toLowerCase() || '.pdf';
        const base = safeBaseName(path_1.default.basename(original, path_1.default.extname(original))).slice(0, 80);
        const stamp = Date.now();
        cb(null, `${base}-${stamp}${ext}`);
    },
});
function fileFilter(_req, file, cb) {
    const okMime = file.mimetype === 'application/pdf';
    const okExt = path_1.default.extname(file.originalname ?? '').toLowerCase() === '.pdf';
    if (okMime || okExt)
        return cb(null, true);
    return cb(new Error('Only PDF files are allowed'));
}
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});
exports.postDocumentUpload = [
    upload.single('file'),
    (req, res) => {
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: 'No file uploaded (field name: file)' });
        const publicPath = `/uploads/${file.filename}`;
        const host = req.get('host');
        const url = host ? `${req.protocol}://${host}${publicPath}` : publicPath;
        return res.json({
            url,
            path: publicPath,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
        });
    },
];
//# sourceMappingURL=uploadsController.js.map