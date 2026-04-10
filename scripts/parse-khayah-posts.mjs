import fs from 'fs'

const sqlPath =
  process.argv[2] ||
  new URL(
    '../20170227_khayah_506981f02a73bdfe3261_20260208103117_archive/dup-installer/dup-database__506981f-08103117.sql',
    import.meta.url,
  ).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')

function splitSqlValues(inner) {
  const vals = []
  let i = 0
  while (i < inner.length) {
    while (i < inner.length && /[\s,]/.test(inner[i])) i++
    if (i >= inner.length) break
    if (inner[i] === '"') {
      i++
      let s = ''
      while (i < inner.length) {
        if (inner[i] === '\\' && i + 1 < inner.length) {
          s += inner[i + 1]
          i += 2
          continue
        }
        if (inner[i] === '"') {
          i++
          break
        }
        s += inner[i++]
      }
      vals.push(s)
    } else {
      i++
    }
  }
  return vals
}

const text = fs.readFileSync(sqlPath, 'utf8')
const lines = text.split('\n')
const rows = []
let debugFirst = 0

for (let line of lines) {
  line = line.replace(/\r$/, '')
  if (!line.startsWith('INSERT INTO `khayah_posts`')) continue
  const vi = line.indexOf('VALUES(')
  if (vi === -1) continue
  if (!line.endsWith(');')) continue
  const inner = line.slice(vi + 7, -2)
  const v = splitSqlValues(inner)
  if (debugFirst < 3) {
    console.error('DEBUG fields', v.length, 'status?', v[7], 'type?', v[18])
    debugFirst++
  }
  if (v.length < 19) continue

  const post_status = v[7]
  const post_type = v[18]
  if (post_status !== 'publish') continue
  if (post_type !== 'post' && post_type !== 'page') continue

  rows.push({
    ID: v[0],
    post_date: v[2],
    post_title: v[5],
    post_name: v[11],
    post_type,
    post_content: v[4],
  })
}

rows.sort((a, b) => String(b.post_date).localeCompare(String(a.post_date)))

console.log(JSON.stringify({ total: rows.length, top5: rows.slice(0, 5) }, null, 2))

const metaLines = lines.filter((l) => l.startsWith('INSERT INTO `khayah_postmeta`'))
const metaByPost = new Map()

for (const line of metaLines) {
  const vi = line.indexOf('VALUES(')
  if (vi === -1 || !line.endsWith(');')) continue
  const inner = line.slice(vi + 7, -2)
  const v = splitSqlValues(inner)
  if (v.length < 4) continue
  const postId = v[1]
  const metaKey = v[2]
  const metaValue = v[3]
  if (!metaByPost.has(postId)) metaByPost.set(postId, [])
  metaByPost.get(postId).push({ meta_key: metaKey, meta_value_preview: metaValue.slice(0, 200) })
}

console.log('\n--- postmeta for top 5 post IDs (views / thumbnail / attachment) ---\n')
for (const r of rows.slice(0, 5)) {
  const list = metaByPost.get(r.ID) || []
  const interesting = list.filter(
    (m) =>
      /view|count|thumbnail|attach|image|featured|wp_attached/i.test(m.meta_key) ||
      m.meta_key === '_thumbnail_id',
  )
  console.log(`ID ${r.ID} (${r.post_title.slice(0, 50)}...)`)
  if (interesting.length === 0) {
    console.log('  (no obvious view/thumbnail keys in first 200 chars of matching keys)')
    const keys = [...new Set(list.map((x) => x.meta_key))].slice(0, 15)
    console.log('  sample meta_keys:', keys.join(', '))
  } else {
    interesting.forEach((m) => console.log(`  ${m.meta_key}: ${m.meta_value_preview}`))
  }
  console.log('')
}
