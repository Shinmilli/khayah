import { useEffect, useRef } from 'react'
import { educationAxesActive } from './educationAxes'
import { useProjectSets } from './useProjectSets'
import type { EducationAxis } from './projectSetTypes'

function Axis({ axis, sand }: { axis: EducationAxis; sand: boolean }) {
  if (axis.enabled === false) return null
  if (axis.mode === 'image') {
    if (!axis.image.trim()) return null
    return (
      <section className={`oedu-block${sand ? ' oedu-block--sand' : ''}`}>
        <div className="oedu-wrap">
          <img className="oedu-replace" src={axis.image} alt={axis.title.replace(/\n/g, ' ')} />
        </div>
      </section>
    )
  }
  const photos = axis.photos.filter((photo) => photo.src.trim())
  const cards = axis.cards.filter((card) => card.title.trim() || card.body.trim())
  const cases = axis.cases.filter((item) => item.place.trim() || item.body.trim())
  return (
    <section className={`oedu-block${sand ? ' oedu-block--sand' : ''}`}>
      <div className="oedu-wrap">
        <div className="oedu-ax">
          <div className="oedu-axh">
            {axis.label.trim() ? <p className="oedu-axe">{axis.label}</p> : null}
            <p className="oedu-axt">
              {axis.title.split('\n').map((line, index) => (
                <span key={index}>
                  {index ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div>
            {axis.phrase.trim() ? <p className="oedu-axs">{axis.phrase}</p> : null}
            {axis.body.trim() ? <p className="oedu-tx">{axis.body}</p> : null}
          </div>
        </div>
        {cards.length ? (
          <div className="oedu-bxg">
            {cards.map((card) => (
              <div key={`${card.title}-${card.subtitle}`} className="oedu-bxc">
                {card.title.trim() ? <p className="oedu-bxt">{card.title}</p> : null}
                {card.subtitle.trim() && !card.subtitle.includes('→') ? <p className="oedu-bxs">{card.subtitle}</p> : null}
                {card.body.trim() ? <p className="oedu-bxd">{card.body}</p> : null}
                {card.subtitle.includes('→') || card.tag.trim() ? (
                  <p className="oedu-flow">
                    {card.subtitle.includes('→') ? card.subtitle : null}
                    {card.tag.trim() ? <small>{card.tag}</small> : null}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        {cases.length ? (
          <div className="oedu-bxg">
            {cases.map((item) => (
              <div key={`${item.place}-${item.body}`} className="oedu-bxc">
                {item.place.trim() ? <p className="oedu-bxt">{item.place}</p> : null}
                {item.body.trim() ? <p className="oedu-bxd">{item.body}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
        {photos.length ? (
          <div className="oedu-photos">
            {photos.map((photo) => (
              <img key={photo.src} src={photo.src} alt={photo.alt} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function OverseasEducationPrograms() {
  const doc = useProjectSets()
  const axes = doc?.pages.education.axes ?? []
  const active = educationAxesActive(axes)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const blocks = [...document.querySelectorAll<HTMLElement>('.oedu-page .oedu-block')].filter((block) => !ref.current?.contains(block))
    blocks.forEach((block) => {
      block.hidden = active
    })
    const slot = document.querySelector('.oedu-page .oedu-cta')
    const node = ref.current
    if (active && slot && node) slot.parentElement?.insertBefore(node, slot)
    return () => {
      blocks.forEach((block) => {
        block.hidden = false
      })
    }
  }, [active, axes])

  if (!active) return null
  return (
    <div ref={ref}>
      {axes.map((axis, index) => (
        <Axis key={`${axis.label}-${index}`} axis={axis} sand={index === 1} />
      ))}
    </div>
  )
}
