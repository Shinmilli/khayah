import { BoardSection, HeroSection, HomeNumbersSection, PartnersSection, StorySection } from '../features/home/sections'
import '../styles/home-redesign.css'

export function HomePage() {
  return (
    <div className="home-page home-page--ko">
      <HeroSection />
      <HomeNumbersSection />
      <StorySection />
      <BoardSection />
      <PartnersSection />
    </div>
  )
}
