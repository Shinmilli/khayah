export type HeroBannerLocaleCopy = {
    alt: string;
    lines: string[];
    smallLine?: string;
};
export type HeroBannerButton = {
    label: string;
    href: string;
};
export type HeroBannerSlide = {
    id: string;
    order: number;
    enabled: boolean;
    image: string;
    mobileImage: string;
    align: 'left' | 'center';
    dim: 'weak' | 'mid' | 'strong';
    buttons: HeroBannerButton[];
    locales: {
        ko: HeroBannerLocaleCopy;
        en: HeroBannerLocaleCopy;
    };
};
export type HeroBannerDocument = {
    version: 1;
    slides: HeroBannerSlide[];
};
export type HeroBannerPublicSlide = {
    id: string;
    order: number;
    image: string;
    mobileImage: string;
    align: 'left' | 'center';
    dim: 'weak' | 'mid' | 'strong';
    buttons: HeroBannerButton[];
    alt: string;
    lines: string[];
    smallLine: string;
};
export type HeroLocale = 'ko' | 'en';
export declare function parseHeroLocale(raw: unknown): HeroLocale;
export declare function readHeroBannerDocument(): Promise<HeroBannerDocument>;
export declare function readHeroBannerForLocale(locale: HeroLocale): Promise<HeroBannerPublicSlide[]>;
export declare function writeHeroBannerDocument(body: unknown): Promise<void>;
//# sourceMappingURL=heroBannerFileService.d.ts.map