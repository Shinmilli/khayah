import type { ProjectSet } from './projectSetTypes'

/**
 * 국내 진행사업 모양 확인용 샘플 1건. 시안 ProjectSample 첫 사업 원문.
 * 영문 칸은 비움. 기존 게시글은 이 데이터로 바꾸지 않는다.
 *
 * 임시 사진 (드라이브 사진이 오면 src만 교체)
 * - 슬라이드 1 [사진 1] 청년 해외연수 사전교육 → /images/business/research-edu-model-1.jpg
 * - 슬라이드 2 넘김용 청년 교육 강의 → /images/business/research-academy-2.jpg
 * - 슬라이드 3 넘김용 청년 교육 강의 → /images/business/domestic-edu-3.jpg
 * - 하단 [사진] 사전교육 소그룹 워크숍 → /images/business/overseas-edu-future-1.jpg
 * - 하단 [사진] Life Design 워크북 작성 → /images/business/research-edu-model-2.jpg
 * - 하단 [사진] 디렉터 진행 장면 → /images/business/research-academy-1.jpg
 */
export const DOMESTIC_PROJECT_SAMPLE: ProjectSet[] = [
  {
    id: 'sample-youth-predeparture',
    year: 2026,
    eyebrow: 'CAREER & FUTURE SKILLS · 진로·미래역량 교육',
    title: '청년 해외연수 사전교육',
    period: '2026',
    audience: '청년',
    partner: '[협력기관]',
    paragraphs: [
      '디자인 씽킹을 진로교육에 적용한 Life Design 커리큘럼과 워크북을 카야 교육 전문가 그룹이 직접 개발했습니다.',
      '경기도·서울시·통일과나눔재단 사업을 거치며 청년 수백 명과 현장에서 검증했습니다.',
      '참가자 사전교육과 인솔자 선발·교육·관리를 맡습니다.',
    ],
    slides: [
      {
        src: '/images/business/research-edu-model-1.jpg',
        alt: '[사진 1] 청년 해외연수 사전교육',
      },
      {
        src: '/images/business/research-academy-2.jpg',
        alt: '청년 해외연수 사전교육',
      },
      {
        src: '/images/business/domestic-edu-3.jpg',
        alt: '청년 해외연수 사전교육',
      },
    ],
    showArrows: false,
    steps: [
      { kicker: 'DISCOVER', title: '자기이해', detail: '강점·가치관·행동 패턴 정리' },
      { kicker: 'EXPLORE', title: '직업·사회 탐색', detail: '직무 체험, 현장 방문, 멘토링' },
      {
        kicker: 'DESIGN',
        title: '진로·삶 설계',
        detail: '미래 시나리오와 실행 계획 완성',
        emphasis: true,
      },
    ],
    facts: [
      { value: '77.9', unit: '%', label: '"진로를 설계하는 방법을 익히는 데 도움이 됐다"' },
      { value: '93.6', unit: '%', label: '"진로 탐색 의지가 높아졌다"' },
      { value: '[0.0]', unit: '/5', label: '[만족도 항목]' },
    ],
    note: 'Life Design 워크숍 사후 설문',
    photos: [
      {
        src: '/images/business/overseas-edu-future-1.jpg',
        alt: '[사진] 사전교육 소그룹 워크숍. 테이블별로 워크북을 펼쳐 놓고 토론하는 장면',
      },
      {
        src: '/images/business/research-edu-model-2.jpg',
        alt: '[사진] Life Design 워크북 작성. 참가자 손과 워크북 페이지 클로즈업',
      },
      {
        src: '/images/business/research-academy-1.jpg',
        alt: '[사진] 디렉터 진행 장면. 디렉터(퍼실리테이터)가 그룹을 이끄는 모습',
      },
    ],
  },
]
