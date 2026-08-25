type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** 단순 인메모리 rate limit (프로세스 단위). 초과 시 true */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const cur = buckets.get(key)
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  cur.count += 1
  if (cur.count > limit) return true
  return false
}

export function clientIp(req: { ip?: string; headers: Record<string, unknown> }): string {
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.trim()) return xf.split(',')[0]!.trim()
  return req.ip || 'unknown'
}
