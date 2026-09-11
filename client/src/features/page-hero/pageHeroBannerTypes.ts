export const PAGE_HERO_BANNER_KEYS = ['khayah', 'business', 'support', 'news'] as const
export type PageHeroBannerKey = (typeof PAGE_HERO_BANNER_KEYS)[number]

export type PageHeroBannersDocument = {
  version: 1
  images: Record<PageHeroBannerKey, string>
}

export const DEFAULT_PAGE_HERO_BANNERS: PageHeroBannersDocument = {
  version: 1,
  images: {
    khayah: '',
    business: '',
    support: '',
    news: '',
  },
}

export const PAGE_HERO_BANNER_LABELS: Record<PageHeroBannerKey, string> = {
  khayah: '카야',
  business: '사업',
  support: '후원',
  news: '소식',
}

export const PAGE_HERO_BANNER_HINTS: Record<PageHeroBannerKey, string> = {
  khayah: '인사말, 연혁, 오시는 길, 재정보고, 소개·CI·조직도',
  business: '국내사업, 해외사업, 옹호사업, 진행사업',
  support: '후원 안내, 후원 신청',
  news: '스토리, 공지사항, 활동소식, 연간소식지, 언론보도, 문의',
}
