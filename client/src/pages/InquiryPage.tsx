import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ListStatus } from '../components/ListStatus'
import {
  INQUIRY_HUB_TAB_IDS,
  type InquiryHubTabId,
  parseInquiryHubTab,
} from '../features/inquiry/inquiryHubTabs'
import { createInquiry, fetchInquiryFaq, lookupInquiries } from '../services/api'
import { useLocale } from '../i18n/LocaleContext'
import { INQUIRY_TYPES, type InquiryPublic, type InquiryType } from '../types/inquiry'
import type { InquiryFaqItem } from '../types/inquiryFaq'
import '../styles/khayah-about-hub.css'
import '../styles/page.css'
import '../styles/inquiry.css'

type Mode = 'write' | 'lookup'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function statusClass(status: string): string {
  if (status === '대기') return 'inquiry-status inquiry-status--wait'
  if (status === '처리중') return 'inquiry-status inquiry-status--progress'
  return 'inquiry-status inquiry-status--done'
}

export function InquiryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { locale, localize, messages } = useLocale()
  const iq = messages.pages.inquiry
  const activeHubTab = useMemo(() => parseInquiryHubTab(location.search), [location.search])
  const hubTabs = useMemo(
    () =>
      INQUIRY_HUB_TAB_IDS.map((id) => ({
        id,
        label: id === 'faq' ? iq.tabs.faq : iq.tabs.board,
      })),
    [iq.tabs],
  )

  const [mode, setMode] = useState<Mode>('write')
  const [faqItems, setFaqItems] = useState<InquiryFaqItem[]>([])
  const [faqLoading, setFaqLoading] = useState(true)
  const [faqError, setFaqError] = useState(false)
  const [openFaqId, setOpenFaqId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [type, setType] = useState<InquiryType>('후원 문의')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitOk, setSubmitOk] = useState<InquiryPublic | null>(null)

  const [lookupName, setLookupName] = useState('')
  const [lookupContact, setLookupContact] = useState('')
  const [lookupPin, setLookupPin] = useState('')
  const [looking, setLooking] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [results, setResults] = useState<InquiryPublic[] | null>(null)

  useEffect(() => {
    document.title = messages.pages.documentTitle(iq.title)
    return () => {
      document.title = messages.pages.defaultTitle
    }
  }, [iq.title, messages.pages])

  useEffect(() => {
    let cancelled = false
    setFaqLoading(true)
    setFaqError(false)
    fetchInquiryFaq(locale)
      .then((doc) => {
        if (!cancelled) {
          setFaqItems(doc.items)
          setOpenFaqId(doc.items[0]?.id ?? null)
        }
      })
      .catch(() => {
        if (!cancelled) setFaqError(true)
      })
      .finally(() => {
        if (!cancelled) setFaqLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  const setHubTab = (id: InquiryHubTabId) => {
    const pathname = localize('/news/inquiry')
    if (id === 'faq') {
      navigate({ pathname }, { replace: true })
    } else {
      navigate({ pathname, search: '?tab=board' }, { replace: true })
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError('')
    setSubmitOk(null)
    if (honeypot.trim()) {
      setSubmitOk(null)
      return
    }
    if (pin !== pinConfirm) {
      setSubmitError(iq.pinMismatch)
      return
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setSubmitError(iq.pinInvalid)
      return
    }
    setSubmitting(true)
    try {
      const created = await createInquiry({
        name,
        contact,
        pin,
        type,
        subject,
        body,
      })
      setSubmitOk(created)
      setSubject('')
      setBody('')
      setPin('')
      setPinConfirm('')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : iq.submitFail)
    } finally {
      setSubmitting(false)
    }
  }

  async function onLookup(e: FormEvent) {
    e.preventDefault()
    setLookupError('')
    setResults(null)
    if (!/^\d{4,6}$/.test(lookupPin)) {
      setLookupError(iq.pinInvalid)
      return
    }
    setLooking(true)
    try {
      const list = await lookupInquiries({
        name: lookupName,
        contact: lookupContact,
        pin: lookupPin,
      })
      setResults(list)
      if (list.length === 0) setLookupError(iq.lookupEmpty)
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : iq.lookupFail)
    } finally {
      setLooking(false)
    }
  }

  return (
    <div className="khayah-about-hub inquiry-page">
      <PageHero title={iq.title} showScrollHint={false} />

      <nav className="khayah-about-tabs" aria-label={iq.tabsAria}>
        <div className="khayah-about-tabs__rail" role="tablist">
          {hubTabs.map((t) => {
            const active = activeHubTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                id={`inquiry-hub-tab-${t.id}`}
                tabIndex={0}
                className={`khayah-about-tabs__tab${active ? ' is-active' : ''}`}
                onClick={() => setHubTab(t.id)}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="khayah-about-hub__inner inquiry-hub__inner">
        <div
          className="khayah-about-hub__panel inquiry-shell"
          role="tabpanel"
          aria-labelledby={`inquiry-hub-tab-${activeHubTab}`}
        >
          {activeHubTab === 'faq' ? (
            <section className="inquiry-faq" aria-labelledby="inquiry-faq-heading">
              <header className="inquiry-section-head">
                <h2 id="inquiry-faq-heading" className="inquiry-section-title">
                  FAQ {faqLoading ? null : <span className="inquiry-count">({faqItems.length})</span>}
                </h2>
                <p className="inquiry-section-sub">{iq.faqSub}</p>
              </header>

              {faqLoading ? (
                <ListStatus variant="loading" lines={3} />
              ) : faqError ? (
                <ListStatus variant="error" message={iq.faqLoadError} />
              ) : faqItems.length === 0 ? (
                <div className="inquiry-faq__list inquiry-faq__list--empty" role="status">
                  <p className="inquiry-faq__empty">{iq.faqEmpty}</p>
                </div>
              ) : (
                <ul className="inquiry-faq__list">
                  {faqItems.map((item) => {
                    const open = openFaqId === item.id
                    return (
                      <li key={item.id} className={`inquiry-faq__item${open ? ' is-open' : ''}`}>
                        <button
                          type="button"
                          className="inquiry-faq__q"
                          aria-expanded={open}
                          onClick={() => setOpenFaqId(open ? null : item.id)}
                        >
                          <span className="inquiry-faq__q-text">{item.question}</span>
                          <span className="inquiry-faq__chevron" aria-hidden>
                            {open ? '−' : '+'}
                          </span>
                        </button>
                        {open ? (
                          <div className="inquiry-faq__a">
                            <p>{item.answer}</p>
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          ) : (
            <section className="inquiry-board" aria-labelledby="inquiry-board-heading">
              <header className="inquiry-section-head">
                <h2 id="inquiry-board-heading" className="inquiry-section-title">
                  {iq.boardTitle}
                </h2>
                <p className="inquiry-section-sub">{iq.boardSub}</p>
              </header>

              <section className="inquiry-guide" aria-labelledby="inquiry-guide-heading">
                <h3 id="inquiry-guide-heading" className="inquiry-guide__title">
                  {iq.guideTitle}
                </h3>
                <ol className="inquiry-guide__steps">
                  {iq.guideSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="inquiry-guide__note">{iq.guideNote}</p>
              </section>

              <div className="inquiry-tabs" role="tablist" aria-label={iq.modeAria}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'write'}
                  className={`inquiry-tab${mode === 'write' ? ' is-active' : ''}`}
                  onClick={() => setMode('write')}
                >
                  {iq.modeWrite}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'lookup'}
                  className={`inquiry-tab${mode === 'lookup' ? ' is-active' : ''}`}
                  onClick={() => setMode('lookup')}
                >
                  {iq.modeLookup}
                </button>
              </div>

              {mode === 'write' ? (
                <form className="inquiry-form" onSubmit={onSubmit} noValidate>
                  <label className="inquiry-hp" aria-hidden="true">
                    <span>website</span>
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.currentTarget.value)}
                    />
                  </label>

                  <div className="inquiry-rows">
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        {iq.labelName} <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <input
                        className="inquiry-input"
                        required
                        maxLength={80}
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                      />
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        {iq.labelContact} <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <input
                        className="inquiry-input"
                        required
                        maxLength={120}
                        placeholder={iq.contactPlaceholder}
                        value={contact}
                        onChange={(e) => setContact(e.currentTarget.value)}
                      />
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        {iq.labelPin} <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <input
                        className="inquiry-input"
                        required
                        inputMode="numeric"
                        pattern="\d{4,6}"
                        maxLength={6}
                        autoComplete="new-password"
                        placeholder={iq.pinPlaceholder}
                        value={pin}
                        onChange={(e) => setPin(e.currentTarget.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        {iq.labelPinConfirm} <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <input
                        className="inquiry-input"
                        required
                        inputMode="numeric"
                        pattern="\d{4,6}"
                        maxLength={6}
                        autoComplete="new-password"
                        value={pinConfirm}
                        onChange={(e) => setPinConfirm(e.currentTarget.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        {iq.labelType} <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <select
                        className="inquiry-input"
                        value={type}
                        onChange={(e) => setType(e.currentTarget.value as InquiryType)}
                      >
                        {INQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {iq.types[t] ?? t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        {iq.labelSubject} <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <input
                        className="inquiry-input"
                        required
                        maxLength={200}
                        value={subject}
                        onChange={(e) => setSubject(e.currentTarget.value)}
                      />
                    </label>
                    <label className="inquiry-row inquiry-row--area">
                      <span className="inquiry-row__label">
                        {iq.labelBody} <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <textarea
                        className="inquiry-input inquiry-input--area"
                        required
                        rows={8}
                        maxLength={5000}
                        value={body}
                        onChange={(e) => setBody(e.currentTarget.value)}
                      />
                    </label>
                  </div>

                  {submitError ? <p className="inquiry-msg inquiry-msg--error">{submitError}</p> : null}
                  {submitOk ? (
                    <p className="inquiry-msg inquiry-msg--ok">{iq.submitOk(submitOk.id)}</p>
                  ) : null}

                  <div className="inquiry-actions">
                    <button type="submit" className="inquiry-btn" disabled={submitting}>
                      {submitting ? iq.submitting : iq.submit}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="inquiry-lookup">
                  <form className="inquiry-form" onSubmit={onLookup} noValidate>
                    <div className="inquiry-rows">
                      <label className="inquiry-row">
                        <span className="inquiry-row__label">
                          {iq.labelName} <span className="inquiry-req" aria-hidden>*</span>
                        </span>
                        <input
                          className="inquiry-input"
                          required
                          maxLength={80}
                          value={lookupName}
                          onChange={(e) => setLookupName(e.currentTarget.value)}
                        />
                      </label>
                      <label className="inquiry-row">
                        <span className="inquiry-row__label">
                          {iq.labelContact} <span className="inquiry-req" aria-hidden>*</span>
                        </span>
                        <input
                          className="inquiry-input"
                          required
                          maxLength={120}
                          value={lookupContact}
                          onChange={(e) => setLookupContact(e.currentTarget.value)}
                        />
                      </label>
                      <label className="inquiry-row">
                        <span className="inquiry-row__label">
                          {iq.labelPin} <span className="inquiry-req" aria-hidden>*</span>
                        </span>
                        <input
                          className="inquiry-input"
                          required
                          inputMode="numeric"
                          pattern="\d{4,6}"
                          maxLength={6}
                          autoComplete="current-password"
                          value={lookupPin}
                          onChange={(e) => setLookupPin(e.currentTarget.value.replace(/\D/g, '').slice(0, 6))}
                        />
                      </label>
                    </div>
                    {lookupError ? <p className="inquiry-msg inquiry-msg--error">{lookupError}</p> : null}
                    <div className="inquiry-actions">
                      <button type="submit" className="inquiry-btn" disabled={looking}>
                        {looking ? iq.looking : iq.lookup}
                      </button>
                    </div>
                  </form>

                  {results && results.length > 0 ? (
                    <ul className="inquiry-results" aria-label={iq.resultsAria}>
                      {results.map((row) => (
                        <li key={row.id} className="inquiry-card">
                          <div className="inquiry-card__head">
                            <span className={statusClass(row.status)}>
                              {iq.statuses[row.status] ?? row.status}
                            </span>
                            <span className="inquiry-card__meta">
                              #{row.id} · {iq.types[row.type] ?? row.type} · {formatDate(row.createdAt)}
                            </span>
                          </div>
                          <h3 className="inquiry-card__title">{row.subject}</h3>
                          <p className="inquiry-card__body">{row.body}</p>
                          {row.reply ? (
                            <div className="inquiry-card__reply">
                              <h4>{iq.reply}</h4>
                              <p>{row.reply}</p>
                              {row.repliedAt ? (
                                <time dateTime={row.repliedAt}>{iq.repliedAt(formatDate(row.repliedAt))}</time>
                              ) : null}
                            </div>
                          ) : (
                            <p className="inquiry-card__pending">{iq.replyPending}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )}
            </section>
          )}

          <section className="inquiry-detail-contact" aria-labelledby="inquiry-detail-heading">
            <h2 id="inquiry-detail-heading" className="inquiry-section-title">
              {iq.detailTitle}
            </h2>
            <p className="inquiry-section-sub">{iq.detailSub}</p>
            <div className="inquiry-detail-cards">
              <a className="inquiry-detail-card" href="mailto:khayahkorea@gmail.com">
                <span className="inquiry-detail-card__label">{iq.emailLabel}</span>
                <span className="inquiry-detail-card__value">khayahkorea@gmail.com</span>
              </a>
              <a className="inquiry-detail-card" href="tel:031-689-3639">
                <span className="inquiry-detail-card__label">{iq.phoneLabel}</span>
                <span className="inquiry-detail-card__value">031-689-3639</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
