import type { StoryChangeStep } from './storyHelpers'

type Props = {
  steps: StoryChangeStep[]
  /** Compact key–value list (impact overview). Default: detail journey layout. */
  variant?: 'detail' | 'compact'
}

export function StoryChangeSteps({ steps, variant = 'detail' }: Props) {
  if (steps.length === 0) return null

  if (variant === 'compact') {
    return (
      <div className="impact-story__rows" role="list">
        {steps.map((step) => (
          <div key={step.key} role="listitem">
            <b>{step.en}</b>
            <span>{step.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="story-journey" aria-labelledby="story-journey-title">
      <header className="story-journey__head">
        <p className="story-journey__kicker">CHANGE JOURNEY</p>
        <h2 id="story-journey-title">변화의 과정</h2>
        <p>참여 전부터 이어지는 변화까지, 한 사례의 흐름입니다.</p>
      </header>
      <ol className="story-journey__list">
        {steps.map((step, index) => (
          <li key={step.key} className="story-journey__item">
            <div className="story-journey__rail" aria-hidden="true">
              <span className="story-journey__dot" />
              {index < steps.length - 1 ? <span className="story-journey__line" /> : null}
            </div>
            <div className="story-journey__card">
              <p className="story-journey__meta">
                <span className="story-journey__num">{String(index + 1).padStart(2, '0')}</span>
                <span className="story-journey__en">{step.en}</span>
                <span className="story-journey__ko">{step.ko}</span>
              </p>
              <p className="story-journey__body">{step.value}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
