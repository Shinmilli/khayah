export type InquiryFaqItem = {
    id: string;
    question: string;
    answer: string;
    published: boolean;
    order: number;
};
export type InquiryFaqLocaleContent = {
    items: InquiryFaqItem[];
};
export type InquiryFaqDocumentV2 = {
    version: 2;
    locales: {
        ko: InquiryFaqLocaleContent;
        en: InquiryFaqLocaleContent;
    };
};
export type InquiryFaqDocument = InquiryFaqDocumentV2;
export type InquiryLocale = 'ko' | 'en';
export declare function parseInquiryFaqLocale(raw: unknown): InquiryLocale;
export declare function readInquiryFaqDocument(): Promise<InquiryFaqDocumentV2>;
export declare function readInquiryFaqForLocale(locale: InquiryLocale): Promise<InquiryFaqLocaleContent>;
export declare function writeInquiryFaqDocument(body: unknown): Promise<void>;
//# sourceMappingURL=inquiryFaqFileService.d.ts.map