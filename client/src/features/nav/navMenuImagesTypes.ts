export const NAV_MENU_IMAGE_KEYS = ['khayah', 'business', 'support', 'news'] as const
export type NavMenuImageKey = (typeof NAV_MENU_IMAGE_KEYS)[number]

export type NavMenuImagesDocument = {
  version: 1
  images: Record<NavMenuImageKey, string>
}

export const DEFAULT_NAV_MENU_IMAGES: NavMenuImagesDocument = {
  version: 1,
  images: {
    khayah: '',
    business: '',
    support: '',
    news: '',
  },
}

export const NAV_MENU_IMAGE_LABELS: Record<NavMenuImageKey, string> = {
  khayah: '카야',
  business: '사업',
  support: '후원',
  news: '소식',
}
