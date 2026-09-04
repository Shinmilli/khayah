export type ImpactStatItem = {
    id: string;
    label: string;
    value: string;
    unit?: string;
};
export type ImpactStatsLocaleContent = {
    donut: {
        percent: number;
        labelLines: string[];
    };
    stats: ImpactStatItem[];
};
export type ImpactStatsDocumentV2 = {
    version: 2;
    locales: {
        ko: ImpactStatsLocaleContent;
        en: ImpactStatsLocaleContent;
    };
};
export type ImpactStatsDocument = ImpactStatsDocumentV2;
export type ImpactLocale = 'ko' | 'en';
export declare function parseImpactLocale(raw: unknown): ImpactLocale;
export declare function readImpactStatsDocument(): Promise<ImpactStatsDocumentV2>;
export declare function readImpactStatsForLocale(locale: ImpactLocale): Promise<ImpactStatsLocaleContent>;
export declare function writeImpactStatsDocument(body: unknown): Promise<void>;
//# sourceMappingURL=impactStatsFileService.d.ts.map