import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { AdminRichTextEditor } from '../components/AdminRichTextEditor'
import type { AdminRichTextEditorHandle } from '../components/AdminRichTextEditor'
import {
  adminCreatePost,
  adminDeletePost,
  adminFetchPostsByKind,
  adminUpdatePost,
  uploadDocumentPdf,
} from '../../../services/api'
import type { AdminPost } from '../../../services/api'

const contentTypes = ['스토리', '공지사항', '활동소식', '연간소식지', '언론보도', '진행사업'] as const
type ContentType = (typeof contentTypes)[number]

type YearlyNewsletterMode = '글쓰기' | 'PDF소식지'

/** 스토리 선택 시 필수 구분 (홈 스토리 칩과 대응) */
const storyPostScopes = ['국내', '해외', '옹호', '진행'] as const
type StoryPostScope = (typeof storyPostScopes)[number]

const projectRegions = ['네팔', '키르기즈스탄', '미얀마', '국내'] as const
type ProjectRegion = (typeof projectRegions)[number]

type View = 'list' | 'editor'

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

function PostEditorForm({
  mode,
  initialPostType,
  initialTitle,
  initialStoryScope,
  initialPostId,
  initialMeta,
  initialContentHtml,
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
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docUrl, setDocUrl] = useState<string>('')
  const [docStatus, setDocStatus] = useState<string>('PDF 업로드 가능 (최대 25MB)')
  const [docUploading, setDocUploading] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('')
  const [pressTitle, setPressTitle] = useState<string>('')
  const [pressPublisher, setPressPublisher] = useState<string>('')
  const [pressUrl, setPressUrl] = useState<string>('')
  const [pressDate, setPressDate] = useState<string>('') // YYYY-MM-DD
  const prevPostType = useRef(postType)
  const richRef = useRef<AdminRichTextEditorHandle | null>(null)
  const [shortBody, setShortBody] = useState<string>('') // yearly pdf mode short body

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
      setDocFile(null)
      setDocUrl('')
      setDocStatus('PDF 업로드 가능 (최대 25MB)')
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
      if (initialMeta.khayah_pdf_url) setDocUrl(initialMeta.khayah_pdf_url)
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
    if (!coverFile) {
      setCoverPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(coverFile)
    setCoverPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  const onPickPdf = (file: File | null) => {
    setDocFile(file)
    if (!file) {
      setDocStatus('PDF 업로드 가능 (최대 25MB)')
      return
    }
    setDocStatus(`선택됨: ${file.name}`)
  }

  const onUploadPdf = async () => {
    if (!docFile) return
    setDocUploading(true)
    setDocStatus('업로드 중…')
    try {
      const result = await uploadDocumentPdf(docFile)
      setDocUrl(result.url)
      setDocStatus(`업로드 완료: ${result.originalName}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '업로드 실패'
      setDocStatus(msg)
    } finally {
      setDocUploading(false)
    }
  }

  const onSave = async () => {
    setSaveError('')
    if (!title.trim()) {
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
    if (postType === '연간소식지' && yearlyMode === 'PDF소식지' && !docUrl) {
      setSaveError('PDF 업로드 후 링크가 생성되어야 합니다.')
      return
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
        if (docUrl) meta.khayah_pdf_url = docUrl
        if (coverPreviewUrl) meta.khayah_cover_url = coverPreviewUrl
      }
      if (postType === '언론보도') {
        if (pressTitle.trim()) meta.khayah_press_title = pressTitle.trim()
        if (pressPublisher.trim()) meta.khayah_press_publisher = pressPublisher.trim()
        if (pressUrl.trim()) meta.khayah_press_url = pressUrl.trim()
        if (pressDate.trim()) meta.khayah_press_date = pressDate.trim()
      }

      const content =
        postType === '연간소식지' && yearlyMode === 'PDF소식지' ? shortBody : richRef.current?.getHtml() ?? ''

      const deriveExcerpt = (html: string): string => {
        const text = html
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        return text.slice(0, 60)
      }

      const excerptAuto = deriveExcerpt(content)

      if (mode === 'new') {
        await adminCreatePost({
          kind: postType,
          title: title.trim(),
          excerpt: excerptAuto,
          content,
          status: 'publish',
          meta,
        })
      } else {
        if (!initialPostId) throw new Error('Missing post id')
        await adminUpdatePost(initialPostId, {
          title: title.trim(),
          excerpt: excerptAuto,
          content,
          status: 'publish',
          meta,
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
                  <span className="admin-field__label">기사 제목 (khayah_press_title)</span>
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
                  <span className="admin-field__label">신문사 (khayah_press_publisher)</span>
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
                  <span className="admin-field__label">기사 URL (khayah_press_url)</span>
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
                  <span className="admin-field__label">기사 날짜 (khayah_press_date)</span>
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
          ) : (
            <label className="admin-field">
              <span className="admin-field__label">카테고리</span>
              <select className="admin-input" defaultValue="">
                <option value="">선택</option>
                <option>일정</option>
                <option>현장</option>
                <option>보도자료</option>
                <option>소식지</option>
              </select>
            </label>
          )}
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
                    대표 이미지{postType === '연간소식지' && yearlyMode === 'PDF소식지' ? ' (PDF 표지 또는 이미지)' : ''}
                  </span>
                  <div className="admin-upload">
                    <div className="admin-upload__preview" aria-hidden>
                      {coverPreviewUrl ? (
                        <img
                          src={coverPreviewUrl}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                      ) : (
                        <span>미리보기</span>
                      )}
                    </div>
                    <div className="admin-upload__actions">
                      {postType === '연간소식지' && yearlyMode === 'PDF소식지' ? (
                        <>
                          <label className="admin-btn admin-btn--ghost" style={{ cursor: 'pointer' }}>
                            이미지 선택
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => setCoverFile(e.currentTarget.files?.[0] ?? null)}
                            />
                          </label>
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            disabled={!coverFile}
                            onClick={() => setCoverFile(null)}
                          >
                            이미지 제거
                          </button>
                        <label className="admin-field admin-field--full" style={{ marginTop: 10 }}>
                          <span className="admin-field__label">표지 이미지 URL (임시)</span>
                          <input
                            className="admin-input"
                            type="url"
                            placeholder="https://..."
                            value={coverPreviewUrl}
                            onChange={(e) => setCoverPreviewUrl(e.currentTarget.value)}
                          />
                        </label>
                          <p className="admin-upload__hint">
                            {docUrl ? 'PDF 업로드됨: 표지가 없으면 PDF 표지(대체)로 표시됩니다.' : 'PDF 업로드 후 표지를 지정할 수 있습니다.'}
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
                  첨부 문서 (PDF){postType === '연간소식지' && yearlyMode === 'PDF소식지' ? ' · PDF 보기 버튼용' : ''}
                </span>
                <div className="admin-upload">
                  <div className="admin-upload__preview" aria-hidden>
                    <span>PDF</span>
                  </div>
                  <div className="admin-upload__actions">
                    <label
                      className="admin-btn admin-btn--ghost"
                      style={{ cursor: docUploading ? 'not-allowed' : 'pointer' }}
                    >
                      파일 선택
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        disabled={docUploading}
                        style={{ display: 'none' }}
                        onChange={(e) => onPickPdf(e.currentTarget.files?.[0] ?? null)}
                      />
                    </label>
                    <button type="button" className="admin-btn admin-btn--ghost" disabled={!docFile || docUploading} onClick={onUploadPdf}>
                      업로드
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      disabled={docUploading && docUrl.length === 0}
                      onClick={() => {
                        setDocFile(null)
                        setDocUrl('')
                        setDocStatus('PDF 업로드 가능 (최대 25MB)')
                      }}
                    >
                      제거
                    </button>
                    <p className="admin-upload__hint" role="status">
                      {docStatus}
                    </p>
                    {docUrl ? (
                      <p className="admin-upload__hint">
                        링크:{' '}
                        <a href={docUrl} target="_blank" rel="noreferrer">
                          {docUrl}
                        </a>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}
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
            ) : rows.length === 0 ? (
              <li className="admin-table__empty">등록된 공지가 없습니다.</li>
            ) : (
              rows.map((row) => (
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
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-table__empty">
                      이 유형에 해당하는 샘플 글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
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
