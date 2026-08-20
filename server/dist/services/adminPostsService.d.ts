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
        total: any;
    }>;
    getById(id: number): Promise<{
        id: any;
        title: any;
        excerpt: any;
        content: any;
        slug: any;
        status: any;
        postType: any;
        publishedAt: any;
        author: {
            id: any;
            displayName: any;
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
        publishedAt?: string;
    }): Promise<{
        id: any;
        title: any;
        excerpt: any;
        content: any;
        slug: any;
        status: any;
        postType: any;
        publishedAt: any;
        author: {
            id: any;
            displayName: any;
        } | undefined;
        meta: AdminPostMeta;
    } | null>;
    update(id: number, params: {
        title?: string;
        excerpt?: string;
        content?: string;
        status?: "publish" | "draft";
        meta?: AdminPostMeta;
        publishedAt?: string;
    }): Promise<{
        id: any;
        title: any;
        excerpt: any;
        content: any;
        slug: any;
        status: any;
        postType: any;
        publishedAt: any;
        author: {
            id: any;
            displayName: any;
        } | undefined;
        meta: AdminPostMeta;
    } | null>;
    remove(id: number): Promise<boolean>;
};
export {};
//# sourceMappingURL=adminPostsService.d.ts.map