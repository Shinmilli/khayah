/** pdf.js와 캔버스를 미리 올려, 첫 표지 요청이 라이브러리 로딩을 기다리지 않게 한다. */
export declare function warmPdfCoverRenderer(): void;
/** 같은 PDF URL은 첫 요청만 렌더하고, 이후에는 JPEG를 바로 돌려준다. */
export declare function getCachedPdfCover(pdfUrl: string, loadPdf: () => Promise<Buffer>): Promise<Buffer>;
//# sourceMappingURL=pdfCover.d.ts.map