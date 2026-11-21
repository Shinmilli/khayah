import { Fragment, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FOOTER_LOGO_DARK, FOOTER_LOGO_FALLBACK, FOOTER_TOP_LINKS } from '../constants'
import { useLocale } from '../i18n/LocaleContext'
import type { FooterTopLinkKey } from '../i18n/messages/ko'
import { cleanEmail, parsePhoneFax } from '../features/site/orgContact'
import { useSiteCommon } from '../features/site/useSiteCommon'
import { isExternalHref, normalizeHref } from '../utils/hrefs'

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

function PhoneIcon() {
  return (
    <svg className="footer-main__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h3l2 5-2 1a12 12 0 006 6l1-2 5 2v3a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z" />
    </svg>
  )
}

function FaxIcon() {
  return (
    <svg className="footer-main__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="7" rx="1.2" />
      <path d="M5 9.5H3.5A1.5 1.5 0 002 11v7.5A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5V11a1.5 1.5 0 00-1.5-1.5H19" />
      <path d="M8 14.5h2M12 14.5h2M16 14.5h2" />
      <path d="M9 5.5h6" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="footer-main__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

function parseFallbackContact(text: string): {
  name: string
  address: string
  phone: string
  fax: string
  email: string
} {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  const name = lines[0] || ''
  const address = lines[1] || ''
  const phoneFaxLine = lines.find((line) => /^T\b/i.test(line) || line.includes('|')) || ''
  const emailLine = lines.find((line) => /^E\b/i.test(line) || line.includes('@')) || ''
  const { phone, fax } = parsePhoneFax(phoneFaxLine)
  return { name, address, phone, fax, email: cleanEmail(emailLine) }
}

function FooterContact({
  name,
  address,
  phone,
  fax,
  email,
}: {
  name: string
  address: string
  phone: string
  fax: string
  email: string
}) {
  return (
    <div className="footer-main__address">
      {name ? <p className="footer-main__line footer-main__line--org">{name}</p> : null}
      {address ? <p className="footer-main__line">{address}</p> : null}
      {phone || fax ? (
        <p className="footer-main__line footer-main__line--meta">
          {phone ? (
            <>
              <PhoneIcon />
              <span>{phone}</span>
            </>
          ) : null}
          {phone && fax ? <span className="footer-main__sep" aria-hidden>|</span> : null}
          {fax ? (
            <>
              <FaxIcon />
              <span>{fax}</span>
            </>
          ) : null}
        </p>
      ) : null}
      {email ? (
        <p className="footer-main__line footer-main__line--meta">
          <MailIcon />
          <span>{email}</span>
        </p>
      ) : null}
    </div>
  )
}

export function Footer() {
  const { locale, localize, messages } = useLocale()
  const { footer } = messages
  const site = useSiteCommon()
  const year = new Date().getFullYear()
  const koOrg = site?.org ?? null
  const fallback = parseFallbackContact(footer.contactText)
  const { phone, fax } = koOrg ? parsePhoneFax(koOrg.phoneFax) : { phone: fallback.phone, fax: fallback.fax }
  const contact = {
    name: (locale === 'en' ? koOrg?.nameEn : koOrg?.nameKo) || koOrg?.nameKo || fallback.name,
    address: (locale === 'en' ? koOrg?.addressEn : koOrg?.addressKo) || koOrg?.addressKo || fallback.address,
    phone,
    fax,
    email: koOrg ? cleanEmail(koOrg.email) : fallback.email,
  }
  const koLinks = site
    ? site.footerLinks
        .filter((row) => row.enabled && (locale === 'en' ? row.labelEn || row.labelKo : row.labelKo).trim() && row.href.trim() && row.href.trim() !== '#')
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
                    const href = normalizeHref(row.href)
                    const external = isExternalHref(href)
                    const label = locale === 'en' ? row.labelEn || row.labelKo : row.labelKo
                    return (
                      <Fragment key={row.id}>
                        {i > 0 && (
                          <span className="footer-links-bar__sep" aria-hidden>
                            |
                          </span>
                        )}
                        {external ? (
                          <a className="footer-links-bar__link" href={href} target="_blank" rel="noopener noreferrer">
                            {label}
                          </a>
                        ) : (
                          <Link className="footer-links-bar__link" to={localize(href)}>
                            {label}
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
                            item.key === 'projects'
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
            <FooterContact {...contact} />
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
