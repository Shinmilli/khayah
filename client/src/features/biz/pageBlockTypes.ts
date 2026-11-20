export const PAGE_BLOCK_TYPES = [
  ['intro', '소개(글+사진)'],
  ['facts', '숫자 카드'],
  ['flow', '단계 도식'],
  ['cards', '카드 목록'],
  ['timeline', '연표'],
  ['cases', '현장 사례'],
  ['photos', '사진 3장'],
  ['image', '이미지 한 장'],
] as const

export type PageBlockType = (typeof PAGE_BLOCK_TYPES)[number][0]

export type PageBlockCard = { value: string; unit: string; note: string; source: string }
export type PageBlockStep = { name: string; body: string }
export type PageBlockItem = { title: string; body: string; href: string; year: string }
export type PageBlockPhoto = { src: string; alt: string }

export type PageBlock = {
  id: string
  type: PageBlockType
  enabled: boolean
  order: number
  kicker: string
  title: string
  emphasis: string
  lead: string
  photo: string
  photoAlt: string
  photoSide: 'right' | 'left' | 'none'
  cards: PageBlockCard[]
  steps: PageBlockStep[]
  items: PageBlockItem[]
  photos: PageBlockPhoto[]
}

export type BizPageBlock = PageBlock & { page: 'common' | 'social' | 'academy' | 'cnc' }

export function blockTypeLabel(type: PageBlockType): string {
  return PAGE_BLOCK_TYPES.find((row) => row[0] === type)?.[1] ?? type
}

export function emptyPageBlock(type: PageBlockType, order: number): PageBlock {
  const photos = type === 'photos' ? [blankPhoto(), blankPhoto(), blankPhoto()] : type === 'image' ? [blankPhoto()] : []
  return {
    id: `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    enabled: true,
    order,
    kicker: '',
    title: '',
    emphasis: '',
    lead: '',
    photo: '',
    photoAlt: '',
    photoSide: 'right',
    cards: type === 'facts' ? [{ value: '', unit: '', note: '', source: '' }] : [],
    steps: type === 'flow' ? [{ name: '', body: '' }] : [],
    items: type === 'cards' || type === 'timeline' || type === 'cases' ? [{ title: '', body: '', href: '', year: '' }] : [],
    photos,
  }
}

function blankPhoto(): PageBlockPhoto {
  return { src: '', alt: '' }
}

export function blockHasContent(block: PageBlock): boolean {
  if (block.type === 'intro') return Boolean(block.title.trim() || block.lead.trim() || block.photo.trim() || block.kicker.trim())
  if (block.type === 'facts') return block.cards.some((card) => card.value.trim())
  if (block.type === 'flow') return block.steps.some((step) => step.name.trim())
  if (block.type === 'cards' || block.type === 'cases') return block.items.some((item) => item.title.trim() || item.body.trim())
  if (block.type === 'timeline') return block.items.some((item) => item.year.trim() || item.title.trim())
  if (block.type === 'photos' || block.type === 'image') return block.photos.some((photo) => photo.src.trim())
  return false
}
