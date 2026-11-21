import type { InquiryPublic } from './inquiriesService';
/** SMTP가 있으면 기관 메일로 문의 알림을 보낸다. 설정이 없거나 실패해도 문의 저장은 유지한다. */
export declare function notifyInquiry(inquiry: InquiryPublic): Promise<void>;
//# sourceMappingURL=inquiryNotify.d.ts.map