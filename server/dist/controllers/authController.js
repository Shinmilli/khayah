"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGoogleLogin = postGoogleLogin;
exports.getMe = getMe;
exports.postLogout = postLogout;
exports.getAuthConfig = getAuthConfig;
exports.postDemoLogin = postDemoLogin;
const prisma_1 = require("../utils/prisma");
const googleIdToken_1 = require("../utils/googleIdToken");
const adminSession_1 = require("../utils/adminSession");
const requireAdmin_1 = require("../middlewares/requireAdmin");
const adminUsersService_1 = require("../services/adminUsersService");
function sendAdminError(res, e, fallback) {
    if (e instanceof adminUsersService_1.AdminHttpError) {
        res.status(e.status).json({ error: e.message });
        return;
    }
    console.error(e);
    const hint = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: fallback, hint });
}
async function postGoogleLogin(req, res) {
    if (!prisma_1.prisma) {
        res.status(503).json({ error: 'Database unavailable' });
        return;
    }
    const idToken = typeof req.body?.idToken === 'string' ? req.body.idToken.trim() : '';
    if (!idToken) {
        res.status(400).json({ error: 'idToken is required' });
        return;
    }
    let google;
    try {
        google = await (0, googleIdToken_1.verifyGoogleIdToken)(idToken);
    }
    catch (e) {
        console.error('[auth/google]', e);
        res.status(401).json({ error: 'Google 로그인 검증에 실패했습니다.' });
        return;
    }
    if (!google.email || !google.emailVerified) {
        res.status(403).json({ error: '인증된 Google 이메일만 사용할 수 있습니다.' });
        return;
    }
    const email = (0, adminUsersService_1.normalizeEmail)(google.email);
    const displayName = google.name || email.split('@')[0] || '';
    try {
        if ((0, adminUsersService_1.isHiddenBootstrapUser)(email)) {
            const user = await (0, adminUsersService_1.ensureBootstrapSuper)(email, displayName);
            const token = (0, adminSession_1.setAdminSessionCookie)(res, user.id);
            res.json({ user: (0, adminUsersService_1.toPublicUser)(user), token });
            return;
        }
        const existing = await (0, adminUsersService_1.findAdminUserByEmail)(email);
        if (!existing) {
            res.status(403).json({
                error: '등록되지 않은 계정입니다. 슈퍼 관리자에게 초대를 요청하세요.',
            });
            return;
        }
        if (!existing.active) {
            res.status(403).json({ error: '비활성화된 계정입니다.' });
            return;
        }
        const updated = await (0, adminUsersService_1.touchAdminLogin)(existing.id, displayName || existing.name);
        const token = (0, adminSession_1.setAdminSessionCookie)(res, updated.id);
        res.json({ user: (0, adminUsersService_1.toPublicUser)(updated), token });
    }
    catch (e) {
        sendAdminError(res, e, '로그인 처리에 실패했습니다.');
    }
}
async function getMe(req, res) {
    try {
        const user = await (0, requireAdmin_1.loadAdminUser)(req);
        if (!user) {
            res.status(401).json({ error: '로그인이 필요합니다.' });
            return;
        }
        res.json({ user });
    }
    catch (e) {
        sendAdminError(res, e, '세션 확인에 실패했습니다.');
    }
}
async function postLogout(_req, res) {
    (0, adminSession_1.clearAdminSessionCookie)(res);
    res.json({ ok: true });
}
function getAuthConfig(_req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ demoLogin: (0, adminSession_1.isDemoLoginAllowed)() });
}
async function postDemoLogin(_req, res) {
    if (!(0, adminSession_1.isDemoLoginAllowed)()) {
        res.status(403).json({ error: '임시 목업 로그인이 비활성화되어 있습니다.' });
        return;
    }
    try {
        let user = adminSession_1.DEMO_ADMIN_PUBLIC;
        if (prisma_1.prisma) {
            try {
                user = (0, adminUsersService_1.toPublicUser)(await (0, adminUsersService_1.ensureDemoSuper)());
            }
            catch (e) {
                console.warn('[auth/demo] admin_users upsert failed; issuing cookie-only demo session', e);
            }
        }
        else {
            console.warn('[auth/demo] database unavailable; issuing cookie-only demo session');
        }
        const token = (0, adminSession_1.setAdminSessionCookie)(res, user.id, {
            demo: true,
            role: user.role,
            email: user.email,
            name: user.name,
        });
        res.json({ user, token });
    }
    catch (e) {
        sendAdminError(res, e, '목업 로그인에 실패했습니다.');
    }
}
//# sourceMappingURL=authController.js.map