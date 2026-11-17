import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { adminFetchBizSupport, adminPutBizSupport } from '../../../services/api'
import { resetBizSupportCache } from '../../biz/useBizSupport'
import type { BizSupportDocument } from '../../biz/bizSupportTypes'

type TabId = 'common' | 'intro' | 'social' | 'academy' | 'cnc' | 'guide' | 'method' | 'settings'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'common', label: '사업 공통' },
  { id: 'intro', label: '사업 소개' },
  { id: 'social', label: '소셜비즈니스' },
  { id: 'academy', label: '카야 아카데미' },
  { id: 'cnc', label: '컬러앤컴포트' },
  { id: 'guide', label: '후원 안내' },
  { id: 'method', label: '후원 방법' },
  { id: 'settings', label: '후원 공통' },
]

const MENU_LABEL: Record<string, string> = {
  domestic: '국내사업',
  domesticEducation: '국내 · 교육',
  domesticProjects: '국내 진행사업',
  overseas: '해외사업',
  overseasEducation: '해외 · 교육',
  overseasVolunteer: '해외봉사단',
  overseasProjects: '해외 진행사업',
  advocacy: '연구사업',
  researchProjects: '연구사업 진행사업',
  researchSocial: '소셜비즈니스',
  socialAcademy: '카야 아카데미',
  socialComfort: '컬러앤컴포트',
}

type Field = { key: string; label: string; html?: boolean; image?: boolean; rows?: number }

