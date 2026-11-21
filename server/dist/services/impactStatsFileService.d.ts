export type ImpactLocale = 'ko' | 'en';
type ImpactDonut = {
    percent: number;
    labelLines: string[];
};
type ImpactIntroLocale = {
    kicker: string;
    title: string;
    subtitle: string;
    rotator: string[];
};
type ImpactIntroColors = {
    kicker: string;
    title: string;
    subtitle: string;
    rotator: string;
};
type ImpactPrimaryCardColors = {
    cardBg: string;
    kicker: string;
    title: string;
    desc: string;
    ctaBg: string;
    ctaText: string;
    donutFill: string;
    donutTrack: string;
    donutHole: string;
    donutValue: string;
    donutSub: string;
};
type ImpactPrimaryCardLocale = {
    kicker: string;
    title: string;
    desc: string;
    ctaLabel: string;
    ctaHref: string;
    donut: ImpactDonut;
};
type ImpactPrimaryCard = {
    id: string;
    showDonut: boolean;
    colors: ImpactPrimaryCardColors;
    locales: {
        ko: ImpactPrimaryCardLocale;
        en: ImpactPrimaryCardLocale;
    };
};
type ImpactStatColors = {
    cardBg: string;
    label: string;
    value: string;
    unit: string;
    iconBg: string;
    iconColor: string;
};
type ImpactStatLocale = {
    label: string;
    value: string;
    unit: string;
};
type ImpactStatItem = {
    id: string;
    icon?: string;
    colors: ImpactStatColors;
    locales: {
        ko: ImpactStatLocale;
        en: ImpactStatLocale;
    };
};
export type ImpactStatsDocumentV3 = {
    version: 3;
    visible: boolean;
    backgroundImageUrl: string;
    introColors: ImpactIntroColors;
    intro: {
        ko: ImpactIntroLocale;
        en: ImpactIntroLocale;
    };
    primaryCards: ImpactPrimaryCard[];
    stats: ImpactStatItem[];
};
export type ImpactStatsDocument = ImpactStatsDocumentV3;
export type ImpactStatsPublicView = {
    visible: boolean;
    backgroundImageUrl: string;
    introColors: ImpactIntroColors;
    intro: ImpactIntroLocale;
    primaryCards: Array<ImpactPrimaryCardLocale & {
        id: string;
        showDonut: boolean;
        colors: ImpactPrimaryCardColors;
    }>;
    stats: Array<ImpactStatLocale & {
        id: string;
        icon?: string;
        colors: ImpactStatColors;
    }>;
};
export declare function parseImpactLocale(raw: unknown): ImpactLocale;
export declare function readImpactStatsDocument(): Promise<ImpactStatsDocumentV3>;
export declare function readImpactStatsForLocale(locale: ImpactLocale): Promise<ImpactStatsPublicView>;
export declare function writeImpactStatsDocument(body: unknown): Promise<void>;
export {};
//# sourceMappingURL=impactStatsFileService.d.ts.map