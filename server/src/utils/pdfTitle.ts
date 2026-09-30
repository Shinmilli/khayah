/** PDF 문서 제목(/Title). 브라우저 탭은 파일명 대신 이 값을 보여 준다. */

function pdfTitleHex(title: string): string {
  let hex = 'FEFF'
  for (const ch of title) {
    const code = ch.codePointAt(0) ?? 0
    if (code > 0xffff) {
      const u = code - 0x10000
      const hi = 0xd800 + (u >> 10)
      const lo = 0xdc00 + (u & 0x3ff)
      hex += hi.toString(16).padStart(4, '0')
      hex += lo.toString(16).padStart(4, '0')
    } else {
      hex += code.toString(16).padStart(4, '0')
    }
  }
  return hex.toUpperCase()
}

function readTrailer(text: string): { rootNum: string; rootGen: string; size: number } | null {
  let best: { rootNum: string; rootGen: string; size: number } | null = null
  let from = 0
  while (from < text.length) {
    const i = text.indexOf('trailer', from)
    if (i < 0) break
    const slice = text.slice(i, i + 600)
    const root = slice.match(/\/Root\s+(\d+)\s+(\d+)\s+R/)
    const size = slice.match(/\/Size\s+(\d+)/)
    if (root && size) {
      const n = Number(size[1])
      if (Number.isFinite(n) && n > 0) {
        best = { rootNum: root[1], rootGen: root[2], size: n }
      }
    }
    from = i + 7
  }
  return best
}

function lastStartxref(text: string): number | null {
  const matches = [...text.matchAll(/startxref\s+(\d+)/g)]
  if (matches.length === 0) return null
  const n = Number(matches[matches.length - 1]?.[1])
  return Number.isFinite(n) ? n : null
}

/**
 * 원본 바이트는 그대로 두고 끝에 제목만 덧붙인다.
 * 파싱에 실패하면 원본을 그대로 돌려준다.
 */
export function appendPdfTitle(pdf: Buffer, title: string): Buffer {
  const clean = title.replace(/[\u0000-\u001f]/g, ' ').trim()
  if (!clean) return pdf
  if (pdf.length < 16 || pdf.subarray(0, 5).toString('latin1') !== '%PDF-') return pdf

  const head = pdf.subarray(0, Math.min(pdf.length, 16384)).toString('latin1')
  const tail = pdf.subarray(Math.max(0, pdf.length - 262144)).toString('latin1')
  const trailer = readTrailer(`${head}\n${tail}`)
  const prev = lastStartxref(tail)
  if (!trailer || prev === null) return pdf

  const objNum = trailer.size
  const hex = pdfTitleHex(clean.slice(0, 180))
  const prefix = pdf[pdf.length - 1] === 0x0a ? Buffer.alloc(0) : Buffer.from('\n')
  const info = Buffer.from(`${objNum} 0 obj\n<< /Title <${hex}> >>\nendobj\n`, 'ascii')
  const infoOffset = pdf.length + prefix.length
  const entry = `${String(infoOffset).padStart(10, '0')} 00000 n \n`
  if (Buffer.byteLength(entry) !== 20) return pdf
  const xref = Buffer.from(
    `xref\n${objNum} 1\n${entry}` +
      `trailer\n<< /Size ${objNum + 1} /Root ${trailer.rootNum} ${trailer.rootGen} R /Info ${objNum} 0 R /Prev ${prev} >>\n` +
      `startxref\n${infoOffset + info.length}\n%%EOF\n`,
    'ascii',
  )
  return Buffer.concat([pdf, prefix, info, xref])
}