const INTRO_PAGES: Array<{ id: string; label: string; fields: Field[] }> = [
  {
    id: 'dom',
    label: '국내사업 소개',
    fields: [
      { key: 'dom.photo', label: '상단 사진', image: true },
      { key: 'dom.photoAlt', label: '사진 대체 텍스트' },
      { key: 'dom.title', label: '소개 제목', html: true, rows: 2 },
      { key: 'dom.lead', label: '소개 문장', rows: 3 },
      { key: 'dom.p.0.title', label: '원칙 1' },
      { key: 'dom.p.0.body', label: '원칙 1 본문', rows: 3 },
      { key: 'dom.p.1.title', label: '원칙 2' },
      { key: 'dom.p.1.body', label: '원칙 2 본문', rows: 3 },
      { key: 'dom.p.2.title', label: '원칙 3' },
      { key: 'dom.p.2.body', label: '원칙 3 본문', rows: 3 },
    ],
  },
  {
    id: 'dedu',
    label: '국내 교육',
    fields: [
      { key: 'dedu.title', label: '소개 제목', html: true },
      { key: 'dedu.desc', label: '소개 문장', rows: 3 },
      { key: 'dedu.cta', label: '진행사업 확인하기' },
      { key: 'dedu.0.title', label: '프로그램 1' },
      { key: 'dedu.0.sub', label: '프로그램 1 축' },
      { key: 'dedu.0.photo', label: '프로그램 1 사진', image: true },
      { key: 'dedu.0.caption', label: '프로그램 1 설명' },
      { key: 'dedu.1.title', label: '프로그램 2' },
      { key: 'dedu.1.sub', label: '프로그램 2 축' },
      { key: 'dedu.1.photo', label: '프로그램 2 사진', image: true },
      { key: 'dedu.1.caption', label: '프로그램 2 설명' },
      { key: 'dedu.2.title', label: '프로그램 3' },
      { key: 'dedu.2.sub', label: '프로그램 3 축' },
      { key: 'dedu.2.photo', label: '프로그램 3 사진', image: true },
      { key: 'dedu.2.caption', label: '프로그램 3 설명' },
    ],
  },
  {
    id: 'ovs',
    label: '해외사업 소개',
    fields: [
      { key: 'ovs.photo', label: '상단 사진', image: true },
      { key: 'ovs.photoAlt', label: '사진 대체 텍스트' },
      { key: 'ovs.title', label: '소개 제목', html: true },
      { key: 'ovs.lead', label: '소개 문장', rows: 2 },
      { key: 'ovs.cta', label: '진행사업 확인하기' },
      { key: 'ovs.p.0.title', label: '원칙 1' },
      { key: 'ovs.p.0.body', label: '원칙 1 본문', html: true, rows: 3 },
      { key: 'ovs.p.1.title', label: '원칙 2' },
      { key: 'ovs.p.1.body', label: '원칙 2 본문', html: true, rows: 3 },
      { key: 'ovs.p.2.title', label: '원칙 3' },
      { key: 'ovs.p.2.body', label: '원칙 3 본문', html: true, rows: 3 },
      { key: 'ovs.p.3.title', label: '원칙 4' },
      { key: 'ovs.p.3.body', label: '원칙 4 본문', html: true, rows: 3 },
    ],
  },
  {
    id: 'oedu',
    label: '해외 교육',
    fields: [
      { key: 'oedu.title', label: '소개 제목', html: true },
      { key: 'oedu.desc', label: '소개 문장', rows: 3 },
      { key: 'oedu.cta', label: '진행사업 확인하기' },
      { key: 'oedu.0.title', label: '교육 축 1' },
      { key: 'oedu.0.body', label: '교육 축 1 본문', rows: 3 },
      { key: 'oedu.0.photo.0', label: '축 1 사진 1', image: true },
      { key: 'oedu.0.cap.0', label: '축 1 사진 1 설명' },
      { key: 'oedu.0.photo.1', label: '축 1 사진 2', image: true },
      { key: 'oedu.0.cap.1', label: '축 1 사진 2 설명' },
      { key: 'oedu.0.photo.2', label: '축 1 사진 3', image: true },
      { key: 'oedu.0.cap.2', label: '축 1 사진 3 설명' },
      { key: 'oedu.1.title', label: '교육 축 2' },
      { key: 'oedu.1.body', label: '교육 축 2 본문', rows: 3 },
      { key: 'oedu.1.photo.0', label: '축 2 사진 1', image: true },
      { key: 'oedu.1.cap.0', label: '축 2 사진 1 설명' },
      { key: 'oedu.1.photo.1', label: '축 2 사진 2', image: true },
      { key: 'oedu.1.cap.1', label: '축 2 사진 2 설명' },
      { key: 'oedu.1.photo.2', label: '축 2 사진 3', image: true },
      { key: 'oedu.1.cap.2', label: '축 2 사진 3 설명' },
      { key: 'oedu.2.title', label: '교육 축 3' },
      { key: 'oedu.2.body', label: '교육 축 3 본문', rows: 3 },
      { key: 'oedu.2.photo.0', label: '축 3 사진 1', image: true },
      { key: 'oedu.2.cap.0', label: '축 3 사진 1 설명' },
      { key: 'oedu.2.photo.1', label: '축 3 사진 2', image: true },
      { key: 'oedu.2.cap.1', label: '축 3 사진 2 설명' },
      { key: 'oedu.2.photo.2', label: '축 3 사진 3', image: true },
      { key: 'oedu.2.cap.2', label: '축 3 사진 3 설명' },
    ],
  },
  {
    id: 'vol',
    label: '해외봉사단',
    fields: [
      { key: 'vol.title', label: '소개 제목', html: true },
      { key: 'vol.desc', label: '소개 문장', rows: 4 },
      { key: 'vol.cta', label: '진행사업 확인하기' },
      { key: 'vol.block.0.title', label: '단계 목록 1' },
      { key: 'vol.block.0.lead', label: '단계 목록 1 설명', rows: 3 },
      { key: 'vol.panel.0.title', label: '목록 1' },
      { key: 'vol.panel.1.title', label: '목록 2' },
      { key: 'vol.block.1.title', label: '단계 목록 2' },
      { key: 'vol.block.1.lead', label: '단계 목록 2 설명', rows: 3 },
      { key: 'vol.photo.0', label: '하단 사진 1', image: true },
      { key: 'vol.photo.1', label: '하단 사진 2', image: true },
      { key: 'vol.photo.2', label: '하단 사진 3', image: true },
    ],
  },
  {
    id: 'res',
    label: '연구사업 소개',
    fields: [
      { key: 'res.photo', label: '상단 사진', image: true },
      { key: 'res.photoAlt', label: '사진 대체 텍스트' },
      { key: 'res.title', label: '소개 제목', rows: 2 },
      { key: 'res.lead', label: '소개 문장', rows: 3 },
      { key: 'res.cta', label: '진행사업 확인하기' },
      { key: 'res.p.0.title', label: '원칙 1' },
      { key: 'res.p.0.body', label: '원칙 1 본문', html: true, rows: 3 },
      { key: 'res.p.1.title', label: '원칙 2' },
      { key: 'res.p.1.body', label: '원칙 2 본문', html: true, rows: 3 },
      { key: 'res.p.2.title', label: '원칙 3' },
      { key: 'res.p.2.body', label: '원칙 3 본문', html: true, rows: 3 },
      { key: 'res.p.3.title', label: '원칙 4' },
      { key: 'res.p.3.body', label: '원칙 4 본문', html: true, rows: 3 },
      { key: 'res.card.0.title', label: '하단 카드 1' },
      { key: 'res.card.0.desc', label: '하단 카드 1 본문', rows: 2 },
      { key: 'res.card.0.href', label: '하단 카드 1 링크' },
      { key: 'res.card.1.title', label: '하단 카드 2' },
      { key: 'res.card.1.desc', label: '하단 카드 2 본문', rows: 2 },
      { key: 'res.card.1.href', label: '하단 카드 2 링크' },
      { key: 'res.card.2.title', label: '하단 카드 3' },
      { key: 'res.card.2.desc', label: '하단 카드 3 본문', rows: 2 },
      { key: 'res.card.2.href', label: '하단 카드 3 링크' },
    ],
  },
]

