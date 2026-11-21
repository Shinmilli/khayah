"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAdminUser = loadAdminUser;
exports.requireRoles = requireRoles;
exports.adminAuthGuard = adminAuthGuard;
const adminAuth_1 = require("../types/adminAuth");
const prisma_1 = require("../utils/prisma");
const adminSession_1 = require("../utils/adminSession");
const adminUsersService_1 = require("../services/adminUsersService");
async function loadAdminUser(req) {
    const token = (0, adminSession_1.readSessionToken)(req);
    if (!token)
        return null;
    let session = null;
    try {
        session = (0, adminSession_1.verifyAdminSession)(token);
    }
    catch {
        return null;
    }
    if (!session)
        return null;
    if (session.demo) {
        if (!(0, adminSession_1.isDemoLoginAllowed)())
            return null;
        return (0, adminSession_1.demoUserFromSession)(session);
    }
    if (!prisma_1.prisma)
        return null;
    const row = await (0, adminUsersService_1.findAdminUserById)(session.uid);
    if (!row || !row.active || !(0, adminAuth_1.isAdminRole)(row.role))
        return null;
    return {
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        active: true,
        lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
    };
}
function requireRoles(roles) {
    return async (req, res, next) => {
        try {
            const user = await loadAdminUser(req);
            if (!user) {
                res.status(401).json({ error: '로그인이 필요합니다.' });
                return;
            }
            if (!roles.includes(user.role)) {
                res.status(403).json({ error: '권한이 없습니다.' });
                return;
            }
            ;
            req.adminUser = user;
            next();
        }
        catch (e) {
            console.error('[admin auth]', e);
            res.status(500).json({ error: '인증 처리 중 오류가 났습니다.' });
        }
    };
}
const SUPER = ['super'];
const CONTENT = ['super', 'content'];
const INQUIRY = ['super', 'inquiry'];
const FAQ = ['super', 'content', 'inquiry'];
/** Path-based RBAC for /api (mounted at /api, so req.path is e.g. /admin/posts). */
async function adminAuthGuard(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }
    const p = req.path;
    if (p.startsWith('/auth/')) {
        next();
        return;
    }
    if (p.startsWith('/admin/users')) {
        await requireRoles(SUPER)(req, res, next);
        return;
    }
    if (p.startsWith('/admin/inquiries')) {
        await requireRoles(INQUIRY)(req, res, next);
        return;
    }
    if (p.startsWith('/admin/inquiry-faq')) {
        await requireRoles(FAQ)(req, res, next);
        return;
    }
    if (p.startsWith('/admin/maintenance')) {
        await requireRoles(SUPER)(req, res, next);
        return;
    }
    if (p.startsWith('/admin/')) {
        await requireRoles(CONTENT)(req, res, next);
        return;
    }
    if (p === '/uploads/document' ||
        p === '/uploads/image' ||
        p === '/uploads/video' ||
        p === '/uploads/delete') {
        await requireRoles(CONTENT)(req, res, next);
        return;
    }
    next();
}
//# sourceMappingURL=requireAdmin.js.map