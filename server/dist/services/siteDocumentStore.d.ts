/** 관리자 설정 문서는 DB에만 있다. 행이 없으면 예외를 던진다. */
export declare function readJsonDocument(key: string): Promise<unknown>;
export declare function writeJsonDocument(key: string, body: unknown): Promise<void>;
export declare function readJsonDocumentOptional(key: string): Promise<unknown | null>;
export declare function deleteJsonDocument(key: string): Promise<void>;
//# sourceMappingURL=siteDocumentStore.d.ts.map