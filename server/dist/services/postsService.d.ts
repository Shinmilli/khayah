import type { PostListItem } from '../types/post';
interface GetPublishedOptions {
    page: number;
    perPage: number;
    kind?: string;
}
export declare const postsService: {
    getPublishedPosts(options: GetPublishedOptions): Promise<{
        posts: PostListItem[];
        total: number;
    }>;
    getPostBySlug(slug: string): Promise<{
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
        meta: Record<string, string>;
    } | null>;
};
export {};
//# sourceMappingURL=postsService.d.ts.map