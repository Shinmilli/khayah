import type { NextFunction, Request, Response } from 'express';
import { type AdminRole, type AdminUserPublic } from '../types/adminAuth';
export declare function loadAdminUser(req: Request): Promise<AdminUserPublic | null>;
export declare function requireRoles(roles: readonly AdminRole[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
/** Path-based RBAC for /api (mounted at /api, so req.path is e.g. /admin/posts). */
export declare function adminAuthGuard(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=requireAdmin.d.ts.map