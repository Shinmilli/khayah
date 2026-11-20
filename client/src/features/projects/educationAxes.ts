import type { EducationAxis } from './projectSetTypes'

export const DEFAULT_EDUCATION_AXES: EducationAxis[] = [
  {
    label: 'FOUNDATIONAL CAPACITY BUILDING',
    phrase: 'Power to accept change',
    title: '기초역량\n강화사업',
    body: '스스로 배우고 삶의 과제에 대응하는 힘은 지속적인 성장의 토대입니다. 카야는 읽기·쓰기·수리력 등 기초학습과 자기이해·의사소통·문제해결 등 삶의 역량을 함께 키웁니다. 참여자가 배움을 이어가고, 자신과 공동체를 이해하며 주체적으로 살아가도록 지원합니다.',
    cards: [
      {
        title: '기초학습역량',
        subtitle: '',
        body: '국어(읽기·쓰기·말하기), 수리, 영어, 과학 등 지속적인 학업과 심화 학습으로 이어지도록 지원하는 필수 기초지식과 학습능력',
        tag: '',
      },
      {
        title: 'Life Skills',
        subtitle: '',
        body: '자기이해, 의사소통, 대인관계, 건강·재정관리, 비판적·창의적 사고, 문제해결 등 일상과 삶의 과제에 주체적이고 사회협력적으로 대응하기 위한 기본 역량',
        tag: '',
      },
    ],
    cases: [],
    photos: [
      { src: '/images/business/overseas-edu-foundation-1.jpg', alt: '학습지를 들고 있는 아이들' },
      { src: '/images/business/overseas-edu-foundation-2.jpg', alt: '수학 수업을 듣는 학생들' },
      { src: '/images/business/overseas-edu-foundation-3.jpg', alt: 'Life Skills 교육 현장' },
    ],
    enabled: true,
    mode: 'text',
    image: '',
  },
  {
    label: 'FUTURE-ORIENTED EDUCATION',
    phrase: 'Dream Seekers',
    title: '미래지향\n교육',
    body: '청소년과 청년이 변화하는 사회를 이해하고 자신의 미래를 주도적으로 설계하도록 돕습니다. 지역의 교육·산업 환경과 참여자의 관심을 바탕으로 진로·직업교육과 미래 분야 역량을 위한 STEM 교육을 함께 운영하며, 배운 것을 삶과 지역의 과제에 적용하는 힘을 키웁니다.',
    cards: [
      {
        title: '맞춤형 진로·직업훈련',
        subtitle: '인식개선 → 탐색 → 설계 → 실행',
        body: '자신의 흥미와 강점, 직업과 공동체의 가치를 이해하고 다양한 직업과 삶의 경로를 탐색합니다. 기술교육, 멘토링, 진로체험 등 필요에 맞는 지원으로 구체화합니다.',
        tag: '4단계 맞춤형 지원',
      },
      {
        title: 'STEM 융합 탐구 교육',
        subtitle: '인식확산형(진로강연·박람회) → 단기 집중 체험형(캠프) → 심화탐구형(클럽) → 문제해결기획 경연형(콘테스트)',
        body: '과학·기술·공학·수학을 연결하여 질문하고, 실험과 프로젝트 활동을 통해 탐구하며 문제해결 역량을 키웁니다.',
        tag: '4단계 심화 지원',
      },
    ],
    cases: [],
    photos: [
      { src: '/images/business/overseas-edu-future-1.jpg', alt: 'Life Design 진로탐색' },
      { src: '/images/business/overseas-edu-future-2.jpg', alt: '직업기술 체험 현장' },
      { src: '/images/business/overseas-edu-future-3.jpg', alt: 'STEM 융합 탐구 수업' },
    ],
    enabled: true,
    mode: 'text',
    image: '',
  },
  {
    label: 'EDUCATION QUALITY IMPROVEMENT',
    phrase: 'EQUIP (Education Quality Improvement Program)',
    title: '교육 질\n개선사업',
    body: '배움의 기회를 넓히고 교육 격차를 줄이는 일과 함께, 교실에서 이루어지는 교육의 질을 높입니다. 교사와 학교, 지역사회가 협력해 수업과 학습환경을 개선하도록 지원합니다. 현장의 필요에 맞는 교사교육과 교육자료, 학습 지원을 연결하고, 그 경험을 함께 돌아보며 더 나은 교육 방법을 발전시킵니다.',
    cards: [
      {
        title: '교사 역량 강화',
        subtitle: '교육자',
        body: '필수적이고 선진적인 교수법 발굴과 교육, 학교 운영·리더십 역량 강화, 교사 간 수업 경험 공유',
        tag: '',
      },
      {
        title: '학습 콘텐츠 및 교육환경 개선',
        subtitle: '학습자',
        body: '교육 패러다임 및 교육 정책 기조에 발맞추는 학습자료와 학습공간 개선',
        tag: '',
      },
      {
        title: '학부모·지역사회 협력',
        subtitle: '지원자',
        body: '학습 독려를 위한 학부모와 지역사회 참여·인식개선, 안전하고 집중할 수 있는 학습환경 조성, 현장 필요에 따른 장학 지원',
        tag: '',
      },
    ],
    cases: [],
    photos: [
      { src: '/images/business/overseas-edu-quality-1.jpg', alt: '교사 역량강화 연수' },
      { src: '/images/business/overseas-edu-quality-2.jpg', alt: '이러닝 교육 플랫폼으로 공부하는 학생' },
      { src: '/images/business/overseas-edu-quality-3.jpg', alt: '학부모 인식개선 행사' },
    ],
    enabled: true,
    mode: 'text',
    image: '',
  },
]

export function educationAxesActive(axes: EducationAxis[] | undefined): boolean {
  return (axes ?? []).some((axis) => {
    if (axis.enabled === false) return false
    if (axis.mode === 'image') return Boolean(axis.image.trim())
    return (
      axis.title.trim() ||
      axis.body.trim() ||
      axis.cards.some((card) => card.title.trim() || card.body.trim()) ||
      axis.cases.some((item) => item.place.trim() || item.body.trim()) ||
      axis.photos.some((photo) => photo.src.trim())
    )
  })
}
