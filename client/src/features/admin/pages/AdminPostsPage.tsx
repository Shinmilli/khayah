import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AdminRichTextEditor } from '../components/AdminRichTextEditor'
import type { AdminRichTextEditorHandle } from '../components/AdminRichTextEditor'
import {
  adminCreatePost,
  adminDeletePost,
  adminFetchPostsByKind,
  adminUpdatePost,
  deleteUploadedMedia,
  uploadDocumentPdf,
  uploadReportImage,
} from '../../../services/api'
import type { AdminPost, DocumentUploadResult } from '../../../services/api'
import { PdfFirstPagePreview } from '../../../components/PdfFirstPagePreview'
import { coverIsBlank, parsePdfAttachments, type PdfAttachment } from '../../../utils/pdfAttachments'
import {
  formatNewsletterYearMeta,
  parseNewsletterYearSpec,
} from '../../../utils/newsletterYear'

const contentTypes = ['스토리', '공지사항', '활동소식', '연간소식지', '언론보도', '진행사업'] as const
type ContentType = (typeof contentTypes)[number]

type YearlyNewsletterMode = '글쓰기' | 'PDF소식지'

/** 스토리 선택 시 필수 구분 (홈 스토리 칩과 대응) */
const storyPostScopes = ['국내', '해외', '옹호', '진행'] as const
type StoryPostScope = (typeof storyPostScopes)[number]

const projectRegions = ['네팔', '키르기즈스탄', '미얀마', '국내'] as const
type ProjectRegion = (typeof projectRegions)[number]

type View = 'list' | 'editor'

function adminPressMetaDate(row: AdminPost): string {
  const d = row.meta?.khayah_press_date?.trim()
  if (d && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10)
  return row.publishedAt.slice(0, 10)
}

