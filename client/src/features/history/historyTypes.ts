export type HistoryItem = {
  id: string
  month: string
  text: string
}

export type HistoryYear = {
  id: string
  year: string
  items: HistoryItem[]
}

export type HistoryLocaleContent = {
  lead: string
  years: HistoryYear[]
}

export type HistoryDocument = {
  version: 1
  locales: {
    ko: HistoryLocaleContent
    en: HistoryLocaleContent
  }
}

export type HistoryEditLocale = 'ko' | 'en'

export const DEFAULT_HISTORY: HistoryDocument = {
  version: 1,
  locales: {
    ko: {
      lead: '카야는 앞으로도 소외된 이웃들과 함께 걸어 가겠습니다.',
      years: [],
    },
    en: {
      lead: 'Khayah will continue walking alongside marginalized neighbors.',
      years: [],
    },
  },
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** JSON 연혁 → 기존 `.kh-history` 마크업 */
export function historyContentToHtml(content: HistoryLocaleContent): string {
  const yearsHtml = content.years
    .map((y) => {
      const yearId = `kh-hist-${escapeHtml(y.year)}`
      const items = y.items
        .map(
          (item) =>
            `<li class="kh-history__item"><span class="kh-history__month">${escapeHtml(item.month)}</span><span class="kh-history__desc">${escapeHtml(item.text)}</span></li>`,
        )
        .join('')
      return `<section class="kh-history__block" aria-labelledby="${yearId}">
      <div class="kh-history__year-wrap"><h2 id="${yearId}" class="kh-history__year">${escapeHtml(y.year)}</h2></div>
      <div class="kh-history__rail" aria-hidden="true"><span class="kh-history__dot"></span><span class="kh-history__line"></span></div>
      <ul class="kh-history__list">${items}</ul>
    </section>`
    })
    .join('')

  return `<div class="kh-history">
  <p class="kh-history__lead">${escapeHtml(content.lead)}</p>
  <div class="kh-history__timeline">${yearsHtml}</div>
</div>`
}
