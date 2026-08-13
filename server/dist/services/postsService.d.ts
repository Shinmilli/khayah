import type { PostListItem } from '../types/post';
interface GetPublishedOptions {
    page: number;
    perPage: number;
    kind?: string;
    region?: string;
}
export declare const postsService: {
    getPublishedPosts(options: GetPublishedOptions): Promise<{
        posts: PostListItem[];
        total: number;
    }>;
    getPostBySlug(slug: string): Promise<{
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
        meta: Record<string, string>;
    } | null>;
};
export {};
//# sourceMappingURL=postsService.d.ts.map