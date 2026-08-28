import { useCallback, useId, useRef, useState } from 'react'
import { uploadDocumentPdf, uploadReportImage } from '../../../services/api'
import { pdfOpenHref } from '../../../utils/pdfAttachments'

export type AdminMediaUploadProps = {
  label: string
  hint?: string
  variant: 'image' | 'pdf'
  /** 배너·팝업 등 넓은 미리보기 */
  layout?: 'default' | 'wide'
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

export function AdminMediaUpload({
  label,
  hint,
  variant,
  layout = 'default',
  value,
  onChange,
  disabled = false,
}: AdminMediaUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [localErr, setLocalErr] = useState<string | null>(null)
  const [lastOk, setLastOk] = useState<string | null>(null)

  const accept =
    variant === 'pdf'
      ? '.pdf,application/pdf'
      : 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif'

  const uploadOne = useCallback(
    async (file: File | undefined) => {
      if (!file || disabled) return
      setLocalErr(null)
      setLastOk(null)
      setUploading(true)
      try {
        const mb = (file.size / (1024 * 1024)).toFixed(1)
        const dest = file.size > 10 * 1024 * 1024 ? 'Supabase' : 'Cloudinary'
        const res = variant === 'pdf' ? await uploadDocumentPdf(file) : await uploadReportImage(file)
        const url = res.url?.trim()
        if (!url) {
          throw new Error('업로드는 됐지만 공개 URL을 받지 못했습니다. 서버 설정을 확인하세요.')
        }
        onChange(url)
        setLastOk(`${file.name} (${mb}MB → ${dest})`)
      } catch (e) {
        setLocalErr(e instanceof Error ? e.message : '업로드에 실패했습니다.')
      } finally {
        setUploading(false)
      }
    },
    [variant, onChange, disabled],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      void uploadOne(e.dataTransfer.files[0])
    },
    [uploadOne],
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void uploadOne(e.target.files?.[0])
      e.target.value = ''
    },
    [uploadOne],
  )

  const previewHref = value && variant === 'pdf' ? pdfOpenHref(value) : value

  return (
    <div className="admin-field admin-field--full">
      <span className="admin-field__label">{label}</span>
      {hint ? <p className="admin-media-upload__hint">{hint}</p> : null}

      {value ? (
        <div className={`admin-media-upload__preview${layout === 'wide' ? ' admin-media-upload__preview--wide' : ''}`}>
          {variant === 'image' ? (
            <img src={value} alt="" className="admin-media-upload__thumb" />
          ) : previewHref ? (
            <a href={previewHref} target="_blank" rel="noopener noreferrer" className="admin-media-upload__file-link">
              PDF 미리보기 · 새 창에서 열기
            </a>
          ) : (
            <span className="admin-media-upload__file-link">PDF 등록됨</span>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-media-upload__remove"
            disabled={disabled || uploading}
            onClick={() => {
              onChange(null)
              setLastOk(null)
              setLocalErr(null)
            }}
          >
            제거
          </button>
        </div>
      ) : null}

      <div
        className={`admin-media-upload__drop${dragOver ? ' is-active' : ''}${uploading ? ' is-busy' : ''}${disabled ? ' is-disabled' : ''}${layout === 'wide' ? ' admin-media-upload__drop--wide' : ''}`}
        onDragEnter={(e) => {
          if (disabled) return
          e.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(e) => {
          if (disabled) return
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false)
        }}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="admin-media-upload__input"
          onChange={onInputChange}
          aria-label={label}
          disabled={disabled || uploading}
        />
        <div className="admin-media-upload__body">
          {uploading ? (
            <span className="admin-media-upload__status">업로드 중…</span>
          ) : (
            <>
              <span className="admin-media-upload__title">
                {variant === 'pdf' ? 'PDF를 끌어다 놓거나' : '이미지를 끌어다 놓거나'}
              </span>
              <button
                type="button"
                className="admin-btn admin-btn--sm admin-btn--ghost"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
              >
                파일 선택
              </button>
            </>
          )}
        </div>
      </div>

      {localErr ? (
        <p className="admin-media-upload__err" role="alert">
          {localErr}
        </p>
      ) : null}
      {lastOk && !localErr ? (
        <p className="admin-media-upload__ok" role="status">
          업로드 완료: {lastOk} — 상단 「저장」을 눌러 반영하세요.
        </p>
      ) : null}
    </div>
  )
}

/** @deprecated AdminMediaUpload 사용 */
export const FinancialReportAssetDrop = AdminMediaUpload
