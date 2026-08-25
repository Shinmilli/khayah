export type InquiryFaqItem = {
    id: string;
    question: string;
    answer: string;
    published: boolean;
    order: number;
};
export type InquiryFaqDocument = {
    version: 1;
    items: InquiryFaqItem[];
};
export declare function readInquiryFaqDocument(): Promise<InquiryFaqDocument>;
export declare function writeInquiryFaqDocument(body: unknown): Promise<void>;
//# sourceMappingURL=inquiryFaqFileService.d.ts.map