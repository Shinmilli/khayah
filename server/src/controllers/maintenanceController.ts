import type { Request, Response } from 'express'
import { readMaintenanceDocument, writeMaintenanceDocument } from '../services/maintenanceFileService'

export async function getMaintenance(_req: Request, res: Response) {
  try {
    const doc = await readMaintenanceDocument()
    res.setHeader('Cache-Control', 'no-store')
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '점검 상태를 불러오지 못했습니다.' })
  }
}

export async function getAdminMaintenance(_req: Request, res: Response) {
  try {
    const doc = await readMaintenanceDocument()
    res.setHeader('Cache-Control', 'no-store')
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '점검 설정을 불러오지 못했습니다.' })
  }
}

export async function putAdminMaintenance(req: Request, res: Response) {
  try {
    await writeMaintenanceDocument(req.body)
    const doc = await readMaintenanceDocument()
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: '점검 안내 내용이 올바르지 않습니다.' })
      return
    }
    if (status === 503) {
      res.status(503).json({ error: '데이터베이스에 연결할 수 없습니다.' })
      return
    }
    console.error(e)
    res.status(500).json({ error: '점검 설정을 저장하지 못했습니다.' })
  }
}
