import { useEffect, useState } from 'react'
import { HomeSlider } from '../components/HomeSlider'
import { HomeHoverBoxes, HomeHeading, HomePhotoBoxes } from '../components/HomeSections'
import { PostList } from '../components/PostList'
import { fetchPosts } from '../services/api'
import type { Post } from '../types/post'
import '../styles/home.css'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts(1, 9)
      .then((data) => setPosts(data.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* 메인 슬라이더 (워드프레스 Rev Slider home-khayah) */}
      <HomeSlider />

      {/* 호버 박스: 카야 소개 / 카야 후원하기 */}
      <HomeHoverBoxes />

      {/* 헤딩: 사람을 키우고 섬기는 개발 NGO */}
      <HomeHeading />

      {/* 포토 박스: 국내사업 / 해외사업 */}
      <HomePhotoBoxes />

      {/* 최신 소식 (포스트 목록) */}
      <section className="section section-post-list">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <h2 className="section-title">최신 소식</h2>
            <PostList posts={posts} loading={loading} />
          </div>
        </div>
      </section>
    </>
  )
}
