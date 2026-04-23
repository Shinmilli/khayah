import type { PageListItem } from '../types/page';
export declare const pagesService: {
    getPublishedPages(page?: number, perPage?: number): Promise<{
        pages: PageListItem[];
        total: number;
    }>;
    getPageBySlug(slug: string): Promise<{
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        postParent: number;
    } | null>;
};
//# sourceMappingURL=pagesService.d.ts.map