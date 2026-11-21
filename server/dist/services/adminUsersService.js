"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminHttpError = void 0;
exports.normalizeEmail = normalizeEmail;
exports.bootstrapEmail = bootstrapEmail;
exports.isHiddenBootstrapUser = isHiddenBootstrapUser;
exports.isHiddenAdminUser = isHiddenAdminUser;
exports.toPublicUser = toPublicUser;
exports.countAdminUsers = countAdminUsers;
exports.countActiveSupers = countActiveSupers;
exports.findAdminUserById = findAdminUserById;
exports.findAdminUserByEmail = findAdminUserByEmail;
exports.createBootstrapSuper = createBootstrapSuper;
exports.ensureBootstrapSuper = ensureBootstrapSuper;
exports.ensureDemoSuper = ensureDemoSuper;
exports.touchAdminLogin = touchAdminLogin;
exports.listAdminUsers = listAdminUsers;
exports.inviteAdminUser = inviteAdminUser;
exports.updateAdminUser = updateAdminUser;
exports.deleteAdminUser = deleteAdminUser;
const prisma_1 = require("../utils/prisma");
const adminAuth_1 = require("../types/adminAuth");
class AdminHttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.AdminHttpError = AdminHttpError;
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
/** 계정 관리 화면에 나오지 않는 부트스트랩 슈퍼 관리자. 로그인과 권한은 유지된다. */
function bootstrapEmail() {
    return normalizeEmail(process.env.ADMIN_BOOTSTRAP_EMAIL ?? '');
}
function isHiddenBootstrapUser(email) {
    const hidden = bootstrapEmail();
    return Boolean(hidden) && normalizeEmail(email) === hidden;
}
const DEMO_ADMIN_EMAIL = 'demo@khayah.local';
/** 계정 관리 화면에 나오지 않는 계정. 부트스트랩 슈퍼 관리자와 목업 로그인 계정. */
function isHiddenAdminUser(email) {
    return isHiddenBootstrapUser(email) || normalizeEmail(email) === DEMO_ADMIN_EMAIL;
}
function toPublicUser(row) {
    return {
        id: row.id,
        email: row.email,
        name: row.name,
        role: (0, adminAuth_1.isAdminRole)(row.role) ? row.role : 'content',
        active: row.active,
        lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
    };
}
function requirePrisma() {
    if (!prisma_1.prisma) {
        throw new AdminHttpError(503, 'Database unavailable');
    }
    return prisma_1.prisma;
}
async function countAdminUsers() {
    return requirePrisma().adminUser.count();
}
async function countActiveSupers() {
    return requirePrisma().adminUser.count({ where: { role: 'super', active: true } });
}
async function findAdminUserById(id) {
    return requirePrisma().adminUser.findUnique({ where: { id } });
}
async function findAdminUserByEmail(email) {
    return requirePrisma().adminUser.findUnique({ where: { email: normalizeEmail(email) } });
}
async function createBootstrapSuper(email, name) {
    return requirePrisma().adminUser.create({
        data: {
            email: normalizeEmail(email),
            name: name.slice(0, 120),
            role: 'super',
            active: true,
            lastLoginAt: new Date(),
        },
    });
}
/** 다른 관리자가 있어도 부트스트랩 이메일은 숨은 슈퍼 관리자로 맞춘다. */
async function ensureBootstrapSuper(email, name) {
    const existing = await findAdminUserByEmail(email);
    const nextName = (name || existing?.name || '').slice(0, 120);
    if (existing) {
        return requirePrisma().adminUser.update({
            where: { id: existing.id },
            data: {
                role: 'super',
                active: true,
                name: nextName,
                lastLoginAt: new Date(),
            },
        });
    }
    return createBootstrapSuper(email, nextName);
}
async function ensureDemoSuper() {
    const existing = await findAdminUserByEmail(DEMO_ADMIN_EMAIL);
    if (existing) {
        return requirePrisma().adminUser.update({
            where: { id: existing.id },
            data: {
                role: 'super',
                active: true,
                name: existing.name || '임시 목업',
                lastLoginAt: new Date(),
            },
        });
    }
    return requirePrisma().adminUser.create({
        data: {
            email: DEMO_ADMIN_EMAIL,
            name: '임시 목업',
            role: 'super',
            active: true,
            lastLoginAt: new Date(),
        },
    });
}
async function touchAdminLogin(id, name) {
    return requirePrisma().adminUser.update({
        where: { id },
        data: {
            lastLoginAt: new Date(),
            name: name.slice(0, 120),
        },
    });
}
async function listAdminUsers() {
    const rows = (await requirePrisma().adminUser.findMany({
        orderBy: [{ createdAt: 'asc' }, { email: 'asc' }],
    }));
    return rows.filter((row) => !isHiddenAdminUser(row.email));
}
async function inviteAdminUser(email, role) {
    const normalized = normalizeEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        throw new AdminHttpError(400, '올바른 이메일을 입력하세요.');
    }
    if (isHiddenAdminUser(normalized)) {
        throw new AdminHttpError(409, '이미 등록된 이메일입니다.');
    }
    const existing = await findAdminUserByEmail(normalized);
    if (existing) {
        throw new AdminHttpError(409, '이미 등록된 이메일입니다.');
    }
    return requirePrisma().adminUser.create({
        data: {
            email: normalized,
            name: '',
            role,
            active: true,
        },
    });
}
async function updateAdminUser(id, patch) {
    const user = await findAdminUserById(id);
    if (!user || isHiddenAdminUser(user.email)) {
        throw new AdminHttpError(404, '계정을 찾을 수 없습니다.');
    }
    const nextRole = patch.role ?? ((0, adminAuth_1.isAdminRole)(user.role) ? user.role : 'content');
    const nextActive = patch.active ?? user.active;
    if (user.role === 'super' && user.active) {
        const supers = await countActiveSupers();
        const wouldLoseSuper = nextRole !== 'super' || nextActive === false;
        if (supers <= 1 && wouldLoseSuper) {
            throw new AdminHttpError(400, '마지막 슈퍼 관리자는 역할 변경·비활성화할 수 없습니다.');
        }
    }
    return requirePrisma().adminUser.update({
        where: { id },
        data: { role: nextRole, active: nextActive },
    });
}
async function deleteAdminUser(id) {
    const user = await findAdminUserById(id);
    if (!user || isHiddenAdminUser(user.email)) {
        throw new AdminHttpError(404, '계정을 찾을 수 없습니다.');
    }
    if (user.role === 'super' && user.active) {
        const supers = await countActiveSupers();
        if (supers <= 1) {
            throw new AdminHttpError(400, '마지막 슈퍼 관리자는 삭제할 수 없습니다.');
        }
    }
    await requirePrisma().adminUser.delete({ where: { id } });
}
//# sourceMappingURL=adminUsersService.js.map