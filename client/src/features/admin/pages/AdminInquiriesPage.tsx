import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { adminDeleteInquiry, adminFetchInquiries, adminUpdateInquiry } from '../../../services/api'
import type { InquiryAdmin } from '../../../types/inquiry'
import { Pagination } from '../../../components/Pagination'
import { paginate } from '../../../utils/paginate'

type InquiryStatus = '대기' | '처리중' | '완료'

const STATUSES: InquiryStatus[] = ['대기', '처리중', '완료']

function statusClass(status: string): string {
  if (status === '대기') return 'admin-tag admin-tag--warn'
  if (status === '처리중') return 'admin-tag admin-tag--info'
  return 'admin-tag admin-tag--ok'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function AdminInquiriesPage() {
  const [rows, setRows] = useState<InquiryAdmin[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [status, setStatus] = useState<InquiryStatus>('대기')
  const [reply, setReply] = useState('')
  const [memo, setMemo] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [nameInput, setNameInput] = useState('')
  const [contactInput, setContactInput] = useState('')
  const [appliedName, setAppliedName] = useState('')
  const [appliedContact, setAppliedContact] = useState('')

  const perPage = 20

  const load = useCallback(
    async (p: number, name: string, contact: string) => {
      setLoading(true)
      setError('')
      try {
        const res = await adminFetchInquiries(p, perPage, { name, contact })
        setRows(res.inquiries)
        setTotal(res.total)
        setSelectedId((prev) => {
          if (prev != null && res.inquiries.some((r) => r.id === prev)) return prev
          return res.inquiries[0]?.id ?? null
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
        setRows([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    void load(page, appliedName, appliedContact)
  }, [load, page, appliedName, appliedContact])

  const selected = rows.find((r) => r.id === selectedId) ?? null

  useEffect(() => {
    if (!selected) {
      setStatus('대기')
      setReply('')
      setMemo('')
      return
    }
    setStatus((STATUSES.includes(selected.status as InquiryStatus) ? selected.status : '대기') as InquiryStatus)
    setReply(selected.reply)
    setMemo(selected.memo)
    setSaveMsg('')
  }, [selected])

  function onSearch(e: FormEvent) {
    e.preventDefault()
    setPage(1)
    setAppliedName(nameInput.trim())
    setAppliedContact(contactInput.trim())
  }

  function onResetSearch() {
    setNameInput('')
    setContactInput('')
    setPage(1)
    setAppliedName('')
    setAppliedContact('')
  }

  async function onSave() {
    if (!selected) return
    setSaving(true)
    setSaveMsg('')
    try {
      const updated = await adminUpdateInquiry(selected.id, { status, reply, memo })
      setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setSaveMsg('저장되었습니다.')
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!selected) return
    if (!window.confirm(`문의 #${selected.id}을(를) 삭제할까요?`)) return
    try {
      await adminDeleteInquiry(selected.id)
      await load(page, appliedName, appliedContact)
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : '삭제에 실패했습니다.')
    }
  }

  const pagedMeta = paginate(Array.from({ length: total }, (_, i) => i), page, perPage)
  const hasFilter = Boolean(appliedName || appliedContact)

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">고객 문의 관리</h1>
          <p className="admin-page__desc">
            접수된 문의를 확인하고 처리 상태·답변·내부 메모를 저장합니다. 답변은 이용자가 「내 문의 조회」에서
            확인할 수 있습니다.
          </p>
        </div>
      </div>

      <form className="admin-inquiry-filter" onSubmit={onSearch}>
        <label className="admin-field">
          <span className="admin-field__label">이름</span>
          <input
            className="admin-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.currentTarget.value)}
            placeholder="이름 검색"
            maxLength={80}
          />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">연락처</span>
          <input
            className="admin-input"
            value={contactInput}
            onChange={(e) => setContactInput(e.currentTarget.value)}
            placeholder="이메일 또는 전화"
            maxLength={120}
          />
        </label>
        <div className="admin-inquiry-filter__actions">
          <button type="submit" className="admin-btn admin-btn--primary">
            검색
          </button>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onResetSearch} disabled={!hasFilter && !nameInput && !contactInput}>
            초기화
          </button>
        </div>
      </form>

      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}

      <div className="admin-split">
        <section className="admin-panel admin-panel--tight" aria-labelledby="inquiry-list-heading">
          <h2 id="inquiry-list-heading" className="admin-panel__title">
            문의 목록 {total > 0 ? `(${total})` : ''}
          </h2>
          <div className="admin-table-wrap">
            {loading ? (
              <p className="admin-empty">불러오는 중…</p>
            ) : rows.length === 0 ? (
              <p className="admin-empty">
                {hasFilter ? '검색 조건에 맞는 문의가 없습니다.' : '접수된 문의가 없습니다.'}
              </p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">접수일</th>
                    <th scope="col">이름</th>
                    <th scope="col">연락처</th>
                    <th scope="col">유형</th>
                    <th scope="col">상태</th>
                    <th scope="col">제목</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={row.id === selectedId ? 'admin-table__row--selected' : undefined}
                    >
                      <td>{formatDate(row.createdAt)}</td>
                      <td>{row.name}</td>
                      <td>{row.contact}</td>
                      <td>{row.type}</td>
                      <td>
                        <span className={statusClass(row.status)}>{row.status}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-linkish"
                          onClick={() => setSelectedId(row.id)}
                        >
                          {row.subject}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {total > perPage ? (
            <Pagination
              page={pagedMeta.page}
              totalPages={pagedMeta.totalPages}
              onChange={setPage}
              label="문의 목록 페이지"
            />
          ) : null}
        </section>

        <section className="admin-panel admin-panel--tight" aria-labelledby="inquiry-detail-heading">
          <h2 id="inquiry-detail-heading" className="admin-panel__title">
            문의 상세
          </h2>
          {!selected ? (
            <p className="admin-empty">선택된 문의가 없습니다.</p>
          ) : (
            <>
              <dl className="admin-dl">
                <div>
                  <dt>문의 ID</dt>
                  <dd>#{selected.id}</dd>
                </div>
                <div>
                  <dt>접수일</dt>
                  <dd>{formatDate(selected.createdAt)}</dd>
                </div>
                <div>
                  <dt>이름</dt>
                  <dd>{selected.name}</dd>
                </div>
                <div>
                  <dt>연락처</dt>
                  <dd>{selected.contact}</dd>
                </div>
                <div>
                  <dt>문의 유형</dt>
                  <dd>{selected.type}</dd>
                </div>
                <div>
                  <dt>처리 상태</dt>
                  <dd>
                    <span className={statusClass(selected.status)}>{selected.status}</span>
                  </dd>
                </div>
              </dl>
              <div className="admin-detail-block">
                <h3 className="admin-detail-block__title">{selected.subject}</h3>
                <p className="admin-detail-block__body" style={{ whiteSpace: 'pre-wrap' }}>
                  {selected.body}
                </p>
              </div>
              <fieldset className="admin-fieldset">
                <legend className="admin-fieldset__legend">답변·후속 처리</legend>
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">처리 상태</span>
                  <select
                    className="admin-input"
                    value={status}
                    onChange={(e) => setStatus(e.currentTarget.value as InquiryStatus)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">이용자 답변</span>
                  <textarea
                    className="admin-input admin-input--area"
                    rows={5}
                    value={reply}
                    onChange={(e) => setReply(e.currentTarget.value)}
                    placeholder="이용자가 조회 시 보이는 답변"
                  />
                </label>
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">관리자 메모 (비공개)</span>
                  <textarea
                    className="admin-input admin-input--area"
                    rows={3}
                    value={memo}
                    onChange={(e) => setMemo(e.currentTarget.value)}
                    placeholder="내부 메모"
                  />
                </label>
                {saveMsg ? <p className="admin-fieldset__hint">{saveMsg}</p> : null}
                <div className="admin-form-actions">
                  <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={onSave}>
                    {saving ? '저장 중…' : '답변 저장'}
                  </button>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={onDelete}>
                    삭제
                  </button>
                </div>
              </fieldset>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
