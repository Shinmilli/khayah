import { BoardSection, HeroSection, ImpactSection, PartnersSection, StorySection } from '../features/home/sections'
import '../styles/home-redesign.css'

export function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <StorySection />

      <div className="top-white">
        <div className="container container--top-white">
          <ImpactSection />
        </div>
      </div>

      <div className="container container--board">
        <BoardSection />
        <PartnersSection />
      </div>
    </div>
  )
}
