import { prisma } from '../utils/prisma'

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
        orderBy: { postDate: 'desc' },
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
      posts: posts.map((p) => ({
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
  }) {
    const authorId = await ensureAuthorId()
    const now = new Date()
    const postName = slugify(`${params.kind}-${params.title}`)

    const created = await prisma!.post.create({
      data: {
        postAuthorId: authorId,
        postDate: now,
        postDateGmt: now,
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
    params: { title?: string; excerpt?: string; content?: string; status?: 'publish' | 'draft'; meta?: AdminPostMeta },
  ) {
    const existing = await prisma!.post.findFirst({
      where: { id, postType: 'post' },
      select: { id: true },
    })
    if (!existing) return null

    const now = new Date()
    await prisma!.post.update({
      where: { id },
      data: {
        postTitle: params.title,
        postExcerpt: params.excerpt,
        postContent: params.content,
        postStatus: params.status,
        postModified: now,
        postModifiedGmt: now,
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

    return this.getById(id)
  },

  async remove(id: number): Promise<boolean> {
    const existing = await prisma!.post.findFirst({ where: { id, postType: 'post' }, select: { id: true } })
    if (!existing) return false
    // delete dependents first
    await prisma!.commentMeta.deleteMany({ where: { comment: { postId: id } } })
    await prisma!.comment.deleteMany({ where: { postId: id } })
    await prisma!.termRelationship.deleteMany({ where: { objectId: id } })
    await prisma!.postMeta.deleteMany({ where: { postId: id } })
    await prisma!.post.delete({ where: { id } })
    return true
  },
}

