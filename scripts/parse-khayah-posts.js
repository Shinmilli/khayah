const fs = require('fs')
const path = require('path')

const sqlPath = path.join(
  __dirname,
  '../20170227_khayah_506981f02a73bdfe3261_20260208103117_archive/dup-installer/dup-database__506981f-08103117.sql',
)

function parseValues(inner) {
  const out = []
  let i = 0
  while (i < inner.length) {
    if (inner[i] !== '"') throw new Error('expected " at ' + i)
    i++
    let buf = ''
    while (i < inner.length) {
      if (inner[i] === '\\') {
        buf += inner[i + 1] || ''
        i += 2
        continue
      }
      if (inner[i] === '"') {
        i++
        break
      }
      buf += inner[i++]
    }
    out.push(buf)
    while (i < inner.length && /[\s,]/.test(inner[i])) i++
  }
  return out
}

const s = fs.readFileSync(sqlPath, 'utf8')
const rows = []
const re = /^INSERT INTO `khayah_posts` VALUES\((.*)\);$/gm
let m
while ((m = re.exec(s)) !== null) {
  try {
    const v = parseValues(m[1])
    if (v.length < 23) continue
    const post_status = v[7]
    const post_type = v[20]
    if (post_status !== 'publish') continue
    if (post_type !== 'post' && post_type !== 'page') continue
    rows.push({
      ID: v[0],
      post_date: v[2],
      post_content: v[4],
      post_title: v[5],
      post_name: v[11],
      post_type,
    })
  } catch {
    /* malformed line */
  }
}

rows.sort((a, b) => (a.post_date < b.post_date ? 1 : a.post_date > b.post_date ? -1 : 0))

const posts = rows.filter((r) => r.post_type === 'post')
const pages = rows.filter((r) => r.post_type === 'page')

console.log('publish + (post|page) rows:', rows.length)
console.log('  post:', posts.length, '| page:', pages.length)
console.log('\n=== Top 5 posts by post_date ===\n')
posts.slice(0, 5).forEach((r, i) => {
  console.log(`#${i + 1} ID=${r.ID} date=${r.post_date}`)
  console.log('  slug:', r.post_name)
  console.log('  title:', r.post_title.slice(0, 120))
  const flat = r.post_content.replace(/\s+/g, ' ').trim()
  console.log('  content:', flat.slice(0, 350) + (flat.length > 350 ? '…' : ''))
  console.log('')
})

// postmeta for first post ID
const topId = posts[0]?.ID
if (topId) {
  console.log(`=== khayah_postmeta rows for post_id=${topId} (sample keys) ===\n`)
  const metaRe = new RegExp(
    '^INSERT INTO `khayah_postmeta` VALUES\\("\\\\d+", "' + topId + '", "([^"]+)", ',
    'gm',
  )
  let k
  const keys = new Set()
  while ((k = metaRe.exec(s)) !== null) keys.add(k[1])
  ;[...keys].slice(0, 30).forEach((key) => console.log(' ', key))
  if (keys.size > 30) console.log('  ... +' + (keys.size - 30) + ' more keys')
}

// poststats visits count for that post
if (topId) {
  let visitCount = 0
  const vr = /^INSERT INTO `khayah_poststats_visits` VALUES\("(\d+)", "(\d+)",/gm
  while ((m = vr.exec(s)) !== null) {
    if (m[2] === topId) visitCount++
  }
  console.log(`\nkhayah_poststats_visits rows with post_id=${topId}:`, visitCount)
}

// _thumbnail_id search in postmeta for a notice-like post
console.log('\n=== Posts with _thumbnail_id in postmeta (first 5 post IDs) ===\n')
const thumbRe = /^INSERT INTO `khayah_postmeta` VALUES\("\d+", "(\d+)", "_thumbnail_id", "(\d+)"\);$/gm
const thumbs = []
while ((m = thumbRe.exec(s)) !== null) thumbs.push({ post_id: m[1], attachment_id: m[2] })
console.log('Total _thumbnail_id meta rows:', thumbs.length)
thumbs.slice(0, 5).forEach((t) => console.log('  post', t.post_id, '→ thumbnail attachment', t.attachment_id))
