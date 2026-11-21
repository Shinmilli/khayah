"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdfCover = getPdfCover;
const pdfCover_1 = require("../utils/pdfCover");
const pdfSource_1 = require("../utils/pdfSource");
class PdfLoadError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
/** 소식지 목록용 1페이지 JPEG. PDF 전체를 브라우저로 내리지 않는다. */
async function getPdfCover(req, res) {
    const raw = (0, pdfSource_1.readQuery)(req, 'url');
    if (!raw) {
        res.status(400).json({ error: 'url is required' });
        return;
    }
    try {
        const jpeg = await (0, pdfCover_1.getCachedPdfCover)(raw, async () => {
            const loaded = await (0, pdfSource_1.loadAllowedPdf)(raw);
            if (!loaded.ok)
                throw new PdfLoadError(loaded.status, loaded.error);
            return loaded.buf;
        });
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(jpeg);
    }
    catch (e) {
        const status = e instanceof PdfLoadError ? e.status : 502;
        const message = e instanceof Error ? e.message : String(e);
        if (status >= 500)
            console.error('[uploads] pdf cover error', message);
        if (!res.headersSent) {
            res.setHeader('Cache-Control', 'no-store');
            res.status(status).json({ error: status >= 500 ? 'Failed to render PDF cover' : message });
        }
    }
}
//# sourceMappingURL=pdfCoverController.js.map