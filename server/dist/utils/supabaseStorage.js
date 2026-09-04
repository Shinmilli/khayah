"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupabaseStorageConfigured = isSupabaseStorageConfigured;
exports.uploadBufferToSupabase = uploadBufferToSupabase;
exports.removeFromSupabase = removeFromSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'uploads';
function isSupabaseStorageConfigured() {
    return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
function getAdminClient() {
    const url = process.env.SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) {
        throw new Error('Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
    return (0, supabase_js_1.createClient)(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
function safeFileName(originalName) {
    const ext = originalName.includes('.') ? originalName.slice(originalName.lastIndexOf('.')).toLowerCase() : '';
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return `${stamp}${ext || ''}`;
}
async function uploadBufferToSupabase(options) {
    const supabase = getAdminClient();
    const folder = options.kind === 'document' ? 'documents' : 'images';
    const filename = safeFileName(options.originalName);
    const objectPath = `${folder}/${filename}`;
    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, options.buffer, {
        contentType: options.mimeType || 'application/octet-stream',
        upsert: false,
    });
    if (error) {
        throw new Error(error.message || 'Supabase Storage upload failed');
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
    const publicUrl = data.publicUrl?.trim();
    if (!publicUrl) {
        throw new Error('Supabase public URL을 만들지 못했습니다. 버킷이 public인지 확인하세요.');
    }
    return {
        url: publicUrl,
        path: objectPath,
        filename,
        publicId: objectPath,
        bytes: options.buffer.length,
        resourceType: options.kind === 'document' ? 'raw' : 'image',
        provider: 'supabase',
    };
}
async function removeFromSupabase(objectPath) {
    const p = objectPath.trim();
    if (!p || !isSupabaseStorageConfigured())
        return;
    const supabase = getAdminClient();
    const { error } = await supabase.storage.from(BUCKET).remove([p]);
    if (error) {
        console.error('[supabase storage] remove failed', error.message);
    }
}
//# sourceMappingURL=supabaseStorage.js.map