import { type SaveMode } from './documentDraft';
export type BizSection = {
    id: string;
    page: string;
    order: number;
    enabled: boolean;
};
export type BizMenuItem = {
    key: string;
    order: number;
    label: string;
    target: string;
    tabs: string;
};
export type BizArchiveItem = {
    id: string;
    name: string;
    status: string;
    memo: string;
};
export type BizPanel = {
    id: string;
    order: number;
    enabled: boolean;
    removed?: boolean;
};
export type BizSupportDocument = {
    version: 1;
    fields: Record<string, string>;
    sections: BizSection[];
    menu: BizMenuItem[];
    otherBusiness: 'manual' | 'auto';
    otherTitle: string;
    titleLimit: string;
    lineLimit: string;
    archive: BizArchiveItem[];
    layout: BizPanel[];
    grantsPublic: boolean;
    donate: {
        url: string;
        labelKo: string;
        menuLabel: string;
        receiptNote: string;
        inquiry: string;
        impactEnabled: boolean;
        openBlank?: boolean;
        impactTitle?: string;
        impactScope?: 'all' | 'country';
        impactCountry?: string;
        impactMetrics?: string;
        menuPin?: 'on' | 'off' | 'site';
        showFloating?: boolean;
    };
    blocks: BizPageBlock[];
};
declare const BLOCK_PAGES: readonly ["common", "social", "academy", "cnc"];
declare const BLOCK_TYPES: readonly ["intro", "facts", "flow", "cards", "timeline", "cases", "photos", "image"];
type BlockType = (typeof BLOCK_TYPES)[number];
type BlockPage = (typeof BLOCK_PAGES)[number];
export type BizPageBlock = {
    page: BlockPage;
    id: string;
    type: BlockType;
    enabled: boolean;
    order: number;
    kicker: string;
    title: string;
    emphasis: string;
    lead: string;
    photo: string;
    photoAlt: string;
    photoSide: 'right' | 'left' | 'none';
    cards: Array<{
        value: string;
        unit: string;
        note: string;
        source: string;
    }>;
    steps: Array<{
        name: string;
        body: string;
    }>;
    items: Array<{
        title: string;
        body: string;
        href: string;
        year: string;
    }>;
    photos: Array<{
        src: string;
        alt: string;
    }>;
};
export declare function defaultBizSupportDocument(): BizSupportDocument;
export declare function readBizSupportDocument(): Promise<BizSupportDocument>;
export declare function readBizSupportState(preferDraft: boolean): Promise<{
    doc: BizSupportDocument;
    unpublished: boolean;
}>;
export declare function writeBizSupportDocument(body: unknown, mode?: SaveMode): Promise<void>;
export {};
//# sourceMappingURL=bizSupportFileService.d.ts.map