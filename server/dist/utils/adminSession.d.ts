import type { Request, Response } from 'express';
import type { AdminRole, AdminUserPublic } from '../types/adminAuth';
export declare const ADMIN_SESSION_COOKIE = "khayah_admin";
export declare const DEMO_ADMIN_PUBLIC: AdminUserPublic;
export declare function isDemoLoginAllowed(): boolean;
export declare function parseClientOrigins(raw?: string): string[];
export type SessionPayload = {
    uid: number;
    iat: number;
    exp: number;
    demo?: boolean;
    role?: AdminRole;
    email?: string;
    name?: string;
};
export declare function signAdminSession(uid: number, extra?: Omit<SessionPayload, 'uid' | 'iat' | 'exp'>): string;
export declare function verifyAdminSession(token: string): SessionPayload | null;
export declare function readCookie(req: Request, name: string): string | null;
export declare function readSessionToken(req: Request): string | null;
export declare function setAdminSessionCookie(res: Response, uid: number, extra?: Omit<SessionPayload, 'uid' | 'iat' | 'exp'>): string;
export declare function demoUserFromSession(session: SessionPayload): AdminUserPublic;
export declare function clearAdminSessionCookie(res: Response): void;
//# sourceMappingURL=adminSession.d.ts.map