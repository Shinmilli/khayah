import type { PageListItem } from '../types/page';
export declare const pagesService: {
    getPublishedPages(page?: number, perPage?: number): Promise<{
        pages: PageListItem[];
        total: number;
    }>;
    getPageBySlug(slug: string): Promise<{
        id: any;
        title: any;
        slug: any;
        excerpt: any;
        content: any;
        postParent: any;
    } | null>;
};
//# sourceMappingURL=pagesService.d.ts.map