import { Request, Response } from 'express'
import { getLatestYoutubeVideo } from '../services/youtubeLatestService'

export async function getYoutubeLatest(_req: Request, res: Response) {
  try {
    const latest = await getLatestYoutubeVideo()
    res.json(latest)
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Failed to load latest YouTube video' })
  }
}
