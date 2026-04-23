import type { Request, Response } from 'express';
/**
 * Issues a Cloudinary upload signature so the client can upload directly to Cloudinary.
 * Client sends allowed upload params (e.g. folder, public_id, tags, context), server responds with signature + timestamp.
 */
export declare function postCloudinarySignature(req: Request, res: Response): Response<any, Record<string, any>>;
//# sourceMappingURL=cloudinaryController.d.ts.map