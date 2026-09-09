import { Request, Response } from 'express'
import { getSocialLatest } from '../services/socialLatestService'

export async function getSocialLatestHandler(_req: Request, res: Response) {
  try {
    const latest = await getSocialLatest()
    res.json(latest)
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Failed to load social previews' })
  }
}
