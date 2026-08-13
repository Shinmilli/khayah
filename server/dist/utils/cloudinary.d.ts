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
//# sourceMappingURL=cloudinary.d.ts.map