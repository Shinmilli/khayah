import { useEffect, useMemo, useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { getDefaultPopupConfig, getDefaultPopupItem, loadPopupConfig, savePopupConfig, type PopupConfig, type PopupItem } from '../../../utils/popup'

export function AdminPopupPage() {
  const defaults = useMemo(() => getDefaultPopupConfig(), [])
  const [config, setConfig] = useState<PopupConfig>(defaults)
  const [selectedId, setSelectedId] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const loaded = loadPopupConfig()
    setConfig(loaded)
    setSelectedId(loaded.items[0]?.id ?? '')
  }, [])

  const save = () => {
    const saved = savePopupConfig(config)
    setConfig(saved)
    setStatus('저장되었습니다. (일반 화면 새로고침 시 반영)')
    window.setTimeout(() => setStatus(''), 2500)
  }

  const selected = config.items.find((i) => i.id === selectedId) ?? config.items[0] ?? null

  const updateSelected = (patch: Partial<PopupItem>) => {
    if (!selected) return
    setConfig((c) => ({
      items: c.items.map((it) => (it.id === selected.id ? { ...it, ...patch } : it)),
    }))
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">팝업 관리</h1>
          <p className="admin-page__desc">여러 개의 팝업을 등록하고, 표시 여부/이미지/링크를 관리합니다. (localStorage 기반)</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => {
              const item = getDefaultPopupItem()
              setConfig((c) => ({ items: [item, ...c.items].slice(0, 20) }))
              setSelectedId(item.id)
            }}
          >
            팝업 추가
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={save}>
            저장
          </button>
        </div>
      </div>

      <section className="admin-panel" aria-label="팝업 설정">
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <span className="admin-field__label">팝업 목록</span>
            <div className="admin-segmented admin-segmented--tight" role="group" aria-label="팝업 선택">
              {config.items.map((it, idx) => (
                <button
                  key={it.id}
                  type="button"
                  className={`admin-segmented__btn${selectedId === it.id ? ' admin-segmented__btn--active' : ''}`}
                  onClick={() => setSelectedId(it.id)}
                  title={it.imageUrl}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <p className="admin-upload__hint">숫자가 작을수록 우선 표시됩니다. (최대 20개)</p>
          </div>

          <div className="admin-field admin-field--full">
            <span className="admin-field__label">팝업 표시</span>
            <div className="admin-segmented admin-segmented--tight" role="group" aria-label="팝업 표시">
              <button
                type="button"
                className={`admin-segmented__btn${selected?.enabled ? ' admin-segmented__btn--active' : ''}`}
                onClick={() => updateSelected({ enabled: true })}
              >
                ON
              </button>
              <button
                type="button"
                className={`admin-segmented__btn${selected && !selected.enabled ? ' admin-segmented__btn--active' : ''}`}
                onClick={() => updateSelected({ enabled: false })}
              >
                OFF
              </button>
            </div>
            <p className="admin-upload__hint">ON이면 일반 화면에서 접속 시 팝업이 표시됩니다. (오늘 그만보기 적용)</p>
          </div>

          <AdminMediaUpload
            label="팝업 이미지"
            hint="JPEG · PNG · WebP · GIF — 업로드 후 「저장」을 누르면 일반 화면에 반영됩니다."
            variant="image"
            layout="wide"
            value={selected?.imageUrl?.trim() ? selected.imageUrl : null}
            onChange={(url) => updateSelected({ imageUrl: url ?? '' })}
          />

          <label className="admin-field admin-field--full">
            <span className="admin-field__label">클릭 시 이동 URL (선택)</span>
            <input
              className="admin-input"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="https://example.com/..."
              value={selected?.linkUrl ?? ''}
              onChange={(e) => updateSelected({ linkUrl: e.currentTarget.value })}
            />
            <p className="admin-upload__hint">
              http:// 또는 https:// 로 시작하는 전체 주소만 적용됩니다. 비우면 이미지 클릭 이동이 없습니다.
            </p>
          </label>

          <div className="admin-field admin-field--full">
            <span className="admin-field__label">버튼 링크 (선택)</span>
            <p className="admin-upload__hint">
              원하면 팝업 하단에 링크 버튼을 추가할 수 있습니다. URL은 http:// 또는 https:// 로 시작하는 전체 주소만
              적용됩니다. 버튼 URL을 비우면 위의「클릭 시 이동 URL」을 사용합니다.
            </p>
            <div className="admin-popup-cta-section">
              <div className="admin-form-grid">
                <div className="admin-field admin-field--full">
                  <span className="admin-field__label">버튼 표시</span>
                  <div className="admin-segmented admin-segmented--tight" role="group" aria-label="팝업 버튼 표시">
                    <button
                      type="button"
                      className={`admin-segmented__btn${selected?.buttonEnabled ? ' admin-segmented__btn--active' : ''}`}
                      onClick={() => updateSelected({ buttonEnabled: true })}
                    >
                      ON
                    </button>
                    <button
                      type="button"
                      className={`admin-segmented__btn${selected && !selected.buttonEnabled ? ' admin-segmented__btn--active' : ''}`}
                      onClick={() => updateSelected({ buttonEnabled: false })}
                    >
                      OFF
                    </button>
                  </div>
                </div>
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">버튼 텍스트</span>
                  <input
                    className="admin-input"
                    type="text"
                    placeholder="예: 자세히 보기"
                    value={selected?.buttonLabel ?? ''}
                    onChange={(e) => updateSelected({ buttonLabel: e.currentTarget.value })}
                  />
                </label>
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">버튼 URL</span>
                  <input
                    className="admin-input"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://example.com/..."
                    value={selected?.buttonUrl ?? ''}
                    onChange={(e) => updateSelected({ buttonUrl: e.currentTarget.value })}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="admin-field admin-field--full">
            <span className="admin-field__label">미리보기</span>
            <div className="admin-media-upload__preview admin-media-upload__preview--wide">
              {selected?.imageUrl ? (
                <img src={selected.imageUrl} alt="" className="admin-media-upload__thumb" />
              ) : (
                <span className="admin-media-upload__empty">이미지를 업로드하세요</span>
              )}
            </div>
            <p className="admin-media-upload__hint">‘오늘 그만보기’는 방문자 브라우저(localStorage)에 저장됩니다.</p>
            {status ? (
              <p className="admin-media-upload__ok" role="status">
                {status}
              </p>
            ) : null}
            {config.items.length > 1 && selected ? (
              <button
                type="button"
                className="admin-btn admin-btn--danger-ghost"
                style={{ marginTop: 8 }}
                onClick={() => {
                  const next = config.items.filter((x) => x.id !== selected.id)
                  const safe = next.length ? next : [getDefaultPopupItem()]
                  setConfig({ items: safe })
                  setSelectedId(safe[0]?.id ?? '')
                }}
              >
                이 팝업 삭제
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

