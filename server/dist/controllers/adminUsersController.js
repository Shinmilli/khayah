"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListUsers = adminListUsers;
exports.adminInviteUser = adminInviteUser;
exports.adminPatchUser = adminPatchUser;
exports.adminDeleteUser = adminDeleteUser;
const adminAuth_1 = require("../types/adminAuth");
const adminUsersService_1 = require("../services/adminUsersService");
function sendAdminError(res, e, fallback) {
    if (e instanceof adminUsersService_1.AdminHttpError) {
        res.status(e.status).json({ error: e.message });
        return;
    }
    console.error(e);
    res.status(500).json({ error: fallback });
}
async function adminListUsers(_req, res) {
    try {
        const rows = await (0, adminUsersService_1.listAdminUsers)();
        res.json({ users: rows.map(adminUsersService_1.toPublicUser) });
    }
    catch (e) {
        sendAdminError(res, e, '관리자 목록을 불러오지 못했습니다.');
    }
}
async function adminInviteUser(req, res) {
    const email = typeof req.body?.email === 'string' ? req.body.email : '';
    const role = req.body?.role;
    if (!(0, adminAuth_1.isAdminRole)(role)) {
        res.status(400).json({ error: '역할은 super, content, inquiry 중 하나여야 합니다.' });
        return;
    }
    try {
        const created = await (0, adminUsersService_1.inviteAdminUser)(email, role);
        res.status(201).json((0, adminUsersService_1.toPublicUser)(created));
    }
    catch (e) {
        sendAdminError(res, e, '초대에 실패했습니다.');
    }
}
async function adminPatchUser(req, res) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    const patch = {};
    if (req.body?.role !== undefined) {
        if (!(0, adminAuth_1.isAdminRole)(req.body.role)) {
            res.status(400).json({ error: '역할은 super, content, inquiry 중 하나여야 합니다.' });
            return;
        }
        patch.role = req.body.role;
    }
    if (req.body?.active !== undefined) {
        if (typeof req.body.active !== 'boolean') {
            res.status(400).json({ error: 'active must be boolean' });
            return;
        }
        patch.active = req.body.active;
    }
    if (patch.role === undefined && patch.active === undefined) {
        res.status(400).json({ error: 'role 또는 active가 필요합니다.' });
        return;
    }
    try {
        const updated = await (0, adminUsersService_1.updateAdminUser)(id, patch);
        res.json((0, adminUsersService_1.toPublicUser)(updated));
    }
    catch (e) {
        sendAdminError(res, e, '계정 변경에 실패했습니다.');
    }
}
async function adminDeleteUser(req, res) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    try {
        await (0, adminUsersService_1.deleteAdminUser)(id);
        res.status(204).end();
    }
    catch (e) {
        sendAdminError(res, e, '계정 삭제에 실패했습니다.');
    }
}
//# sourceMappingURL=adminUsersController.js.map