export const KAYA_SECTION_IDS = ['intro', 'identity', 'values', 'ci'] as const

export type KayaSectionId = (typeof KAYA_SECTION_IDS)[number]

export function kayaSectionOrder(raw: string | undefined): KayaSectionId[] {
  return orderedIds(KAYA_SECTION_IDS, raw)
}

export const GREET_MOVING_IDS = ['quote', 'body'] as const
export type GreetMovingId = (typeof GREET_MOVING_IDS)[number]

export function greetSectionOrder(raw: string | undefined): GreetMovingId[] {
  return orderedIds(GREET_MOVING_IDS, raw)
}

export const TRANS_MOVING_IDS = ['disclose', 'principles', 'compliance', 'reports'] as const
export type TransMovingId = (typeof TRANS_MOVING_IDS)[number]

export function transSectionOrder(raw: string | undefined): TransMovingId[] {
  return orderedIds(TRANS_MOVING_IDS, raw)
}

function orderedIds<T extends string>(ids: readonly T[], raw: string | undefined): T[] {
  const picked = (raw ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter((id): id is T => (ids as readonly string[]).includes(id))
  return [...picked, ...ids.filter((id) => !picked.includes(id))]
}
