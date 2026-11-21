import { type SaveMode } from './documentDraft';
export type SiteOrg = {
    nameKo: string;
    nameEn: string;
    representative: string;
    registrationNo: string;
    addressKo: string;
    addressEn: string;
    phoneFax: string;
    email: string;
    accounts: string;
};
export type SiteFooterLink = {
    id: string;
    order: number;
    enabled: boolean;
    labelKo: string;
    labelEn: string;
    href: string;
};
export type SitePartner = {
    id: string;
    order: number;
    enabled: boolean;
    logo: string;
    nameKo: string;
    nameEn: string;
    kind: string;
    href: string;
};
export type SiteClicker = {
    id: 'kakao' | 'instagram' | 'blog' | 'donate';
    order: number;
    enabled: boolean;
    labelKo: string;
    href: string;
};
export type SiteSlogan = {
    id: string;
    order: number;
    text: string;
};
export type SiteCommonDocument = {
    version: 1;
    homeStories: {
        featured: string;
        rest: 'auto' | 'manual';
        manual: string[];
        blog: {
            image: string;
            href: string;
        };
        instagram: {
            image: string;
            href: string;
        };
        youtube: {
            image: string;
            href: string;
        };
    };
    org: SiteOrg;
    footerLinks: SiteFooterLink[];
    partners: SitePartner[];
    clickers: SiteClicker[];
    headerDonate: {
        labelKo: string;
        pinned: boolean;
    };
    logo: {
        imageKo: string;
        imageEn: string;
        rotate: boolean;
        intervalSec: number;
        slogansKo: SiteSlogan[];
        sloganEn: string;
    };
};
export declare function defaultSiteCommonDocument(): SiteCommonDocument;
export declare function readSiteCommonDocument(): Promise<SiteCommonDocument>;
export declare function readSiteCommonState(preferDraft: boolean): Promise<{
    doc: SiteCommonDocument;
    unpublished: boolean;
}>;
export declare function writeSiteCommonDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=siteCommonFileService.d.ts.map