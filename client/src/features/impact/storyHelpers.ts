import type { ImpactStory } from './impactPageTypes'

export type StoryChangeStep = {
  key: 'before' | 'intervention' | 'after' | 'evidence' | 'sustainability'
  en: string
  ko: string
  value: string
}

const STEP_META: Array<{ key: StoryChangeStep['key']; en: string; ko: string }> = [
  { key: 'before', en: 'Before', ko: '참여 전' },
  { key: 'intervention', en: 'Intervention', ko: '카야의 개입' },
  { key: 'after', en: 'After', ko: '달라진 점' },
  { key: 'evidence', en: 'Evidence', ko: '근거' },
  { key: 'sustainability', en: 'Sustainability', ko: '이어지는 변화' },
]

/** Strip HTML from rich-text body for list/home teasers. */
export function plainStoryBody(html: string | undefined | null): string {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Home / list teaser: narrative body only (2–3 sentences).
 * Never dump Before·Intervention stage fields into the teaser.
 */
export function storyTeaser(story: ImpactStory, maxChars = 160): string {
  if (story.category === '전문가 이야기') {
    const line = story.expertLine?.trim() || plainStoryBody(story.body)
    return truncate(line, maxChars)
  }
  return truncate(plainStoryBody(story.body), maxChars)
}

export function storyChangeSteps(story: ImpactStory): StoryChangeStep[] {
  return STEP_META.map((meta) => ({
    ...meta,
    value: story[meta.key]?.trim() ?? '',
  })).filter((step) => Boolean(step.value))
}

function truncate(text: string, maxChars: number): string {
  if (!text || text.length <= maxChars) return text
  const slice = text.slice(0, maxChars)
  const cut = slice.lastIndexOf(' ')
  const base = cut > Math.floor(maxChars * 0.6) ? slice.slice(0, cut) : slice
  return `${base.trimEnd()}…`
}
