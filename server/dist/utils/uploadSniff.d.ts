/** Detect obvious image payloads so they are not stored under documents/ as raw. */
export declare function looksLikeImageBuffer(buf: Buffer, mimeType?: string, originalName?: string): boolean;
export declare function looksLikePdfBuffer(buf: Buffer): boolean;
//# sourceMappingURL=uploadSniff.d.ts.map