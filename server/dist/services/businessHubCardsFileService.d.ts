import { type SaveMode } from './documentDraft';
export declare const BUSINESS_HUBS: readonly ["overseas", "domestic"];
export type BusinessHub = (typeof BUSINESS_HUBS)[number];
export declare const BUSINESS_HUB_ICONS: readonly ["education", "volunteer", "projects", "people"];
export type BusinessHubIcon = (typeof BUSINESS_HUB_ICONS)[number];
export type BusinessHubCardLocaleCopy = {
    title: string;
    description: string;
    buttonLabel: string;
};
export type BusinessHubCard = {
    id: string;
    hub: BusinessHub;
    order: number;
    enabled: boolean;
    href: string;
    icon: BusinessHubIcon;
    locales: {
        ko: BusinessHubCardLocaleCopy;
        en: BusinessHubCardLocaleCopy;
    };
};
export type BusinessHubCardsDocument = {
    version: 1;
    cards: BusinessHubCard[];
};
export type BusinessHubCardPublic = {
    id: string;
    hub: BusinessHub;
    order: number;
    href: string;
    icon: BusinessHubIcon;
    title: string;
    description: string;
    buttonLabel: string;
};
export type BusinessLocale = 'ko' | 'en';
export declare function parseBusinessLocale(raw: unknown): BusinessLocale;
export declare function parseBusinessHub(raw: unknown): BusinessHub | null;
export declare function readBusinessHubCardsDocument(): Promise<BusinessHubCardsDocument>;
export declare function readBusinessHubCardsState(preferDraft: boolean): Promise<{
    doc: BusinessHubCardsDocument;
    unpublished: boolean;
}>;
export declare function readBusinessHubCardsForLocale(locale: BusinessLocale, hub?: BusinessHub | null, preferDraft?: boolean): Promise<BusinessHubCardPublic[]>;
export declare function writeBusinessHubCardsDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=businessHubCardsFileService.d.ts.map