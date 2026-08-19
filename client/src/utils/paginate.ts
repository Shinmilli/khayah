export function paginate<T>(items: T[], page: number, perPage: number): {
  page: number
  totalPages: number
  items: T[]
} {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage) || 1)
  const safe = Math.min(Math.max(1, page), totalPages)
  const start = (safe - 1) * perPage
  return { page: safe, totalPages, items: items.slice(start, start + perPage) }
}

export function pageWindow(current: number, total: number, radius = 2): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set<number>()
  set.add(1)
  set.add(total)
  for (let i = current - radius; i <= current + radius; i++) {
    if (i >= 1 && i <= total) set.add(i)
  }
  const nums = Array.from(set).sort((a, b) => a - b)
  const out: Array<number | 'gap'> = []
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i]! - nums[i - 1]! > 1) out.push('gap')
    out.push(nums[i]!)
  }
  return out
}
