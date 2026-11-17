import { useCallback, useEffect, useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { adminFetchSiteCommon, adminPutSiteCommon } from '../../../services/api'
import { resetSiteCommonCache } from '../../site/useSiteCommon'
import type { SiteCommonDocument, SiteFooterLink, SitePartner, SiteSlogan } from '../../site/siteCommonTypes'

function reorderRows<T extends { id: string; order: number }>(rows: T[], id: string, beforeId: string): T[] {
  if (!id || id === beforeId) return rows
  const ordered = [...rows].sort((a, b) => a.order - b.order)
  const moving = ordered.find((row) => row.id === id)
  if (!moving) return rows
  const rest = ordered.filter((row) => row.id !== id)
  const index = rest.findIndex((row) => row.id === beforeId)
  rest.splice(index < 0 ? rest.length : index, 0, moving)
  return rest.map((row, rowIndex) => ({ ...row, order: rowIndex + 1 }))
}

function newId(prefix: string): string {
  return `${prefix}-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Date.now())}`
}

function OnOff({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <div className="admin-segmented admin-segmented--tight" role="group" aria-label={label}>
      <button
        type="button"
        className={`admin-segmented__btn${enabled ? ' admin-segmented__btn--active' : ''}`}
        onClick={() => onChange(true)}
      >
        ON
      </button>
      <button
        type="button"
        className={`admin-segmented__btn${!enabled ? ' admin-segmented__btn--active' : ''}`}
        onClick={() => onChange(false)}
      >
        OFF
      </button>
    </div>
  )
}

export function AdminSiteCommonPage() {
  const [doc, setDoc] = useState<SiteCommonDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setDoc(await adminFetchSiteCommon())
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!doc) return
    const id = window.location.hash.replace('#', '')
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [doc])

  const patch = (next: SiteCommonDocument) => setDoc(next)

  const onSave = async () => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutSiteCommon(doc)
      setDoc(saved)
      resetSiteCommonCache()
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !doc) {
    return (
      <div className="admin-page">
        <p className="admin-panel__foot">{error || '불러오는 중…'}</p>
      </div>
    )
  }

  const setOrg = (key: keyof SiteCommonDocument['org'], value: string) =>
    patch({ ...doc, org: { ...doc.org, [key]: value } })

  const setLink = (id: string, partial: Partial<SiteFooterLink>) =>
    patch({
      ...doc,
      footerLinks: doc.footerLinks.map((row) => (row.id === id ? { ...row, ...partial } : row)),
    })

  const setPartner = (id: string, partial: Partial<SitePartner>) =>
    patch({
      ...doc,
      partners: doc.partners.map((row) => (row.id === id ? { ...row, ...partial } : row)),
    })

  const setSlogan = (id: string, partial: Partial<SiteSlogan>) =>
    patch({
      ...doc,
      logo: {
        ...doc.logo,
        slogansKo: doc.logo.slogansKo.map((row) => (row.id === id ? { ...row, ...partial } : row)),
      },
    })

  const stories = doc.homeStories ?? {
    featured: '',
    rest: 'auto' as const,
    manual: ['', '', ''],
    blog: { image: '', href: '' },
    instagram: { image: '', href: '' },
    youtube: { image: '', href: '' },
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">메인 · 사이트 설정</p>
          <h1 className="admin-page__title">사이트 공통 관리</h1>
        </div>
        <div className="admin-page__actions">
          <a className="admin-btn" href="/" target="_blank" rel="noopener noreferrer">미리보기</a>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-panel__foot">저장됨 ({savedAt})</p> : null}

      <section id="stories" className="admin-panel">
        <h2 className="admin-panel__title">③ 스토리 · 현장의 기록</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">대표 사례 글</span>
            <input className="admin-input" value={stories.featured} onChange={(e) => patch({ ...doc, homeStories: { ...stories, featured: e.target.value } })} />
          </label>
          <div className="admin-field">
            <span className="admin-field__label">나머지 카드</span>
            <div className="admin-segmented">
              <button type="button" className={`admin-segmented__btn${stories.rest === 'auto' ? ' admin-segmented__btn--active' : ''}`} onClick={() => patch({ ...doc, homeStories: { ...stories, rest: 'auto' } })}>최신 글 3개 자동</button>
              <button type="button" className={`admin-segmented__btn${stories.rest === 'manual' ? ' admin-segmented__btn--active' : ''}`} onClick={() => patch({ ...doc, homeStories: { ...stories, rest: 'manual' } })}>직접 선택</button>
            </div>
          </div>
          {stories.rest === 'manual'
            ? [0, 1, 2].map((index) => (
                <label key={index} className="admin-field">
                  <span className="admin-field__label">카드 {index + 1} 글 제목</span>
                  <input
                    className="admin-input"
                    value={stories.manual?.[index] ?? ''}
                    onChange={(e) => {
                      const manual = [stories.manual?.[0] ?? '', stories.manual?.[1] ?? '', stories.manual?.[2] ?? '']
                      manual[index] = e.target.value
                      patch({ ...doc, homeStories: { ...stories, manual } })
                    }}
                  />
                </label>
              ))
            : null}
        </div>
        {(['blog', 'instagram', 'youtube'] as const).map((key) => (
          <div key={key} className="admin-item">
            <b style={{ flex: '0 0 110px', fontSize: 13 }}>{key === 'blog' ? '네이버 블로그' : key === 'instagram' ? '인스타그램' : '유튜브'}</b>
            <AdminMediaUpload layout="slot" slotTitle="고정 썸네일" slotRatio="logo" label="고정 썸네일" variant="image" value={stories[key].image || null} onChange={(url) => patch({ ...doc, homeStories: { ...stories, [key]: { ...stories[key], image: url ?? '' } } })} />
            <label className="admin-field" style={{ flex: '1 1 220px' }}>
              <span className="admin-field__label">주소</span>
              <input className="admin-input" value={stories[key].href} onChange={(e) => patch({ ...doc, homeStories: { ...stories, [key]: { ...stories[key], href: e.target.value } } })} />
            </label>
          </div>
        ))}
      </section>

      <section id="partners" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">④ 협력기관 로고</h2>
          <button
            type="button"
            className="admin-btn"
            style={{ color: 'var(--adm-wine)', borderStyle: 'dashed', borderColor: '#e3b3bd' }}
            onClick={() =>
              patch({
                ...doc,
                partners: [
                  ...doc.partners,
                  { id: newId('p'), order: doc.partners.length + 1, enabled: true, logo: '', nameKo: '', nameEn: '', kind: '', href: '' },
                ],
              })
            }
          >
            + 기관 추가
          </button>
        </div>
        {doc.partners
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((row) => (
            <div
              key={row.id}
              className="admin-item"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('text/plain')
                patch({ ...doc, partners: reorderRows(doc.partners, id, row.id) })
              }}
            >
              <span className="admin-org__grip" draggable aria-label="순서 변경" onDragStart={(e) => e.dataTransfer.setData('text/plain', row.id)}>⋮⋮</span>
              <AdminMediaUpload layout="slot" slotTitle="로고" slotRatio="logo" label="로고" variant="image" value={row.logo || null} onChange={(url) => setPartner(row.id, { logo: url ?? '' })} />
              <div className="admin-form-grid" style={{ flex: '1 1 360px' }}>
                <label className="admin-field">
                  <span className="admin-field__label">기관명 (국문)</span>
                  <input className="admin-input" value={row.nameKo} onChange={(e) => setPartner(row.id, { nameKo: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">기관명 (영문)</span>
                  <input className="admin-input" value={row.nameEn} onChange={(e) => setPartner(row.id, { nameEn: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">유형 · 국가</span>
                  <input className="admin-input" value={row.kind} onChange={(e) => setPartner(row.id, { kind: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">링크 (선택)</span>
                  <input className="admin-input" value={row.href} onChange={(e) => setPartner(row.id, { href: e.target.value })} />
                </label>
              </div>
              <label className="admin-org__check">
                <input type="checkbox" checked={row.enabled} onChange={(e) => setPartner(row.id, { enabled: e.target.checked })} />
                표시
              </label>
            </div>
          ))}
      </section>

      <section id="org" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">⑤ 기관 정보 · 푸터</h2>
          <span className="admin-panel__foot">한 곳 수정 → 전체 반영</span>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">기관명</span>
            <input className="admin-input" value={doc.org.nameKo} onChange={(e) => setOrg('nameKo', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">대표자</span>
            <input className="admin-input" value={doc.org.representative} onChange={(e) => setOrg('representative', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">고유번호</span>
            <input className="admin-input" value={doc.org.registrationNo} onChange={(e) => setOrg('registrationNo', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">주소 (국문)</span>
            <input className="admin-input" value={doc.org.addressKo} onChange={(e) => setOrg('addressKo', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">주소 (영문)</span>
            <input className="admin-input" value={doc.org.addressEn} onChange={(e) => setOrg('addressEn', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">전화 · 팩스</span>
            <input className="admin-input" value={doc.org.phoneFax} onChange={(e) => setOrg('phoneFax', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">이메일</span>
            <input className="admin-input" value={doc.org.email} onChange={(e) => setOrg('email', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">후원 계좌 · SWIFT</span>
            <textarea className="admin-input admin-input--area" rows={5} value={doc.org.accounts} onChange={(e) => setOrg('accounts', e.target.value)} />
          </label>
        </div>
        <div className="admin-item" style={{ alignItems: 'center' }}>
          <b style={{ flex: '0 0 110px', fontSize: 13 }}>하단 링크</b>
          <span style={{ flex: '1 1 220px', fontSize: 14, lineHeight: 1.7 }}>
            {doc.footerLinks
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((row) => row.labelKo || '이름 없음')
              .join(' · ')}
          </span>
        </div>
        {doc.footerLinks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((row) => (
            <div
              key={row.id}
              className="admin-item"
              style={{ alignItems: 'center' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('text/plain')
                patch({ ...doc, footerLinks: reorderRows(doc.footerLinks, id, row.id) })
              }}
            >
              <span className="admin-org__grip" draggable aria-label="순서 변경" onDragStart={(e) => e.dataTransfer.setData('text/plain', row.id)}>⋮⋮</span>
              <input className="admin-input" style={{ flex: '1 1 140px', width: 'auto' }} aria-label="문구" value={row.labelKo} onChange={(e) => setLink(row.id, { labelKo: e.target.value })} />
              <input className="admin-input" style={{ flex: '1 1 140px', width: 'auto' }} aria-label="문구 영문" value={row.labelEn} onChange={(e) => setLink(row.id, { labelEn: e.target.value })} />
              <input className="admin-input" style={{ flex: '1 1 180px', width: 'auto' }} aria-label="링크" value={row.href} onChange={(e) => setLink(row.id, { href: e.target.value })} />
              <label className="admin-org__check">
                <input type="checkbox" checked={row.enabled} onChange={(e) => setLink(row.id, { enabled: e.target.checked })} />
                표시
              </label>
            </div>
          ))}
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() =>
            patch({
              ...doc,
              footerLinks: [
                ...doc.footerLinks,
                { id: newId('fl'), order: doc.footerLinks.length + 1, enabled: true, labelKo: '', labelEn: '', href: '' },
              ],
            })
          }
        >
          + 링크 추가
        </button>
      </section>

      <section id="clicker" className="admin-panel">
        <h2 className="admin-panel__title">⑥ 클릭커 · 후원하기 버튼</h2>
        {doc.clickers
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((row) => (
            <div
              key={row.id}
              className="admin-item"
              style={{ alignItems: 'center' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('text/plain')
                patch({ ...doc, clickers: reorderRows(doc.clickers, id, row.id) })
              }}
            >
              <span className="admin-org__grip" draggable aria-label="순서 변경" onDragStart={(e) => e.dataTransfer.setData('text/plain', row.id)}>⋮⋮</span>
              <b style={{ flex: '0 0 110px', fontSize: 13 }}>{row.labelKo || row.id}</b>
              <input
                className="admin-input"
                style={{ flex: '1 1 220px', width: 'auto' }}
                aria-label={`${row.labelKo} 주소`}
                placeholder={row.id === 'donate' ? '해피나눔 주소 (후원 공통 설정에서 불러옴)' : ''}
                value={row.href}
                onChange={(e) =>
                  patch({
                    ...doc,
                    clickers: doc.clickers.map((item) => (item.id === row.id ? { ...item, href: e.target.value } : item)),
                  })
                }
              />
              <label className="admin-org__check">
                <input
                  type="checkbox"
                  checked={row.enabled}
                  onChange={(e) =>
                    patch({
                      ...doc,
                      clickers: doc.clickers.map((item) => (item.id === row.id ? { ...item, enabled: e.target.checked } : item)),
                    })
                  }
                />
                표시
              </label>
            </div>
          ))}
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">상단 후원하기 버튼 문구</span>
            <input
              className="admin-input"
              value={doc.headerDonate.labelKo}
              maxLength={20}
              onChange={(e) => patch({ ...doc, headerDonate: { ...doc.headerDonate, labelKo: e.target.value } })}
            />
          </label>
          <div className="admin-field">
            <span className="admin-field__label">상단 고정</span>
            <OnOff
              enabled={doc.headerDonate.pinned}
              label="상단 후원하기 고정"
              onChange={(pinned) => patch({ ...doc, headerDonate: { ...doc.headerDonate, pinned } })}
            />
          </div>
        </div>
      </section>

      <details className="admin-panel admin-fold">
        <summary className="admin-fold__summary">상단 로고 · 슬로건 순환</summary>
        <div className="admin-form-grid">
          <AdminMediaUpload
            label="로고 이미지 (국문)"
            variant="image"
            value={doc.logo.imageKo || null}
            onChange={(url) => patch({ ...doc, logo: { ...doc.logo, imageKo: url ?? '' } })}
          />
          <AdminMediaUpload
            label="로고 이미지 (영문)"
            variant="image"
            value={doc.logo.imageEn || null}
            onChange={(url) => patch({ ...doc, logo: { ...doc.logo, imageEn: url ?? '' } })}
          />
          <div className="admin-field">
            <span className="admin-field__label">순환</span>
            <OnOff
              enabled={doc.logo.rotate}
              label="로고 슬로건 순환"
              onChange={(rotate) => patch({ ...doc, logo: { ...doc.logo, rotate } })}
            />
          </div>
          <label className="admin-field">
            <span className="admin-field__label">전환 간격</span>
            <input
              className="admin-input"
              type="number"
              min={1}
              max={30}
              value={doc.logo.intervalSec}
              onChange={(e) =>
                patch({ ...doc, logo: { ...doc.logo, intervalSec: parseInt(e.target.value, 10) || 3 } })
              }
            />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">영문 슬로건</span>
            <input
              className="admin-input"
              value={doc.logo.sloganEn}
              maxLength={20}
              onChange={(e) => patch({ ...doc, logo: { ...doc.logo, sloganEn: e.target.value } })}
            />
          </label>
        </div>
        <h3 className="admin-subpanel__title">순환 문구</h3>
        <p className="admin-fieldset__hint">약 20자</p>
        {doc.logo.slogansKo
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((row) => (
            <div key={row.id} className="admin-form-grid" style={{ marginBottom: 12 }}>
              <label className="admin-field">
                <span className="admin-field__label">순서</span>
                <input className="admin-input" type="number" value={row.order} onChange={(e) => setSlogan(row.id, { order: parseInt(e.target.value, 10) || row.order })} />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">순환 문구</span>
                <input className="admin-input" maxLength={20} value={row.text} onChange={(e) => setSlogan(row.id, { text: e.target.value })} />
              </label>
              <button
                type="button"
                className="admin-btn admin-btn--danger-ghost"
                onClick={() =>
                  patch({
                    ...doc,
                    logo: { ...doc.logo, slogansKo: doc.logo.slogansKo.filter((item) => item.id !== row.id) },
                  })
                }
              >
                삭제
              </button>
            </div>
          ))}
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() =>
            patch({
              ...doc,
              logo: {
                ...doc.logo,
                slogansKo: [...doc.logo.slogansKo, { id: newId('s'), order: doc.logo.slogansKo.length + 1, text: '' }],
              },
            })
          }
        >
          문구 추가
        </button>
      </details>
    </div>
  )
}
