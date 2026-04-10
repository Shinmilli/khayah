export interface HeroSlideItem {
  image: string
  alt: string
  lines: string[]
}

export interface StoryItem {
  image: string
  alt: string
  chip: string
  title: string
  text: string
}

export interface BoardItem {
  title: string
  date: string
  isNew?: boolean
}

export const HERO_SLIDES: HeroSlideItem[] = [
  {
    image: '/images/Home/slider/SliderImg1.JPG',
    alt: '아이들 이미지',
    lines: ['카야는', '사람을 키우고 섬기는', '개발 NGO 입니다.'],
  },
  {
    image: '/images/Home/slider/sliderImg2.jpg',
    alt: '함께 만들어가는 세상',
    lines: ['함께 만들어가는', '따뜻한 세상'],
  },
  {
    image: '/images/Home/slider/sliderImg3.jpg',
    alt: '작은 변화와 희망',
    lines: ['작은 변화가', '큰 희망을 만듭니다'],
  },
]

export const STORY_ITEMS: StoryItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=500&fit=crop',
    alt: '미얀마 난민 긴급 식량 지원',
    chip: '해외사업',
    title: '[2026] 미얀마 난민 긴급 식량 지원',
    text: '계속되는 분쟁으로 삶의 터전을 잃은 이들에게 가장 필요한 것은 오늘을 버틸 한 끼의 식사입니다.',
  },
  {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop',
    alt: '아이들의 하루를 바꾸는 급식 프로젝트',
    chip: '국내사업',
    title: '아이들의 하루를 바꾸는 지역 급식 프로젝트',
    text: '작은 한 끼가 모여 아이들의 내일을 바꿉니다. 함께 만들어가는 따뜻한 변화에 참여해 주세요.',
  },
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    alt: '모두가 존중받는 세상',
    chip: '옹호사업',
    title: '모두가 존중받는 세상을 위한 목소리',
    text: '현장의 이야기가 정책으로 연결되도록, 우리가 할 수 있는 변화의 시작을 기록합니다.',
  },
  {
    image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&h=500&fit=crop',
    alt: '자립의 여정',
    chip: '진행사업',
    title: '현장과 함께 만드는 자립의 여정',
    text: '교육, 보건, 생계까지. 지속 가능한 변화를 위해 현장에서 이어지는 프로젝트를 소개합니다.',
  },
  {
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=500&fit=crop',
    alt: '아동 지원',
    chip: '국내사업',
    title: '아이들의 배움이 멈추지 않도록',
    text: '지역사회와 함께 필요한 지원을 연결합니다. 작은 도움으로도 아이들의 일상은 달라질 수 있습니다.',
  },
  {
    image: 'https://images.unsplash.com/photo-1520975958225-0f015b1d7a88?w=800&h=500&fit=crop',
    alt: '연대와 협력',
    chip: '옹호사업',
    title: '연대가 만드는 더 큰 변화',
    text: '사람들의 목소리가 모이면 제도와 인식이 바뀝니다. 함께 나아갈 길을 이야기합니다.',
  },
]

export const NOTICE_ITEMS: BoardItem[] = [
  { title: '2026년 1분기 정기 후원금 모금 안내', date: '26.01.05', isNew: true },
  { title: '시스템 점검 안내 (2026.01.20 예정)', date: '26.01.03', isNew: true },
  { title: '연말연시 휴무 안내', date: '25.12.25' },
  { title: '개인정보 처리방침 개정 안내', date: '25.12.15' },
  { title: '기부금 영수증 발급 일정 안내', date: '25.12.08' },
]

export const HERO_BIZ_LINKS: { label: string; to: string }[] = [
  { label: '국내사업', to: '/국내사업' },
  { label: '해외사업', to: '/해외사업' },
  { label: '옹호사업', to: '/사업/옹호사업' },
  { label: '진행사업', to: '/사업/진행사업' },
]
