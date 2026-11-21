import { type SaveMode } from './documentDraft';
export type ImpactSection = {
    id: string;
    order: number;
    enabled: boolean;
};
export type ImpactNumber = {
    label: string;
    value: string;
    unit: string;
    note: string;
    source?: 'manual' | 'impact';
    impactKey?: string;
    enabled?: boolean;
};
export type ImpactOffice = {
    name: string;
    kicker: string;
    status: string;
    body: string;
    photo: string;
    photoAlt: string;
    people: string;
    partners: string;
    programs: string;
};
export type ImpactPageDocument = {
    version: 1;
    public: boolean;
    title: string;
    kicker: string;
    headline: string;
    message: string;
    sections: ImpactSection[];
    homeTitle: string;
    homeLead: string;
    homeNote: string;
    homePublic?: boolean;
    homeNumbers: ImpactNumber[];
    overviewNote: string;
    overview: ImpactNumber[];
    offices: ImpactOffice[];
    supportScope: 'all' | 'country';
    featuredLabel: string;
    projects: Array<{
        id: string;
        name: string;
        base: string;
        field: string;
        period: string;
        status: '진행' | '종료';
    }>;
    years: Array<{
        year: string;
        rows: Array<{
            name: string;
            real: string;
            total: string;
            child: string;
            youth: string;
            teacher: string;
        }>;
    }>;
    evals: Array<{
        id: string;
        program: string;
        axis: string;
        mode: string;
        value: string;
        itemName: string;
        meta: string;
    }>;
    stories: Array<{
        id: string;
        category: '변화의 이야기' | '전문가 이야기';
        title: string;
        project: string;
        featured: boolean;
        consent: boolean;
        body: string;
        before: string;
        intervention: string;
        after: string;
        evidence: string;
        sustainability: string;
        expertName: string;
        expertOrg: string;
        expertField: string;
        expertLine: string;
        expertPhoto: string;
    }>;
};
export declare function defaultImpactPageDocument(): ImpactPageDocument;
export declare function normalizeImpactPage(body: unknown): ImpactPageDocument;
export declare function readImpactPageDocument(): Promise<ImpactPageDocument>;
export declare function readImpactPageState(preferDraft: boolean): Promise<{
    doc: ImpactPageDocument;
    unpublished: boolean;
}>;
export declare function writeImpactPageDocument(body: unknown, mode?: SaveMode): Promise<void>;
//# sourceMappingURL=impactPageFileService.d.ts.map