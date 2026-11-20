import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminOrgPanel } from './AdminOrgPanel'
import { AdminKayaSectionForms } from './AdminKayaSectionForms'
import { AdminSaveActions, draftStatus, takeUnpublished } from '../AdminSaveActions'
import { adminFetchFinancialReports, adminFetchKayaPages, adminFetchPageHeroBanners, adminPutFinancialReports, adminPutKayaPages, adminPutPageHeroBanners, type SaveMode } from '../../../services/api'
import type { FinancialReportsDocument } from '../../financial-report/financialReportTypes'
import type { PageHeroBannersDocument } from '../../page-hero/pageHeroBannerTypes'
import { resetKayaPagesCache } from '../../kaya/useKayaPages'
import type { KayaPagesDocument } from '../../kaya/kayaPagesTypes'

type TabId = 'intro' | 'greet' | 'org' | 'trans' | 'location'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'intro', label: '카야 소개·CI' },
  { id: 'greet', label: '인사말' },
  { id: 'org', label: '조직도·이사회·전문위원' },
  { id: 'trans', label: '투명경영' },
  { id: 'location', label: '오시는 길' },
]

const KAYA_TABS: TabId[] = ['intro', 'greet', 'org', 'trans', 'location']

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
  const [savedMode, setSavedMode] = useState<SaveMode | ''>('')
  const [unpublished, setUnpublished] = useState(false)
  const [orgLocale, setOrgLocale] = useState<'ko' | 'en'>('ko')
  const [hero, setHero] = useState<PageHeroBannersDocument | null>(null)
  const [finance, setFinance] = useState<FinancialReportsDocument | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [pages, banners, reports] = await Promise.all([
        adminFetchKayaPages(),
        adminFetchPageHeroBanners().catch(() => null),
        adminFetchFinancialReports().catch(() => null),
      ])
      const loaded = takeUnpublished(pages)
      setDoc(loaded.doc)
      setUnpublished(loaded.unpublished)
      setHero(banners ? takeUnpublished(banners).doc : null)
      setFinance(reports ? takeUnpublished(reports).doc : null)
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

  const onSave = async (mode: SaveMode) => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = takeUnpublished(await adminPutKayaPages(doc, mode))
      setDoc(saved.doc)
      setUnpublished(saved.unpublished)
      setSavedMode(mode)
      if (hero) setHero(takeUnpublished(await adminPutPageHeroBanners(hero, mode)).doc)
      if (tab === 'trans' && finance) setFinance(takeUnpublished(await adminPutFinancialReports(finance, mode)).doc)
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
          <a className="admin-btn" href={tab === 'greet' ? '/about/greeting' : tab === 'org' ? '/about/org-chart' : tab === 'trans' ? '/about/transparency' : tab === 'location' ? '/about/location' : '/about/khayah'} target="_blank" rel="noopener noreferrer">미리보기</a>
          <AdminSaveActions saving={saving} onSave={(mode) => void onSave(mode)} />
        </div>
      </div>
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {draftStatus(unpublished, savedAt, savedMode) ? <p className="admin-panel__foot">{draftStatus(unpublished, savedAt, savedMode)}</p> : null}

      {tab === 'intro' || tab === 'greet' || tab === 'trans' || tab === 'location' ? (
        <AdminKayaSectionForms
          tab={tab}
          doc={doc}
          setField={setField}
          setDoc={(next) => setDoc(next)}
          heroImage={hero?.images.khayah ?? ''}
          onHeroImage={(url) => setHero((prev) => (prev ? { ...prev, images: { ...prev.images, khayah: url } } : prev))}
          finance={finance}
          setFinance={setFinance}
        />
      ) : null}

      {tab === 'org' ? (
        <AdminOrgPanel
          doc={doc}
          setDoc={setDoc}
          setField={setField}
          locale={orgLocale}
          saving={saving}
          onSave={() => void onSave('publish')}
          onDraft={() => void onSave('draft')}
        />
      ) : null}
    </div>
  )
}
