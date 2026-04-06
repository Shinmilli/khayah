import { prisma } from '../utils/prisma'

interface FindPublishedOptions {
  page: number
  perPage: number
}

type RepositoryAuthor = { id: number; displayName: string }

type RepositoryPostRow = {
  id: number
  postTitle: string
  postName: string
  postExcerpt: string
  postContent: string
  postParent: number
  menuOrder: number
  postDate: Date
  postStatus: 'publish'
  postType: 'page' | 'post'
  author?: RepositoryAuthor
}

const mockPosts: RepositoryPostRow[] = [
  {
    id: 1,
    postTitle: 'Home',
    postName: 'home',
    postExcerpt: 'Welcome page',
    postContent: '<h1>Home</h1><p>This is mock content served without a DB.</p>',
    postParent: 0,
    menuOrder: 0,
    postDate: new Date('2026-01-01T00:00:00.000Z'),
    postStatus: 'publish',
    postType: 'page',
  },
  {
    id: 2,
    postTitle: 'About',
    postName: 'about',
    postExcerpt: 'About this project',
    postContent: '<h1>About</h1><p>Replace this with DB-backed content later.</p>',
    postParent: 0,
    menuOrder: 1,
    postDate: new Date('2026-01-02T00:00:00.000Z'),
    postStatus: 'publish',
    postType: 'page',
  },
]

export const postRepository = {
  async findPublished(options: FindPublishedOptions) {
    if (!prisma) {
      const { page, perPage } = options
      const skip = (page - 1) * perPage
      const publishedPosts = mockPosts
        .filter((p) => p.postStatus === 'publish' && p.postType === 'post')
        .sort((a, b) => b.postDate.getTime() - a.postDate.getTime())
      const postsPage = publishedPosts.slice(skip, skip + perPage)
      return { posts: postsPage, total: publishedPosts.length }
    }

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

    if (!prisma) {
      const publishedPages = mockPosts
        .filter((p) => p.postStatus === 'publish' && p.postType === 'page')
        .sort((a, b) => {
          if (a.postParent !== b.postParent) return a.postParent - b.postParent
          if (a.menuOrder !== b.menuOrder) return a.menuOrder - b.menuOrder
          return b.postDate.getTime() - a.postDate.getTime()
        })
      const pagesPage = publishedPages.slice(skip, skip + perPage)
      return {
        pages: pagesPage.map((p) => ({
          id: p.id,
          postTitle: p.postTitle,
          postName: p.postName,
          postExcerpt: p.postExcerpt,
          postContent: p.postContent,
          postParent: p.postParent,
          menuOrder: p.menuOrder,
        })),
        total: publishedPages.length,
      }
    }

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
    if (!prisma) {
      return (
        mockPosts.find(
          (p) => p.postStatus === 'publish' && p.postType === 'post' && p.postName === decoded,
        ) ?? null
      )
    }
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
    if (!prisma) {
      const page = mockPosts.find(
        (p) => p.postStatus === 'publish' && p.postType === 'page' && p.postName === decoded,
      )
      if (!page) return null
      return {
        id: page.id,
        postTitle: page.postTitle,
        postName: page.postName,
        postExcerpt: page.postExcerpt,
        postContent: page.postContent,
        postParent: page.postParent,
      }
    }
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
