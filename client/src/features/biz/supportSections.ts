import type { BizSection } from './bizSupportTypes'

export type SupportSection = { id: string; title: string; note?: string }

export const GUIDE_SECTIONS: SupportSection[] = [
  { id: 'guide.hero', title: '첫 화면 (미션 문구·사진·버튼)' },
  { id: 'guide.where', title: '후원이 닿는 곳' },
  { id: 'guide.impact', title: '함께 만든 변화', note: '임팩트 대시보드 연동 · 공개 전 자동 숨김' },
  { id: 'guide.open', title: '투명하게 운영합니다' },
  { id: 'guide.give', title: '후원 종류 · 후원 버튼' },
  { id: 'guide.contact', title: '후원 문의', note: '연락처는 사이트 공통 정보에서 불러옴' },
]

export const METHOD_SECTIONS: SupportSection[] = [
  { id: 'method.happy', title: '해피나눔 안내' },
  { id: 'method.steps', title: '신청 절차', note: '단계 추가·삭제, 캡처 교체' },
  { id: 'method.pay', title: '납부 방법', note: '결제일·결제수단 안내 문구' },
  { id: 'method.account', title: '후원 계좌', note: '계좌 추가·삭제' },
  { id: 'method.receipt', title: '후원회원 혜택·영수증' },
  { id: 'method.contact', title: '변경·문의 · 후원 추천하기', note: '연락처는 사이트 공통 정보에서 불러옴' },
  { id: 'method.cta', title: '하단 후원 버튼', note: '링크는 후원 공통 설정에서 관리' },
]

export function rankedSupportSections(page: 'guide' | 'method', sections: BizSection[] | undefined) {
  const catalog = page === 'guide' ? GUIDE_SECTIONS : METHOD_SECTIONS
  return catalog
    .map((item, index) => {
      const found = sections?.find((row) => row.id === item.id)
      return { ...item, order: found?.order ?? index + 1, enabled: found?.enabled !== false, index }
    })
    .sort((a, b) => a.order - b.order || a.index - b.index)
}
