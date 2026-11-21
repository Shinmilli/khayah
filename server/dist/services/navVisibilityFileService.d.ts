import { type SaveMode } from './documentDraft';
export declare const NAV_VISIBILITY_TOP_KEYS: readonly ["khayah", "business", "support", "news"];
export type NavVisibilityTopKey = (typeof NAV_VISIBILITY_TOP_KEYS)[number];
export declare const NAV_VISIBILITY_LINK_KEYS: readonly ["greeting", "history", "location", "financialReport", "aboutKhayah", "ci", "org", "domestic", "domesticEducation", "overseas", "overseasEducation", "overseasVolunteer", "domesticProjects", "overseasProjects", "researchProjects", "researchEducation", "researchSocial", "socialAcademy", "socialComfort", "advocacy", "projects", "supportGuide", "supportMethod", "announcements", "activities", "stories", "newsletter", "press", "inquiry", "impactGlance"];
export type NavVisibilityLinkKey = (typeof NAV_VISIBILITY_LINK_KEYS)[number];
export type NavVisibilityDocument = {
    version: 1;
    top: Record<NavVisibilityTopKey, boolean>;
    links: Record<NavVisibilityLinkKey, boolean>;
};
export declare function normalizeNavVisibilityDocument(body: unknown): NavVisibilityDocument;
export declare function validateNavVisibilityDocument(body: unknown): body is NavVisibilityDocument;
export declare function readNavVisibilityDocument(): Promise<NavVisibilityDocument>;
export declare function readNavVisibilityState(preferDraft: boolean): Promise<{
    doc: NavVisibilityDocument;
    unpublished: boolean;
}>;
export declare function writeNavVisibilityDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=navVisibilityFileService.d.ts.map