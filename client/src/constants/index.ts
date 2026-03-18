export const SITE_NAME = '사단법인 카야 인터내셔널'
export const SITE_DESCRIPTION = '개발NGO, 해외후원, 국내후원, 옹호사업, 교육_보건의료'

export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

/** 푸터 위젯 텍스트 (워드프레스 widget_text 기반) */
export const FOOTER = {
  shortcutTitle: 'Shortcut links',
  supportTitle: '후원계좌',
  supportText: '예금주 | (사)카야인터내셔널\n우리 | 1005 403 029492　 농협 | 301 1122 4444 01\n국민 | 584101 01 286346　 신한 | 100 034 744590',
  contactTitle: 'KHAYAH International',
  contactText: '카야코리아 | 04080 서울특별시 마포구 토정로 174\nT 031 689 3639 | E khayahkorea@gmail.com',
} as const

/** 홈 슬라이더 이미지 (Rev Slider home-khayah – 업로드 폴더 복사 시 사용) */
export const SLIDER_IMAGES = [
  '/images/slider/home_khayah_slider2.jpg',
  '/images/slider/home_khayah_slider3.jpg',
  '/images/slider/home_khayah_slider4.jpg',
  '/images/slider/home_khayah_slider5.jpg',
] as const
