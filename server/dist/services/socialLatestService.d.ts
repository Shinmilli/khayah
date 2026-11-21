export type SocialPreview = {
    url: string;
    title: string;
    description: string;
    image: string | null;
    publishedAt: string | null;
};
export type SocialLatest = {
    blog: SocialPreview;
    instagram: SocialPreview;
};
export declare function getSocialLatest(): Promise<SocialLatest>;
//# sourceMappingURL=socialLatestService.d.ts.map