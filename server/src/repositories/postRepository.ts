import { prisma } from '../utils/prisma'

interface FindPublishedOptions {
  page: number
  perPage: number
}

export const postRepository = {
  async findPublished(options: FindPublishedOptions) {
    const { page, perPage } = options
    const skip = (page - 1) * perPage

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          postStatus: 'publish',
          postType: 'post',
        },
        orderBy: { postDate: 'desc' },
        skip,
        take: perPage,
        include: {
          author: {
            select: { id: true, displayName: true },
          },
        },
      }),
      prisma.post.count({
        where: {
          postStatus: 'publish',
          postType: 'post',
        },
      }),
    ])

    return { posts, total }
  },

  async findPublishedPages(options: { page?: number; perPage?: number }) {
    const page = Math.max(1, options.page ?? 1)
    const perPage = Math.min(100, Math.max(1, options.perPage ?? 50))
    const skip = (page - 1) * perPage

    const [pages, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          postStatus: 'publish',
          postType: 'page',
        },
        orderBy: [{ postParent: 'asc' }, { menuOrder: 'asc' }, { postDate: 'desc' }],
        skip,
        take: perPage,
        select: {
          id: true,
          postTitle: true,
          postName: true,
          postExcerpt: true,
          postContent: true,
          postParent: true,
          menuOrder: true,
        },
      }),
      prisma.post.count({
        where: {
          postStatus: 'publish',
          postType: 'page',
        },
      }),
    ])
    return { pages, total }
  },

  async findPostBySlug(slug: string) {
    const decoded = decodeURIComponent(slug)
    const post = await prisma.post.findFirst({
      where: {
        postStatus: 'publish',
        postType: 'post',
        postName: decoded,
      },
      include: {
        author: { select: { id: true, displayName: true } },
      },
    })
    return post
  },

  async findPageBySlug(slug: string) {
    const decoded = decodeURIComponent(slug)
    const page = await prisma.post.findFirst({
      where: {
        postStatus: 'publish',
        postType: 'page',
        postName: decoded,
      },
      select: {
        id: true,
        postTitle: true,
        postName: true,
        postExcerpt: true,
        postContent: true,
        postParent: true,
      },
    })
    return page
  },
}
