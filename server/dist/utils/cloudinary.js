"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signCloudinaryParams = signCloudinaryParams;
const crypto_1 = __importDefault(require("crypto"));
function toCloudinarySignatureBase(params) {
    const entries = [];
    for (const [key, raw] of Object.entries(params)) {
        if (raw === undefined || raw === null)
            continue;
        if (key === 'file' || key === 'api_key' || key === 'signature')
            continue;
        entries.push([key, String(raw)]);
    }
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return entries.map(([k, v]) => `${k}=${v}`).join('&');
}
function signCloudinaryParams(params, apiSecret) {
    const base = toCloudinarySignatureBase(params);
    return crypto_1.default
        .createHash('sha1')
        .update(`${base}${apiSecret}`)
        .digest('hex');
}
//# sourceMappingURL=cloudinary.js.map