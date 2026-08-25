import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { ListStatus } from '../components/ListStatus'
import {
  INQUIRY_HUB_TABS,
  type InquiryHubTabId,
  parseInquiryHubTab,
} from '../features/inquiry/inquiryHubTabs'
import { createInquiry, fetchInquiryFaq, lookupInquiries } from '../services/api'
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
  const activeHubTab = useMemo(() => parseInquiryHubTab(location.search), [location.search])

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
    document.title = '고객 문의 | 사단법인 카야 인터내셔널'
    return () => {
      document.title = '사단법인 카야 인터내셔널 | 개발NGO'
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setFaqLoading(true)
    setFaqError(false)
    fetchInquiryFaq()
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
  }, [])

  const setHubTab = (id: InquiryHubTabId) => {
    if (id === 'faq') {
      navigate({ pathname: '/소식/고객문의' }, { replace: true })
    } else {
      navigate({ pathname: '/소식/고객문의', search: '?tab=board' }, { replace: true })
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
      setSubmitError('임시 비밀번호가 일치하지 않습니다.')
      return
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setSubmitError('임시 비밀번호는 숫자 4~6자리여야 합니다.')
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
      setSubmitError(err instanceof Error ? err.message : '문의 접수에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  async function onLookup(e: FormEvent) {
    e.preventDefault()
    setLookupError('')
    setResults(null)
    if (!/^\d{4,6}$/.test(lookupPin)) {
      setLookupError('임시 비밀번호는 숫자 4~6자리여야 합니다.')
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
      if (list.length === 0) setLookupError('일치하는 문의가 없습니다. 정보를 다시 확인해 주세요.')
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : '문의 조회에 실패했습니다.')
    } finally {
      setLooking(false)
    }
  }

  return (
    <div className="khayah-about-hub inquiry-page">
      <PageHero title="고객 문의" showScrollHint={false} />

      <nav className="khayah-about-tabs" aria-label="고객 문의 하위 메뉴">
        <div className="khayah-about-tabs__rail" role="tablist">
          {INQUIRY_HUB_TABS.map((t) => {
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
                <p className="inquiry-section-sub">자주 묻는 질문을 먼저 확인해 보세요.</p>
              </header>

              {faqLoading ? (
                <ListStatus variant="loading" lines={3} />
              ) : faqError ? (
                <ListStatus variant="error" message="FAQ를 불러오지 못했습니다." />
              ) : faqItems.length === 0 ? (
                <div className="inquiry-faq__list inquiry-faq__list--empty" role="status">
                  <p className="inquiry-faq__empty">등록된 게시물이 없습니다.</p>
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
                  문의하기
                </h2>
                <p className="inquiry-section-sub">문의 작성 또는 기존 문의 조회</p>
              </header>

              <section className="inquiry-guide" aria-labelledby="inquiry-guide-heading">
                <h3 id="inquiry-guide-heading" className="inquiry-guide__title">
                  문의방법
                </h3>
                <ol className="inquiry-guide__steps">
                  <li>
                    <strong>이름 · 연락처 · 임시 비밀번호</strong>를 입력해 문의를 작성합니다.
                  </li>
                  <li>
                    임시 비밀번호는 <strong>숫자 4~6자리</strong>로 직접 정합니다.
                  </li>
                  <li>
                    나중에 「내 문의 조회」에서 같은 정보로 <strong>답변을 확인</strong>합니다.
                  </li>
                </ol>
                <p className="inquiry-guide__note">
                  비밀번호는 암호화되어 저장되며, 분실 시 사이트에서 복구할 수 없습니다.
                </p>
              </section>

              <div className="inquiry-tabs" role="tablist" aria-label="문의 모드">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'write'}
                  className={`inquiry-tab${mode === 'write' ? ' is-active' : ''}`}
                  onClick={() => setMode('write')}
                >
                  문의 작성
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'lookup'}
                  className={`inquiry-tab${mode === 'lookup' ? ' is-active' : ''}`}
                  onClick={() => setMode('lookup')}
                >
                  내 문의 조회
                </button>
              </div>

              {mode === 'write' ? (
                <form className="inquiry-form" onSubmit={onSubmit} noValidate>
                  <label className="inquiry-hp" aria-hidden="true">
                    <span>웹사이트</span>
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
                        이름 <span className="inquiry-req" aria-hidden>*</span>
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
                        연락처 <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <input
                        className="inquiry-input"
                        required
                        maxLength={120}
                        placeholder="이메일 또는 전화"
                        value={contact}
                        onChange={(e) => setContact(e.currentTarget.value)}
                      />
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        임시 비밀번호 <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <input
                        className="inquiry-input"
                        required
                        inputMode="numeric"
                        pattern="\d{4,6}"
                        maxLength={6}
                        autoComplete="new-password"
                        placeholder="숫자 4~6자리"
                        value={pin}
                        onChange={(e) => setPin(e.currentTarget.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        비밀번호 확인 <span className="inquiry-req" aria-hidden>*</span>
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
                        문의 유형 <span className="inquiry-req" aria-hidden>*</span>
                      </span>
                      <select
                        className="inquiry-input"
                        value={type}
                        onChange={(e) => setType(e.currentTarget.value as InquiryType)}
                      >
                        {INQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="inquiry-row">
                      <span className="inquiry-row__label">
                        제목 <span className="inquiry-req" aria-hidden>*</span>
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
                        내용 <span className="inquiry-req" aria-hidden>*</span>
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
                    <p className="inquiry-msg inquiry-msg--ok">
                      문의가 접수되었습니다. (문의번호 #{submitOk.id}) 같은 이름·연락처·비밀번호로 「내 문의
                      조회」에서 답변을 확인할 수 있습니다.
                    </p>
                  ) : null}

                  <div className="inquiry-actions">
                    <button type="submit" className="inquiry-btn" disabled={submitting}>
                      {submitting ? '접수 중…' : '문의 접수'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="inquiry-lookup">
                  <form className="inquiry-form" onSubmit={onLookup} noValidate>
                    <div className="inquiry-rows">
                      <label className="inquiry-row">
                        <span className="inquiry-row__label">
                          이름 <span className="inquiry-req" aria-hidden>*</span>
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
                          연락처 <span className="inquiry-req" aria-hidden>*</span>
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
                          임시 비밀번호 <span className="inquiry-req" aria-hidden>*</span>
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
                        {looking ? '조회 중…' : '문의 조회'}
                      </button>
                    </div>
                  </form>

                  {results && results.length > 0 ? (
                    <ul className="inquiry-results" aria-label="조회 결과">
                      {results.map((row) => (
                        <li key={row.id} className="inquiry-card">
                          <div className="inquiry-card__head">
                            <span className={statusClass(row.status)}>{row.status}</span>
                            <span className="inquiry-card__meta">
                              #{row.id} · {row.type} · {formatDate(row.createdAt)}
                            </span>
                          </div>
                          <h3 className="inquiry-card__title">{row.subject}</h3>
                          <p className="inquiry-card__body">{row.body}</p>
                          {row.reply ? (
                            <div className="inquiry-card__reply">
                              <h4>답변</h4>
                              <p>{row.reply}</p>
                              {row.repliedAt ? (
                                <time dateTime={row.repliedAt}>답변일 {formatDate(row.repliedAt)}</time>
                              ) : null}
                            </div>
                          ) : (
                            <p className="inquiry-card__pending">아직 답변이 등록되지 않았습니다.</p>
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
              자세한 문의
            </h2>
            <p className="inquiry-section-sub">
              FAQ·문의하기로 해결되지 않으면 아래 연락처로 문의해 주세요.
            </p>
            <div className="inquiry-detail-cards">
              <a className="inquiry-detail-card" href="mailto:khayahkorea@gmail.com">
                <span className="inquiry-detail-card__label">이메일</span>
                <span className="inquiry-detail-card__value">khayahkorea@gmail.com</span>
              </a>
              <a className="inquiry-detail-card" href="tel:031-689-3639">
                <span className="inquiry-detail-card__label">전화</span>
                <span className="inquiry-detail-card__value">031-689-3639</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
