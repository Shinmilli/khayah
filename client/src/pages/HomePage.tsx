import { BoardSection, HeroSection, HomeNumbersSection, ImpactSection, PartnersSection, StorySection } from '../features/home/sections'
import { useLocale } from '../i18n/LocaleContext'
import '../styles/home-redesign.css'

export function HomePage() {
  const { locale } = useLocale()
  if (locale === 'ko') {
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

  return (
    <div className="home-page">
      <HeroSection />
      <HomeNumbersSection />
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
