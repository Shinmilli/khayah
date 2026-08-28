/** Detect obvious image payloads so they are not stored under documents/ as raw. */
export function looksLikeImageBuffer(buf: Buffer, mimeType?: string, originalName?: string): boolean {
  const mime = (mimeType ?? '').toLowerCase()
  if (mime.startsWith('image/')) return true

  const ext = (originalName ?? '').toLowerCase()
  if (/\.(jpe?g|png|gif|webp|bmp|heic|heif|tiff?)$/i.test(ext)) return true

  if (buf.length >= 3) {
    // JPEG
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true
    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true
    // GIF
    if (buf.subarray(0, 3).toString('ascii') === 'GIF') return true
    // WEBP (RIFF....WEBP)
    if (
      buf.length >= 12 &&
      buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buf.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
      return true
    }
  }
  return false
}

export function looksLikePdfBuffer(buf: Buffer): boolean {
  if (buf.length < 5) return false
  // PDF may have a small BOM/whitespace prefix
  const head = buf.subarray(0, Math.min(1024, buf.length)).toString('latin1')
  return head.includes('%PDF')
}
