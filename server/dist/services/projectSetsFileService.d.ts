import { type SaveMode } from './documentDraft';
declare const CATEGORIES: readonly ["국내", "해외", "연구"];
declare const PAGE_KEYS: readonly ["domestic", "overseas", "education", "volunteer", "research"];
type Category = (typeof CATEGORIES)[number];
type PageKey = (typeof PAGE_KEYS)[number];
export type ProjectPageHeader = {
    title: string;
    eyebrow: string;
    photo: string;
    photoAlt: string;
    cards: Array<{
        value: string;
        unit: string;
        note: string;
        source: string;
    }>;
    flow: Array<{
        name: string;
        body: string;
    }>;
    heroLabel: string;
    introKicker: string;
    introKickerKo: string;
    introTitle: string;
    emphasis: string;
    lead: string;
    align: 'left' | 'center';
    photoSide: 'right' | 'left' | 'none';
    band: 'white' | 'gray';
    blocks: PageBlock[];
    panels: Array<{
        id: string;
        order: number;
        enabled: boolean;
        removed: boolean;
    }>;
    axes: Array<{
        label: string;
        phrase: string;
        title: string;
        body: string;
        cards: Array<{
            title: string;
            subtitle: string;
            body: string;
            tag: string;
        }>;
        cases: Array<{
            place: string;
            body: string;
        }>;
        photos: Array<{
            src: string;
            alt: string;
        }>;
        enabled: boolean;
        mode: 'text' | 'image';
        image: string;
    }>;
};
export type ProjectSetRecord = {
    id: string;
    category: Category;
    field: '' | '교육' | '해외봉사단' | '긴급구호';
    year: number | null;
    enabled: boolean;
    order: number;
    eyebrow: string;
    title: string;
    period: string;
    audience: string;
    partner: string;
    paragraphs: string[];
    slides: Array<{
        src: string;
        alt: string;
    }>;
    showArrows: boolean;
    emphasizeLast: boolean;
    stepsOn: boolean;
    steps: Array<{
        kicker: string;
        title: string;
        detail: string;
        emphasis?: boolean;
    }>;
    factsOn: boolean;
    facts: Array<{
        value: string;
        unit: string;
        label: string;
    }>;
    note: string;
    photosOn: boolean;
    photos: Array<{
        src: string;
        alt: string;
    }>;
};
export type ProjectSetsDocument = {
    version: 1;
    pages: Record<PageKey, ProjectPageHeader>;
    items: ProjectSetRecord[];
};
declare const BLOCK_TYPES: readonly ["intro", "facts", "flow", "cards", "timeline", "cases", "photos", "image"];
type BlockType = (typeof BLOCK_TYPES)[number];
type PageBlock = {
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
export declare function readProjectSetsDocument(): Promise<ProjectSetsDocument>;
export declare function readProjectSetsState(preferDraft: boolean): Promise<{
    doc: ProjectSetsDocument;
    unpublished: boolean;
}>;
export declare function writeProjectSetsDocument(body: unknown, mode?: SaveMode): Promise<void>;
export {};
//# sourceMappingURL=projectSetsFileService.d.ts.map