const PAGE_FIELDS: Record<Exclude<TabId, 'common' | 'intro' | 'settings'>, Field[]> = {
  social: [
    { key: 'soc.title', label: '소개 제목', html: true },
    { key: 'soc.lead', label: '소개 문장', html: true, rows: 2 },
    { key: 'soc.aca.photo', label: '카야 아카데미 사진', image: true },
    { key: 'soc.aca.caption', label: '카야 아카데미 사진 설명' },
    { key: 'soc.aca.name', label: '카야 아카데미 이름' },
    { key: 'soc.aca.lead', label: '카야 아카데미 문장', rows: 2 },
    { key: 'soc.aca.more', label: '카야 아카데미 버튼' },
    { key: 'soc.aca.href', label: '카야 아카데미 링크' },
    { key: 'soc.cnc.logo', label: '컬러앤컴포트 로고', image: true },
    { key: 'soc.cnc.name', label: '컬러앤컴포트 이름' },
    { key: 'soc.cnc.lead', label: '컬러앤컴포트 문장', rows: 2 },
    { key: 'soc.cnc.more', label: '컬러앤컴포트 버튼' },
    { key: 'soc.cnc.href', label: '컬러앤컴포트 링크' },
    { key: 'soc.cnc.photo', label: '컬러앤컴포트 사진', image: true },
    { key: 'soc.cnc.caption', label: '컬러앤컴포트 사진 설명' },
  ],
  academy: [
    { key: 'aca.title', label: '소개 제목', html: true },
    { key: 'aca.lead', label: '소개 문장', html: true, rows: 2 },
    { key: 'aca.heroPhoto', label: '상단 사진', image: true },
    { key: 'aca.heroCaption', label: '상단 사진 설명' },
    { key: 'aca.pre.lead', label: 'Pre-School 문장', rows: 2 },
    { key: 'aca.pre.target', label: '대상' },
    { key: 'aca.pre.study', label: '교육 내용' },
    { key: 'aca.book.lead', label: '학습지 문장', html: true, rows: 2 },
    { key: 'aca.csr', label: 'CSR', rows: 2 },
    { key: 'aca.facebook', label: '페이스북 링크' },
    { key: 'aca.instagram', label: '인스타그램 링크' },
  ],
  cnc: [
    { key: 'cnc.title', label: '소개 제목', html: true },
    { key: 'cnc.lead', label: '소개 문장', html: true, rows: 2 },
    { key: 'cnc.heroPhoto', label: '상단 사진', image: true },
    { key: 'cnc.heroCaption', label: '상단 사진 설명' },
    { key: 'cnc.note', label: '브랜드 문구' },
    { key: 'cnc.storeLabel', label: '스토어 버튼' },
    { key: 'cnc.store', label: '스토어 링크' },
    { key: 'cnc.kakaoLabel', label: '카카오톡 버튼' },
    { key: 'cnc.kakao', label: '카카오톡 링크' },
    { key: 'cnc.instagram', label: '인스타그램 링크' },
  ],
  guide: [
    { key: 'guide.title', label: '첫 화면 제목', html: true, rows: 2 },
    { key: 'guide.lead', label: '첫 화면 문장', html: true, rows: 2 },
    { key: 'guide.photo', label: '첫 화면 사진', image: true },
    { key: 'guide.photoAlt', label: '사진 대체 텍스트' },
    { key: 'guide.whereTitle', label: '후원이 닿는 곳' },
    { key: 'guide.whereLead', label: '후원이 닿는 곳 문장', rows: 2 },
    { key: 'guide.placePhoto', label: '대표 카드 사진', image: true },
    { key: 'guide.placeAlt', label: '대표 카드 사진 대체 텍스트' },
    { key: 'guide.placeTag', label: '대표 카드 태그' },
    { key: 'guide.placeTitle', label: '대표 카드 제목' },
    { key: 'guide.placeBody', label: '대표 카드 본문', rows: 3 },
    { key: 'guide.item.0.title', label: '카드 1' },
    { key: 'guide.item.0.body', label: '카드 1 본문', rows: 2 },
    { key: 'guide.item.1.title', label: '카드 2' },
    { key: 'guide.item.1.body', label: '카드 2 본문', rows: 2 },
    { key: 'guide.item.2.title', label: '카드 3' },
    { key: 'guide.item.2.body', label: '카드 3 본문', rows: 2 },
    { key: 'guide.give.0.title', label: '후원 종류 1' },
    { key: 'guide.give.0.body', label: '후원 종류 1 본문', rows: 2 },
    { key: 'guide.give.1.title', label: '후원 종류 2' },
    { key: 'guide.give.1.body', label: '후원 종류 2 본문', rows: 2 },
    { key: 'guide.give.2.title', label: '후원 종류 3' },
    { key: 'guide.give.2.body', label: '후원 종류 3 본문', rows: 2 },
  ],
  method: [
    { key: 'method.title', label: '제목' },
    { key: 'method.lead', label: '소개 문장', rows: 2 },
    { key: 'method.happyTitle', label: '해피나눔 안내', html: true, rows: 2 },
    { key: 'method.step.0.title', label: '절차 1' },
    { key: 'method.step.0.photo', label: '절차 1 캡처', image: true },
    { key: 'method.step.1.title', label: '절차 2' },
    { key: 'method.step.1.photo', label: '절차 2 캡처', image: true },
    { key: 'method.step.2.title', label: '절차 3' },
    { key: 'method.step.2.photo', label: '절차 3 캡처', image: true },
    { key: 'method.pay.0.title', label: '납부 1' },
    { key: 'method.pay.0.badge', label: '납부 1 배지' },
    { key: 'method.pay.1.title', label: '납부 2' },
    { key: 'method.pay.1.badge', label: '납부 2 배지' },
    { key: 'method.receiptTitle', label: '영수증 안내' },
    { key: 'method.contactTitle', label: '변경 안내' },
    { key: 'method.contactBody', label: '변경 안내 본문', rows: 3 },
  ],
}

