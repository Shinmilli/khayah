import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminOrgPanel } from './AdminOrgPanel'
import { AdminKayaSectionForms } from './AdminKayaSectionForms'
import { adminFetchKayaPages, adminFetchPageHeroBanners, adminPutKayaPages, adminPutPageHeroBanners } from '../../../services/api'
import type { PageHeroBannersDocument } from '../../page-hero/pageHeroBannerTypes'
import { resetKayaPagesCache } from '../../kaya/useKayaPages'
import type { KayaPagesDocument } from '../../kaya/kayaPagesTypes'

type TabId = 'intro' | 'greet' | 'org' | 'trans'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'intro', label: '카야 소개·CI' },
  { id: 'greet', label: '인사말' },
  { id: 'org', label: '조직도·이사회·전문위원' },
  { id: 'trans', label: '투명경영' },
]

const KAYA_TABS: TabId[] = ['intro', 'greet', 'org', 'trans']

function kayaTab(raw: string | null): TabId {
  return KAYA_TABS.includes(raw as TabId) ? (raw as TabId) : 'intro'
}

export function AdminKayaPagesPage() {
  const [params] = useSearchParams()
  const tab = kayaTab(params.get('tab'))
  const [doc, setDoc] = useState<KayaPagesDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')
  const [orgLocale, setOrgLocale] = useState<'ko' | 'en'>('ko')
  const [hero, setHero] = useState<PageHeroBannersDocument | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [pages, banners] = await Promise.all([
        adminFetchKayaPages(),
        adminFetchPageHeroBanners().catch(() => null),
      ])
      setDoc(pages)
      setHero(banners)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const setField = (key: string, value: string) => {
    setDoc((prev) => (prev ? { ...prev, fields: { ...prev.fields, [key]: value } } : prev))
  }

  const onSave = async () => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutKayaPages(doc)
      setDoc(saved)
      if (hero) setHero(await adminPutPageHeroBanners(hero))
      resetKayaPagesCache()
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

  const label = TABS.find((item) => item.id === tab)?.label ?? ''

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">카야 › {label}</p>
          <h1 className="admin-page__title">{label} 관리</h1>
        </div>
        <div className="admin-page__actions">
          {tab === 'org' ? (
            <div className="admin-org__lang" role="group" aria-label="언어">
              <button type="button" className={orgLocale === 'ko' ? 'is-on' : undefined} onClick={() => setOrgLocale('ko')}>국문</button>
              <button type="button" className={orgLocale === 'en' ? 'is-on' : undefined} onClick={() => setOrgLocale('en')}>영문</button>
            </div>
          ) : null}
          <a className="admin-btn" href={tab === 'greet' ? '/about/greeting' : tab === 'org' ? '/about/org-chart' : tab === 'trans' ? '/about/transparency' : '/about/khayah'} target="_blank" rel="noopener noreferrer">미리보기</a>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-panel__foot">저장됨 ({savedAt})</p> : null}

      {tab === 'intro' || tab === 'greet' || tab === 'trans' ? (
        <AdminKayaSectionForms
          tab={tab}
          doc={doc}
          setField={setField}
          setDoc={(next) => setDoc(next)}
          heroImage={hero?.images.khayah ?? ''}
          onHeroImage={(url) => setHero((prev) => (prev ? { ...prev, images: { ...prev.images, khayah: url } } : prev))}
        />
      ) : null}

      {tab === 'org' ? (
        <AdminOrgPanel
          doc={doc}
          setDoc={setDoc}
          setField={setField}
          locale={orgLocale}
          saving={saving}
          onSave={() => void onSave()}
        />
      ) : null}
    </div>
  )
}
