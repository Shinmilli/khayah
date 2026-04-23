interface FindPublishedOptions {
    page: number;
    perPage: number;
    kind?: string;
}
type RepositoryAuthor = {
    id: number;
    displayName: string;
};
type RepositoryPostRow = {
    id: number;
    postTitle: string;
    postName: string;
    postExcerpt: string;
    postContent: string;
    postParent: number;
    menuOrder: number;
    postDate: Date;
    postStatus: 'publish';
    postType: 'page' | 'post';
    author?: RepositoryAuthor;
};
export declare const postRepository: {
    findPublished(options: FindPublishedOptions): Promise<{
        posts: RepositoryPostRow[];
        total: number;
    } | {
        posts: ({
            author: {
                id: number;
                displayName: string;
            };
            postMeta: {
                metaKey: string | null;
                metaValue: string | null;
            }[];
        } & {
            id: number;
            postAuthorId: number;
            postDate: Date;
            postDateGmt: Date;
            postContent: string;
            postTitle: string;
            postExcerpt: string;
            postStatus: string;
            commentStatus: string;
            pingStatus: string;
            postPassword: string;
            postName: string;
            postModified: Date;
            postModifiedGmt: Date;
            postParent: number;
            guid: string;
            menuOrder: number;
            postType: string;
            postMimeType: string;
            commentCount: number;
        })[];
        total: number;
    }>;
    findPublishedPages(options: {
        page?: number;
        perPage?: number;
    }): Promise<{
        pages: {
            id: number;
            postTitle: string;
            postName: string;
            postExcerpt: string;
            postContent: string;
            postParent: number;
            menuOrder: number;
        }[];
        total: number;
    }>;
    findPostBySlug(slug: string): Promise<RepositoryPostRow | ({
        author: {
            id: number;
            displayName: string;
        };
        postMeta: {
            metaKey: string | null;
            metaValue: string | null;
        }[];
    } & {
        id: number;
        postAuthorId: number;
        postDate: Date;
        postDateGmt: Date;
        postContent: string;
        postTitle: string;
        postExcerpt: string;
        postStatus: string;
        commentStatus: string;
        pingStatus: string;
        postPassword: string;
        postName: string;
        postModified: Date;
        postModifiedGmt: Date;
        postParent: number;
        guid: string;
        menuOrder: number;
        postType: string;
        postMimeType: string;
        commentCount: number;
    }) | null>;
    findPageBySlug(slug: string): Promise<{
        id: number;
        postTitle: string;
        postName: string;
        postExcerpt: string;
        postContent: string;
        postParent: number;
    } | null>;
};
export {};
//# sourceMappingURL=postRepository.d.ts.map