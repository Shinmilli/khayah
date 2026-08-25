import type { Request, Response } from 'express'
import { inquiriesService } from '../services/inquiriesService'
import { clientIp, isRateLimited } from '../utils/rateLimit'
import { prismaInitStatus } from '../utils/prisma'

function errStatus(e: unknown): number {
  const s = (e as { status?: number })?.status
  return typeof s === 'number' ? s : 500
}

function errMessage(e: unknown, fallback: string): string {
  return e instanceof Error && e.message ? e.message : fallback
}

function dbUnavailablePayload() {
  return {
    error: 'Database unavailable',
    reason: prismaInitStatus.reason ?? 'unknown',
    hint:
      prismaInitStatus.reason === 'missing_database_url'
        ? 'server/.env에 DATABASE_URL을 설정한 뒤 API 서버를 재시art하세요.'
        : 'DATABASE_URL과 Supabase 연결을 확인한 뒤 API 서버를 재시art하세요.',
  }
}

export async function createInquiry(req: Request, res: Response) {
  const ip = clientIp(req)
  if (isRateLimited(`inq:create:${ip}`, 8, 15 * 60 * 1000)) {
    return res.status(429).json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' })
  }
  try {
    const body = req.body ?? {}
    const created = await inquiriesService.create({
      name: String(body.name ?? ''),
      contact: String(body.contact ?? ''),
      pin: String(body.pin ?? ''),
      type: String(body.type ?? ''),
      subject: String(body.subject ?? ''),
      body: String(body.body ?? ''),
    })
    res.status(201).json(created)
  } catch (e) {
    const status = errStatus(e)
    if (status >= 400 && status < 500) return res.status(status).json({ error: errMessage(e, 'Invalid request') })
    console.error(e)
    res.status(500).json({ error: 'Failed to create inquiry' })
  }
}

export async function lookupInquiries(req: Request, res: Response) {
  const ip = clientIp(req)
  if (isRateLimited(`inq:lookup:${ip}`, 20, 15 * 60 * 1000)) {
    return res.status(429).json({ error: '조회 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.' })
  }
  try {
    const body = req.body ?? {}
    const inquiries = await inquiriesService.lookup({
      name: String(body.name ?? ''),
      contact: String(body.contact ?? ''),
      pin: String(body.pin ?? ''),
    })
    res.json({ inquiries })
  } catch (e) {
    const status = errStatus(e)
    if (status >= 400 && status < 500) return res.status(status).json({ error: errMessage(e, 'Invalid request') })
    console.error(e)
    res.status(500).json({ error: 'Failed to look up inquiries' })
  }
}

export async function adminListInquiries(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1)
    const perPage = Math.min(50, Math.max(1, parseInt(String(req.query.perPage ?? '20'), 10) || 20))
    const name = typeof req.query.name === 'string' ? req.query.name : ''
    const contact = typeof req.query.contact === 'string' ? req.query.contact : ''
    const result = await inquiriesService.listAdmin(page, perPage, { name, contact })
    res.json(result)
  } catch (e) {
    const status = errStatus(e)
    if (status === 503) {
      return res.status(503).json(dbUnavailablePayload())
    }
    if (status >= 400 && status < 500) {
      return res.status(status).json({ error: errMessage(e, 'Invalid request') })
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to list inquiries' })
  }
}

function paramId(req: Request): number {
  const raw = req.params.id
  const s = Array.isArray(raw) ? raw[0] : raw
  return parseInt(String(s ?? ''), 10)
}

export async function adminGetInquiry(req: Request, res: Response) {
  try {
    const id = paramId(req)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    const row = await inquiriesService.getAdmin(id)
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(row)
  } catch (e) {
    const status = errStatus(e)
    if (status >= 400 && status < 500) {
      return res.status(status).json({ error: errMessage(e, 'Invalid request') })
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to get inquiry' })
  }
}

export async function adminUpdateInquiry(req: Request, res: Response) {
  try {
    const id = paramId(req)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    const body = req.body ?? {}
    const updated = await inquiriesService.updateAdmin(id, {
      status: body.status != null ? String(body.status) : undefined,
      reply: body.reply != null ? String(body.reply) : undefined,
      memo: body.memo != null ? String(body.memo) : undefined,
    })
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (e) {
    const status = errStatus(e)
    if (status >= 400 && status < 500) return res.status(status).json({ error: errMessage(e, 'Invalid request') })
    console.error(e)
    res.status(500).json({ error: 'Failed to update inquiry' })
  }
}

export async function adminDeleteInquiry(req: Request, res: Response) {
  try {
    const id = paramId(req)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    const ok = await inquiriesService.removeAdmin(id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) {
    const status = errStatus(e)
    if (status >= 400 && status < 500) {
      return res.status(status).json({ error: errMessage(e, 'Invalid request') })
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to delete inquiry' })
  }
}
