import { type AdminRole, type AdminUserPublic } from '../types/adminAuth';
export declare class AdminHttpError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
type AdminUserRow = {
    id: number;
    email: string;
    name: string;
    role: string;
    active: boolean;
    lastLoginAt: Date | null;
};
export declare function normalizeEmail(email: string): string;
/** 계정 관리 화면에 나오지 않는 부트스트랩 슈퍼 관리자. 로그인과 권한은 유지된다. */
export declare function bootstrapEmail(): string;
export declare function isHiddenBootstrapUser(email: string): boolean;
/** 계정 관리 화면에 나오지 않는 계정. 부트스트랩 슈퍼 관리자와 목업 로그인 계정. */
export declare function isHiddenAdminUser(email: string): boolean;
export declare function toPublicUser(row: AdminUserRow): AdminUserPublic;
export declare function countAdminUsers(): Promise<number>;
export declare function countActiveSupers(): Promise<number>;
export declare function findAdminUserById(id: number): Promise<AdminUserRow | null>;
export declare function findAdminUserByEmail(email: string): Promise<AdminUserRow | null>;
export declare function createBootstrapSuper(email: string, name: string): Promise<AdminUserRow>;
/** 다른 관리자가 있어도 부트스트랩 이메일은 숨은 슈퍼 관리자로 맞춘다. */
export declare function ensureBootstrapSuper(email: string, name: string): Promise<AdminUserRow>;
export declare function ensureDemoSuper(): Promise<AdminUserRow>;
export declare function touchAdminLogin(id: number, name: string): Promise<AdminUserRow>;
export declare function listAdminUsers(): Promise<AdminUserRow[]>;
export declare function inviteAdminUser(email: string, role: AdminRole): Promise<AdminUserRow>;
export declare function updateAdminUser(id: number, patch: {
    role?: AdminRole;
    active?: boolean;
}): Promise<AdminUserRow>;
export declare function deleteAdminUser(id: number): Promise<void>;
export {};
//# sourceMappingURL=adminUsersService.d.ts.map