function fieldGroups(id: string, fields: Field[]): Array<{ title: string; rows: Field[] }> {
  const rules: Array<[string, (key: string) => boolean]> =
    id === 'dom'
      ? [
          ['① 상단 사진', (key) => key.includes('photo')],
          ['② 소개', (key) => key === 'dom.title' || key === 'dom.lead'],
          ['③ 원칙 목록', (key) => key.includes('.p.')],
        ]
      : id === 'dedu'
        ? [
            ['② 소개', (key) => key === 'dedu.title' || key === 'dedu.desc'],
            ['④ 프로그램 · 교육 축', (key) => key.startsWith('dedu.0.') || key.startsWith('dedu.1.') || key.startsWith('dedu.2.')],
            ['⑦ 진행사업 확인하기', (key) => key.endsWith('.cta')],
          ]
        : id === 'ovs'
          ? [
              ['① 상단 사진', (key) => key.includes('photo')],
              ['② 소개', (key) => key === 'ovs.title' || key === 'ovs.lead'],
              ['③ 원칙 목록', (key) => key.includes('.p.')],
              ['⑦ 진행사업 확인하기', (key) => key.endsWith('.cta')],
            ]
          : id === 'oedu'
            ? [
                ['② 소개', (key) => key === 'oedu.title' || key === 'oedu.desc'],
                ['③ 기초를 다지는 교육', (key) => key.startsWith('oedu.0.')],
                ['④ 미래를 여는 교육', (key) => key.startsWith('oedu.1.')],
                ['⑤ 함께 만드는 교육', (key) => key.startsWith('oedu.2.')],
                ['⑦ 진행사업 확인하기', (key) => key.endsWith('.cta')],
              ]
            : id === 'vol'
              ? [
                  ['② 소개', (key) => key === 'vol.title' || key === 'vol.desc'],
                  ['⑤ 단계 목록', (key) => key.includes('.block.') || key.includes('.panel.')],
                  ['⑥ 하단 카드', (key) => key.includes('photo')],
                  ['⑦ 진행사업 확인하기', (key) => key.endsWith('.cta')],
                ]
              : id === 'res'
                ? [
                    ['① 상단 사진', (key) => key.includes('photo')],
                    ['② 소개', (key) => key === 'res.title' || key === 'res.lead'],
                    ['③ 연구의 흐름', (key) => key.includes('.p.')],
                    ['⑥ 하단 카드', (key) => key.includes('.card.')],
                    ['⑦ 진행사업 확인하기', (key) => key.endsWith('.cta')],
                  ]
                : id === 'social'
                  ? [
                      ['② 소개', (key) => key === 'soc.title' || key === 'soc.lead'],
                      ['③ 사업 소개 블록 · 카야 아카데미', (key) => key.startsWith('soc.aca.')],
                      ['④ 사업 소개 블록 · 컬러앤컴포트', () => true],
                    ]
                  : id === 'academy'
                    ? [
                        ['① 상단 사진', (key) => key.startsWith('aca.hero')],
                        ['② 소개', (key) => key === 'aca.title' || key === 'aca.lead'],
                        ['③ Pre-School', (key) => key.startsWith('aca.pre.')],
                        ['④ 학습지', (key) => key.startsWith('aca.book.')],
                        ['⑤ CSR', () => true],
                      ]
                    : id === 'cnc'
                      ? [
                          ['① 상단 사진', (key) => key.startsWith('cnc.hero')],
                          ['② 소개', (key) => key === 'cnc.title' || key === 'cnc.lead'],
                          ['③ 브랜드 이야기', (key) => key === 'cnc.note'],
                          ['⑤ 구매 방법 · 버튼', () => true],
                        ]
                      : id === 'guide'
                        ? [
                            ['① 첫 화면', (key) => ['guide.title', 'guide.lead', 'guide.photo', 'guide.photoAlt'].includes(key)],
                            ['② 후원이 닿는 곳', (key) => key.startsWith('guide.where') || key.startsWith('guide.place') || key.startsWith('guide.item.')],
                            ['③ 후원 종류', () => true],
                          ]
                        : [
                            ['① 소개', (key) => key === 'method.title' || key === 'method.lead'],
                            ['해피나눔', (key) => key.startsWith('method.happy')],
                            ['② 신청 절차', (key) => key.startsWith('method.step.')],
                            ['③ 납부 방법', (key) => key.startsWith('method.pay.')],
                            ['④ 후원 계좌 · 영수증', (key) => key.startsWith('method.receipt')],
                            ['⑤ 변경 안내', () => true],
                          ]
  const used = new Set<string>()
  const groups: Array<{ title: string; rows: Field[] }> = []
  for (const [title, match] of rules) {
    const rows = fields.filter((field) => !used.has(field.key) && match(field.key))
    rows.forEach((field) => used.add(field.key))
    if (rows.length) groups.push({ title, rows })
  }
  return groups
}

