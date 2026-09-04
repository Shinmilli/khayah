export type StoredMediaRef = {
    url: string;
    name?: string;
    publicId?: string;
    path?: string;
    provider?: string;
    resourceType?: string;
};
export declare function parsePdfFilesMeta(meta: Record<string, string>): StoredMediaRef[];
export declare function guessProvider(url: string): 'supabase' | 'cloudinary' | undefined;
/** 본문 HTML의 img / Cloudinary·Supabase 미디어 URL 수집 */
export declare function extractMediaFromHtml(html: string | null | undefined): StoredMediaRef[];
export declare function collectPostMedia(meta: Record<string, string>, contentHtml?: string | null): StoredMediaRef[];
/** Cloudinary URL → 시도할 public_id 후보들 (.pdf 유무 등) */
export declare function cloudinaryPublicIdCandidates(url: string, explicit?: string): string[];
export declare function deleteStoredMedia(ref: StoredMediaRef): Promise<void>;
export declare function deleteStoredMediaMany(refs: StoredMediaRef[]): Promise<void>;
export declare function mediaNotIn(oldRefs: StoredMediaRef[], newRefs: StoredMediaRef[]): StoredMediaRef[];
//# sourceMappingURL=storedMedia.d.ts.map