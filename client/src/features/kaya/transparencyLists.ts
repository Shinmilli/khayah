export type DisclosureKind = 'publicInterest' | 'donation' | 'link' | 'files'

export type DisclosureFile = { year: number; url: string }

export type DisclosureItem = {
  id: string
  label: string
  kind: DisclosureKind
  href: string
  files: DisclosureFile[]
}

export type TextPair = { title: string; body: string }
export type ComplianceRow = { dt: string; dd: string }

const ACRC_URL = 'https://www.acrc.go.kr/'

const DEFAULT_ACTIONS: DisclosureItem[] = [
  { id: 'publicInterest', label: '공익법인 결산서류 등 공시', kind: 'publicInterest', href: '', files: [] },
  { id: 'donation', label: '기부금 모금액 및 활용실적 공시', kind: 'donation', href: '', files: [] },
  { id: 'acrc', label: '공익위반사항 제보', kind: 'link', href: ACRC_URL, files: [] },
]

const DEFAULT_PRINCIPLES: TextPair[] = [
  {
    title: '내부 감사',
    body: '예산과 결산은 이사회의 심의와 의결을 거치며, 감사가 법인의 재무와 업무 집행을 정기적으로 점검합니다.',
  },
  {
    title: '외부 감사',
    body: '외부 회계 전문가의 회계감사를 통해 재무 처리의 정확성과 적정성을 검증합니다.',
  },
  {
    title: '재무 공개',
    body: '국세청 공익법인 결산서류 공시와 기부금 모금액 및 활용실적 공개를 매년 이행하고, 연도별 재무보고를 홈페이지에 게시합니다.',
  },
]

const DEFAULT_COMPLIANCE: ComplianceRow[] = [
  { dt: '홈페이지 공개', dd: '기관 소개, 이사회·전문위원 명단, 사업 소개, 연도별 재무보고' },
  { dt: '국세청 공시', dd: '공익법인 결산서류 등 공시 (매년)' },
  { dt: '기부금 공개', dd: '기부금 모금액 및 활용실적 공개 (매년)' },
  { dt: '기부금영수증', dd: '연말정산 간소화 자료 제출 및 후원자 요청 시 발급' },
  { dt: '후원자 소통', dd: '전화·이메일·온라인 문의 창구 운영' },
  { dt: '공익신고', dd: '국민권익위원회 신고 창구 연결' },
]

function field(fields: Record<string, string>, key: string, fallback: string): string {
  const value = fields[key]
  return typeof value === 'string' && value.trim() ? value : fallback
}

