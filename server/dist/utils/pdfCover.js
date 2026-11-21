"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warmPdfCoverRenderer = warmPdfCoverRenderer;
exports.getCachedPdfCover = getCachedPdfCover;
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const module_1 = require("module");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const nodeRequire = (0, module_1.createRequire)(__filename);
const pdfjsRoot = path_1.default.dirname(nodeRequire.resolve('pdfjs-dist/package.json'));
const cMapUrl = path_1.default.join(pdfjsRoot, 'cmaps') + path_1.default.sep;
const standardFontDataUrl = path_1.default.join(pdfjsRoot, 'standard_fonts') + path_1.default.sep;
const CACHE_DIR = path_1.default.join(os_1.default.tmpdir(), 'khayah-pdf-covers');
const TARGET_WIDTH = 720;
const MAX_HEIGHT = 1280;
const JPEG_QUALITY = 72;
const MEMORY_MAX = 32;
const RENDER_SLOTS = 2;
const memory = new Map();
const pending = new Map();
let cacheDirReady = null;
let activeRenders = 0;
const renderWaiters = [];
function remember(key, buf) {
    if (memory.has(key))
        memory.delete(key);
    memory.set(key, buf);
    while (memory.size > MEMORY_MAX) {
        const oldest = memory.keys().next().value;
        if (oldest === undefined)
            break;
        memory.delete(oldest);
    }
}
function ensureCacheDir() {
    if (!cacheDirReady)
        cacheDirReady = (0, promises_1.mkdir)(CACHE_DIR, { recursive: true }).then(() => undefined);
    return cacheDirReady;
}
async function readDisk(key) {
    try {
        return await (0, promises_1.readFile)(path_1.default.join(CACHE_DIR, `${key}.jpg`));
    }
    catch {
        return null;
    }
}
async function withRenderSlot(fn) {
    if (activeRenders >= RENDER_SLOTS) {
        await new Promise((resolve) => renderWaiters.push(resolve));
    }
    activeRenders += 1;
    try {
        return await fn();
    }
    finally {
        activeRenders -= 1;
        renderWaiters.shift()?.();
    }
}
async function loadPdfjs() {
    const dynamicImport = new Function('specifier', 'return import(specifier)');
    return dynamicImport('pdfjs-dist/legacy/build/pdf.mjs');
}
async function renderPdfFirstPageJpeg(source) {
    const pdfjs = await loadPdfjs();
    const src = typeof source === 'string'
        ? {
            url: source,
            disableAutoFetch: true,
            disableStream: true,
            rangeChunkSize: 65536,
        }
        : { data: new Uint8Array(source) };
    const task = pdfjs.getDocument({
        ...src,
        cMapUrl,
        cMapPacked: true,
        standardFontDataUrl,
        isEvalSupported: false,
        verbosity: 0,
    });
    const doc = await task.promise;
    let canvasAndContext = null;
    try {
        const page = await doc.getPage(1);
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(TARGET_WIDTH / base.width, MAX_HEIGHT / base.height);
        const viewport = page.getViewport({ scale: Number.isFinite(scale) && scale > 0 ? scale : 1 });
        canvasAndContext = doc.canvasFactory.create(Math.ceil(viewport.width), Math.ceil(viewport.height));
        const ctx = canvasAndContext.context;
        const canvas = canvasAndContext.canvas;
        if (!ctx || !canvas)
            throw new Error('canvas');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const jpeg = canvas.toBuffer('image/jpeg', JPEG_QUALITY);
        page.cleanup();
        return jpeg;
    }
    finally {
        if (canvasAndContext) {
            try {
                doc.canvasFactory.destroy(canvasAndContext);
            }
            catch {
                /* ignore */
            }
        }
        await doc.destroy().catch(() => undefined);
    }
}
async function writeCache(key, jpeg) {
    await ensureCacheDir();
    const finalPath = path_1.default.join(CACHE_DIR, `${key}.jpg`);
    const tmpPath = `${finalPath}.${process.pid}.tmp`;
    await (0, promises_1.writeFile)(tmpPath, jpeg);
    await (0, promises_1.rename)(tmpPath, finalPath);
}
function tinyWarmPdf() {
    const stream = 'BT /F1 12 Tf 40 40 Td ( ) Tj ET\n';
    const header = '%PDF-1.4\n';
    const objs = [
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
        `4 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
        '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    ];
    let body = header;
    const offsets = [0];
    for (const obj of objs) {
        offsets.push(Buffer.byteLength(body));
        body += obj;
    }
    const xrefPos = Buffer.byteLength(body);
    let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objs.length; i += 1) {
        xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    return Buffer.from(`${body}${xref}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);
}
/** pdf.js와 캔버스를 미리 올려, 첫 표지 요청이 라이브러리 로딩을 기다리지 않게 한다. */
function warmPdfCoverRenderer() {
    const started = Date.now();
    void renderPdfFirstPageJpeg(tinyWarmPdf())
        .then(() => {
        console.log('[uploads] pdf cover renderer ready', `${Date.now() - started}ms`);
    })
        .catch((e) => {
        console.warn('[uploads] pdf cover renderer warm failed', e);
    });
}
/** 같은 PDF URL은 첫 요청만 렌더하고, 이후에는 JPEG를 바로 돌려준다. */
async function getCachedPdfCover(pdfUrl, loadPdf) {
    const key = (0, crypto_1.createHash)('sha256').update(`v1|${pdfUrl}`).digest('hex');
    const hot = memory.get(key);
    if (hot)
        return hot;
    const disk = await readDisk(key);
    if (disk) {
        remember(key, disk);
        return disk;
    }
    const existing = pending.get(key);
    if (existing)
        return existing;
    const job = (async () => {
        const again = memory.get(key) ?? (await readDisk(key));
        if (again) {
            remember(key, again);
            return again;
        }
        let jpeg;
        try {
            jpeg = await withRenderSlot(() => renderPdfFirstPageJpeg(pdfUrl));
        }
        catch (err) {
            console.warn('[uploads] pdf cover url render failed, downloading full file', err);
            jpeg = await withRenderSlot(async () => renderPdfFirstPageJpeg(await loadPdf()));
        }
        remember(key, jpeg);
        await writeCache(key, jpeg).catch((e) => {
            console.warn('[uploads] pdf cover cache write failed', e);
        });
        return jpeg;
    })().finally(() => {
        pending.delete(key);
    });
    pending.set(key, job);
    return job;
}
//# sourceMappingURL=pdfCover.js.map