function PostTypeSegmentedSection({
  headingId,
  value,
  onChange,
  footer,
  disabled = false,
}: {
  headingId: string
  value: ContentType
  onChange: (t: ContentType) => void
  footer: ReactNode
  disabled?: boolean
}) {
  return (
    <section className="admin-panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="admin-panel__title">
        게시글 유형
      </h2>
      <div className="admin-segmented" role="group" aria-label="게시글 유형">
        {contentTypes.map((t) => (
          <button
            key={t}
            type="button"
            className={`admin-segmented__btn${value === t ? ' admin-segmented__btn--active' : ''}`}
            onClick={() => onChange(t)}
            disabled={disabled}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="admin-panel__foot admin-panel__subnote">{footer}</p>
    </section>
  )
}

function todayYmd(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function publishedAtYmd(iso?: string): string {
  if (iso && /^\d{4}-\d{2}-\d{2}/.test(iso)) return iso.slice(0, 10)
  return todayYmd()
}

function attachmentFromUpload(result: DocumentUploadResult): PdfAttachment {
  return {
    url: result.url,
    name: result.originalName || result.filename || '문서.pdf',
    publicId: result.publicId,
    path: result.path,
    provider: result.provider,
    resourceType: result.resourceType,
    size: result.size,
  }
}

function PostEditorForm({
  mode,
  initialPostType,
  initialTitle,
  initialStoryScope,
  initialPostId,
  initialMeta,
  initialContentHtml,
  initialPublishedAt,
  onClose,
  onSaved,
}: {
  mode: 'new' | 'edit'
  initialPostType: ContentType
  initialTitle: string
  initialStoryScope: StoryPostScope | null
  initialPostId: number | null
  initialMeta: Record<string, string>
  initialContentHtml: string
  initialPublishedAt: string
  onClose: () => void
  onSaved: () => void
}) {
  const titleHeading = mode === 'new' ? '새 글 작성' : '게시글 수정'
  const isEditLocked = mode === 'edit'
  const [postType, setPostType] = useState<ContentType>(initialPostType)
  const [storyScope, setStoryScope] = useState<StoryPostScope | null>(() =>
    initialPostType === '스토리' ? initialStoryScope : null,
  )
  const [projectRegion, setProjectRegion] = useState<ProjectRegion | null>(null)
  const [yearlyMode, setYearlyMode] = useState<YearlyNewsletterMode>('글쓰기')
  const [title, setTitle] = useState<string>(initialTitle)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string>('')
  const [docStatus, setDocStatus] = useState<string>(
    'PDF 선택 시 자동 업로드 (10MB 이하는 Cloudinary, 초과는 Supabase)',
  )
  const [docUploading, setDocUploading] = useState(false)
  const [pdfFiles, setPdfFiles] = useState<PdfAttachment[]>(() => parsePdfAttachments(initialMeta))
  const [selectedPdfUrls, setSelectedPdfUrls] = useState<string[]>([])
  const [pdfDropOver, setPdfDropOver] = useState(false)
  const [coverBlank, setCoverBlank] = useState(() => coverIsBlank(initialMeta))
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('')
  const [coverImageUploading, setCoverImageUploading] = useState(false)
  const [pressTitle, setPressTitle] = useState<string>('')
  const [pressPublisher, setPressPublisher] = useState<string>('')
  const [pressUrl, setPressUrl] = useState<string>('')
  const [pressDate, setPressDate] = useState<string>('') // YYYY-MM-DD
  const prevPostType = useRef(postType)
  const richRef = useRef<AdminRichTextEditorHandle | null>(null)
  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const [shortBody, setShortBody] = useState<string>('') // yearly pdf mode short body
  const [newsletterIssue, setNewsletterIssue] = useState<string>('') // khayah_newsletter_issue
  const [publishedDate, setPublishedDate] = useState<string>(() =>
    mode === 'edit' ? publishedAtYmd(initialPublishedAt) : todayYmd(),
  )
  const [newsletterYearRange, setNewsletterYearRange] = useState<boolean>(() => {
    const spec = parseNewsletterYearSpec((initialMeta.khayah_newsletter_year ?? '').trim())
    return Boolean(spec && spec.start !== spec.end)
  })
  const [newsletterYear, setNewsletterYear] = useState<string>(() => {
    const spec = parseNewsletterYearSpec((initialMeta.khayah_newsletter_year ?? '').trim())
    if (spec) return String(spec.start)
    if (initialPostType === '연간소식지') return String(new Date().getFullYear())
    return ''
  })
  const [newsletterYearEnd, setNewsletterYearEnd] = useState<string>(() => {
    const spec = parseNewsletterYearSpec((initialMeta.khayah_newsletter_year ?? '').trim())
    if (spec && spec.start !== spec.end) return String(spec.end)
    return ''
  })

  useEffect(() => {
    if (postType !== '스토리') {
      setStoryScope(null)
    } else if (prevPostType.current !== '스토리') {
      setStoryScope(null)
    }
    if (postType !== '진행사업') {
      setProjectRegion(null)
    } else if (prevPostType.current !== '진행사업') {
      setProjectRegion(null)
    }
    if (postType !== '연간소식지') {
      setYearlyMode('글쓰기')
      setDocStatus('PDF 선택 시 자동 업로드 (10MB 이하는 Cloudinary, 초과는 Supabase)')
      setNewsletterIssue('')
    } else if (prevPostType.current !== '연간소식지') {
      setNewsletterYear(String(new Date().getFullYear()))
      setNewsletterYearEnd('')
      setNewsletterYearRange(false)
    }
    if (postType !== '연간소식지' && postType !== '활동소식' && postType !== '스토리') {
      setCoverFile(null)
      setCoverPreviewUrl('')
    }
    if (postType !== '언론보도') {
      setPressTitle('')
      setPressPublisher('')
      setPressUrl('')
      setPressDate('')
    }
    prevPostType.current = postType
  }, [postType])

  useEffect(() => {
    // hydrate meta-backed fields when opening editor
    if (initialPostType === '연간소식지') {
      const m = initialMeta.khayah_newsletter_mode
      if (m === 'PDF 업로드 모드' || m === 'PDF소식지') setYearlyMode('PDF소식지')
      if (m === '글쓰기 모드' || m === '글쓰기') setYearlyMode('글쓰기')
      if (initialMeta.khayah_cover_url) setCoverPreviewUrl(initialMeta.khayah_cover_url)
      if (initialMeta.khayah_newsletter_issue) setNewsletterIssue(initialMeta.khayah_newsletter_issue)
      const yy = (initialMeta.khayah_newsletter_year ?? '').trim()
      const spec = parseNewsletterYearSpec(yy)
      if (spec) {
        setNewsletterYear(String(spec.start))
        if (spec.start !== spec.end) {
          setNewsletterYearRange(true)
          setNewsletterYearEnd(String(spec.end))
        }
      }
    }
    if (initialPostType === '활동소식' || initialPostType === '스토리') {
      if (initialMeta.khayah_cover_url) setCoverPreviewUrl(initialMeta.khayah_cover_url)
    }
    if (initialPostType === '언론보도') {
      setPressTitle(initialMeta.khayah_press_title ?? '')
      setPressPublisher(initialMeta.khayah_press_publisher ?? '')
      setPressUrl(initialMeta.khayah_press_url ?? '')
      setPressDate(initialMeta.khayah_press_date ?? '')
    }
    if (initialPostType === '스토리') {
      const s = initialMeta.khayah_story_scope as StoryPostScope | undefined
      if (s && storyPostScopes.includes(s)) setStoryScope(s)
    }
    if (initialPostType === '진행사업') {
      const r = initialMeta.khayah_project_region as ProjectRegion | undefined
      if (r && projectRegions.includes(r)) setProjectRegion(r)
    }
    setShortBody(initialContentHtml ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!coverFile) return
    const url = URL.createObjectURL(coverFile)
    setCoverPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  const onPickPdf = async (file: File | null) => {
    if (!file) return
    setDocUploading(true)
    setDocStatus(`업로드 중… ${file.name}`)
    try {
      const result = await uploadDocumentPdf(file)
      const att = attachmentFromUpload(result)
      if (postType === '연간소식지') {
        const prev = pdfFiles[0]
        if (prev?.url && prev.url !== att.url) {
          void deleteUploadedMedia(prev).catch(() => undefined)
        }
        setPdfFiles([att])
        setSelectedPdfUrls([])
      } else {
        setPdfFiles((list) => [...list, att])
      }
      setDocStatus(`업로드 완료: ${att.name}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '업로드 실패'
      setDocStatus(msg)
    } finally {
      setDocUploading(false)
    }
  }

  const onRemoveSelectedPdfs = async () => {
    const pick = new Set(selectedPdfUrls)
    if (pick.size === 0) return
    const removing = pdfFiles.filter((f) => pick.has(f.url))
    setDocUploading(true)
    try {
      await Promise.all(removing.map((f) => deleteUploadedMedia(f).catch(() => undefined)))
      setPdfFiles((list) => list.filter((f) => !pick.has(f.url)))
      setSelectedPdfUrls([])
      setDocStatus('선택한 PDF를 제거했습니다.')
    } finally {
      setDocUploading(false)
    }
  }

  const onPdfFilesFromDrop = (list: FileList | null) => {
    if (!list?.length || docUploading) return
    const pdfs = Array.from(list).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
    )
    if (pdfs.length === 0) {
      setDocStatus('PDF 파일만 올릴 수 있습니다.')
      return
    }
    if (postType === '연간소식지') {
      void onPickPdf(pdfs[0] ?? null)
      return
    }
    void (async () => {
      for (const f of pdfs) {
        await onPickPdf(f)
      }
    })()
  }

  const onRemoveAllNewsletterPdf = async () => {
    const prev = pdfFiles[0]
    if (prev) void deleteUploadedMedia(prev).catch(() => undefined)
    setPdfFiles([])
    setSelectedPdfUrls([])
    setDocStatus('PDF 선택 시 자동 업로드 (10MB 이하는 Cloudinary, 초과는 Supabase)')
  }

  const onPickCoverImageUpload = async (file: File | null) => {
    if (!file) return
    setCoverImageUploading(true)
    setSaveError('')
    try {
      const result = await uploadReportImage(file)
      setCoverPreviewUrl(result.url)
      setCoverFile(null)
      setCoverBlank(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '이미지 업로드 실패'
      setSaveError(msg)
    } finally {
      setCoverImageUploading(false)
    }
  }

  const onSave = async () => {
    setSaveError('')
    if (postType !== '언론보도' && !title.trim()) {
      setSaveError('제목을 입력해 주세요.')
      return
    }
    if (postType === '스토리' && !storyScope) {
      setSaveError('스토리 게시 유형(국내/해외/옹호/진행)을 선택해 주세요.')
      return
    }
    if (postType === '진행사업' && !projectRegion) {
      setSaveError('진행사업 지역(네팔/키르기즈스탄/미얀마/국내)을 선택해 주세요.')
      return
    }
    if (postType === '연간소식지' && yearlyMode === 'PDF소식지' && pdfFiles.length === 0) {
      setSaveError('PDF 업로드 후 링크가 생성되어야 합니다.')
      return
    }
    if (postType === '연간소식지') {
      if (!/^\d{4}$/.test(newsletterYear.trim())) {
        setSaveError('소식지 연도는 네 자리 숫자(예: 2026)로 입력해 주세요.')
        return
      }
      if (newsletterYearRange) {
        if (!/^\d{4}$/.test(newsletterYearEnd.trim())) {
          setSaveError('종료 연도를 네 자리 숫자로 입력해 주세요.')
          return
        }
        if (parseInt(newsletterYearEnd, 10) < parseInt(newsletterYear, 10)) {
          setSaveError('종료 연도는 시작 연도보다 같거나 커야 합니다.')
          return
        }
      }
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedDate.trim())) {
      setSaveError('게시 날짜를 선택해 주세요.')
      return
    }
    if (postType === '언론보도') {
      if (!pressTitle.trim()) {
        setSaveError('기사 제목을 입력해 주세요.')
        return
      }
      if (!pressPublisher.trim()) {
        setSaveError('신문사를 입력해 주세요.')
        return
      }
      if (!pressUrl.trim()) {
        setSaveError('기사 URL을 입력해 주세요.')
        return
      }
      if (!pressDate.trim()) {
        setSaveError('기사 날짜를 선택해 주세요.')
        return
      }
    }

    setSaving(true)
    try {
      const meta: Record<string, string> = {
        khayah_kind: postType,
      }

      if (postType === '공지사항') {
        meta.khayah_notice = 'true'
      }
      if (postType === '스토리' && storyScope) {
        meta.khayah_story_scope = storyScope
      }
      if (postType === '진행사업' && projectRegion) {
        meta.khayah_project_region = projectRegion
      }
      if (postType === '연간소식지') {
        meta.khayah_newsletter_mode = yearlyMode === '글쓰기' ? '글쓰기 모드' : 'PDF 업로드 모드'
        const yStart = parseInt(newsletterYear.trim(), 10)
        const yEnd = newsletterYearRange ? parseInt(newsletterYearEnd.trim(), 10) : yStart
        meta.khayah_newsletter_year = formatNewsletterYearMeta(yStart, yEnd)
        meta.khayah_newsletter_issue = newsletterIssue.trim()
      }
      const storedCover =
        coverPreviewUrl.trim() && !coverPreviewUrl.startsWith('blob:') ? coverPreviewUrl.trim() : ''
      if (postType === '연간소식지' || postType === '활동소식' || postType === '스토리') {
        meta.khayah_cover_url = storedCover
        meta.khayah_cover_blank = coverBlank ? 'true' : ''
      }
      if (postType !== '언론보도') {
        const filesToStore = postType === '연간소식지' ? pdfFiles.slice(0, 1) : pdfFiles
        meta.khayah_pdf_files = JSON.stringify(filesToStore)
        meta.khayah_pdf_url = filesToStore[0]?.url ?? ''
        meta.khayah_pdf_name = filesToStore[0]?.name ?? ''
      }
      if (postType === '언론보도') {
        meta.khayah_press_title = pressTitle.trim()
        meta.khayah_press_publisher = pressPublisher.trim()
        meta.khayah_press_url = pressUrl.trim()
        meta.khayah_press_date = pressDate.trim()
      }

      const content =
        postType === '언론보도'
          ? ''
          : postType === '연간소식지' && yearlyMode === 'PDF소식지'
            ? shortBody
            : richRef.current?.getHtml() ?? ''

      const deriveExcerpt = (html: string): string => {
        const text = html
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        return text.slice(0, 60)
      }

      const excerptAuto = postType === '언론보도' ? '' : deriveExcerpt(content)

      const resolvedTitle =
        postType === '언론보도'
          ? `[${pressPublisher.trim()}] ${pressTitle.trim()}`
          : title.trim()

      if (mode === 'new') {
        await adminCreatePost({
          kind: postType,
          title: resolvedTitle,
          excerpt: excerptAuto,
          content,
          status: 'publish',
          meta,
          publishedAt: publishedDate.trim(),
        })
      } else {
        if (!initialPostId) throw new Error('Missing post id')
        await adminUpdatePost(initialPostId, {
          title: resolvedTitle,
          excerpt: excerptAuto,
          content,
          status: 'publish',
          meta,
          publishedAt: publishedDate.trim(),
        })
      }
      onSaved()
      onClose()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '저장 실패'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__editor-top">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
          ← 목록으로
        </button>
      </div>

      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">{titleHeading}</h1>
          {mode === 'edit' ? <p className="admin-page__desc">수정 중: {initialTitle}</p> : null}
        </div>
      </div>

      <PostTypeSegmentedSection
        headingId="editor-post-type-heading"
        value={postType}
        onChange={(t) => {
          if (isEditLocked) return
          setPostType(t)
        }}
        disabled={isEditLocked}
        footer={
          <>
            이 화면에서 고른 유형이 글에 적용됩니다. 목록의「게시글 유형」은 필터 전용으로 따로
            동작합니다.
          </>
        }
      />

      <section className="admin-panel" aria-labelledby="post-editor-form-heading">
        <h2 id="post-editor-form-heading" className="admin-panel__title">
          등록·수정
        </h2>
        <div className="admin-form-grid">
          {postType === '연간소식지' ? (
            <div className="admin-field admin-field--full">
              <span className="admin-field__label">연간소식지 작성 방식</span>
              <div className="admin-segmented admin-segmented--tight" role="group" aria-label="연간소식지 작성 방식">
                {(['글쓰기', 'PDF소식지'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`admin-segmented__btn${yearlyMode === m ? ' admin-segmented__btn--active' : ''}`}
                    onClick={() => {
                      if (isEditLocked) return
                      setYearlyMode(m)
                    }}
                    disabled={isEditLocked}
                  >
                    {m === '글쓰기' ? '글쓰기 모드' : 'PDF 업로드 모드'}
                  </button>
                ))}
              </div>
              <p className="admin-upload__hint">
                {yearlyMode === '글쓰기'
                  ? '일반 게시글처럼 제목/본문만 작성합니다.'
                  : '제목 + 짧은 부내용 + PDF 업로드(보기 버튼) 형태로 노출됩니다.'}
              </p>
              <label className="admin-field admin-field--full" style={{ marginTop: 12 }}>
                <span className="admin-field__label">소식지 연도</span>
                <div className="admin-year-row">
                  <input
                    className="admin-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="예: 2026"
                    aria-label="시작 연도"
                    value={newsletterYear}
                    onChange={(e) => setNewsletterYear(e.currentTarget.value.replace(/\D/g, '').slice(0, 4))}
                  />
                  {newsletterYearRange ? (
                    <>
                      <span className="admin-year-row__sep" aria-hidden>
                        –
                      </span>
                      <input
                        className="admin-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="종료 연도"
                        aria-label="종료 연도"
                        value={newsletterYearEnd}
                        onChange={(e) => setNewsletterYearEnd(e.currentTarget.value.replace(/\D/g, '').slice(0, 4))}
                      />
                    </>
                  ) : null}
                </div>
                <label className="admin-field--check" style={{ marginTop: 8 }}>
                  <input
                    type="checkbox"
                    checked={newsletterYearRange}
                    onChange={(e) => {
                      const on = e.currentTarget.checked
                      setNewsletterYearRange(on)
                      if (on && !newsletterYearEnd) setNewsletterYearEnd(newsletterYear)
                    }}
                  />
                  <span>여러 연도에 걸침 (예: 2017–2020)</span>
                </label>
                <span className="admin-fieldset__hint admin-fieldset__hint--flush">
                  기본은 한 해입니다. 범위를 켜면 메타에 2017-2020처럼 저장되어 검색에 잡히고, 공개
                  목록 연도 탭에는 종료 연도에만 한 번 나타납니다.
                </span>
              </label>
              <label className="admin-field admin-field--full" style={{ marginTop: 12 }}>
                <span className="admin-field__label">소식지 호수</span>
                <input
                  className="admin-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 3"
                  value={newsletterIssue}
                  onChange={(e) => setNewsletterIssue(e.currentTarget.value)}
                />
                <span className="admin-fieldset__hint admin-fieldset__hint--flush">
                  숫자만 입력해도 됩니다. 선택한 연도 안에서만 호수 필터에 나타납니다.
                </span>
              </label>
            </div>
          ) : null}

          {postType === '언론보도' ? (
            <div className="admin-field admin-field--full">
              <span className="admin-field__label">언론보도 입력</span>
              <p className="admin-fieldset__hint admin-fieldset__hint--flush">
                언론보도는 메타 정보만 등록합니다. (기사 제목 / 신문사 / 기사 링크 / 날짜)
              </p>
              <div className="admin-form-grid">
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">기사 제목</span>
                  <input
                    className="admin-input"
                    type="text"
                    placeholder="예: ○○일보 인터뷰 — 현장 이야기"
                    value={pressTitle}
                    onChange={(e) => setPressTitle(e.currentTarget.value)}
                    disabled={isEditLocked}
                  />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">신문사</span>
                  <input
                    className="admin-input"
                    type="text"
                    placeholder="예: OO일보"
                    value={pressPublisher}
                    onChange={(e) => setPressPublisher(e.currentTarget.value)}
                    disabled={isEditLocked}
                  />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">기사 URL</span>
                  <input
                    className="admin-input"
                    type="url"
                    placeholder="https://..."
                    value={pressUrl}
                    onChange={(e) => setPressUrl(e.currentTarget.value)}
                    disabled={isEditLocked}
                  />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">기사 날짜</span>
                  <input
                    className="admin-input"
                    type="date"
                    value={pressDate}
                    onChange={(e) => setPressDate(e.currentTarget.value)}
                    disabled={isEditLocked}
                  />
                </label>
              </div>
            </div>
          ) : postType === '스토리' ? (
            <div className="admin-field admin-field--full">
              <span className="admin-field__label">게시 유형</span>
              <p className="admin-fieldset__hint admin-fieldset__hint--flush">
                스토리 글은 국내·해외·옹호·진행 네 가지 중 하나를 반드시 선택합니다.
              </p>
              <div className="admin-segmented admin-segmented--tight" role="group" aria-label="스토리 게시 유형">
                {storyPostScopes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`admin-segmented__btn${storyScope === s ? ' admin-segmented__btn--active' : ''}`}
                    onClick={() => {
                      if (isEditLocked) return
                      setStoryScope(s)
                    }}
                    disabled={isEditLocked}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {storyScope === null ? (
                <p className="admin-upload__hint" role="status">
                  게시 유형을 선택해 주세요.
                </p>
              ) : null}
            </div>
          ) : postType === '진행사업' ? (
            <div className="admin-field admin-field--full">
              <span className="admin-field__label">지역 분류</span>
              <p className="admin-fieldset__hint admin-fieldset__hint--flush">
                진행사업 목록의 탭(전체/네팔/키르기즈스탄/미얀마/국내)에 사용됩니다.
              </p>
              <div className="admin-segmented admin-segmented--tight" role="group" aria-label="진행사업 지역">
                {projectRegions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`admin-segmented__btn${projectRegion === r ? ' admin-segmented__btn--active' : ''}`}
                    onClick={() => {
                      if (isEditLocked) return
                      setProjectRegion(r)
                    }}
                    disabled={isEditLocked}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {projectRegion === null ? (
                <p className="admin-upload__hint" role="status">
                  지역을 선택해 주세요.
                </p>
              ) : null}
            </div>
          ) : null}
          {postType === '언론보도' ? null : (
            <>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">제목</span>
                <input
                  className="admin-input"
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              </label>
              {postType === '공지사항' ? null : (
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">
                    대표 이미지
                    {postType === '연간소식지' && yearlyMode === 'PDF소식지'
                      ? ' (PDF 표지 또는 이미지)'
                      : postType === '활동소식' || postType === '스토리'
                        ? ' (목록 왼쪽 썸네일)'
                        : ''}
                  </span>
                  <div className="admin-upload">
                    <div className="admin-upload__preview" aria-hidden>
                      {coverPreviewUrl ? (
                        <img
                          src={coverPreviewUrl}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                      ) : !coverBlank && pdfFiles[0]?.url ? (
                        <PdfFirstPagePreview url={pdfFiles[0].url} className="admin-upload__pdf-thumb" />
                      ) : (
                        <span>미리보기</span>
                      )}
                    </div>
                    <div className="admin-upload__actions">
                      {postType === '연간소식지' && yearlyMode === 'PDF소식지' ? (
                        <>
                          <label
                            className="admin-btn admin-btn--ghost"
                            style={{ cursor: coverImageUploading ? 'not-allowed' : 'pointer' }}
                          >
                            이미지 선택
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={coverImageUploading}
                              onChange={(e) => {
                                const f = e.currentTarget.files?.[0] ?? null
                                e.currentTarget.value = ''
                                void onPickCoverImageUpload(f)
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            disabled={!coverPreviewUrl && coverBlank}
                            onClick={() => {
                              setCoverFile(null)
                              setCoverPreviewUrl('')
                              setCoverBlank(true)
                            }}
                          >
                            이미지 제거
                          </button>
                          <p className="admin-upload__hint">
                            표지 이미지가 없으면 PDF 첫 장이 미리보기에 나옵니다. 이미지 제거를 누르면 빈
                            칸으로 둡니다.
                          </p>
                        </>
                      ) : postType === '활동소식' || postType === '스토리' ? (
                        <>
                          <label
                            className="admin-btn admin-btn--ghost"
                            style={{ cursor: coverImageUploading ? 'not-allowed' : 'pointer' }}
                          >
                            이미지 업로드
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={coverImageUploading}
                              onChange={(e) => {
                                const f = e.currentTarget.files?.[0] ?? null
                                e.currentTarget.value = ''
                                void onPickCoverImageUpload(f)
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            disabled={!coverPreviewUrl}
                            onClick={() => {
                              setCoverPreviewUrl('')
                              setCoverFile(null)
                              setCoverBlank(true)
                            }}
                          >
                            대표 이미지 제거
                          </button>
                          <p className="admin-upload__hint">
                            공개 목록에서 제목 왼쪽 네모 썸네일로 표시됩니다.
                          </p>
                        </>
                      ) : (
                        <>
                          <button type="button" className="admin-btn admin-btn--ghost" disabled>
                            파일 선택
                          </button>
                          <button type="button" className="admin-btn admin-btn--ghost" disabled>
                            이미지 제거
                          </button>
                          <p className="admin-upload__hint">스토리지 연동 후 업로드 가능</p>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              )}
              <div className="admin-field admin-field--full">
                <span className="admin-field__label">본문</span>
                {postType === '연간소식지' && yearlyMode === 'PDF소식지' ? (
                  <textarea
                    className="admin-input admin-input--area"
                    rows={4}
                    placeholder="부내용(짧게 몇 줄) 입력"
                    value={shortBody}
                    onChange={(e) => setShortBody(e.currentTarget.value)}
                  />
                ) : (
                  <AdminRichTextEditor ref={richRef} initialHtml={initialContentHtml} />
                )}
              </div>
              <div className="admin-field admin-field--full">
                <span className="admin-field__label">
                  첨부 문서 PDF
                  {postType === '연간소식지' ? ' · 1개만' : ' · 여러 개 가능'}
                </span>
                <div className="admin-upload">
                  <div
                    className={`admin-upload__preview admin-upload__preview--pdf${pdfDropOver ? ' admin-upload__preview--drop' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => pdfInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        pdfInputRef.current?.click()
                      }
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault()
                      setPdfDropOver(true)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setPdfDropOver(true)
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setPdfDropOver(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setPdfDropOver(false)
                      onPdfFilesFromDrop(e.dataTransfer.files)
                    }}
                  >
                    <span>{docUploading ? '업로드 중…' : 'PDF를 끌어다 놓기'}</span>
                  </div>
                  <div className="admin-upload__actions" style={{ width: '100%' }}>
                    <label
                      className="admin-btn admin-btn--ghost"
                      style={{ cursor: docUploading ? 'not-allowed' : 'pointer' }}
                    >
                      {docUploading
                        ? '업로드 중…'
                        : postType === '연간소식지'
                          ? 'PDF 선택·업로드'
                          : 'PDF 추가 업로드'}
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        multiple={postType !== '연간소식지'}
                        disabled={docUploading}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const files = e.currentTarget.files
                          e.currentTarget.value = ''
                          onPdfFilesFromDrop(files)
                        }}
                      />
                    </label>
                    {postType === '연간소식지' ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        disabled={docUploading || pdfFiles.length === 0}
                        onClick={() => void onRemoveAllNewsletterPdf()}
                      >
                        제거
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        disabled={docUploading || selectedPdfUrls.length === 0}
                        onClick={() => void onRemoveSelectedPdfs()}
                      >
                        선택 항목 제거
                      </button>
                    )}
                    <p className="admin-upload__hint" role="status">
                      {docStatus}
                    </p>
                    {pdfFiles.length > 0 ? (
                      <ul className="admin-pdf-list">
                        {pdfFiles.map((f) => (
                          <li key={f.url} className="admin-pdf-list__row">
                            {postType === '연간소식지' ? null : (
                              <input
                                type="checkbox"
                                checked={selectedPdfUrls.includes(f.url)}
                                onChange={(e) => {
                                  const on = e.currentTarget.checked
                                  setSelectedPdfUrls((cur) =>
                                    on ? [...cur, f.url] : cur.filter((u) => u !== f.url),
                                  )
                                }}
                                aria-label={`${f.name} 선택`}
                              />
                            )}
                            <a className="admin-pdf-list__name" href={f.url} target="_blank" rel="noreferrer">
                              {f.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
              <label className="admin-field">
                <span className="admin-field__label">게시 날짜</span>
                <input
                  className="admin-input"
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.currentTarget.value)}
                />
                <span className="admin-fieldset__hint admin-fieldset__hint--flush">
                  목록·상세의 등록일로 표시됩니다. 기본값은 오늘이며 달력에서 바꿀 수 있습니다.
                </span>
              </label>
            </>
          )}
          {postType === '언론보도' ? (
            <label className="admin-field">
              <span className="admin-field__label">게시 날짜</span>
              <input
                className="admin-input"
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.currentTarget.value)}
              />
            </label>
          ) : null}
        </div>
        {saveError ? (
          <p className="admin-panel__foot admin-panel__subnote" style={{ color: '#b42318' }}>
            {saveError}
          </p>
        ) : null}
        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={saving}>
            취소
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={onSave} disabled={saving}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </section>
    </div>
  )
}

export function AdminPostsPage() {
  const [filterType, setFilterType] = useState<ContentType>('공지사항')
  const [view, setView] = useState<View>('list')
  const [editorMode, setEditorMode] = useState<'new' | 'edit'>('new')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [rows, setRows] = useState<AdminPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const sortedRows = useMemo(() => {
    if (filterType !== '언론보도') return rows
    return [...rows].sort((a, b) => adminPressMetaDate(b).localeCompare(adminPressMetaDate(a)))
  }, [rows, filterType])

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await adminFetchPostsByKind(filterType, 1, 100)
      setRows(res.posts)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType])

  const closeEditor = () => {
    setView('list')
    setEditingId(null)
  }

  const openNew = () => {
    setEditorMode('new')
    setEditingId(null)
    setView('editor')
  }

  const openEdit = (id: number) => {
    setEditorMode('edit')
    setEditingId(id)
    setView('editor')
  }

  const onDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await adminDeletePost(id)
      await load()
    } catch {
      window.alert('삭제에 실패했습니다.')
    }
  }

  if (view === 'editor') {
    const row = editingId ? rows.find((r) => r.id === editingId) : undefined
    const initialTitle = row?.title ?? ''
    const initialPostType = (row?.meta?.khayah_kind as ContentType | undefined) ?? (row ? filterType : filterType)
    const initialStoryScope =
      row?.meta?.khayah_story_scope && storyPostScopes.includes(row.meta.khayah_story_scope as StoryPostScope)
        ? (row.meta.khayah_story_scope as StoryPostScope)
        : null
    const initialMeta = row?.meta ?? {}
    const initialContentHtml = row?.content ?? ''

    return (
      <PostEditorForm
        key={editorMode === 'new' ? `new-${filterType}` : `edit-${editingId ?? 0}`}
        mode={editorMode}
        initialPostType={initialPostType}
        initialTitle={initialTitle}
        initialStoryScope={initialStoryScope}
        initialPostId={editingId}
        initialMeta={initialMeta}
        initialContentHtml={initialContentHtml}
        initialPublishedAt={row?.publishedAt ?? ''}
        onClose={closeEditor}
        onSaved={load}
      />
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">게시글 관리</h1>
          <p className="admin-page__desc">
            공지사항, 스토리, 언론보도, 연간소식지 등 게시형 콘텐츠를 유형별로 등록·수정·삭제합니다. 메인
            히어로 배너는 <strong>메인 배너 관리</strong>(콘텐츠 관리 하위)에서 다룹니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
          새 글 작성
        </button>
      </div>

      <PostTypeSegmentedSection
        headingId="posts-filter-heading"
        value={filterType}
        onChange={setFilterType}
        footer={
          <>선택한 유형의 글만 아래 목록에 표시됩니다. 새 글 작성 화면에서도 동일한 UI로 유형을 고릅니다.</>
        }
      />

      <section className="admin-panel" aria-labelledby="posts-list-heading">
        <h2 id="posts-list-heading" className="admin-panel__title">
          목록
        </h2>
        {filterType === '공지사항' ? (
          <ul className="admin-notice-list" aria-label="공지사항 목록">
            {loading ? (
              <li className="admin-table__empty">불러오는 중…</li>
            ) : error ? (
              <li className="admin-table__empty">목록을 불러오지 못했습니다.</li>
            ) : sortedRows.length === 0 ? (
              <li className="admin-table__empty">등록된 공지가 없습니다.</li>
            ) : (
              sortedRows.map((row) => (
                <li key={row.id} className="admin-notice-item">
                  <div className="admin-notice-item__title">{row.title}</div>
                  <div className="admin-notice-item__date">{new Date(row.publishedAt).toISOString().slice(0, 10)}</div>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--ghost"
                      onClick={() => openEdit(row.id)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                      onClick={() => onDelete(row.id)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        ) : filterType === '언론보도' ? (
          <ul className="admin-press-list" aria-label="언론보도 목록">
            {loading ? (
              <li className="admin-table__empty">불러오는 중…</li>
            ) : error ? (
              <li className="admin-table__empty">목록을 불러오지 못했습니다.</li>
            ) : sortedRows.length === 0 ? (
              <li className="admin-table__empty">등록된 언론보도가 없습니다.</li>
            ) : (
              sortedRows.map((row) => {
                const pub = row.meta?.khayah_press_publisher?.trim() ?? ''
                const ptitle = row.meta?.khayah_press_title?.trim() ?? row.title
                const purl = row.meta?.khayah_press_url?.trim() ?? ''
                const pdate = adminPressMetaDate(row)
                return (
                  <li key={row.id} className="admin-press-item">
                    <div className="admin-press-item__main">
                      <div className="admin-press-item__headline">
                        {pub ? (
                          <span className="admin-press-item__source">
                            [{pub}]{' '}
                          </span>
                        ) : null}
                        <span className="admin-press-item__title">{ptitle}</span>
                      </div>
                      <div className="admin-press-item__meta">
                        <span className="admin-press-item__date">{pdate}</span>
                        {purl ? (
                          <a className="admin-press-item__link" href={purl} target="_blank" rel="noreferrer">
                            {purl.length > 56 ? `${purl.slice(0, 54)}…` : purl}
                          </a>
                        ) : (
                          <span className="admin-press-item__link admin-press-item__link--empty">URL 없음</span>
                        )}
                      </div>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm admin-btn--ghost"
                        onClick={() => openEdit(row.id)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                        onClick={() => onDelete(row.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">유형</th>
                  <th scope="col">제목</th>
                  <th scope="col">요약</th>
                  <th scope="col">대표 이미지</th>
                  <th scope="col">수정일</th>
                  <th scope="col">관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="admin-table__empty">
                      불러오는 중…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="admin-table__empty">
                      목록을 불러오지 못했습니다.
                    </td>
                  </tr>
                ) : sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-table__empty">
                      이 유형에 해당하는 샘플 글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  sortedRows.map((row) => (
                    <tr key={row.id}>
                      <td>{filterType}</td>
                      <td>{row.title}</td>
                      <td>{row.excerpt}</td>
                      <td>
                        <span className="admin-thumb" aria-label="대표 이미지 자리">
                          IMG
                        </span>
                      </td>
                      <td>{new Date(row.publishedAt).toISOString().slice(0, 10)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--ghost"
                            onClick={() => openEdit(row.id)}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                            onClick={() => onDelete(row.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
