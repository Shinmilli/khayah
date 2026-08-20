"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePdfFilesMeta = parsePdfFilesMeta;
exports.collectPostMedia = collectPostMedia;
exports.guessProvider = guessProvider;
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
        });
    }
    return out;
}
function collectPostMedia(meta) {
    const files = parsePdfFilesMeta(meta);
    const cover = meta.khayah_cover_url?.trim();
    if (cover && !files.some((f) => f.url === cover)) {
        files.push({ url: cover, provider: guessProvider(cover), resourceType: 'image' });
    }
    return files;
}
function guessProvider(url) {
    if (url.includes('/storage/v1/object/public/'))
        return 'supabase';
    if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com'))
        return 'cloudinary';
    return undefined;
}
function supabasePathFromUrl(url) {
    const m = url.match(/\/object\/public\/[^/]+\/(.+?)(?:\?|$)/);
    return m?.[1] ? decodeURIComponent(m[1]) : undefined;
}
function cloudinaryPublicIdFromUrl(url) {
    const m = url.match(/\/(?:raw|image|video)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!m?.[1])
        return undefined;
    return decodeURIComponent(m[1]);
}
function cloudinaryResourceHint(url, explicit) {
    if (explicit)
        return explicit;
    if (url.includes('/image/upload/'))
        return 'image';
    if (url.includes('/raw/upload/'))
        return 'raw';
    return undefined;
}
async function deleteStoredMedia(ref) {
    const url = ref.url?.trim() ?? '';
    const provider = ref.provider || (url ? guessProvider(url) : undefined);
    if (provider === 'supabase') {
        const objectPath = ref.path || (url ? supabasePathFromUrl(url) : undefined);
        if (objectPath)
            await (0, supabaseStorage_1.removeFromSupabase)(objectPath);
        return;
    }
    if (provider === 'cloudinary') {
        const publicId = ref.publicId || (url ? cloudinaryPublicIdFromUrl(url) : undefined);
        if (publicId)
            await (0, cloudinary_1.destroyCloudinaryAsset)(publicId, cloudinaryResourceHint(url, ref.resourceType));
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