function parseArray(raw: string): unknown[] | null {
  try {
    const data = JSON.parse(raw) as unknown
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

function asKind(value: unknown): DisclosureKind | null {
  if (value === 'publicInterest' || value === 'donation' || value === 'link' || value === 'files') return value
  return null
}

function asFiles(value: unknown): DisclosureFile[] {
  if (!Array.isArray(value)) return []
  const files: DisclosureFile[] = []
  for (const row of value) {
    if (!row || typeof row !== 'object') continue
    const year = (row as { year?: unknown }).year
    const url = (row as { url?: unknown }).url
    if (typeof year !== 'number' || !Number.isFinite(year)) continue
    if (typeof url !== 'string' || !url.trim()) continue
    files.push({ year: Math.round(year), url: url.trim() })
    if (files.length >= 20) break
  }
  return files
}

export function disclosureItems(fields: Record<string, string>): DisclosureItem[] {
  const raw = fields['trans.actionsJson']?.trim()
  if (raw) {
    const rows = parseArray(raw)
    if (rows) {
      return rows
        .slice(0, 8)
        .flatMap((row): DisclosureItem[] => {
          if (!row || typeof row !== 'object') return []
          const kind = asKind((row as { kind?: unknown }).kind)
          if (!kind) return []
          const id = typeof (row as { id?: unknown }).id === 'string' ? (row as { id: string }).id : ''
          return [
            {
              id: id || `action-${kind}`,
              label: typeof (row as { label?: unknown }).label === 'string' ? (row as { label: string }).label : '',
              kind,
              href: typeof (row as { href?: unknown }).href === 'string' ? (row as { href: string }).href : '',
              files: asFiles((row as { files?: unknown }).files),
            },
          ]
        })
    }
  }
  return DEFAULT_ACTIONS.map((item, index) => ({
    ...item,
    label: field(fields, `trans.action.${index}`, item.label),
  }))
}

export function pdfKindOf(item: DisclosureItem): 'publicInterest' | 'donation' | 'files' {
  if (item.kind === 'publicInterest' || item.kind === 'donation' || item.kind === 'files') return item.kind
  if (item.id === 'publicInterest' || item.id === 'donation') return item.id
  return 'files'
}

export function disclosurePatch(items: DisclosureItem[]): Record<string, string> {
  const patch: Record<string, string> = {
    'trans.actionsJson': JSON.stringify(
      items.slice(0, 8).map((item) => ({
        id: item.id,
        label: item.label,
        kind: item.kind,
        href: item.kind === 'link' ? item.href : '',
        files: item.kind === 'files' ? item.files : [],
      })),
    ),
  }
  for (let index = 0; index < 3; index += 1) {
    patch[`trans.action.${index}`] = items[index]?.label ?? ''
  }
  return patch
}

export function principleItems(fields: Record<string, string>): TextPair[] {
  const raw = fields['trans.principlesJson']?.trim()
  if (raw) {
    const rows = parseArray(raw)
    if (rows) {
      return rows.slice(0, 8).flatMap((row): TextPair[] => {
        if (!row || typeof row !== 'object') return []
        return [
          {
            title: typeof (row as { title?: unknown }).title === 'string' ? (row as { title: string }).title : '',
            body: typeof (row as { body?: unknown }).body === 'string' ? (row as { body: string }).body : '',
          },
        ]
      })
    }
  }
  return DEFAULT_PRINCIPLES.map((item, index) => ({
    title: field(fields, `trans.principle.${index}.title`, item.title),
    body: field(fields, `trans.principle.${index}.body`, item.body),
  }))
}

export function principlePatch(items: TextPair[]): Record<string, string> {
  const patch: Record<string, string> = {
    'trans.principlesJson': JSON.stringify(items.slice(0, 8)),
  }
  for (let index = 0; index < 3; index += 1) {
    patch[`trans.principle.${index}.title`] = items[index]?.title ?? ''
    patch[`trans.principle.${index}.body`] = items[index]?.body ?? ''
  }
  return patch
}

export function complianceItems(fields: Record<string, string>): ComplianceRow[] {
  const raw = fields['trans.complianceJson']?.trim()
  if (raw) {
    const rows = parseArray(raw)
    if (rows) {
      return rows.slice(0, 12).flatMap((row): ComplianceRow[] => {
        if (!row || typeof row !== 'object') return []
        return [
          {
            dt: typeof (row as { dt?: unknown }).dt === 'string' ? (row as { dt: string }).dt : '',
            dd: typeof (row as { dd?: unknown }).dd === 'string' ? (row as { dd: string }).dd : '',
          },
        ]
      })
    }
  }
  return DEFAULT_COMPLIANCE.map((item, index) => ({
    dt: field(fields, `trans.compliance.${index}.dt`, item.dt),
    dd: field(fields, `trans.compliance.${index}.dd`, item.dd),
  }))
}

export function compliancePatch(items: ComplianceRow[]): Record<string, string> {
  const patch: Record<string, string> = {
    'trans.complianceJson': JSON.stringify(items.slice(0, 12)),
  }
  for (let index = 0; index < 6; index += 1) {
    patch[`trans.compliance.${index}.dt`] = items[index]?.dt ?? ''
    patch[`trans.compliance.${index}.dd`] = items[index]?.dd ?? ''
  }
  return patch
}

export function newDisclosureItem(): DisclosureItem {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())
  return { id: `action-${id}`, label: '', kind: 'files', href: '', files: [] }
}
