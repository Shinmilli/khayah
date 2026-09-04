export declare const INQUIRY_TYPES: readonly ["후원 문의", "봉사 참여", "사업 문의", "기타"];
export declare const INQUIRY_STATUSES: readonly ["대기", "처리중", "완료"];
export type InquiryType = (typeof INQUIRY_TYPES)[number];
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
export type InquiryPublic = {
    id: number;
    name: string;
    contact: string;
    type: string;
    subject: string;
    body: string;
    status: string;
    reply: string;
    createdAt: string;
    repliedAt: string | null;
};
export type InquiryAdmin = InquiryPublic & {
    memo: string;
    updatedAt: string;
};
export declare function validatePin(pin: string): boolean;
export declare const inquiriesService: {
    create(input: {
        name: string;
        contact: string;
        pin: string;
        type: string;
        subject: string;
        body: string;
    }): Promise<InquiryPublic>;
    lookup(input: {
        name: string;
        contact: string;
        pin: string;
    }): Promise<InquiryPublic[]>;
    listAdmin(page?: number, perPage?: number, filters?: {
        name?: string;
        contact?: string;
    }): Promise<{
        inquiries: InquiryAdmin[];
        total: number;
    }>;
    getAdmin(id: number): Promise<InquiryAdmin | null>;
    updateAdmin(id: number, input: {
        status?: string;
        reply?: string;
        memo?: string;
    }): Promise<InquiryAdmin | null>;
    removeAdmin(id: number): Promise<boolean>;
};
//# sourceMappingURL=inquiriesService.d.ts.map