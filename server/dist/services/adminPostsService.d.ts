type AdminPostMeta = Record<string, string>;
export declare const adminPostsService: {
    list(options: {
        page: number;
        perPage: number;
        kind?: string;
    }): Promise<{
        posts: {
            id: number;
            title: string;
            excerpt: string;
            content: string;
            slug: string;
            status: string;
            postType: string;
            publishedAt: string;
            author: {
                id: number;
                displayName: string;
            } | undefined;
            meta: AdminPostMeta;
        }[];
        total: number;
    }>;
    getById(id: number): Promise<{
        id: number;
        title: string;
        excerpt: string;
        content: string;
        slug: string;
        status: string;
        postType: string;
        publishedAt: string;
        author: {
            id: number;
            displayName: string;
        } | undefined;
        meta: AdminPostMeta;
    } | null>;
    create(params: {
        kind: string;
        title: string;
        excerpt: string;
        content: string;
        status: "publish" | "draft";
        meta: AdminPostMeta;
    }): Promise<{
        id: number;
        title: string;
        excerpt: string;
        content: string;
        slug: string;
        status: string;
        postType: string;
        publishedAt: string;
        author: {
            id: number;
            displayName: string;
        } | undefined;
        meta: AdminPostMeta;
    } | null>;
    update(id: number, params: {
        title?: string;
        excerpt?: string;
        content?: string;
        status?: "publish" | "draft";
        meta?: AdminPostMeta;
    }): Promise<{
        id: number;
        title: string;
        excerpt: string;
        content: string;
        slug: string;
        status: string;
        postType: string;
        publishedAt: string;
        author: {
            id: number;
            displayName: string;
        } | undefined;
        meta: AdminPostMeta;
    } | null>;
    remove(id: number): Promise<boolean>;
};
export {};
//# sourceMappingURL=adminPostsService.d.ts.map