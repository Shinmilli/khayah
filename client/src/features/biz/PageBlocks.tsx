import { Fragment } from 'react'
import { blockHasContent, type PageBlock } from './pageBlockTypes'
import { isExternalHref, normalizeHref } from '../../utils/hrefs'
import '../../styles/page-blocks.css'

function Title({ text, emphasis }: { text: string; emphasis: string }) {
  const at = emphasis ? text.indexOf(emphasis) : -1
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <span>{emphasis}</span>
      {text.slice(at + emphasis.length)}
    </>
  )
}

function Lead({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  )
}

function BlockView({ block }: { block: PageBlock }) {
  if (block.type === 'intro') {
    const side = block.photoSide
    return (
      <section className={`pblk-intro${side === 'none' ? ' is-center' : ''}${side === 'left' ? ' is-left' : ''}`}>
        <div>
          {block.kicker ? <p className="pblk-kicker">{block.kicker}</p> : null}
          {block.title ? (
            <h2 className="pblk-title">
              <Title text={block.title} emphasis={block.emphasis} />
            </h2>
          ) : null}
          {block.lead ? (
            <p className="pblk-lead">
              <Lead text={block.lead} />
            </p>
          ) : null}
        </div>
        {side !== 'none' && block.photo ? (
          <figure className="pblk-photo">
            <img src={block.photo} alt={block.photoAlt} />
          </figure>
        ) : null}
      </section>
    )
  }
  if (block.type === 'facts') {
    return (
      <section className="pblk-band">
        <div className="pblk-wrap pblk-facts">
          {block.cards
            .filter((card) => card.value.trim())
            .map((card) => (
              <div key={`${card.value}-${card.note}`} className="pblk-fact">
                <b>
                  {card.value}
                  <small>{card.unit}</small>
                </b>
                <strong>{card.note}</strong>
                {card.source ? <span>{card.source}</span> : null}
              </div>
            ))}
        </div>
      </section>
    )
  }
  if (block.type === 'flow') {
    const steps = block.steps.filter((step) => step.name.trim())
    return (
      <section className="pblk-band">
        <div className="pblk-wrap">
          {block.kicker || block.title ? (
            <div className="pblk-head">
              {block.kicker ? <p className="pblk-kicker">{block.kicker}</p> : null}
              {block.title ? <h2 className="pblk-title pblk-title--sub">{block.title}</h2> : null}
            </div>
          ) : null}
          <div className="pblk-steps">
            {steps.map((step, index) => (
              <div key={`${step.name}-${index}`} className="pblk-step">
                <i>{index + 1}</i>
                <b>{step.name}</b>
                {step.body ? <span>{step.body}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  if (block.type === 'cards') {
    return (
      <section className="pblk-plain">
        <div className="pblk-wrap">
          {block.title ? <h2 className="pblk-title pblk-title--sub">{block.title}</h2> : null}
          <div className="pblk-cards">
            {block.items
              .filter((item) => item.title.trim() || item.body.trim())
              .map((item, index) => {
                const body = (
                  <>
                    {item.title ? <b>{item.title}</b> : null}
                    {item.body ? <span>{item.body}</span> : null}
                  </>
                )
                return item.href.trim() ? (
                  <a key={`${item.title}-${index}`} className="pblk-card" href={item.href}>
                    {body}
                  </a>
                ) : (
                  <div key={`${item.title}-${index}`} className="pblk-card">
                    {body}
                  </div>
                )
              })}
          </div>
        </div>
      </section>
    )
  }
  if (block.type === 'timeline') {
    return (
      <section className="pblk-plain">
        <div className="pblk-wrap pblk-time">
          {block.items
            .filter((item) => item.year.trim() || item.title.trim())
            .map((item, index) => (
              <div key={`${item.year}-${index}`} className="pblk-year">
                {item.year ? <b>{item.year}</b> : null}
                {item.title ? <strong>{item.title}</strong> : null}
                {item.body ? <span>{item.body}</span> : null}
              </div>
            ))}
        </div>
      </section>
    )
  }
  if (block.type === 'cases') {
    return (
      <section className="pblk-plain">
        <div className="pblk-wrap">
          {block.items
            .filter((item) => item.title.trim() || item.body.trim())
            .map((item, index) => (
              <div key={`${item.title}-${index}`} className="pblk-case">
                {item.title ? <b>{item.title}</b> : null}
                {item.body ? <span>{item.body}</span> : null}
              </div>
            ))}
        </div>
      </section>
    )
  }
  const photos = block.photos.filter((photo) => photo.src.trim())
  if (block.type === 'image') {
    const photo = photos[0]
    if (!photo) return null
    return (
      <section className="pblk-plain">
        <figure className="pblk-wrap pblk-wide">
          <img src={photo.src} alt={photo.alt} />
          {photo.alt ? <figcaption>{photo.alt}</figcaption> : null}
        </figure>
      </section>
    )
  }
  return (
    <section className="pblk-plain">
      <div className={`pblk-wrap pblk-grid${photos.length < 3 ? ' is-short' : ''}`}>
        {photos.map((photo) => (
          <figure key={photo.src} className="pblk-shot">
            <img src={photo.src} alt={photo.alt} />
            {photo.alt ? <figcaption>{photo.alt}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  )
}

export function PageBlocks({ blocks }: { blocks?: PageBlock[] }) {
  const shown = (blocks ?? []).filter((block) => block.enabled && blockHasContent(block)).sort((a, b) => a.order - b.order)
  if (!shown.length) return null
  return (
    <div className="pblk">
      {shown.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </div>
  )
}
