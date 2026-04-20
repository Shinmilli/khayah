import { useState } from 'react'

const contentTypes = ['공지사항', '스토리', '언론보도', '연간소식지'] as const

const mockRows = [
  {
    id: '1',
    type: '공지사항',
    title: '2026년 상반기 봉사 일정 안내',
    category: '일정',
    updatedAt: '2026-04-12',
  },
  {
    id: '2',
    type: '스토리',
    title: '현장에서 만난 이야기',
    category: '현장',
    updatedAt: '2026-04-08',
  },
  {
    id: '3',
    type: '언론보도',
    title: '○○일보 – 지역 나눔 활동 보도',
    category: '신문',
    updatedAt: '2026-03-21',
  },
] as const

export function AdminContentPage() {
  const [filterType, setFilterType] = useState<(typeof contentTypes)[number]>('공지사항')

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">콘텐츠 관리</h1>
          <p className="admin-page__desc">
            공지·스토리·언론·연간소식지 등 게시형 콘텐츠를 유형별로 등록·수정·삭제합니다. 대표 이미지와
            카테고리를 함께 관리합니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary">
          새 글 작성
        </button>
      </div>

      <section className="admin-panel" aria-labelledby="content-filter-heading">
        <h2 id="content-filter-heading" className="admin-panel__title">
          콘텐츠 유형
        </h2>
        <div className="admin-segmented">
          {contentTypes.map((t) => (
            <button
              key={t}
              type="button"
              className={`admin-segmented__btn${filterType === t ? ' admin-segmented__btn--active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="admin-panel__foot admin-panel__subnote">
          목록·폼은 API 연동 전입니다. 현재 선택 유형: <strong>{filterType}</strong>
        </p>
      </section>

      <section className="admin-panel" aria-labelledby="content-form-heading">
        <h2 id="content-form-heading" className="admin-panel__title">
          등록·수정 폼 (목업)
        </h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">제목</span>
            <input className="admin-input" type="text" placeholder="제목을 입력하세요" readOnly />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">카테고리</span>
            <select className="admin-input" defaultValue="" disabled aria-disabled="true">
              <option value="">선택</option>
              <option>일정</option>
              <option>현장</option>
              <option>보도자료</option>
              <option>소식지</option>
            </select>
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">대표 이미지</span>
            <div className="admin-upload">
              <div className="admin-upload__preview" aria-hidden>
                <span>미리보기</span>
              </div>
              <div className="admin-upload__actions">
                <button type="button" className="admin-btn admin-btn--ghost" disabled>
                  파일 선택
                </button>
                <button type="button" className="admin-btn admin-btn--ghost" disabled>
                  이미지 제거
                </button>
                <p className="admin-upload__hint">스토리지 연동 후 업로드 가능</p>
              </div>
            </div>
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">본문</span>
            <textarea className="admin-input admin-input--area" readOnly rows={5} placeholder="본문 에디터 영역" />
          </label>
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-btn" disabled>
            임시저장
          </button>
          <button type="button" className="admin-btn admin-btn--primary" disabled>
            게시
          </button>
        </div>
      </section>

      <section className="admin-panel" aria-labelledby="content-list-heading">
        <h2 id="content-list-heading" className="admin-panel__title">
          목록 (샘플 데이터)
        </h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">유형</th>
                <th scope="col">제목</th>
                <th scope="col">카테고리</th>
                <th scope="col">대표 이미지</th>
                <th scope="col">수정일</th>
                <th scope="col">관리</th>
              </tr>
            </thead>
            <tbody>
              {mockRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.type}</td>
                  <td>{row.title}</td>
                  <td>{row.category}</td>
                  <td>
                    <span className="admin-thumb" aria-label="대표 이미지 자리">
                      IMG
                    </span>
                  </td>
                  <td>{row.updatedAt}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost">
                        수정
                      </button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger-ghost">
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
