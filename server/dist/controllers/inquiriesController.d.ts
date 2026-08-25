import type { Request, Response } from 'express';
export declare function createInquiry(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function lookupInquiries(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function adminListInquiries(req: Request, res: Response): Promise<void>;
export declare function adminGetInquiry(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function adminUpdateInquiry(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function adminDeleteInquiry(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=inquiriesController.d.ts.map