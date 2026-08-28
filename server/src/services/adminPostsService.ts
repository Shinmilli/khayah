import { prisma } from '../utils/prisma'
import {
  collectPostMedia,
  deleteStoredMediaMany,
  mediaNotIn,
} from '../utils/storedMedia'

/** YYYY-MM-DD → 그날 정오 UTC (KST에서 날짜가 하루 밀리지 않도록) */
function parsePublishedAt(raw?: string): Date | undefined {
  if (!raw || typeof raw !== 'string') return undefined
  const t = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return new Date(`${t}T12:00:00.000Z`)
  const d = new Date(t)
  return Number.isNaN(d.getTime()) ? undefined : d
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 190)
}

type AdminPostMeta = Record<string, string>

type AdminPostRow = {
  id: number
  postTitle: string
  postName: string
  postExcerpt: string
  postContent: string
  postStatus: string
  postType: string
  postDate: Date
  author?: { id: number; displayName: string }
  postMeta: Array<{ metaKey: string | null; metaValue: string | null }>
}

function metaArrayToObject(list: Array<{ metaKey: string | null; metaValue: string | null }>): AdminPostMeta {
  const out: AdminPostMeta = {}
  for (const m of list) {
    if (!m.metaKey) continue
    out[m.metaKey] = m.metaValue ?? ''
  }
  return out
}

async function ensureAuthorId(): Promise<number> {
  // NOTE: no auth yet; pick first user or create one.
  const existing = await prisma!.user.findFirst({ select: { id: true } })
  if (existing) return existing.id
  const created = await prisma!.user.create({
    data: {
      userLogin: 'admin',
      userPass: 'admin',
      userNicename: 'admin',
      userEmail: 'admin@example.org',
      userUrl: '',
      userActivationKey: '',
      userStatus: 0,
      displayName: 'Admin',
    },
    select: { id: true },
  })
  return created.id
}

export const adminPostsService = {
  async list(options: { page: number; perPage: number; kind?: string }) {
    const { page, perPage, kind } = options
    const skip = (page - 1) * perPage

    const kindFilter = kind
      ? {
          postMeta: {
            some: { metaKey: 'khayah_kind', metaValue: kind },
          },
        }
      : {}

    const [posts, total] = await Promise.all([
      prisma!.post.findMany({
        where: { postType: 'post', ...kindFilter },
        orderBy: [{ postDate: 'desc' }, { id: 'desc' }],
        skip,
        take: perPage,
        include: {
          author: { select: { id: true, displayName: true } },
          postMeta: { select: { metaKey: true, metaValue: true } },
        },
      }),
      prisma!.post.count({ where: { postType: 'post', ...kindFilter } }),
    ])

    return {
      posts: (posts as AdminPostRow[]).map((p) => ({
        id: p.id,
        title: p.postTitle,
        excerpt: p.postExcerpt,
        content: p.postContent,
        slug: p.postName,
        status: p.postStatus,
        postType: p.postType,
        publishedAt: p.postDate.toISOString(),
        author: p.author ? { id: p.author.id, displayName: p.author.displayName } : undefined,
        meta: metaArrayToObject(p.postMeta),
      })),
      total,
    }
  },

  async getById(id: number) {
    const p = await prisma!.post.findFirst({
      where: { id, postType: 'post' },
      include: {
        author: { select: { id: true, displayName: true } },
        postMeta: { select: { metaKey: true, metaValue: true } },
      },
    })
    if (!p) return null
    return {
      id: p.id,
      title: p.postTitle,
      excerpt: p.postExcerpt,
      content: p.postContent,
      slug: p.postName,
      status: p.postStatus,
      postType: p.postType,
      publishedAt: p.postDate.toISOString(),
      author: p.author ? { id: p.author.id, displayName: p.author.displayName } : undefined,
      meta: metaArrayToObject(p.postMeta),
    }
  },

  async create(params: {
    kind: string
    title: string
    excerpt: string
    content: string
    status: 'publish' | 'draft'
    meta: AdminPostMeta
    publishedAt?: string
  }) {
    const authorId = await ensureAuthorId()
    const now = new Date()
    const postDate = parsePublishedAt(params.publishedAt) ?? now
    const postName = slugify(`${params.kind}-${params.title}`)

    const created = await prisma!.post.create({
      data: {
        postAuthorId: authorId,
        postDate,
        postDateGmt: postDate,
        postModified: now,
        postModifiedGmt: now,
        postTitle: params.title,
        postExcerpt: params.excerpt,
        postContent: params.content,
        postStatus: params.status,
        postName,
        postType: 'post',
        guid: '',
        postMimeType: '',
        commentStatus: 'closed',
        pingStatus: 'closed',
        postPassword: '',
        postParent: 0,
        menuOrder: 0,
      },
      select: { id: true },
    })

    const metaEntries = {
      khayah_kind: params.kind,
      ...params.meta,
    }

    await prisma!.postMeta.createMany({
      data: Object.entries(metaEntries).map(([k, v]) => ({
        postId: created.id,
        metaKey: k,
        metaValue: String(v ?? ''),
      })),
    })

    return this.getById(created.id)
  },

  async update(
    id: number,
    params: {
      title?: string
      excerpt?: string
      content?: string
      status?: 'publish' | 'draft'
      meta?: AdminPostMeta
      publishedAt?: string
    },
  ) {
    const existing = await prisma!.post.findFirst({
      where: { id, postType: 'post' },
      include: { postMeta: { select: { metaKey: true, metaValue: true } } },
    })
    if (!existing) return null

    const prevMeta = metaArrayToObject(existing.postMeta)
    const now = new Date()
    const postDate = parsePublishedAt(params.publishedAt)
    await prisma!.post.update({
      where: { id },
      data: {
        postTitle: params.title,
        postExcerpt: params.excerpt,
        postContent: params.content,
        postStatus: params.status,
        postModified: now,
        postModifiedGmt: now,
        ...(postDate ? { postDate, postDateGmt: postDate } : {}),
      },
    })

    if (params.meta) {
      const keys = Object.keys(params.meta)
      if (keys.length) {
        await prisma!.postMeta.deleteMany({ where: { postId: id, metaKey: { in: keys } } })
        await prisma!.postMeta.createMany({
          data: keys.map((k) => ({ postId: id, metaKey: k, metaValue: String(params.meta?.[k] ?? '') })),
        })
      }
    }

    const nextMeta = params.meta ? { ...prevMeta, ...params.meta } : prevMeta
    const nextContent = params.content != null ? params.content : existing.postContent
    const removed = mediaNotIn(
      collectPostMedia(prevMeta, existing.postContent),
      collectPostMedia(nextMeta, nextContent),
    )
    await deleteStoredMediaMany(removed)

    return this.getById(id)
  },

  async remove(id: number): Promise<boolean> {
    const existing = await prisma!.post.findFirst({
      where: { id, postType: 'post' },
      include: { postMeta: { select: { metaKey: true, metaValue: true } } },
    })
    if (!existing) return false
    await deleteStoredMediaMany(
      collectPostMedia(metaArrayToObject(existing.postMeta), existing.postContent),
    )
    // delete dependents first
    await prisma!.commentMeta.deleteMany({ where: { comment: { postId: id } } })
    await prisma!.comment.deleteMany({ where: { postId: id } })
    await prisma!.termRelationship.deleteMany({ where: { objectId: id } })
    await prisma!.postMeta.deleteMany({ where: { postId: id } })
    await prisma!.post.delete({ where: { id } })
    return true
  },
}

