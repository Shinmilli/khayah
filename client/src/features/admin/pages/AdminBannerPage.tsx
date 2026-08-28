import { useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'

type HeroSlide = {
  id: string
  order: number
  image: string
  alt: string
  lines: string[]
}

const initialHeroSlides: HeroSlide[] = [
  {
    id: 'h1',
    order: 1,
    image: '/images/Home/slider/SliderImg1.JPG',
    alt: '아이들 이미지',
    lines: ['카야는', '사람을 키우고 섬기는', '개발 NGO 입니다.'],
  },
  {
    id: 'h2',
    order: 2,
    image: '/images/Home/slider/sliderImg2.jpg',
    alt: '함께 만들어가는 세상',
    lines: ['함께 만들어가는', '따뜻한 세상'],
  },
  {
    id: 'h3',
    order: 3,
    image: '/images/Home/slider/sliderImg3.jpg',
    alt: '작은 변화와 희망',
    lines: ['작은 변화가', '큰 희망을 만듭니다'],
  },
]

export function AdminBannerPage() {
  const [slides, setSlides] = useState<HeroSlide[]>(() => initialHeroSlides.map((s) => ({ ...s, lines: [...s.lines] })))
  const [selectedHeroId, setSelectedHeroId] = useState<string>(initialHeroSlides[0].id)
  const selectedHero = slides.find((s) => s.id === selectedHeroId) ?? slides[0]

  const updateSelectedSlide = (patch: Partial<HeroSlide>) => {
    if (!selectedHero) return
    setSlides((list) => list.map((s) => (s.id === selectedHero.id ? { ...s, ...patch } : s)))
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">메인 배너 관리</h1>
          <p className="admin-page__desc">
            홈 상단 히어로 슬라이드의 배경 이미지·문구·alt를 관리합니다. 이미지는 Cloudinary/Supabase에
            업로드됩니다. (홈 연동 API는 추후 — 현재 이 화면에서의 변경은 미리보기·목업용)
          </p>
        </div>
      </div>

      <section className="admin-panel" aria-labelledby="hero-heading">
        <h2 id="hero-heading" className="admin-panel__title">
          홈 히어로 슬라이드
        </h2>

        <div className="admin-split admin-split--hero">
          <div>
            <h3 className="admin-subpanel__title">슬라이드 목록</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">순서</th>
                    <th scope="col">문구 미리보기</th>
                    <th scope="col">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide) => (
                    <tr
                      key={slide.id}
                      className={slide.id === selectedHeroId ? 'admin-table__row--selected' : undefined}
                    >
                      <td>{slide.order}</td>
                      <td>
                        <span className="admin-hero-preview">{slide.lines.join(' · ')}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                          onClick={() => setSelectedHeroId(slide.id)}
                        >
                          편집 선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="admin-subpanel__title">선택 슬라이드 편집</h3>
            <p className="admin-fieldset__hint admin-fieldset__hint--flush">
              슬라이드: {selectedHero.order}번 · {selectedHero.alt}
            </p>
            <div className="admin-form-grid">
              <AdminMediaUpload
                label="배너 배경 이미지"
                hint="16:9 권장 · 업로드 후 URL이 슬라이드에 반영됩니다."
                variant="image"
                layout="wide"
                value={/^https?:\/\//i.test(selectedHero.image) ? selectedHero.image : null}
                onChange={(url) => {
                  if (url) updateSelectedSlide({ image: url })
                }}
              />
              {!/^https?:\/\//i.test(selectedHero.image) ? (
                <p className="admin-media-upload__hint">
                  현재 정적 경로: {selectedHero.image} — 업로드하면 HTTPS URL로 교체됩니다.
                </p>
              ) : null}
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">배너 문구 (줄마다 Enter)</span>
                <textarea
                  className="admin-input admin-input--area"
                  rows={4}
                  value={selectedHero.lines.join('\n')}
                  onChange={(e) =>
                    updateSelectedSlide({
                      lines: e.target.value.split('\n').map((l) => l.trimEnd()),
                    })
                  }
                />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">이미지 설명 (alt)</span>
                <input
                  className="admin-input"
                  type="text"
                  value={selectedHero.alt}
                  onChange={(e) => updateSelectedSlide({ alt: e.target.value })}
                />
              </label>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="admin-btn" disabled>
                미리보기
              </button>
              <button type="button" className="admin-btn admin-btn--primary" disabled>
                배너 반영 (홈 API 연동 예정)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
