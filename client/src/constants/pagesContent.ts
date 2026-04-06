/**
 * 워드프레스 페이지별 정적 콘텐츠 (DB 마이그레이션 전 fallback)
 * 키: pathname (앞 슬래시 제외, 예: "카야/카야소개", "해외사업")
 */
export interface StaticPage {
  title: string
  /** HTML 또는 텍스트 */
  content: string
}

export const PAGES_STATIC: Record<string, StaticPage> = {
  '카야/카야소개': {
    title: '카야 소개',
    content: `
<section id="about" class="page-section">
  <h2>정의</h2>
  <h3>카야는 사람을 키우고 섬기는 개발 NGO입니다.</h3>
  <p>카야는 올바른 인도를 통해 성장한 한 사람의 힘이 큰 변혁을 이끌어 낼 수 있음을 믿습니다. 그리하여 그들이 온 땅 곳곳에서 이 세상을 더 나은 곳으로 만들어 갈 수 있도록 돕고자 합니다.</p>
</section>
<section id="vision" class="page-section">
  <h2>비전 &amp; 미션</h2>
  <p>우리는 한 사람의 변화가 전체의 변화로 이어짐을 믿으며, 그 한 사람을 위해 노력합니다.</p>
</section>
<section id="value" class="page-section">
  <h2>핵심가치</h2>
  <p>카야의 핵심가치를 담아 일관된 사업을 추진합니다.</p>
</section>
<section id="ci" class="page-section">
  <h2>카야 CI</h2>
  <p>카야의 정체성과 시각적 일관성을 소개합니다.</p>
</section>
<section id="history" class="page-section">
  <h2>연혁</h2>
  <p>카야의 발자취를 연도별로 정리했습니다. 자세한 내용은 <a href="/카야/카야-연혁">카야 연혁</a> 페이지를 참고하세요.</p>
</section>
<section id="members" class="page-section">
  <h2>조직도</h2>
  <p>카야의 조직 구성과 역할을 안내합니다.</p>
</section>
`,
  },
  '카야/카야-스토리': {
    title: '인사말(카야스토리)',
    content: '<p>카야가 걸어온 이야기와 현장의 소식을 전합니다.</p>',
  },
  '카야/카야-연혁': {
    title: '카야 연혁',
    content: `
<p>카야는 앞으로도 소외된 이웃들과 함께 걸어 가겠습니다.</p>
<h3>2024</h3>
<ul class="li_title">
  <li><b>01</b> WFK 해외 장기봉사단 파견기관 선정 &#39;키르기스스탄&#39;</li>
  <li><b>05</b> 경기도 국제개발협력사업 3년 연속 선정 &#39;기후 위기 대응 청년 특사단&#39;</li>
  <li><b>07</b> 삼성꿈장학재단 국외장학사업 4년 연속 선정 &#39;미얀마 도시빈민마을 청소년 꿈도서관 지원&#39;</li>
  <li><b>08</b> 단기해외봉사단(기후특사단) 120명 파견 &#39;몽골, 키르기스스탄, 우즈베키스탄&#39;</li>
  <li><b>09</b> 지정기부금 공익법인 지정연장(6년)</li>
</ul>
<h3>2023</h3>
<ul class="li_title">
  <li><b>01</b> 사랑의열매 해외지원 다년도(3년) 사업 선정 &#39;키르기스스탄 도시빈민학생 STEM 역량 강화 이러닝학습센터 운영&#39;</li>
  <li><b>07</b> 경기도 국제개발협력사업 2년 연속 선정 &#39;키르기스스탄 청(소)년 프로젝트 기반 STEM 교육&#39;</li>
</ul>
<p>이전 연도 연혁은 자료실에서 확인하실 수 있습니다.</p>
`,
  },
  '카야/위치안내': {
    title: '오시는 길',
    content: `
<p><strong>카야코리아</strong><br/>
04080 서울특별시 마포구 토정로 174</p>
<p>T 031 689 3639 | E khayahkorea@gmail.com</p>
<p>대중교통 이용 시 안내문을 참고해 주세요.</p>
`,
  },
  '카야/조직도': {
    title: '조직도',
    content: '<p>카야의 조직 구성과 역할을 안내합니다.</p>',
  },
  '카야/이사회-전문위원': {
    title: '이사회 / 전문위원',
    content: '<p>이사회 및 전문위원 구성을 안내합니다.</p>',
  },
  '카야/핵심사업': {
    title: '핵심사업',
    content: '<p>카야의 핵심 사업을 소개합니다. <a href="/사업/진행사업">진행사업</a>에서 상세 내용을 확인하실 수 있습니다.</p>',
  },
  '해외사업': {
    title: '해외사업',
    content: '<p>네팔, 미얀마, 키르기스스탄 등에서 국제개발협력 사업을 진행합니다. 교육·보건의료·옹호사업을 통해 현지 공동체와 함께 성장합니다.</p><p><a href="/사업/진행사업">진행사업</a> · <a href="/해외사업/교육">교육</a> · <a href="/해외사업/보건의료">보건의료</a></p>',
  },
  '해외사업/교육': {
    title: '교육',
    content: '<p>해외 현지 아동·청소년 대상 교육 지원, 교사 연수, 교육 인프라 지원 사업을 진행합니다.</p>',
  },
  '해외사업/보건의료': {
    title: '보건의료',
    content: '<p>보건의료 접근성 개선, 의료 지원, 보건 교육 사업을 진행합니다.</p>',
  },
  '국내사업': {
    title: '국내사업',
    content: '<p>국내에서 이웃과 함께하는 나눔·교육·옹호 사업을 진행합니다. 우리 옆에 있지만 소외된 이웃과 함께합니다.</p>',
  },
  '사업/옹호사업': {
    title: '옹호사업',
    content: '<p>정책 옹호와 인권·사회적 약자 지원을 위한 옹호 사업을 소개합니다.</p>',
  },
  '사업/진행사업': {
    title: '진행사업',
    content: '<p>현재 진행 중인 사업을 지역별·분야별로 안내합니다.</p><p><a href="/사업/진행사업/네팔">네팔</a> · <a href="/사업/진행사업/미얀마">미얀마</a> · <a href="/사업/진행사업/키르기즈스탄">키르기즈스탄</a> · <a href="/사업/진행사업/국내">국내</a></p>',
  },
  '사업/진행사업/네팔': {
    title: '네팔',
    content: '<p>네팔 현지 교육·보건·공동체 개발 사업을 진행합니다.</p>',
  },
  '사업/진행사업/미얀마': {
    title: '미얀마',
    content: '<p>미얀마 도시빈민마을 청소년 꿈도서관 지원 등 교육·보건 사업을 진행합니다.</p>',
  },
  '사업/진행사업/키르기즈스탄': {
    title: '키르기즈스탄',
    content: '<p>키르기스스탄 도시빈민학생 STEM 역량 강화, 청년 프로젝트 등 사업을 진행합니다.</p>',
  },
  '사업/진행사업/국내': {
    title: '국내',
    content: '<p>국내 진행사업을 안내합니다.</p>',
  },
  '후원가이드/후원자-가이드': {
    title: '후원자 가이드',
    content: `
<p>카야를 후원해 주시는 분들을 위한 안내입니다.</p>
<h3>후원 방법</h3>
<p>정기후원, 일시후원, 지정기부금 등 다양한 방법으로 참여하실 수 있습니다.</p>
<h3>후원계좌</h3>
<p><strong>예금주</strong> (사)카야인터내셔널<br/>
<strong>우리</strong> 1005 403 029492　 <strong>농협</strong> 301 1122 4444 01<br/>
<strong>국민</strong> 584101 01 286346　 <strong>신한</strong> 100 034 744590</p>
<h3>문의</h3>
<p>T 031 689 3639 | E khayahkorea@gmail.com</p>
`,
  },
  '후원가이드/후원신청': {
    title: '후원신청',
    content: '<p>후원 신청 및 정기후원 안내 페이지입니다. 문의: khayahkorea@gmail.com / 031 689 3639</p>',
  },
  '후원가이드/정기후원': {
    title: '정기후원',
    content: '<p>정기 후원 참여 방법을 안내합니다. <a href="/후원가이드/후원신청">후원 신청</a> · 문의: 031 689 3639</p>',
  },
  '후원가이드/일시후원': {
    title: '일시후원',
    content: '<p>일시 후원 및 계좌 안내입니다. <a href="/후원가이드/후원자-가이드">후원안내</a>를 함께 확인해 주세요.</p>',
  },
  '후원가이드/물품후원': {
    title: '물품후원',
    content: '<p>물품 후원 절차 및 문의 안내입니다.</p>',
  },
  '후원가이드/자원봉사': {
    title: '자원봉사',
    content: '<p>자원봉사 참여 및 신청 안내입니다.</p>',
  },
  '소식': {
    title: '소식',
    content: '<p>카야의 최신 소식, 공지사항, 소식지, 재정보고를 확인하실 수 있습니다.</p><p><a href="/소식/공지사항">공지사항</a> · <a href="/소식/카야소식">카야소식</a> · <a href="/소식/소식지">소식지</a> · <a href="/소식/재정보고">재정보고</a></p>',
  },
  '소식/공지사항': {
    title: '공지사항',
    content: '<p>공지사항 목록입니다. 최신 소식은 <a href="/">홈</a>의 최신 소식에서도 보실 수 있습니다.</p>',
  },
  '소식/카야소식': {
    title: '카야소식',
    content: '<p>카야의 일상과 현장 소식을 전합니다.</p>',
  },
  '소식/소식지': {
    title: '소식지',
    content: '<p>카야와 함께 변화하는 이 땅 곳곳의 이야기를 소식지로 전합니다.</p>',
  },
  '소식/재정보고': {
    title: '재정보고',
    content: '<p>연간 재정보고 및 사업보고 자료를 안내합니다.</p>',
  },
  '소식/언론보도': {
    title: '언론보도',
    content: '<p>언론 보도 및 보도자료를 안내합니다.</p>',
  },
  '소식/1대1문의': {
    title: '1:1 문의',
    content: '<p>1:1 문의 안내입니다. 이메일: khayahkorea@gmail.com · T 031 689 3639</p>',
  },
  '카야와-함께': {
    title: '카야와 함께',
    content: '<p>카야와 함께할 수 있는 방법을 안내합니다. <a href="/카야와-함께/공지사항">공지사항</a> · <a href="/카야와-함께/카야소식">카야소식</a></p>',
  },
  '카야와-함께/공지사항': {
    title: '공지사항',
    content: '<p>카야와 함께하기 관련 공지사항입니다.</p>',
  },
  '카야와-함께/카야소식': {
    title: '카야소식',
    content: '<p>카야소식 목록입니다.</p>',
  },
}

/** 각 세그먼트를 한 번 디코드해 정적 키·API slug와 맞춤 (이중 인코딩 URL 대응) */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

/** pathname을 PAGES_STATIC 키 형태로 정규화 (예: 카야/%EC%B9%94… → 카야/카야소개) */
export function normalizePathKey(pathname: string): string {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '')
  if (!trimmed) return ''
  return trimmed.split('/').map(decodeSegment).join('/')
}

/** pathname에서 API slug 추출 (마지막 세그먼트, 디코드 후) */
export function pathToSlug(pathname: string): string {
  const key = normalizePathKey(pathname)
  if (!key) return ''
  const segments = key.split('/')
  return segments[segments.length - 1] ?? ''
}
