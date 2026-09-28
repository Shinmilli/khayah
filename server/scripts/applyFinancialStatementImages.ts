import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadBufferToCloudinary } from '../src/utils/cloudinary'
import {
  readFinancialReportsDocument,
  writeFinancialReportsDocument,
} from '../src/services/financialReportsFileService'
import { prisma } from '../src/utils/prisma'

const ASSETS = '/home/sumin/.cursor/projects/home-sumin-khayah/assets'

/**
 * 왼쪽(당해) 연도 기준.
 * ed2933e6 표는 칸 제목이 2020으로 읽히지만,
 * 사업수익 229,973,963 + 2020 자산총계 14,622,127 = 2021 수입총액 244,596,090 이라 2021 운영성과표다.
 */
const FILES: Array<{ file: string; year: number; kind: 'balance' | 'operations' }> = [
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-351572df-e322-4392-b0ca-adf068371ca3.png', year: 2016, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-5d112c28-2dfe-45da-856a-b1becb0990f6.png', year: 2016, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-7194ded9-7745-412d-b713-0f71fed43a94.png', year: 2017, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-34429039-e136-41a0-9aa9-dae53c9c173d.png', year: 2017, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-8fc1b5ae-abd1-4abc-8ac0-890042dce3c7.png', year: 2018, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-8db88298-2cf3-42b7-b302-517606cf86a8.png', year: 2018, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-aba04e76-9b33-4e93-830c-26b49eb5e6a3.png', year: 2019, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-682e9607-6e4f-4917-9f60-9741255ab06f.png', year: 2019, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-f7c1ac24-a011-43ac-b4dd-795e2885d144.png', year: 2020, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-42c50530-c4a7-4e8e-bf41-bad454fdeaa6.png', year: 2020, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-61760c83-1a47-42bf-9777-6ace0728e53a.png', year: 2021, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-ed2933e6-ded6-432c-88f6-703877bc57ea.png', year: 2021, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-907013cc-4c28-492b-a736-d800b03f2760.png', year: 2022, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-7a29c0b7-5dca-4f66-b4f1-37061966ac0a.png', year: 2022, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-35770c92-61d3-435e-a981-ad933f02db68.png', year: 2023, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-da6158dd-88dd-4a9c-b3ca-46fc0f50cd37.png', year: 2023, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-e11a06c6-4afe-4f7a-87ce-cc3b5675e4f1.png', year: 2024, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-4df45fab-bd21-442f-9d80-17d10c2a9f46.png', year: 2024, kind: 'operations' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-5e487947-3281-46f4-aea2-4b62af3bc6dc.png', year: 2025, kind: 'balance' },
  { file: 'c__Users_LG_AppData_Roaming_Cursor_User_workspaceStorage_88095ac74bb532859a7662a9ca57a6e8_images_image-c6d9e340-f0b5-4163-9c4a-bf011ac9a459.png', year: 2025, kind: 'operations' },
]

function toCloudinaryWebpUrl(url: string): string {
  const parsed = new URL(url)
  const marker = '/image/upload/'
  const at = parsed.pathname.indexOf(marker)
  if (at < 0) return url
  const prefix = parsed.pathname.slice(0, at + marker.length)
  const rest = parsed.pathname.slice(at + marker.length)
  parsed.pathname = `${prefix}f_webp,q_auto/${rest.replace(/^\/+/, '')}`
  return parsed.toString()
}

function isWebp(buf: Buffer): boolean {
  return buf.length >= 12 && buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP'
}

async function main() {
  const doc = await readFinancialReportsDocument()
  const byYear = new Map(doc.reports.map((report) => [report.year, report]))

  for (const item of FILES) {
    const report = byYear.get(item.year)
    if (!report) throw new Error(`재정보고 ${item.year}년 데이터가 없습니다.`)
    const filePath = path.join(ASSETS, item.file)
    const buffer = fs.readFileSync(filePath)
    const uploaded = await uploadBufferToCloudinary({
      buffer,
      originalName: `financial-${item.year}-${item.kind}.png`,
      mimeType: 'image/png',
      kind: 'image',
    })
    const webpUrl = toCloudinaryWebpUrl(uploaded.url)
    const res = await fetch(webpUrl)
    const body = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') ?? ''
    if (!res.ok || !isWebp(body)) {
      throw new Error(
        `webp 변환 실패 ${item.year} ${item.kind}: ${res.status} ${contentType} ${webpUrl}`,
      )
    }
    if (item.kind === 'balance') report.balanceSheetImageUrl = uploaded.url
    else report.operationsStatementImageUrl = uploaded.url
    console.log(`${item.year} ${item.kind} webp ok ${contentType} ${body.length}b`)
  }

  const reports = [...byYear.values()].sort((a, b) => b.year - a.year)
  await writeFinancialReportsDocument({ ...doc, reports })
  console.log('saved statement images for', reports.map((r) => r.year).join(', '))
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma?.$disconnect?.()
  })
