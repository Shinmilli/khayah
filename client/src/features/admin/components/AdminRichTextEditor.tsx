import type { ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'

function focusAndExec(editor: HTMLElement | null, command: string, value?: string) {
  if (!editor) return
  editor.focus()
  if (value !== undefined) {
    document.execCommand(command, false, value)
  } else {
    document.execCommand(command, false)
  }
}

function Ico(props: { children: ReactNode }) {
  return (
    <svg
      className="admin-rich__ico"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {props.children}
    </svg>
  )
}

const icons = {
  bold: (
    <Ico>
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </Ico>
  ),
  italic: (
    <Ico>
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </Ico>
  ),
  underline: (
    <Ico>
      <path d="M6 4v7a6 6 0 0 0 12 0V4" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </Ico>
  ),
  strike: (
    <Ico>
      <path d="M16 4H9a3 3 0 0 0-2.8 4" />
      <path d="M14 12a4 4 0 0 1 0 8H6" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </Ico>
  ),
  alignLeft: (
    <Ico>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Ico>
  ),
  alignCenter: (
    <Ico>
      <line x1="5" y1="6" x2="19" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="5" y1="18" x2="19" y2="18" />
    </Ico>
  ),
  alignRight: (
    <Ico>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Ico>
  ),
  quote: (
    <Ico>
      <path d="M7 10a2 2 0 0 0-2 2v6h4v-6a2 2 0 0 0-2-2z" />
      <path d="M17 10a2 2 0 0 0-2 2v6h4v-6a2 2 0 0 0-2-2z" />
    </Ico>
  ),
  link: (
    <Ico>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Ico>
  ),
  image: (
    <Ico>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </Ico>
  ),
  highlight: (
    <Ico>
      <path d="M4 20h16" />
      <path d="M7 16l9-9 2 2-9 9H7z" />
      <path d="M14 6l2 2" />
    </Ico>
  ),
  hr: (
    <Ico>
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="7" x2="8" y2="7" />
      <line x1="16" y1="7" x2="20" y2="7" />
      <line x1="4" y1="17" x2="8" y2="17" />
      <line x1="16" y1="17" x2="20" y2="17" />
    </Ico>
  ),
} as const

type ToolbarBtn = {
  key: string
  title: string
  ariaLabel: string
  onClick: () => void
  icon?: ReactNode
  label?: string
}

export type AdminRichTextEditorHandle = {
  getHtml: () => string
  setHtml: (html: string) => void
}

export const AdminRichTextEditor = forwardRef<AdminRichTextEditorHandle, { initialHtml?: string }>(
  function AdminRichTextEditor({ initialHtml }, ref) {
    const editorRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(
      ref,
      () => ({
        getHtml: () => editorRef.current?.innerHTML ?? '',
        setHtml: (html: string) => {
          if (editorRef.current) editorRef.current.innerHTML = html
        },
      }),
      [],
    )

    useEffect(() => {
      if (typeof initialHtml !== 'string') return
      if (editorRef.current) editorRef.current.innerHTML = initialHtml
      // only initial set
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const exec = useCallback((command: string, value?: string) => {
      focusAndExec(editorRef.current, command, value)
    }, [])

    const setBlock = useCallback((tag: 'h1' | 'h2' | 'h3' | 'p' | 'blockquote') => {
      focusAndExec(editorRef.current, 'formatBlock', tag)
    }, [])

    const insertLink = useCallback(() => {
      const url = window.prompt('링크 URL', 'https://')
      if (!url?.trim()) return
      focusAndExec(editorRef.current, 'createLink', url.trim())
    }, [])

    const insertImage = useCallback(() => {
      const url = window.prompt('이미지 URL', 'https://')
      if (!url?.trim()) return
      focusAndExec(editorRef.current, 'insertImage', url.trim())
    }, [])

    const applyHighlight = useCallback((hex: string) => {
      focusAndExec(editorRef.current, 'styleWithCSS', 'true')
      // Chrome: hiliteColor, Safari fallback: backColor
      focusAndExec(editorRef.current, 'hiliteColor', hex)
      focusAndExec(editorRef.current, 'backColor', hex)
    }, [])

    const highlightColors = [
      { hex: 'transparent', label: '해제' },
      { hex: '#FFF59D', label: '노랑' },
      { hex: '#FFCCBC', label: '살구' },
      { hex: '#C8E6C9', label: '연두' },
      { hex: '#B3E5FC', label: '하늘' },
      { hex: '#D1C4E9', label: '보라' },
      { hex: '#F8BBD0', label: '핑크' },
    ] as const

    const groups: ToolbarBtn[][] = [
      [
        { key: 'bold', title: '굵게', ariaLabel: '굵게', onClick: () => exec('bold'), icon: icons.bold },
        { key: 'italic', title: '기울임', ariaLabel: '기울임', onClick: () => exec('italic'), icon: icons.italic },
        {
          key: 'underline',
          title: '밑줄',
          ariaLabel: '밑줄',
          onClick: () => exec('underline'),
          icon: icons.underline,
        },
        {
          key: 'strike',
          title: '취소선',
          ariaLabel: '취소선',
          onClick: () => exec('strikeThrough'),
          icon: icons.strike,
        },
      ],
      [
        { key: 'h1', title: '제목 1', ariaLabel: '제목 1', onClick: () => setBlock('h1'), label: 'H1' },
        { key: 'h2', title: '제목 2', ariaLabel: '제목 2', onClick: () => setBlock('h2'), label: 'H2' },
        { key: 'h3', title: '제목 3', ariaLabel: '제목 3', onClick: () => setBlock('h3'), label: 'H3' },
        { key: 'p', title: '본문 단락', ariaLabel: '본문 단락', onClick: () => setBlock('p'), label: '본문' },
      ],
      [
        {
          key: 'al',
          title: '왼쪽 정렬',
          ariaLabel: '왼쪽 정렬',
          onClick: () => exec('justifyLeft'),
          icon: icons.alignLeft,
        },
        {
          key: 'ac',
          title: '가운데 맞춤',
          ariaLabel: '가운데 맞춤',
          onClick: () => exec('justifyCenter'),
          icon: icons.alignCenter,
        },
        {
          key: 'ar',
          title: '오른쪽 정렬',
          ariaLabel: '오른쪽 정렬',
          onClick: () => exec('justifyRight'),
          icon: icons.alignRight,
        },
      ],
      [
        {
          key: 'quote',
          title: '인용 블록',
          ariaLabel: '인용 블록',
          onClick: () => setBlock('blockquote'),
          icon: icons.quote,
        },
        { key: 'link', title: '링크 삽입', ariaLabel: '링크 삽입', onClick: insertLink, icon: icons.link },
        {
          key: 'img',
          title: '이미지(URL) 삽입',
          ariaLabel: '이미지 삽입',
          onClick: insertImage,
          icon: icons.image,
        },
        {
          key: 'hr',
          title: '구분선 삽입',
          ariaLabel: '구분선 삽입',
          onClick: () => exec('insertHorizontalRule'),
          icon: icons.hr,
        },
      ],
    ]

    return (
      <div className="admin-rich">
      <div className="admin-rich__toolbar" role="toolbar" aria-label="본문 서식">
        {groups.map((group, gi) => (
          <div key={gi} className="admin-rich__toolbar-group" role="presentation">
            {group.map((btn) => (
              <button
                key={btn.key}
                type="button"
                className={`admin-rich__btn${btn.label ? ' admin-rich__btn--text' : ''}`}
                title={btn.title}
                aria-label={btn.ariaLabel}
                onMouseDown={(e) => e.preventDefault()}
                onClick={btn.onClick}
              >
                {btn.icon ?? <span className="admin-rich__btn-label">{btn.label}</span>}
              </button>
            ))}
          </div>
        ))}
        <div className="admin-rich__toolbar-group" role="presentation">
          <span className="admin-rich__hl" aria-label="형광펜">
            <span className="admin-rich__hl-ico" aria-hidden>
              {icons.highlight}
            </span>
            <div className="admin-rich__hl-swatches" role="group" aria-label="형광펜 색상">
              {highlightColors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className={`admin-rich__hl-swatch${c.hex === 'transparent' ? ' admin-rich__hl-swatch--off' : ''}`}
                  title={`형광펜: ${c.label}`}
                  aria-label={`형광펜: ${c.label}`}
                  style={c.hex === 'transparent' ? undefined : { backgroundColor: c.hex }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyHighlight(c.hex)}
                />
              ))}
            </div>
          </span>
        </div>
      </div>
      <p className="admin-rich__hint">
        아이콘에 마우스를 올리면 기능 설명이 나옵니다. Enter로 줄 바꿈 · 정렬은 단락·블록에 적용됩니다.
      </p>
      <div
        ref={editorRef}
        className="admin-rich__editor"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        data-placeholder="본문을 입력하세요"
        role="textbox"
        aria-multiline="true"
      />
    </div>
    )
  },
)
