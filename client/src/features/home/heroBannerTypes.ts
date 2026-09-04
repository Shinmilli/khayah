export type HeroBannerLocaleCopy = {
  alt: string
  lines: string[]
}

export type HeroBannerSlide = {
  id: string
  order: number
  enabled: boolean
  image: string
  locales: {
    ko: HeroBannerLocaleCopy
    en: HeroBannerLocaleCopy
  }
}

export type HeroBannerDocument = {
  version: 1
  slides: HeroBannerSlide[]
}

export type HeroBannerPublicSlide = {
  id: string
  order: number
  image: string
  alt: string
  lines: string[]
}

export type HeroBannerPublicDocument = {
  version: 1
  slides: HeroBannerPublicSlide[]
}

export type HeroBannerEditLocale = 'ko' | 'en'

export const DEFAULT_HERO_BANNER: HeroBannerDocument = {
  version: 1,
  slides: [
    {
      id: 'h1',
      order: 1,
      enabled: true,
      image: '/images/Home/slider/SliderImg1.JPG',
      locales: {
        ko: {
          alt: '아이들 이미지',
          lines: ['카야는', '사람을 키우고 섬기는', '개발 NGO 입니다.'],
        },
        en: {
          alt: 'Children',
          lines: ['Khayah is', 'a development NGO', 'that nurtures and serves people.'],
        },
      },
    },
    {
      id: 'h2',
      order: 2,
      enabled: true,
      image: '/images/Home/slider/sliderImg2.jpg',
      locales: {
        ko: {
          alt: '함께 만들어가는 세상',
          lines: ['함께 만들어가는', '따뜻한 세상'],
        },
        en: {
          alt: 'Building a warmer world together',
          lines: ['Together we build', 'a warmer world'],
        },
      },
    },
    {
      id: 'h3',
      order: 3,
      enabled: true,
      image: '/images/Home/slider/sliderImg3.jpg',
      locales: {
        ko: {
          alt: '작은 변화와 희망',
          lines: ['작은 변화가', '큰 희망을 만듭니다'],
        },
        en: {
          alt: 'Small changes and hope',
          lines: ['Small changes', 'create great hope'],
        },
      },
    },
  ],
}
