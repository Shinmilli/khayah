import { useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import type { KayaMember, KayaPagesDocument } from '../../kaya/kayaPagesTypes'

const ROLES = ['이사', '상임이사', '감사', '전문위원'] as const

function newId(): string {
  return `m-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Date.now())}`
}

function fileLabel(url: string): string {
  const name = decodeURIComponent(url.split('?')[0]?.split('/').pop() || '')
  return name || url
}

function termText(row: KayaMember): string {
  if (!row.termStart && !row.termEnd) return '상시'
  return `${row.termStart || '—'} ~ ${row.termEnd || '—'}`
}

export function AdminOrgPanel({
  doc,
  setDoc,
  setField,
  locale,
  onSave,
  saving,
}: {
  doc: KayaPagesDocument
  setDoc: (next: KayaPagesDocument) => void
  setField: (key: string, value: string) => void
  locale: 'ko' | 'en'
  onSave: () => void
  saving: boolean
}) {
  const [filter, setFilter] = useState<'all' | KayaMember['group']>('all')
  const [selectedId, setSelectedId] = useState<string | null>(doc.members[0]?.id ?? null)
  const ordered = doc.members.slice().sort((a, b) => a.order - b.order)
  const visible = ordered.filter((row) => filter === 'all' || row.group === filter)
  const selected = ordered.find((row) => row.id === selectedId) ?? visible[0] ?? null
  const standing = selected ? !selected.termStart && !selected.termEnd : true

  const setMember = (id: string, partial: Partial<KayaMember>) => {
    setDoc({ ...doc, members: doc.members.map((row) => (row.id === id ? { ...row, ...partial } : row)) })
  }

  const addMember = () => {
    const group: KayaMember['group'] = filter === '전문위원회' ? '전문위원회' : '이사회'
    const row: KayaMember = {
      id: newId(),
      group,
      order: ordered.reduce((max, item) => Math.max(max, item.order), 0) + 1,
      enabled: true,
      badge: group === '전문위원회' ? '전문위원' : '이사',
      name: '',
      nameEn: '',
      role: '',
      bio: '',
      bioEn: '',
      showTerm: false,
      termStart: '',
      termEnd: '',
    }
    setDoc({ ...doc, members: [...doc.members, row] })
    setSelectedId(row.id)
  }

  const moveMember = (id: string, beforeId: string | null) => {
    if (!id || id === beforeId) return
    const list = ordered.filter((row) => row.id !== id)
    const moving = ordered.find((row) => row.id === id)
    if (!moving) return
    const index = beforeId ? list.findIndex((row) => row.id === beforeId) : list.length
    list.splice(index < 0 ? list.length : index, 0, moving)
    setDoc({ ...doc, members: list.map((row, itemIndex) => ({ ...row, order: itemIndex + 1 })) })
  }

  return (
    <>
      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">① 조직도 (도식·문구)</h2>
          <span className="admin-org__note">제목·설명 = 텍스트 · 도식 = 이미지</span>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">제목 / 강조 단어</span>
            <input className="admin-input" value={doc.fields['org.title'] ?? ''} onChange={(e) => setField('org.title', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">설명 (줄바꿈 가능)</span>
            <input className="admin-input" value={doc.fields['org.lead'] ?? ''} onChange={(e) => setField('org.lead', e.target.value)} />
          </label>
        </div>
        <AdminMediaUpload
          label="조직도 이미지 올리기 (PC · 모바일)"
          variant="image"
          layout="slot"
          slotTitle="조직도 이미지 올리기 (PC · 모바일)"
          slotRatio="권장 가로 1200px 이상 · JPG/PNG"
          value={doc.fields['org.image'] || null}
          onChange={(url) => setField('org.image', url ?? '')}
        />
        {doc.fields['org.image'] ? <p className="admin-org__current">현재: {fileLabel(doc.fields['org.image'])}</p> : null}
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">대체 텍스트 (검색·접근성용)</span>
          <input className="admin-input" value={doc.fields['org.imageAlt'] ?? ''} onChange={(e) => setField('org.imageAlt', e.target.value)} />
        </label>
        <p className="admin-org__note">제목·설명은 글자로 입력, 도식(원)은 이미지 한 장으로 교체. 부서명이 바뀌면 이미지만 새로 올리면 됨</p>
      </section>

      <div className="admin-org__split">
        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">② 이사회·전문위원 명단</h2>
            <div className="admin-org__tools">
              <div className="admin-segmented" role="group" aria-label="구분 필터">
                {(['all', '이사회', '전문위원회'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`admin-segmented__btn${filter === item ? ' admin-segmented__btn--active' : ''}`}
                    onClick={() => setFilter(item)}
                  >
                    {item === 'all' ? '전체' : item}
                  </button>
                ))}
              </div>
              <button type="button" className="admin-btn admin-btn--primary" onClick={addMember}>
                + 인원 추가
              </button>
            </div>
          </div>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">섹션 제목 / 강조 단어</span>
            <input className="admin-input" value={doc.fields['org.peopleTitle'] ?? ''} onChange={(e) => setField('org.peopleTitle', e.target.value)} />
          </label>
          <div className="admin-org__table-wrap">
            <table className="admin-sheet admin-org__table">
              <thead>
                <tr>
                  <th aria-label="순서 이동" />
                  <th>구분</th>
                  <th>이름</th>
                  <th>직책</th>
                  <th>소속·약력</th>
                  <th>임기</th>
                  <th>표시</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr
                    key={row.id}
                    className={selected?.id === row.id ? 'is-on' : undefined}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('text/plain', row.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault()
                      moveMember(event.dataTransfer.getData('text/plain'), row.id)
                    }}
                  >
                    <td className="admin-org__grip" aria-label="드래그해서 순서 변경">⋮⋮</td>
                    <td>
                      <span className={`admin-org__tag${row.group === '전문위원회' ? ' admin-org__tag--expert' : ''}`}>{row.group}</span>
                    </td>
                    <td className="admin-org__name">{locale === 'en' ? row.nameEn || row.name : row.name}</td>
                    <td>{row.badge}</td>
                    <td className="admin-org__bio">{locale === 'en' ? row.bioEn || row.role : row.role}</td>
                    <td className="admin-org__term">{termText(row)}</td>
                    <td>
                      <label className="admin-onoff">
                        <input
                          type="checkbox"
                          role="switch"
                          checked={row.enabled}
                          aria-label={row.enabled ? '홈페이지 표시 중' : '홈페이지에서 숨김'}
                          onChange={(e) => setMember(row.id, { enabled: e.target.checked })}
                        />
                        <span className="admin-onoff__track" aria-hidden>
                          <span className="admin-onoff__thumb" />
                        </span>
                      </label>
                    </td>
                    <td className="admin-org__manage">
                      <button type="button" onClick={() => setSelectedId(row.id)}>수정</button>
                      <button type="button" onClick={() => setDoc({ ...doc, members: doc.members.filter((item) => item.id !== row.id) })}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="admin-org__note">임기가 끝난 인원은 삭제 대신 표시를 끄면 홈페이지에서만 숨겨집니다. 임기 없이 계속하는 인원은 ‘상시’로 두면 됩니다.</p>
        </section>

        <section className="admin-panel admin-org__editor">
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">인원 수정</h2>
            {selected ? <span className={`admin-org__tag${selected.group === '전문위원회' ? ' admin-org__tag--expert' : ''}`}>{selected.group}</span> : null}
          </div>
          {selected ? (
            <div className="admin-org__form">
              <label className="admin-field">
                <span className="admin-field__label">구분</span>
                <select
                  className="admin-input"
                  value={selected.group}
                  onChange={(e) => setMember(selected.id, { group: e.target.value === '전문위원회' ? '전문위원회' : '이사회' })}
                >
                  <option value="이사회">이사회</option>
                  <option value="전문위원회">전문위원회</option>
                </select>
              </label>
              <div className="admin-org__pair">
                <label className="admin-field">
                  <span className="admin-field__label">이름 (국문)</span>
                  <input className="admin-input" value={selected.name} onChange={(e) => setMember(selected.id, { name: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">이름 (영문)</span>
                  <input className="admin-input" value={selected.nameEn} onChange={(e) => setMember(selected.id, { nameEn: e.target.value })} />
                </label>
              </div>
              <label className="admin-field">
                <span className="admin-field__label">직책</span>
                <select className="admin-input" value={ROLES.includes(selected.badge as (typeof ROLES)[number]) ? selected.badge : ''} onChange={(e) => setMember(selected.id, { badge: e.target.value })}>
                  {!ROLES.includes(selected.badge as (typeof ROLES)[number]) ? <option value={selected.badge}>{selected.badge || '선택'}</option> : null}
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span className="admin-field__label">소속·약력 (국문, 최대 2줄)</span>
                <textarea className="admin-input" rows={2} value={selected.role} onChange={(e) => setMember(selected.id, { role: e.target.value })} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">소속·약력 (영문)</span>
                <textarea className="admin-input" rows={2} value={selected.bioEn ?? ''} onChange={(e) => setMember(selected.id, { bioEn: e.target.value })} />
              </label>
              <fieldset className="admin-org__term-kind">
                <legend>임기 구분</legend>
                <label>
                  <input
                    type="radio"
                    name={`term-${selected.id}`}
                    checked={!standing}
                    onChange={() => {
                      if (standing) setMember(selected.id, { termStart: selected.termStart || '', termEnd: selected.termEnd || ' ' })
                    }}
                  />
                  임기제
                </label>
                <label>
                  <input type="radio" name={`term-${selected.id}`} checked={standing} onChange={() => setMember(selected.id, { termStart: '', termEnd: '', showTerm: false })} />
                  상시 (임기 없음)
                </label>
              </fieldset>
              {!standing ? (
                <div className="admin-org__pair">
                  <label className="admin-field">
                    <span className="admin-field__label">임기 시작</span>
                    <input className="admin-input" placeholder="YYYY.MM" value={selected.termStart} onChange={(e) => setMember(selected.id, { termStart: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">임기 종료</span>
                    <input className="admin-input" placeholder="YYYY.MM" value={selected.termEnd.trim()} onChange={(e) => setMember(selected.id, { termEnd: e.target.value })} />
                  </label>
                </div>
              ) : null}
              <p className="admin-org__note">상시를 고르면 임기 칸이 숨겨지고, 목록에는 ‘상시’로 표시됨</p>
              <label className="admin-org__check">
                <input type="checkbox" checked={Boolean(selected.showTerm)} disabled={standing} onChange={(e) => setMember(selected.id, { showTerm: e.target.checked })} />
                홈페이지에 임기 표시
              </label>
              <label className="admin-org__check">
                <input type="checkbox" checked={selected.enabled} onChange={(e) => setMember(selected.id, { enabled: e.target.checked })} />
                홈페이지에 표시
              </label>
              <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={onSave}>
                {saving ? '저장 중…' : '저장'}
              </button>
            </div>
          ) : (
            <p className="admin-org__note">수정할 인원을 선택하거나 인원을 추가해 주세요.</p>
          )}
        </section>
      </div>
    </>
  )
}
