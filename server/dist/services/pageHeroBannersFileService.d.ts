import { type SaveMode } from './documentDraft';
export declare const PAGE_HERO_BANNER_KEYS: readonly ["khayah", "business", "support", "news"];
export type PageHeroBannerKey = (typeof PAGE_HERO_BANNER_KEYS)[number];
export type PageHeroBannersDocument = {
    version: 1;
    images: Record<PageHeroBannerKey, string>;
};
export declare function validatePageHeroBannersDocument(body: unknown): body is PageHeroBannersDocument;
export declare function normalizePageHeroBannersDocument(body: unknown): PageHeroBannersDocument;
export declare function readPageHeroBannersDocument(): Promise<PageHeroBannersDocument>;
export declare function readPageHeroBannersState(preferDraft: boolean): Promise<{
    doc: PageHeroBannersDocument;
    unpublished: boolean;
}>;
export declare function writePageHeroBannersDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=pageHeroBannersFileService.d.ts.map