export type FinancialReportSegmentLabels = {
    ko: string;
    en: string;
};
export type FinancialReportSegmentV2 = {
    id: string;
    percent: number;
    color: string;
    labels: FinancialReportSegmentLabels;
};
export type FinancialReportPageSettings = {
    showBalanceSheet: boolean;
    showOperationsStatement: boolean;
    showActionButtons: boolean;
};
export type FinancialReportYearDataV2 = {
    year: number;
    incomeSegments: FinancialReportSegmentV2[];
    expenseSegments: FinancialReportSegmentV2[];
    incomeTotalWon: number;
    expenseTotalWon: number;
    balanceSheetImageUrl?: string | null;
    operationsStatementImageUrl?: string | null;
    donationDisclosurePdfUrl?: string | null;
};
export type FinancialReportsDocumentV2 = {
    version: 2;
    settings: FinancialReportPageSettings;
    reports: FinancialReportYearDataV2[];
};
/** 공개 API 응답 — locale별 label이 풀린 형태 */
export type FinancialReportSegmentPublic = {
    id: string;
    label: string;
    percent: number;
    color: string;
};
export type FinancialReportYearDataPublic = Omit<FinancialReportYearDataV2, 'incomeSegments' | 'expenseSegments'> & {
    incomeSegments: FinancialReportSegmentPublic[];
    expenseSegments: FinancialReportSegmentPublic[];
};
export type FinancialReportsPublicDocument = {
    version: 2;
    settings: FinancialReportPageSettings;
    reports: FinancialReportYearDataPublic[];
};
export type FinancialReportsDocument = FinancialReportsDocumentV2;
export type FinancialLocale = 'ko' | 'en';
export declare function parseFinancialLocale(raw: unknown): FinancialLocale;
export declare function readFinancialReportsDocument(): Promise<FinancialReportsDocumentV2>;
export declare function readFinancialReportsForLocale(locale: FinancialLocale): Promise<FinancialReportsPublicDocument>;
export declare function writeFinancialReportsDocument(body: unknown): Promise<void>;
//# sourceMappingURL=financialReportsFileService.d.ts.map