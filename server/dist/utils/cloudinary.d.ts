export declare function isCloudinaryConfigured(): boolean;
export declare function configureCloudinary(): void;
export type CloudinaryUploadResult = {
    url: string;
    path: string;
    filename: string;
    publicId: string;
    bytes: number;
    resourceType: string;
    format?: string;
};
export declare function uploadBufferToCloudinary(options: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    kind: 'document' | 'image';
}): Promise<CloudinaryUploadResult>;
export type CloudinaryDestroyOutcome = 'ok' | 'not_found' | 'failed';
/** public delivery가 401인 raw(특히 public_id에 .pdf 포함)용 인증 다운로드 */
export declare function downloadCloudinaryRawBuffer(publicId: string): Promise<Buffer | null>;
export declare function destroyCloudinaryAsset(publicId: string, resourceTypeHint?: string): Promise<CloudinaryDestroyOutcome>;
//# sourceMappingURL=cloudinary.d.ts.map