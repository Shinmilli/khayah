import type { Request } from 'express';
export type SaveMode = 'draft' | 'publish';
export declare function draftDocumentKey(key: string): string;
export declare function saveModeOf(req: Request): SaveMode;
export declare function isAdminPath(req: Request): boolean;
/** 공개 주소라도 관리자 세션이면 임시저장을 보여 준다. 세션이 없으면 게시본만 본다. */
export declare function adminCanSeeDraft(req: Request): Promise<boolean>;
export declare function readDrafted<T>(key: string, readPublished: () => Promise<T>, preferDraft: boolean): Promise<{
    doc: T;
    unpublished: boolean;
}>;
export declare function writeDrafted(key: string, cleaned: unknown, mode: SaveMode, afterPublish?: (previous: unknown | null) => Promise<void>): Promise<void>;
//# sourceMappingURL=documentDraft.d.ts.map