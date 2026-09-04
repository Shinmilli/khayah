import { Fragment, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FOOTER_LOGO_DARK, FOOTER_LOGO_FALLBACK, FOOTER_TOP_LINKS } from '../constants'
import { useLocale } from '../i18n/LocaleContext'
import type { FooterTopLinkKey } from '../i18n/messages/ko'

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
  const { localize, messages } = useLocale()
  const { footer } = messages
  const year = new Date().getFullYear()

  return (
    <footer id="Footer" className="clearfix">
      <div className="footer-links-bar">
        <div className="container footer-links-bar__inner">
          <nav className="footer-links-bar__nav" aria-label={footer.aria}>
            <div className="footer-links-bar__row">
              {FOOTER_TOP_LINKS.map((item, i) => (
                <Fragment key={item.key}>
                  {i > 0 && (
                    <span className="footer-links-bar__sep" aria-hidden>
                      |
                    </span>
                  )}
                  <FooterTopLink
                    item={item}
                    to={'to' in item ? localize(item.to) : undefined}
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
            <ContactText text={footer.contactText} />
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
