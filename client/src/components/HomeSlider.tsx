import { useState, useEffect } from 'react'
import { SLIDER_IMAGES } from '../constants'

export function HomeSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDER_IMAGES.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="mfn-main-slider rev_slider_wrapper">
      <div className="rev_slider home-khayah-slider">
        <ul>
          {SLIDER_IMAGES.map((src, i) => (
            <li
              key={src}
              data-transition="fade"
              style={{ display: i === index ? 'block' : 'none' }}
            >
              <div
                className="slotholder"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundColor: '#e7e7e7',
                  width: '100%',
                  height: '100%',
                  minHeight: '400px',
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="slider-nav">
        {SLIDER_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
