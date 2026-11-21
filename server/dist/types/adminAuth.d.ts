export declare const ADMIN_ROLES: readonly ["super", "content", "inquiry"];
export type AdminRole = (typeof ADMIN_ROLES)[number];
export type AdminUserPublic = {
    id: number;
    email: string;
    name: string;
    role: AdminRole;
    active: boolean;
    lastLoginAt: string | null;
};
export declare function isAdminRole(value: unknown): value is AdminRole;
//# sourceMappingURL=adminAuth.d.ts.map