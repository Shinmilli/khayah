export type HistoryItem = {
    id: string;
    month: string;
    text: string;
};
export type HistoryYear = {
    id: string;
    year: string;
    items: HistoryItem[];
};
export type HistoryLocaleContent = {
    lead: string;
    years: HistoryYear[];
};
export type HistoryDocument = {
    version: 1;
    locales: {
        ko: HistoryLocaleContent;
        en: HistoryLocaleContent;
    };
};
export type HistoryLocale = 'ko' | 'en';
export declare function parseHistoryLocale(raw: unknown): HistoryLocale;
export declare function readHistoryDocument(): Promise<HistoryDocument>;
export declare function readHistoryForLocale(locale: HistoryLocale): Promise<HistoryLocaleContent>;
export declare function writeHistoryDocument(body: unknown): Promise<void>;
//# sourceMappingURL=historyFileService.d.ts.map