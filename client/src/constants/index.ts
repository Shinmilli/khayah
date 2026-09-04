import { NANUM_DONATE_URL } from './nanumDonate'

export { NANUM_DONATE_URL }

export const SITE_NAME = '사단법인 카야 인터내셔널'
export const SITE_DESCRIPTION = '개발NGO, 해외후원, 국내후원, 옹호사업, 교육_보건의료'

export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

/** 푸터 상단 바로가기 (한 줄, | 구분) — 라벨은 i18n messages.footer.topLinks */
export const FOOTER_TOP_LINKS = [
  { key: 'donate', href: NANUM_DONATE_URL },
  { key: 'projects', to: '/business/projects' },
  { key: 'location', to: '/about/location' },
  { key: 'instagram', href: 'https://www.instagram.com/khayah_international' },
  { key: 'blog', href: 'https://blog.naver.com/khayah' },
  { key: 'kakao', href: 'https://pf.kakao.com/_TnWKK' },
] as const

/** 푸터 브랜드 로고(다크그레이). 없으면 `FOOTER_LOGO_FALLBACK` + CSS 보정 */
export const FOOTER_LOGO_DARK = '/images/logo/khayahLogoDarkgray.png'
export const FOOTER_LOGO_FALLBACK = '/images/logo/khayah_logo.png'

/** 푸터 본문(주소·연락처) — 줄바꿈 순서 그대로 표시 */
export const FOOTER = {
  contactText:
    '사단법인 카야 인터내셔널\n경기도 성남시 분당구 이매동 81-3 (방아로 38)\nT 070.5121.2198 | F 070.8650.3639\nE khayahinternational@gmail.com',
} as const
