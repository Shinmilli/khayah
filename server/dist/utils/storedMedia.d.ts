export type StoredMediaRef = {
    url: string;
    name?: string;
    publicId?: string;
    path?: string;
    provider?: string;
    resourceType?: string;
};
export declare function parsePdfFilesMeta(meta: Record<string, string>): StoredMediaRef[];
export declare function collectPostMedia(meta: Record<string, string>): StoredMediaRef[];
export declare function guessProvider(url: string): 'supabase' | 'cloudinary' | undefined;
export declare function deleteStoredMedia(ref: StoredMediaRef): Promise<void>;
export declare function deleteStoredMediaMany(refs: StoredMediaRef[]): Promise<void>;
export declare function mediaNotIn(oldRefs: StoredMediaRef[], newRefs: StoredMediaRef[]): StoredMediaRef[];
//# sourceMappingURL=storedMedia.d.ts.map