import { Fragment, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FOOTER_LOGO_DARK, FOOTER_LOGO_FALLBACK, FOOTER_TOP_LINKS } from '../constants'
import { useLocale } from '../i18n/LocaleContext'
import type { FooterTopLinkKey } from '../i18n/messages/ko'
import { useSiteCommon } from '../features/site/useSiteCommon'

type TopLinkItem = (typeof FOOTER_TOP_LINKS)[number]

function FooterTopLink({
  item,
  children,
  to,
}: {
  item: TopLinkItem
  children: ReactNode
  to?: string
}) {
  if ('to' in item && to) {
    return (
      <Link className="footer-links-bar__link" to={to}>
        {children}
      </Link>
    )
  }
  if ('href' in item && item.href) {
    return (
      <a
        className="footer-links-bar__link"
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }
  return <span className="footer-links-bar__text">{children}</span>
}

function FooterBrandLogo() {
  const [src, setSrc] = useState(FOOTER_LOGO_DARK)
  const isFallback = src === FOOTER_LOGO_FALLBACK

  return (
    <img
      src={src}
      alt=""
      className={`footer-main__logo${isFallback ? ' footer-main__logo--fallback' : ''}`}
      onError={() => setSrc(FOOTER_LOGO_FALLBACK)}
    />
  )
}

function ContactText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="footer-main__address">
      {lines.map((line, i) => (
        <p key={i} className={`footer-main__line${i === 0 ? ' footer-main__line--org' : ''}`}>
          {line}
        </p>
      ))}
    </div>
  )
}

export function Footer() {
  const { locale, localize, messages } = useLocale()
  const { footer } = messages
  const site = useSiteCommon()
  const year = new Date().getFullYear()
  const koOrg = locale === 'ko' ? site?.org : null
  const contactText = koOrg
    ? [koOrg.nameKo, koOrg.addressKo, koOrg.phoneFax, koOrg.email ? `E ${koOrg.email.replace(/^E\s*/i, '')}` : '']
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n')
    : footer.contactText
  const koLinks =
    locale === 'ko' && site
      ? site.footerLinks
          .filter((row) => row.enabled && row.labelKo.trim() && row.href.trim() && row.href.trim() !== '#')
          .sort((a, b) => a.order - b.order)
      : null

  return (
    <footer id="Footer" className="clearfix">
      <div className="footer-links-bar">
        <div className="container footer-links-bar__inner">
          <nav className="footer-links-bar__nav" aria-label={footer.aria}>
            <div className="footer-links-bar__row">
              {koLinks
                ? koLinks.map((row, i) => {
                    const href = row.href.trim()
                    const external = /^https?:/i.test(href)
                    return (
                      <Fragment key={row.id}>
                        {i > 0 && (
                          <span className="footer-links-bar__sep" aria-hidden>
                            |
                          </span>
                        )}
                        {external ? (
                          <a className="footer-links-bar__link" href={href} target="_blank" rel="noopener noreferrer">
                            {row.labelKo}
                          </a>
                        ) : (
                          <Link className="footer-links-bar__link" to={localize(href)}>
                            {row.labelKo}
                          </Link>
                        )}
                      </Fragment>
                    )
                  })
                : null}
              {!koLinks && FOOTER_TOP_LINKS.map((item, i) => (
                <Fragment key={item.key}>
                  {i > 0 && (
                    <span className="footer-links-bar__sep" aria-hidden>
                      |
                    </span>
                  )}
                  <FooterTopLink
                    item={item}
                    to={
                      'to' in item
                        ? localize(
                            item.key === 'projects' && locale === 'ko'
                              ? '/business/domestic'
                              : item.to,
                          )
                        : undefined
                    }
                  >
                    {footer.topLinks[item.key as FooterTopLinkKey]}
                  </FooterTopLink>
                </Fragment>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="footer-main">
        <div className="container footer-main__inner">
          <div className="footer-main__left">
            <FooterBrandLogo />
            <ContactText text={contactText} />
          </div>
        </div>
      </div>

      <div className="footer_copy">
        <div className="container">
          <div className="column one">
            <a
              id="back_to_top"
              className="button button_left button_js"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <span className="button_icon" aria-hidden>
                ↑
              </span>
            </a>
            <div className="copyright">{footer.copyright(year)}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
