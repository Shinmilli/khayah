import { useState } from 'react'

type InquiryStatus = '대기' | '처리중' | '완료'

const mockInquiries = [
  {
    id: 'inq-1042',
    receivedAt: '2026-04-18',
    type: '후원 문의',
    subject: '정기 후원 변경 문의',
    status: '대기' as InquiryStatus,
    hasReply: false,
    body: '정기 후원 금액을 변경하고 싶습니다. 절차를 안내 부탁드립니다.',
  },
  {
    id: 'inq-1041',
    receivedAt: '2026-04-16',
    type: '봉사 참여',
    subject: '주말 봉사 일정 문의',
    status: '처리중' as InquiryStatus,
    hasReply: false,
    body: '4월 말 주말 봉사 가능한 일정이 있을까요?',
  },
  {
    id: 'inq-1038',
    receivedAt: '2026-04-10',
    type: '기타',
    subject: '제휴 제안',
    status: '완료' as InquiryStatus,
    hasReply: true,
    body: '○○ 기관과 협력 프로그램을 논의하고 싶습니다.',
  },
] as const

function statusClass(status: InquiryStatus): string {
  if (status === '대기') return 'admin-tag admin-tag--warn'
  if (status === '처리중') return 'admin-tag admin-tag--info'
  return 'admin-tag admin-tag--ok'
}

export function AdminInquiriesPage() {
  const [selectedId, setSelectedId] = useState<string>(mockInquiries[0].id)
  const selected = mockInquiries.find((r) => r.id === selectedId) ?? mockInquiries[0]

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">1:1 문의 관리</h1>
          <p className="admin-page__desc">
            접수일·문의 유형·처리 상태를 한눈에 보고, 상세 내용 확인과 답변 여부를 상태값으로
            표시합니다.
          </p>
        </div>
      </div>

      <div className="admin-split">
        <section className="admin-panel admin-panel--tight" aria-labelledby="inquiry-list-heading">
          <h2 id="inquiry-list-heading" className="admin-panel__title">
            문의 목록
          </h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">접수일</th>
                  <th scope="col">유형</th>
                  <th scope="col">상태</th>
                  <th scope="col">제목</th>
                </tr>
              </thead>
              <tbody>
                {mockInquiries.map((row) => (
                  <tr
                    key={row.id}
                    className={row.id === selectedId ? 'admin-table__row--selected' : undefined}
                  >
                    <td>{row.receivedAt}</td>
                    <td>{row.type}</td>
                    <td>
                      <span className={statusClass(row.status)}>{row.status}</span>
                    </td>
                    <td>
                      <button type="button" className="admin-linkish" onClick={() => setSelectedId(row.id)}>
                        {row.subject}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel admin-panel--tight" aria-labelledby="inquiry-detail-heading">
          <h2 id="inquiry-detail-heading" className="admin-panel__title">
            문의 상세
          </h2>
          <dl className="admin-dl">
            <div>
              <dt>문의 ID</dt>
              <dd>{selected.id}</dd>
            </div>
            <div>
              <dt>접수일</dt>
              <dd>{selected.receivedAt}</dd>
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
            <h3 className="admin-detail-block__title">문의 내용</h3>
            <p className="admin-detail-block__body">{selected.body}</p>
          </div>
          <fieldset className="admin-fieldset">
            <legend className="admin-fieldset__legend">답변·후속 처리 (목업)</legend>
            <div className="admin-reply-flag">
              <span className="admin-field__label">답변 여부 표시</span>
              <span className={selected.hasReply ? 'admin-tag admin-tag--ok' : 'admin-tag admin-tag--warn'}>
                {selected.hasReply ? '답변 완료' : '미답변'}
              </span>
            </div>
            <p className="admin-fieldset__hint">
              실제 서비스에서는 답변 등록 시 자동 반영하거나, 처리 상태(대기/처리중/완료)와 별도 플래그로
              관리할 수 있습니다.
            </p>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">관리자 메모</span>
              <textarea className="admin-input admin-input--area" rows={4} readOnly placeholder="내부 메모" />
            </label>
            <div className="admin-form-actions">
              <button type="button" className="admin-btn admin-btn--primary" disabled>
                답변 저장
              </button>
            </div>
          </fieldset>
        </section>
      </div>
    </div>
  )
}
