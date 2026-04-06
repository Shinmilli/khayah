export interface HomeActionBox {
  title: string
  subtitle: string
  link: string
  backgroundColor: string
  emphasis?: boolean
}

export interface HomePhotoCard {
  img: string
  title: string
  subtitle: string
  description: string
  link: string
}

export const HOME_ACTION_BOXES: HomeActionBox[] = [
  {
    title: '카야 소개',
    subtitle: 'About Khayah',
    link: '/카야/카야소개',
    backgroundColor: '#727272',
  },
  {
    title: '카야 후원하기',
    subtitle: 'Sponsor Khayah',
    link: '/후원가이드/후원자-가이드',
    backgroundColor: '#b20838',
    emphasis: true,
  },
]

export const HOME_PHOTO_CARDS: HomePhotoCard[] = [
  {
    img: '/images/domestic.png',
    title: '국내사업',
    subtitle: 'Domestic Services',
    description: '우리 옆에 있지만 소외된 이웃과 함께합니다.',
    link: '/국내사업',
  },
  {
    img: '/images/overseas.png',
    title: '해외사업',
    subtitle: 'Overseas Services',
    description: '네팔, 미얀마, 키르기스스탄 등에서 개발협력 사업을 진행합니다.',
    link: '/해외사업',
  },
]
