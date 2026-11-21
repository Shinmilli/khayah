import { type SaveMode } from './documentDraft';
export type KayaMember = {
    id: string;
    group: '이사회' | '전문위원회';
    order: number;
    enabled: boolean;
    badge: string;
    name: string;
    nameEn: string;
    role: string;
    bio: string;
    bioEn: string;
    showTerm: boolean;
    termStart: string;
    termEnd: string;
};
export type KayaPagesDocument = {
    version: 1;
    fields: Record<string, string>;
    members: KayaMember[];
};
export declare function defaultKayaPagesDocument(): KayaPagesDocument;
export declare function readKayaPagesDocument(): Promise<KayaPagesDocument>;
export declare function readKayaPagesState(preferDraft: boolean): Promise<{
    doc: KayaPagesDocument;
    unpublished: boolean;
}>;
export declare function writeKayaPagesDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=kayaPagesFileService.d.ts.map