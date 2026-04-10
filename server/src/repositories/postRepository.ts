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
  /* 워드프레스 공지 목록 이관용 샘플 (MOCK_DATA / DB 없을 때) */
  {
    id: 101,
    postTitle: '경기청년 기후특사단 캄보디아팀 조기귀국 관련 안내',
    postName: 'notice-20251015-cambodia-return',
    postExcerpt: '',
    postContent:
      '<p>경기청년 기후특사단 캄보디아팀 조기귀국과 관련한 안내입니다. 자세한 내용은 추후 공지에 따라 진행됩니다.</p>',
    postParent: 0,
    menuOrder: 0,
    postDate: new Date('2025-10-15T00:00:00.000Z'),
    postStatus: 'publish',
    postType: 'post',
  },
  {
    id: 102,
    postTitle: '2025년 경기청년 기후특사단 최종합격자 발표 및 사전OT 안내',
    postName: 'notice-20250721-climate-final',
    postExcerpt: '',
    postContent:
      '<p>2025년 경기청년 기후특사단 최종합격자 발표 및 사전 OT 일정을 안내합니다.</p>',
    postParent: 0,
    menuOrder: 0,
    postDate: new Date('2025-07-21T00:00:00.000Z'),
    postStatus: 'publish',
    postType: 'post',
  },
  {
    id: 103,
    postTitle: '[공지] 2025년 경기청년 기후특사단 1차 서류심사 합격자 발표',
    postName: 'notice-20250711-doc-pass',
    postExcerpt: '',
    postContent: '<p>1차 서류심사 합격자 발표 관련 공지입니다.</p>',
    postParent: 0,
    menuOrder: 0,
    postDate: new Date('2025-07-11T15:00:00.000Z'),
    postStatus: 'publish',
    postType: 'post',
  },
  {
    id: 104,
    postTitle: '[긴급공지] 2025년 경기청년 기후특사단 1차 서류합격자 발표 시간 변경 안내',
    postName: 'notice-20250711-doc-time',
    postExcerpt: '',
    postContent: '<p>발표 시간이 변경되었습니다. 아래 일정을 확인해 주세요.</p>',
    postParent: 0,
    menuOrder: 0,
    postDate: new Date('2025-07-11T14:00:00.000Z'),
    postStatus: 'publish',
    postType: 'post',
  },
  {
    id: 105,
    postTitle: '🌍 2025년 경기 청년 기후 특사단 모집 🌍~~ 7.8(화) 23:00',
    postName: 'notice-20250617-recruit',
    postExcerpt: '',
    postContent: '<p>2025년 경기 청년 기후 특사단 모집 안내입니다.</p>',
    postParent: 0,
    menuOrder: 0,
    postDate: new Date('2025-06-17T00:00:00.000Z'),
    postStatus: 'publish',
    postType: 'post',
  },
  {
    id: 106,
    postTitle: '2025년 경기청년 기후특사단 관련 안내',
    postName: 'notice-20250402',
    postExcerpt: '',
    postContent: '<p>경기청년 기후특사단 관련 안내입니다.</p>',
    postParent: 0,
    menuOrder: 0,
    postDate: new Date('2025-04-02T00:00:00.000Z'),
    postStatus: 'publish',
    postType: 'post',
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
