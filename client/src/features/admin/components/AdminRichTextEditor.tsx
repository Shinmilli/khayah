import type { ClipboardEvent, KeyboardEvent, ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { uploadReportImage, type DocumentUploadResult } from '../../../services/api'
import { sanitizePasteHtml, sanitizePlainTextPaste } from '../../../utils/sanitizePasteHtml'

function focusAndExec(editor: HTMLElement | null, command: string, value?: string) {
  if (!editor) return
  editor.focus()
  if (value !== undefined) {
    document.execCommand(command, false, value)
  } else {
    document.execCommand(command, false)
  }
}

function restoreSelection(range: Range | null) {
  if (!range) return
  const sel = window.getSelection()
  if (!sel) return
  sel.removeAllRanges()
  sel.addRange(range)
}

function placeCaretIn(el: HTMLElement, atStart = false) {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(atStart)
  const sel = window.getSelection()
  if (!sel) return
  sel.removeAllRanges()
  sel.addRange(range)
}

const BLOCK_SELECTOR = 'p, div, h1, h2, h3, h4, h5, h6, blockquote, li, pre, figcaption, ul, ol, hr, table, figure'

function isTopLevelBlock(tag: string): boolean {
  return /^(P|DIV|H[1-6]|BLOCKQUOTE|UL|OL|PRE|HR|TABLE|FIGURE)$/i.test(tag)
}

function getCurrentBlock(editor: HTMLElement): HTMLElement | null {
  const sel = window.getSelection()
  if (!sel || !sel.anchorNode) return null
  let node: Node | null = sel.anchorNode
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement
  while (node && node !== editor) {
    if (node instanceof HTMLElement && isTopLevelBlock(node.tagName) && node.parentElement === editor) {
      return node
    }
    if (node instanceof HTMLElement && node.tagName === 'BLOCKQUOTE') return node
    if (node instanceof HTMLElement && /^(P|H[1-6]|LI)$/i.test(node.tagName)) {
      // climb to top-level under editor
      let cur: HTMLElement = node
      while (cur.parentElement && cur.parentElement !== editor) {
        if (cur.parentElement.tagName === 'BLOCKQUOTE') return cur.parentElement
        cur = cur.parentElement
      }
      if (cur.parentElement === editor) return cur
    }
    node = (node as HTMLElement).parentElement
  }
  return null
}

/** 루트에 직접 있는 텍스트/인라인을 <p>로 감싸 정렬·저장이 깨지지 않게 함 */
function wrapOrphanNodes(editor: HTMLElement) {
  const children = Array.from(editor.childNodes)
  let pending: Node[] = []

  const flush = (before: ChildNode | null) => {
    if (pending.length === 0) return
    const p = document.createElement('p')
    for (const n of pending) p.appendChild(n)
    pending = []
    if (before) editor.insertBefore(p, before)
    else editor.appendChild(p)
  }

  for (const node of children) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (isTopLevelBlock(el.tagName)) {
        flush(node)
        continue
      }
    }
    if (node.nodeType === Node.TEXT_NODE && !(node.textContent ?? '').trim()) {
      continue
    }
    pending.push(node)
  }
  flush(null)
}

function bakeAlignIntoBlocks(editor: HTMLElement, align: string) {
  if (!align) return
  editor.querySelectorAll<HTMLElement>(BLOCK_SELECTOR).forEach((el) => {
    if (el.tagName === 'HR' || el.tagName === 'UL' || el.tagName === 'OL' || el.tagName === 'TABLE') return
    if (el.tagName === 'BLOCKQUOTE') {
      // 인용 안 글은 항상 가운데, 박스 위치만 정렬에 따름
      el.style.textAlign = 'center'
      el.dataset.quoteAlign = align
      if (align === 'center') {
        el.style.marginLeft = 'auto'
        el.style.marginRight = 'auto'
      } else if (align === 'right') {
        el.style.marginLeft = 'auto'
        el.style.marginRight = '0'
      } else {
        el.style.marginLeft = '0'
        el.style.marginRight = 'auto'
      }
      return
    }
    el.style.textAlign = align
  })
  editor.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    img.style.display = 'block'
    if (align === 'center') {
      img.style.marginLeft = 'auto'
      img.style.marginRight = 'auto'
    } else if (align === 'right') {
      img.style.marginLeft = 'auto'
      img.style.marginRight = '0'
    } else {
      img.style.marginLeft = '0'
      img.style.marginRight = 'auto'
    }
  })
}

