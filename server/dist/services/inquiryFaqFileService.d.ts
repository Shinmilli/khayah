import { type SaveMode } from './documentDraft';
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
export declare function readInquiryFaqState(preferDraft: boolean): Promise<{
    doc: InquiryFaqDocumentV2;
    unpublished: boolean;
}>;
export declare function readInquiryFaqForLocale(locale: InquiryLocale, preferDraft?: boolean): Promise<InquiryFaqLocaleContent>;
export declare function writeInquiryFaqDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=inquiryFaqFileService.d.ts.map