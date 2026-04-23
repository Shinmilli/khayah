import { useState } from 'react'

/** 홈 `HeroSection` / `#home-hero-banner` 슬라이드와 동일한 구조(연동 시 참고) */
const mockHeroSlides = [
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
] as const

export function AdminBannerPage() {
  const [selectedHeroId, setSelectedHeroId] = useState<string>(mockHeroSlides[0].id)
  const selectedHero = mockHeroSlides.find((s) => s.id === selectedHeroId) ?? mockHeroSlides[0]

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">메인 배너 관리</h1>
          <p className="admin-page__desc">
            홈 상단 <strong>히어로 배너</strong> — 메인 <code>#home-hero-banner</code> 슬라이드의{' '}
            <strong>배경 이미지</strong>와 오버레이 <strong>문구(줄 단위)</strong>, <strong>alt</strong>를
            관리합니다. (현재 홈은 <code>HERO_SLIDES</code> 정적 데이터)
          </p>
        </div>
      </div>

      <section className="admin-panel" aria-labelledby="hero-heading">
        <h2 id="hero-heading" className="admin-panel__title">
          홈 히어로 슬라이드
        </h2>
        <p className="admin-panel__foot admin-panel__subnote">
          슬라이드별 <strong>배경 사진</strong>, <strong>한국어 문구</strong>, <strong>이미지 설명(alt)</strong>{' '}
          수정 목업입니다.
        </p>

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
                  {mockHeroSlides.map((slide) => (
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
            <h3 className="admin-subpanel__title">선택 슬라이드 편집 (목업)</h3>
            <p className="admin-fieldset__hint admin-fieldset__hint--flush">
              슬라이드: {selectedHero.order}번 · {selectedHero.alt}
            </p>
            <div className="admin-form-grid">
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">배너 배경 이미지</span>
                <div className="admin-upload">
                  <div className="admin-upload__preview admin-upload__preview--wide" aria-hidden>
                    <span>16:9 미리보기</span>
                  </div>
                  <div className="admin-upload__actions">
                    <button type="button" className="admin-btn admin-btn--ghost" disabled>
                      이미지 교체
                    </button>
                    <p className="admin-upload__hint">현재 경로: {selectedHero.image}</p>
                  </div>
                </div>
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">배너 문구 (줄마다 한 블록 · 홈 hero-text-kr)</span>
                <textarea
                  className="admin-input admin-input--area"
                  readOnly
                  rows={4}
                  value={selectedHero.lines.join('\n')}
                />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">이미지 설명 (alt)</span>
                <input className="admin-input" type="text" readOnly value={selectedHero.alt} />
              </label>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="admin-btn" disabled>
                미리보기
              </button>
              <button type="button" className="admin-btn admin-btn--primary" disabled>
                배너 반영
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