function OnOff({ enabled, onChange }: { enabled: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="admin-segmented admin-segmented--tight" role="group" aria-label="표시">
      <button type="button" className={`admin-segmented__btn${enabled ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange(true)}>
        ON
      </button>
      <button type="button" className={`admin-segmented__btn${!enabled ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange(false)}>
        OFF
      </button>
    </div>
  )
}

const BIZ_TABS: TabId[] = ['common', 'intro', 'social', 'academy', 'cnc', 'guide', 'method', 'settings']

function bizTab(raw: string | null): TabId {
  return BIZ_TABS.includes(raw as TabId) ? (raw as TabId) : 'common'
}

export function AdminBizSupportPage() {
  const [params, setParams] = useSearchParams()
  const tab = bizTab(params.get('tab'))
  const [doc, setDoc] = useState<BizSupportDocument | null>(null)
  const pageParam = params.get('page')
  const [introId, setIntroId] = useState(pageParam && INTRO_PAGES.some((page) => page.id === pageParam) ? pageParam : 'dom')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setDoc(await adminFetchBizSupport())
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (pageParam && INTRO_PAGES.some((page) => page.id === pageParam)) setIntroId(pageParam)
  }, [pageParam])

  const setField = (key: string, value: string) => {
    setDoc((prev) => (prev ? { ...prev, fields: { ...prev.fields, [key]: value } } : prev))
  }

  const onSave = async () => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutBizSupport(doc)
      setDoc(saved)
      resetBizSupportCache()
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !doc) {
    return (
      <div className="admin-page">
        <p className="admin-panel__foot">{error || '불러오는 중…'}</p>
      </div>
    )
  }

  const intro = INTRO_PAGES.find((page) => page.id === introId) ?? INTRO_PAGES[0]
  const fields = tab === 'intro' ? intro.fields : tab === 'common' || tab === 'settings' ? [] : PAGE_FIELDS[tab]
  const sectionPage = tab === 'intro' ? intro.id : tab

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">{tab === 'guide' || tab === 'method' || tab === 'settings' ? '후원' : '사업'}</p>
          <h1 className="admin-page__title">{TABS.find((item) => item.id === tab)?.label}</h1>
        </div>
        <div className="admin-page__actions">
          <a className="admin-btn" href={tab === 'guide' ? '/support/guide' : tab === 'method' ? '/support/method' : tab === 'social' ? '/business/social' : tab === 'academy' ? '/business/social/academy' : tab === 'cnc' ? '/business/social/color-and-comfort' : tab === 'intro' ? '/business/domestic' : '/'} target="_blank" rel="noopener noreferrer">미리보기</a>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-panel__foot">저장됨 ({savedAt})</p> : null}
      {tab === 'common' ? (
        <section className="admin-panel">
          <h2 className="admin-panel__title">① 사업 메뉴 · 하위 탭</h2>
          <div className="admin-form-grid">
            {doc.menu.map((row) => (
              <label key={row.key} className="admin-field">
                <span className="admin-field__label">{MENU_LABEL[row.key] ?? row.key}</span>
                <input
                  className="admin-input"
                  type="number"
                  value={row.order}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      menu: doc.menu.map((item) => (item.key === row.key ? { ...item, order: Number(e.target.value) } : item)),
                    })
                  }
                />
              </label>
            ))}
          </div>
          <h2 className="admin-panel__title">② 하단 '다른 사업 보기'</h2>
          <div className="admin-segmented" role="group" aria-label="다른 사업 보기">
            <button type="button" className={`admin-segmented__btn${doc.otherBusiness === 'auto' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, otherBusiness: 'auto' })}>
              자동
            </button>
            <button type="button" className={`admin-segmented__btn${doc.otherBusiness === 'manual' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, otherBusiness: 'manual' })}>
              직접
            </button>
          </div>
          <p className="admin-panel__foot">직접은 국내·해외 카드 메뉴의 카드를 그대로 씁니다.</p>
          <h2 className="admin-panel__title">④ 삭제된 메뉴 · 비공개 게시판</h2>
          <OnOff enabled={doc.grantsPublic} onChange={(grantsPublic) => setDoc({ ...doc, grantsPublic })} />
          <p className="admin-panel__foot">꺼 두면 지원사업 게시판을 공개 메뉴에 넣지 않습니다.</p>
        </section>
      ) : null}

      {tab === 'settings' ? (
        <>
          <section className="admin-panel">
            <h2 className="admin-panel__title">후원 신청 링크</h2>
            <label className="admin-field">
              <span className="admin-field__label">해피나눔 주소</span>
              <input className="admin-input" value={doc.donate.url} onChange={(e) => setDoc({ ...doc, donate: { ...doc.donate, url: e.target.value } })} />
            </label>
          </section>
          <section className="admin-panel">
            <h2 className="admin-panel__title">후원 버튼</h2>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">큰 버튼 문구</span>
                <input className="admin-input" value={doc.donate.labelKo} onChange={(e) => setDoc({ ...doc, donate: { ...doc.donate, labelKo: e.target.value } })} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">상단 메뉴 버튼 문구</span>
                <input className="admin-input" value={doc.donate.menuLabel ?? ''} onChange={(e) => setDoc({ ...doc, donate: { ...doc.donate, menuLabel: e.target.value } })} />
              </label>
            </div>
          </section>
          <section className="admin-panel">
            <h2 className="admin-panel__title">문의 · 영수증 안내</h2>
            <label className="admin-field">
              <span className="admin-field__label">문의 정보</span>
              <input className="admin-input" value={doc.donate.inquiry ?? ''} onChange={(e) => setDoc({ ...doc, donate: { ...doc.donate, inquiry: e.target.value } })} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">기부금 영수증 안내</span>
              <textarea className="admin-input" rows={3} value={doc.donate.receiptNote ?? ''} onChange={(e) => setDoc({ ...doc, donate: { ...doc.donate, receiptNote: e.target.value } })} />
            </label>
          </section>
          <section className="admin-panel">
            <h2 className="admin-panel__title">함께 만든 변화 연동</h2>
            <div className="admin-field">
              <span className="admin-field__label">후원 페이지에 표시</span>
              <OnOff enabled={doc.donate.impactEnabled} onChange={(impactEnabled) => setDoc({ ...doc, donate: { ...doc.donate, impactEnabled } })} />
            </div>
            <p className="admin-panel__foot">임팩트 페이지가 비공개면 이 칸을 켜도 후원 화면에는 나오지 않습니다. 문의 정보와 계좌는 사이트 설정의 기관 정보를 씁니다.</p>
          </section>
        </>
      ) : null}

      {tab === 'intro' ? (
        <div className="admin-segmented" role="tablist" aria-label="사업 소개">
          {INTRO_PAGES.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`admin-segmented__btn${introId === page.id ? ' admin-segmented__btn--active' : ''}`}
              onClick={() => {
                setIntroId(page.id)
                const next = new URLSearchParams(params)
                next.set('tab', 'intro')
                next.set('page', page.id)
                setParams(next, { replace: true })
              }}
            >
              {page.label}
            </button>
          ))}
        </div>
      ) : null}

      {fields.length
        ? fieldGroups(sectionPage, fields).map((group) => (
            <section key={group.title} className="admin-panel">
              <h2 className="admin-panel__title">{group.title}</h2>
              <div className="admin-form-grid">
                {group.rows.map((field) =>
                  field.image ? (
                    <AdminMediaUpload key={field.key} label={field.label} variant="image" value={doc.fields[field.key] || null} onChange={(url) => setField(field.key, url ?? '')} />
                  ) : (
                    <label key={field.key} className={`admin-field${field.rows || field.html ? ' admin-field--full' : ''}`}>
                      <span className="admin-field__label">{field.label}</span>
                      {field.rows || field.html ? (
                        <textarea className="admin-input" rows={field.rows ?? 2} value={doc.fields[field.key] ?? ''} onChange={(e) => setField(field.key, e.target.value)} />
                      ) : (
                        <input className="admin-input" value={doc.fields[field.key] ?? ''} onChange={(e) => setField(field.key, e.target.value)} />
                      )}
                    </label>
                  ),
                )}
              </div>
            </section>
          ))
        : null}
      {fields.length && doc.sections.some((row) => row.page === sectionPage || row.id.startsWith(`${sectionPage}.`)) ? (
        <section className="admin-panel">
          <>
              <h2 className="admin-panel__title">표시 · 순서</h2>
              {doc.sections
                .filter((row) => row.page === sectionPage || row.id.startsWith(`${sectionPage}.`))
                .map((row) => (
                  <div key={row.id} className="admin-form-grid">
                    <label className="admin-field">
                      <span className="admin-field__label">{row.id}</span>
                      <input
                        className="admin-input"
                        type="number"
                        value={row.order}
                        onChange={(e) =>
                          setDoc({
                            ...doc,
                            sections: doc.sections.map((item) => (item.id === row.id ? { ...item, order: Number(e.target.value) } : item)),
                          })
                        }
                      />
                    </label>
                    <div className="admin-field">
                      <span className="admin-field__label">표시</span>
                      <OnOff
                        enabled={row.id === 'guide.impact' ? doc.donate.impactEnabled : row.enabled}
                        onChange={(enabled) => {
                          if (row.id === 'guide.impact') {
                            setDoc({ ...doc, donate: { ...doc.donate, impactEnabled: enabled } })
                            return
                          }
                          setDoc({
                            ...doc,
                            sections: doc.sections.map((item) => (item.id === row.id ? { ...item, enabled } : item)),
                          })
                        }}
                      />
                    </div>
                  </div>
                ))}
            </>
        </section>
      ) : null}

      {tab === 'method' ? <p className="admin-panel__foot">후원 계좌는 사이트 설정의 기관 정보에서 불러옵니다.</p> : null}
    </div>
  )
}
