import { type SaveMode } from './documentDraft';
export declare const NAV_MENU_IMAGE_KEYS: readonly ["khayah", "business", "support", "news"];
export type NavMenuImageKey = (typeof NAV_MENU_IMAGE_KEYS)[number];
export type NavMenuImagesDocument = {
    version: 1;
    images: Record<NavMenuImageKey, string>;
};
export declare function validateNavMenuImagesDocument(body: unknown): body is NavMenuImagesDocument;
export declare function normalizeNavMenuImagesDocument(body: unknown): NavMenuImagesDocument;
export declare function readNavMenuImagesDocument(): Promise<NavMenuImagesDocument>;
export declare function readNavMenuImagesState(preferDraft: boolean): Promise<{
    doc: NavMenuImagesDocument;
    unpublished: boolean;
}>;
export declare function writeNavMenuImagesDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=navMenuImagesFileService.d.ts.map