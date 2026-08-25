"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRateLimited = isRateLimited;
exports.clientIp = clientIp;
const buckets = new Map();
/** 단순 인메모리 rate limit (프로세스 단위). 초과 시 true */
function isRateLimited(key, limit, windowMs) {
    const now = Date.now();
    const cur = buckets.get(key);
    if (!cur || cur.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }
    cur.count += 1;
    if (cur.count > limit)
        return true;
    return false;
}
function clientIp(req) {
    const xf = req.headers['x-forwarded-for'];
    if (typeof xf === 'string' && xf.trim())
        return xf.split(',')[0].trim();
    return req.ip || 'unknown';
}
//# sourceMappingURL=rateLimit.js.map