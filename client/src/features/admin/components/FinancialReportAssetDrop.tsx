import { useCallback, useId, useRef, useState } from 'react'
import { uploadDocumentPdf, uploadReportImage } from '../../../services/api'

type Props = {
  label: string
  hint: string
  variant: 'image' | 'pdf'
  value: string | null
  onChange: (storedPath: string | null) => void
}

export function FinancialReportAssetDrop({ label, hint, variant, value, onChange }: Props) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [localErr, setLocalErr] = useState<string | null>(null)

  const accept =
    variant === 'pdf'
      ? '.pdf,application/pdf'
      : 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif'

  const uploadOne = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      setLocalErr(null)
      setUploading(true)
      try {
        const res = variant === 'pdf' ? await uploadDocumentPdf(file) : await uploadReportImage(file)
        onChange(res.path)
      } catch (e) {
        setLocalErr(e instanceof Error ? e.message : '업로드에 실패했습니다.')
      } finally {
        setUploading(false)
      }
    },
    [variant, onChange],
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

  return (
    <div className="admin-field admin-field--full">
      <span className="admin-field__label">{label}</span>
      <p className="admin-fr-drop__hint">{hint}</p>
      <div
        className={`admin-fr-drop${dragOver ? ' admin-fr-drop--active' : ''}${uploading ? ' admin-fr-drop--busy' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(e) => {
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
          className="admin-fr-drop__input"
          onChange={onInputChange}
          aria-label={label}
          disabled={uploading}
        />
        <div className="admin-fr-drop__body">
          {uploading ? (
            <span className="admin-fr-drop__status">업로드 중…</span>
          ) : (
            <>
              <span className="admin-fr-drop__title">파일을 여기에 놓거나</span>
              <button
                type="button"
                className="admin-btn admin-btn--sm admin-btn--ghost"
                onClick={() => inputRef.current?.click()}
              >
                파일 선택
              </button>
            </>
          )}
        </div>
      </div>
      {localErr ? (
        <p className="admin-fr-drop__err" role="alert">
          {localErr}
        </p>
      ) : null}
      {value ? (
        <div className="admin-fr-drop__preview-row">
          {variant === 'image' ? (
            <img src={value} alt="" className="admin-fr-drop__thumb" />
          ) : (
            <a href={value} target="_blank" rel="noopener noreferrer" className="admin-fr-drop__link">
              업로드된 PDF 열기
            </a>
          )}
          <button type="button" className="admin-btn admin-btn--sm admin-btn--danger-ghost" onClick={() => onChange(null)}>
            제거
          </button>
        </div>
      ) : null}
    </div>
  )
}
