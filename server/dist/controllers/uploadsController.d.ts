import type { NextFunction, Request, Response } from 'express';
export declare const postDocumentUpload: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const postImageUpload: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare function deleteUpload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=uploadsController.d.ts.map