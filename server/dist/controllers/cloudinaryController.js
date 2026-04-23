"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCloudinarySignature = postCloudinarySignature;
const cloudinary_1 = require("../utils/cloudinary");
function env(name) {
    const v = process.env[name];
    return v && v.trim().length > 0 ? v : undefined;
}
function pickString(body, key) {
    if (!body || typeof body !== 'object')
        return undefined;
    const v = body[key];
    return typeof v === 'string' && v.trim().length > 0 ? v : undefined;
}
/**
 * Issues a Cloudinary upload signature so the client can upload directly to Cloudinary.
 * Client sends allowed upload params (e.g. folder, public_id, tags, context), server responds with signature + timestamp.
 */
function postCloudinarySignature(req, res) {
    const cloudName = env('CLOUDINARY_CLOUD_NAME');
    const apiKey = env('CLOUDINARY_API_KEY');
    const apiSecret = env('CLOUDINARY_API_SECRET');
    if (!cloudName || !apiKey || !apiSecret) {
        return res.status(500).json({
            error: 'Cloudinary env vars missing',
            required: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
        });
    }
    const timestamp = Math.floor(Date.now() / 1000);
    // Whitelisted params only (Cloudinary signs any params you send, but we keep it tight for safety).
    const folder = pickString(req.body, 'folder') ?? env('CLOUDINARY_FOLDER');
    const public_id = pickString(req.body, 'public_id');
    const tags = pickString(req.body, 'tags');
    const context = pickString(req.body, 'context');
    const resource_type = pickString(req.body, 'resource_type'); // e.g. "image"
    const upload_preset = pickString(req.body, 'upload_preset'); // if you want to use a preset + signed upload
    const paramsToSign = {
        timestamp,
        folder,
        public_id,
        tags,
        context,
        resource_type,
        upload_preset,
    };
    const signature = (0, cloudinary_1.signCloudinaryParams)(paramsToSign, apiSecret);
    return res.json({
        cloudName,
        apiKey,
        timestamp,
        signature,
        // echo back the params the client should include in the upload form-data
        folder,
        public_id,
        tags,
        context,
        resource_type,
        upload_preset,
    });
}
//# sourceMappingURL=cloudinaryController.js.map