/** PDF 문서 제목(/Title). 브라우저 탭은 파일명 대신 이 값을 보여 준다. */
/**
 * 원본 바이트는 그대로 두고 끝에 제목만 덧붙인다.
 * 파싱에 실패하면 원본을 그대로 돌려준다.
 */
export declare function appendPdfTitle(pdf: Buffer, title: string): Buffer;
//# sourceMappingURL=pdfTitle.d.ts.map