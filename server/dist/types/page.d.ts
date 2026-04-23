export interface PageListItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    postParent: number;
    menuOrder: number;
}
export interface PageDetail extends PageListItem {
    postParent: number;
}
//# sourceMappingURL=page.d.ts.map