import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { enMessages } from './messages/en'
import { koMessages, type Messages } from './messages/ko'
import { localizePath, splitLocalePath, swapLocalePath, type Locale } from './locale'
import { pathKeyToHref } from './routes'

const MESSAGES: Record<Locale, Messages> = {
  ko: koMessages,
  en: enMessages,
}

type LocaleContextValue = {
  locale: Locale
  messages: Messages
  localize: (path: string) => string
  swapLocale: (target: Locale) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'ko'
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages: MESSAGES[locale],
      localize: (path: string) => localizePath(path, locale),
      swapLocale: (target: Locale) =>
        swapLocalePath(location.pathname, location.search, location.hash, target),
    }),
    [locale, location.pathname, location.search, location.hash],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    return {
      locale: 'ko',
      messages: koMessages,
      localize: (path: string) => localizePath(path, 'ko'),
      swapLocale: (target: Locale) => localizePath('/', target),
    }
  }
  return ctx
}

/** path key → 현재 locale의 href */
export function usePathHref(pathKey: string): string {
  const { localize } = useLocale()
  return localize(pathKeyToHref(pathKey))
}

export function useLocaleFromRouter(): Locale {
  const location = useLocation()
  return splitLocalePath(location.pathname).locale
}
