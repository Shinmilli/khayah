import type { Request } from 'express';
export declare function allowedPdfSourceHost(host: string): boolean;
export declare function readQuery(req: Request, key: string): string;
export type LoadedPdf = {
    ok: true;
    buf: Buffer;
} | {
    ok: false;
    status: number;
    error: string;
};
/** Cloudinary/Supabase에 있는 PDF 바이트. 공개 URL이 401이면 인증 다운로드로 재시도. */
export declare function loadAllowedPdf(raw: string): Promise<LoadedPdf>;
//# sourceMappingURL=pdfSource.d.ts.map