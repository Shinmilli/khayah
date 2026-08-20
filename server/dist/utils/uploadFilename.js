"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeOriginalFilename = decodeOriginalFilename;
/** Multer often gives originalname as latin1; recover UTF-8 (한글 파일명). */
function decodeOriginalFilename(raw, fallback = 'file') {
    if (!raw?.trim())
        return fallback;
    try {
        const utf8 = Buffer.from(raw, 'latin1').toString('utf8');
        return (utf8 || raw).replace(/[/\\]/g, '_').trim() || fallback;
    }
    catch {
        return raw.replace(/[/\\]/g, '_').trim() || fallback;
    }
}
//# sourceMappingURL=uploadFilename.js.map