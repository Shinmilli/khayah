interface FindPublishedOptions {
    page: number;
    perPage: number;
    kind?: string;
    region?: string;
}
type RepositoryAuthor = {
    id: number;
    displayName: string;
};
type RepositoryPostMetaRow = {
    metaKey: string | null;
    metaValue: string | null;
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
    postMeta?: RepositoryPostMetaRow[];
};
type RepositoryPageRow = Pick<RepositoryPostRow, 'id' | 'postTitle' | 'postName' | 'postExcerpt' | 'postContent' | 'postParent' | 'menuOrder'>;
export declare const postRepository: {
    findPublished(options: FindPublishedOptions): Promise<{
        posts: RepositoryPostRow[];
        total: number;
    }>;
    findPublishedPages(options: {
        page?: number;
        perPage?: number;
    }): Promise<{
        pages: RepositoryPageRow[];
        total: number;
    }>;
    findPostBySlug(slug: string): Promise<any>;
    findPageBySlug(slug: string): Promise<any>;
};
export {};
//# sourceMappingURL=postRepository.d.ts.map