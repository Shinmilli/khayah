import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { setPageHeroImageOverrides } from '../../constants/pageHeroImages'
import { fetchPageHeroBanners } from '../../services/api'
import { DEFAULT_PAGE_HERO_BANNERS, type PageHeroBannersDocument } from './pageHeroBannerTypes'

const PageHeroBannerContext = createContext<PageHeroBannersDocument['images']>(
  DEFAULT_PAGE_HERO_BANNERS.images,
)

export function PageHeroBannerProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState(DEFAULT_PAGE_HERO_BANNERS.images)

  useEffect(() => {
    let cancelled = false
    fetchPageHeroBanners()
      .then((doc) => {
        if (cancelled) return
        setPageHeroImageOverrides(doc.images)
        setImages(doc.images)
      })
      .catch(() => {
        if (cancelled) return
        setPageHeroImageOverrides(null)
        setImages(DEFAULT_PAGE_HERO_BANNERS.images)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <PageHeroBannerContext.Provider value={images}>{children}</PageHeroBannerContext.Provider>
}

export function usePageHeroBannerImages() {
  return useContext(PageHeroBannerContext)
}
