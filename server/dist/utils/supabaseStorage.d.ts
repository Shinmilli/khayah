export declare function isSupabaseStorageConfigured(): boolean;
export type StorageUploadResult = {
    url: string;
    path: string;
    filename: string;
    publicId: string;
    bytes: number;
    resourceType: string;
    provider: 'supabase';
};
export declare function uploadBufferToSupabase(options: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    kind: 'document' | 'image';
}): Promise<StorageUploadResult>;
//# sourceMappingURL=supabaseStorage.d.ts.map