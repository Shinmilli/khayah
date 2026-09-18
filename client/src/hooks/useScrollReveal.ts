import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GROUP_SELECTOR = [
  '.home-section-intro',
  '.partners-head',
  '.page-hero__inner',
  '.overseas-hero .ov-wrap',
  '.domestic-hero .dom-wrap',
  '.ov-edu-hero .ov-edu-wrap',
  '.ov-health-hero .ov-health-wrap',
  '.edu-ref-hero .edu-wrap',
  '.adv-hero .adv-wrap',
  '.adv-block__head',
  '.ov-edu-head',
  '.vmv-hero',
  '.sg-hero .sg-wrap',
  '.inquiry-section-head',
  '.story-archive__head',
  '.greeting-modern .sidebar',
].join(',')

const BLOCK_SELECTOR = [
  '.overseas-item',
  '.domestic-item',
  '.adv-item',
  '.edu-ref-grid > div',
  '.projects-lead',
  '.khayah-ci-page__h',
  '.khayah-ci-page__sub',
  '.khayah-ci-legend__item',
].join(',')

const SKIP_CHILD = /(divider|scroll|filter|toast|bg|visual|legend|hero__inner|lockup)/i

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isTexty(el: HTMLElement): boolean {
  if (el.getAttribute('aria-hidden') === 'true') return false
  if (SKIP_CHILD.test(el.className)) return false
  return Boolean(el.textContent?.trim())
}

function collectGroupItems(root: HTMLElement): HTMLElement[] {
  const direct = [...root.children].filter((el): el is HTMLElement => el instanceof HTMLElement && isTexty(el))
  if (direct.length > 0) return direct.slice(0, 5)
  return [...root.querySelectorAll<HTMLElement>('h1, h2, h3, p')].filter(isTexty).slice(0, 4)
}

function armGroup(root: HTMLElement) {
  if (root.dataset.revealArmed === '1') return
  const items = collectGroupItems(root)
  if (items.length === 0) return
  root.classList.add('reveal-copy')
  items.forEach((item, i) => {
    item.classList.add('reveal-copy__item')
    item.style.setProperty('--reveal-i', String(i))
  })
  root.dataset.revealArmed = '1'
}

function armBlock(el: HTMLElement) {
  if (el.dataset.revealArmed === '1') return
  if (el.closest('.reveal-copy')) return
  el.classList.add('reveal-block')
  el.dataset.revealArmed = '1'
}

export function useScrollReveal() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const root = document.getElementById('Content') ?? document.body
    const reduced = prefersReducedMotion()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    const scan = () => {
      root.querySelectorAll<HTMLElement>(GROUP_SELECTOR).forEach((el) => {
        armGroup(el)
        if (!el.classList.contains('reveal-copy') || el.classList.contains('is-revealed')) return
        if (reduced) {
          el.classList.add('is-revealed')
          return
        }
        io.observe(el)
      })
      root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR).forEach((el) => {
        armBlock(el)
        if (!el.classList.contains('reveal-block') || el.classList.contains('is-revealed')) return
        if (reduced) {
          el.classList.add('is-revealed')
          return
        }
        io.observe(el)
      })
    }

    scan()
    const frame = window.requestAnimationFrame(scan)

    const mo = new MutationObserver(() => {
      window.requestAnimationFrame(scan)
    })
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      window.cancelAnimationFrame(frame)
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname, search])
}
