"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePdfFilesMeta = parsePdfFilesMeta;
exports.guessProvider = guessProvider;
exports.extractMediaFromHtml = extractMediaFromHtml;
exports.collectPostMedia = collectPostMedia;
exports.cloudinaryPublicIdCandidates = cloudinaryPublicIdCandidates;
exports.deleteStoredMedia = deleteStoredMedia;
exports.deleteStoredMediaMany = deleteStoredMediaMany;
exports.mediaNotIn = mediaNotIn;
const cloudinary_1 = require("./cloudinary");
const supabaseStorage_1 = require("./supabaseStorage");
function isRecord(v) {
    return Boolean(v) && typeof v === 'object';
}
function parsePdfFilesMeta(meta) {
    const out = [];
    const seen = new Set();
    const push = (ref) => {
        const url = ref.url?.trim();
        if (!url || seen.has(url))
            return;
        seen.add(url);
        out.push({ ...ref, url });
    };
    const raw = meta.khayah_pdf_files?.trim();
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                for (const item of parsed) {
                    if (!isRecord(item) || typeof item.url !== 'string')
                        continue;
                    push({
                        url: item.url,
                        name: typeof item.name === 'string' ? item.name : undefined,
                        publicId: typeof item.publicId === 'string' ? item.publicId : undefined,
                        path: typeof item.path === 'string' ? item.path : undefined,
                        provider: typeof item.provider === 'string' ? item.provider : undefined,
                        resourceType: typeof item.resourceType === 'string' ? item.resourceType : undefined,
                    });
                }
            }
        }
        catch {
            // ignore invalid json
        }
    }
    const legacy = meta.khayah_pdf_url?.trim();
    if (legacy) {
        push({
            url: legacy,
            name: meta.khayah_pdf_name?.trim() || undefined,
            provider: guessProvider(legacy),
            resourceType: legacy.includes('/raw/') ? 'raw' : undefined,
        });
    }
    return out;
}
function guessProvider(url) {
    if (url.includes('/storage/v1/object/public/'))
        return 'supabase';
    if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com'))
        return 'cloudinary';
    return undefined;
}
/** 본문 HTML의 img / Cloudinary·Supabase 미디어 URL 수집 */
function extractMediaFromHtml(html) {
    if (!html?.trim())
        return [];
    const out = [];
    const seen = new Set();
    const push = (url, resourceType) => {
        const u = url.trim();
        if (!u || seen.has(u))
            return;
        const provider = guessProvider(u);
        if (!provider)
            return;
        seen.add(u);
        out.push({
            url: u,
            provider,
            resourceType: resourceType ||
                (u.includes('/raw/upload/') ? 'raw' : provider === 'cloudinary' ? 'image' : undefined),
        });
    };
    const srcRe = /(?:src|href)=["']([^"']+)["']/gi;
    let m;
    while ((m = srcRe.exec(html))) {
        push(m[1]);
    }
    return out;
}
function collectPostMedia(meta, contentHtml) {
    const files = parsePdfFilesMeta(meta);
    const cover = meta.khayah_cover_url?.trim();
    if (cover && !files.some((f) => f.url === cover)) {
        files.push({ url: cover, provider: guessProvider(cover), resourceType: 'image' });
    }
    for (const ref of extractMediaFromHtml(contentHtml)) {
        if (!files.some((f) => f.url === ref.url))
            files.push(ref);
    }
    return files;
}
function supabasePathFromUrl(url) {
    const m = url.match(/\/object\/public\/[^/]+\/(.+?)(?:\?|$)/);
    return m?.[1] ? decodeURIComponent(m[1]) : undefined;
}
/** Cloudinary URL → 시도할 public_id 후보들 (.pdf 유무 등) */
function cloudinaryPublicIdCandidates(url, explicit) {
    const out = [];
    const add = (id) => {
        const v = id?.trim();
        if (!v || out.includes(v))
            return;
        out.push(v);
    };
    add(explicit);
    const m = url.match(/\/(?:raw|image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\?|$)/);
    if (m?.[1]) {
        const decoded = decodeURIComponent(m[1]);
        add(decoded);
        if (decoded.toLowerCase().endsWith('.pdf'))
            add(decoded.slice(0, -4));
        else
            add(`${decoded}.pdf`);
    }
    return out;
}
function cloudinaryResourceHint(url, explicit) {
    if (explicit)
        return explicit;
    if (url.includes('/image/upload/'))
        return 'image';
    if (url.includes('/raw/upload/'))
        return 'raw';
    if (url.toLowerCase().includes('.pdf'))
        return 'raw';
    return undefined;
}
async function deleteStoredMedia(ref) {
    const url = ref.url?.trim() ?? '';
    const provider = ref.provider || (url ? guessProvider(url) : undefined);
    if (provider === 'supabase') {
        const objectPath = ref.path || (url ? supabasePathFromUrl(url) : undefined) || ref.publicId;
        if (objectPath)
            await (0, supabaseStorage_1.removeFromSupabase)(objectPath);
        return;
    }
    if (provider === 'cloudinary') {
        const ids = cloudinaryPublicIdCandidates(url, ref.publicId);
        const hint = cloudinaryResourceHint(url, ref.resourceType);
        if (!ids.length) {
            throw new Error('Cloudinary public_id를 확인할 수 없습니다.');
        }
        let allNotFound = true;
        for (const id of ids) {
            const outcome = await (0, cloudinary_1.destroyCloudinaryAsset)(id, hint);
            if (outcome === 'ok')
                return;
            if (outcome !== 'not_found')
                allNotFound = false;
        }
        // 후보 전부 없음 = 이미 삭제된 것으로 멱등 성공
        if (allNotFound)
            return;
        console.warn('[storedMedia] cloudinary delete failed', { url, ids, hint });
        throw new Error(`Cloudinary 삭제 실패: ${ids[0]}`);
    }
}
async function deleteStoredMediaMany(refs) {
    for (const ref of refs) {
        try {
            await deleteStoredMedia(ref);
        }
        catch (e) {
            console.error('[storedMedia] delete failed', ref.url, e);
        }
    }
}
function mediaNotIn(oldRefs, newRefs) {
    const keep = new Set(newRefs.map((r) => r.url.trim()).filter(Boolean));
    return oldRefs.filter((r) => r.url.trim() && !keep.has(r.url.trim()));
}
//# sourceMappingURL=storedMedia.js.map