/** 연속된 blockquote를 하나의 인용(줄바꿈으로 연결)으로 합침 */
function mergeAdjacentBlockquotes(editor: HTMLElement) {
  let child = editor.firstElementChild
  while (child) {
    const next = child.nextElementSibling
    if (child.tagName === 'BLOCKQUOTE' && next?.tagName === 'BLOCKQUOTE') {
      const left = child as HTMLElement
      const right = next as HTMLElement
      if (left.innerHTML && !/<br\s*\/?>\s*$/i.test(left.innerHTML)) {
        left.appendChild(document.createElement('br'))
      }
      while (right.firstChild) left.appendChild(right.firstChild)
      right.remove()
      continue
    }
    child = next
  }
}

function serializeEditorHtml(editor: HTMLElement): string {
  wrapOrphanNodes(editor)
  const align = editor.style.textAlign || ''
  if (align) bakeAlignIntoBlocks(editor, align)
  // 루트 style은 innerHTML에 안 들어가므로 블록에만 남김
  return editor.innerHTML
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
  textColor: (
    <Ico>
      <path d="M8 17L12 5l4 12" />
      <line x1="9.2" y1="13" x2="14.8" y2="13" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </Ico>
  ),
  highlight: (
    <Ico>
      <path d="M4 20h16" />
      <path d="M7 16l9-9 2 2-9 9H7z" />
      <path d="M14 6l2 2" />
    </Ico>
  ),
  palette: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
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

export const AdminRichTextEditor = forwardRef<
  AdminRichTextEditorHandle,
  {
    initialHtml?: string
    /** 본문 이미지 업로드 직후(저장 전 이탈 시 고아 파일 정리용) */
    onImageUploaded?: (uploaded: DocumentUploadResult) => void
  }
>(function AdminRichTextEditor({ initialHtml, onImageUploaded }, ref) {
    const editorRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const savedRangeRef = useRef<Range | null>(null)
    const [imageUploading, setImageUploading] = useState(false)
    const [imageStatus, setImageStatus] = useState('')
    const [customTextColor, setCustomTextColor] = useState('#b20838')

    useImperativeHandle(
      ref,
      () => ({
        getHtml: () => {
          const editor = editorRef.current
          if (!editor) return ''
          return serializeEditorHtml(editor)
        },
        setHtml: (html: string) => {
          if (editorRef.current) {
            editorRef.current.innerHTML = html
            editorRef.current.style.textAlign = ''
          }
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

    const setBlock = useCallback((tag: 'h1' | 'h2' | 'h3' | 'p') => {
      focusAndExec(editorRef.current, 'formatBlock', tag)
    }, [])

    const insertLink = useCallback(() => {
      const url = window.prompt('링크 URL', 'https://')
      if (!url?.trim()) return
      focusAndExec(editorRef.current, 'createLink', url.trim())
    }, [])

    const saveSelection = useCallback(() => {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) {
        savedRangeRef.current = null
        return
      }
      const range = sel.getRangeAt(0)
      const editor = editorRef.current
      if (editor && editor.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange()
      } else {
        savedRangeRef.current = null
      }
    }, [])

    /** 인용: 현재 줄이 인용이면 해제, 아니면 바로 아래 줄에 인용 블록 추가 */
    const toggleQuote = useCallback(() => {
      const editor = editorRef.current
      if (!editor) return
      editor.focus()
      restoreSelection(savedRangeRef.current)
      wrapOrphanNodes(editor)

      const current = getCurrentBlock(editor)
      if (current?.tagName === 'BLOCKQUOTE') {
        const p = document.createElement('p')
        p.innerHTML = current.innerHTML.trim() ? current.innerHTML : '<br>'
        if (current.style.textAlign) p.style.textAlign = current.style.textAlign
        current.replaceWith(p)
        placeCaretIn(p)
        saveSelection()
        return
      }

      const quote = document.createElement('blockquote')
      quote.innerHTML = '<br>'
      const align = (editor.style.textAlign || 'left') as 'left' | 'center' | 'right'
      quote.style.textAlign = 'center'
      quote.dataset.quoteAlign = align
      if (align === 'center') {
        quote.style.marginLeft = 'auto'
        quote.style.marginRight = 'auto'
      } else if (align === 'right') {
        quote.style.marginLeft = 'auto'
        quote.style.marginRight = '0'
      } else {
        quote.style.marginLeft = '0'
        quote.style.marginRight = 'auto'
      }

      if (current) {
        current.after(quote)
      } else {
        editor.appendChild(quote)
      }

      // 인용 뒤에 일반 문단을 미리 두어, 인용 안 Enter로는 빠져나오지 않아도 이어서 쓸 수 있게 함
      const next = quote.nextElementSibling
      if (!next || next.tagName === 'BLOCKQUOTE') {
        const after = document.createElement('p')
        after.innerHTML = '<br>'
        const bodyAlign = editor.style.textAlign
        if (bodyAlign) after.style.textAlign = bodyAlign
        quote.after(after)
      }

      placeCaretIn(quote)
      saveSelection()
    }, [saveSelection])

    const applyAlign = useCallback((align: 'left' | 'center' | 'right') => {
      const editor = editorRef.current
      if (!editor) return
      editor.focus()
      wrapOrphanNodes(editor)
      editor.style.textAlign = align
      bakeAlignIntoBlocks(editor, align)
    }, [])

    const onEditorKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter' || e.shiftKey) return
        const editor = editorRef.current
        if (!editor) return
        const block = getCurrentBlock(editor)
        if (block?.tagName !== 'BLOCKQUOTE') return

        // 브라우저 기본(새 blockquote 생성) 막고, 같은 인용 안에서만 줄 추가
        e.preventDefault()

        const plain = (block.textContent ?? '').replace(/\u00a0/g, ' ').trim()
        if (!plain) {
          const align = editor.style.textAlign || block.style.textAlign
          const anchor = block.nextSibling
          block.remove()
          const p = document.createElement('p')
          p.innerHTML = '<br>'
          if (align) p.style.textAlign = align
          if (anchor) editor.insertBefore(p, anchor)
          else editor.appendChild(p)
          placeCaretIn(p)
          saveSelection()
          return
        }

        const sel = window.getSelection()
        if (!sel?.rangeCount) return
        const range = sel.getRangeAt(0)
        if (!block.contains(range.commonAncestorContainer)) return

        range.deleteContents()
        const br = document.createElement('br')
        range.insertNode(br)

        // 끝에서 줄바꿈 시 캐럿이 새 줄에 앉도록 trailing <br> 유지
        const atEnd = !br.nextSibling || (br.nextSibling.nodeType === Node.TEXT_NODE && !(br.nextSibling.textContent ?? ''))
        if (atEnd) {
          const tail = document.createElement('br')
          br.after(tail)
        }

        const next = document.createRange()
        next.setStartAfter(br)
        next.collapse(true)
        sel.removeAllRanges()
        sel.addRange(next)
        saveSelection()

        // 혹시 생긴 인접 인용은 하나로 합침
        mergeAdjacentBlockquotes(editor)
      },
      [saveSelection],
    )

    const onPaste = useCallback(
      (e: ClipboardEvent<HTMLDivElement>) => {
        const editor = editorRef.current
        if (!editor) return
        e.preventDefault()

        const clip = e.clipboardData
        const html = clip.getData('text/html')
        const text = clip.getData('text/plain')
        const cleaned = html.trim() ? sanitizePasteHtml(html, text) : sanitizePlainTextPaste(text)
        if (!cleaned) return

        editor.focus()
        restoreSelection(savedRangeRef.current)
        const ok = document.execCommand('insertHTML', false, cleaned)
        if (!ok) {
          const sel = window.getSelection()
          if (sel?.rangeCount) {
            const range = sel.getRangeAt(0)
            range.deleteContents()
            const temp = document.createElement('div')
            temp.innerHTML = cleaned
            const frag = document.createDocumentFragment()
            while (temp.firstChild) frag.appendChild(temp.firstChild)
            range.insertNode(frag)
            range.collapse(false)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
        wrapOrphanNodes(editor)
        saveSelection()
      },
      [saveSelection],
    )

    const openImagePicker = useCallback(() => {
      if (imageUploading) return
      saveSelection()
      setImageStatus('')
      imageInputRef.current?.click()
    }, [imageUploading, saveSelection])

    const onImageFileChange = useCallback(async (file: File | null) => {
      if (!file) return
      if (!file.type.startsWith('image/')) {
        setImageStatus('이미지 파일만 업로드할 수 있습니다.')
        return
      }
      setImageUploading(true)
      setImageStatus('이미지 업로드 중…')
      try {
        const uploaded = await uploadReportImage(file)
        const url = uploaded.url?.trim()
        if (!url) throw new Error('업로드 URL을 받지 못했습니다.')
        onImageUploaded?.(uploaded)
        const editor = editorRef.current
        if (editor) {
          editor.focus()
          restoreSelection(savedRangeRef.current)
          document.execCommand('insertImage', false, url)
          const imgs = editor.querySelectorAll('img')
          const last = imgs[imgs.length - 1]
          if (last && last.getAttribute('src') === url) {
            last.setAttribute('alt', file.name.replace(/\.[^.]+$/, '') || '본문 이미지')
            last.style.maxWidth = '100%'
            last.style.height = 'auto'
          }
        }
        setImageStatus('이미지가 본문에 삽입되었습니다.')
      } catch (e) {
        setImageStatus(e instanceof Error ? e.message : '이미지 업로드에 실패했습니다.')
      } finally {
        setImageUploading(false)
        if (imageInputRef.current) imageInputRef.current.value = ''
      }
    }, [onImageUploaded])

    const applyHighlight = useCallback((hex: string) => {
      const editor = editorRef.current
      if (!editor) return
      editor.focus()
      restoreSelection(savedRangeRef.current)
      document.execCommand('styleWithCSS', false, 'true')
      document.execCommand('hiliteColor', false, hex)
      document.execCommand('backColor', false, hex)
      saveSelection()
    }, [saveSelection])

    const applyTextColor = useCallback((hex: string) => {
      const editor = editorRef.current
      if (!editor) return
      editor.focus()
      restoreSelection(savedRangeRef.current)
      document.execCommand('styleWithCSS', false, 'true')
      document.execCommand('foreColor', false, hex)
      setCustomTextColor(hex)
      saveSelection()
    }, [saveSelection])

    const onCustomColorPick = useCallback(
      (hex: string) => {
        setCustomTextColor(hex)
        applyTextColor(hex)
      },
      [applyTextColor],
    )

    const highlightColors = [
      { hex: 'transparent', label: '해제' },
      { hex: '#FFF59D', label: '노랑' },
      { hex: '#FFCCBC', label: '살구' },
      { hex: '#C8E6C9', label: '연두' },
      { hex: '#B3E5FC', label: '하늘' },
      { hex: '#D1C4E9', label: '보라' },
      { hex: '#F8BBD0', label: '핑크' },
    ] as const

    const textColors = [
      { hex: '#111111', label: '검정' },
      { hex: '#b20838', label: '카야 레드' },
      { hex: '#1d4ed8', label: '파랑' },
      { hex: '#15803d', label: '초록' },
      { hex: '#6b7280', label: '회색' },
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
          title: '전체 왼쪽 정렬',
          ariaLabel: '전체 왼쪽 정렬',
          onClick: () => applyAlign('left'),
          icon: icons.alignLeft,
        },
        {
          key: 'ac',
          title: '전체 가운데 맞춤',
          ariaLabel: '전체 가운데 맞춤',
          onClick: () => applyAlign('center'),
          icon: icons.alignCenter,
        },
        {
          key: 'ar',
          title: '전체 오른쪽 정렬',
          ariaLabel: '전체 오른쪽 정렬',
          onClick: () => applyAlign('right'),
          icon: icons.alignRight,
        },
      ],
      [
        {
          key: 'quote',
          title: '인용 (Enter로 줄 추가 / 버튼으로 해제)',
          ariaLabel: '인용 토글',
          onClick: toggleQuote,
          icon: icons.quote,
        },
        { key: 'link', title: '링크 삽입', ariaLabel: '링크 삽입', onClick: insertLink, icon: icons.link },
        {
          key: 'img',
          title: imageUploading ? '이미지 업로드 중…' : '이미지 파일 업로드',
          ariaLabel: imageUploading ? '이미지 업로드 중' : '이미지 파일 업로드',
          onClick: openImagePicker,
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
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          className="admin-rich__file"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const file = e.currentTarget.files?.[0] ?? null
            void onImageFileChange(file)
          }}
        />
        <div className="admin-rich__toolbar" role="toolbar" aria-label="본문 서식">
          {groups.map((group, gi) => (
            <div key={gi} className="admin-rich__toolbar-group" role="presentation">
              {group.map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  className={`admin-rich__btn${btn.label ? ' admin-rich__btn--text' : ''}${
                    btn.key === 'img' && imageUploading ? ' is-busy' : ''
                  }`}
                  title={btn.title}
                  aria-label={btn.ariaLabel}
                  disabled={btn.key === 'img' ? imageUploading : false}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    saveSelection()
                  }}
                  onClick={btn.onClick}
                >
                  {btn.icon ?? <span className="admin-rich__btn-label">{btn.label}</span>}
                </button>
              ))}
            </div>
          ))}
          <div className="admin-rich__toolbar-group" role="presentation">
            <span className="admin-rich__hl" aria-label="글자색">
              <span
                className="admin-rich__hl-ico admin-rich__hl-ico--text-color"
                style={{ color: customTextColor }}
                aria-hidden
              >
                {icons.textColor}
              </span>
              <div className="admin-rich__hl-swatches" role="group" aria-label="글자색">
                {textColors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className="admin-rich__hl-swatch"
                    title={`글자색: ${c.label}`}
                    aria-label={`글자색: ${c.label}`}
                    style={{ backgroundColor: c.hex }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      saveSelection()
                    }}
                    onClick={() => applyTextColor(c.hex)}
                  />
                ))}
                <label
                  className="admin-rich__color-pick"
                  title="글자색 직접 선택"
                  style={{ backgroundColor: customTextColor }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    saveSelection()
                  }}
                >
                  <span className="sr-only">글자색 직접 선택</span>
                  <span className="admin-rich__color-pick-badge" aria-hidden>
                    {icons.palette}
                  </span>
                  <input
                    type="color"
                    value={customTextColor}
                    aria-label="글자색 직접 선택"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      saveSelection()
                    }}
                    onInput={(e) => onCustomColorPick(e.currentTarget.value)}
                    onChange={(e) => onCustomColorPick(e.currentTarget.value)}
                  />
                </label>
              </div>
            </span>
          </div>
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
                    onMouseDown={(e) => {
                      e.preventDefault()
                      saveSelection()
                    }}
                    onClick={() => applyHighlight(c.hex)}
                  />
                ))}
              </div>
            </span>
          </div>
        </div>
        <p className="admin-rich__hint">
          웹에서 붙여넣으면 불필요한 스타일은 제거하고 본문만 넣습니다. 인용 안에서 Enter를 누르면
          같은 인용이 늘어나고, 인용 버튼으로 해제합니다.
        </p>
        {imageStatus ? (
          <p className="admin-rich__status" role="status">
            {imageStatus}
          </p>
        ) : null}
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
          onKeyDown={onEditorKeyDown}
          onPaste={onPaste}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
        />
      </div>
    )
})
