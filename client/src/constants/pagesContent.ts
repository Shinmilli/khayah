import { KHAYAH_HISTORY_PAGE_HTML } from './khayahHistoryHtml'

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
<div class="khayah-about-def-vmv">
  <section id="about" class="def-section" aria-labelledby="about-label">
    <div id="about-label" class="def-label">정의</div>
    <div class="def-content">
      <p class="def-headline">카야는 사람을 키우고 섬기는 개발 NGO입니다.</p>
      <p class="def-body">카야는 올바른 인도를 통해 성장한 한 사람의 힘이 큰 변혁을 이끌어 낼 수 있음을 믿습니다. 그리하여 그들이 온 땅 곳곳에서 이 세상을 밝히는 빛이 될 수 있기를 희망합니다.</p>
    </div>
  </section>
  <div class="def-divider" aria-hidden="true"></div>
  <section id="vision" class="vmv-hero" aria-labelledby="vmv-hero-title">
    <svg class="vmv-hero-cross" viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="48" y="0" width="24" height="400" fill="#fff"/>
      <rect x="0" y="100" width="120" height="24" fill="#fff"/>
    </svg>
    <h2 id="vmv-hero-title" class="vmv-hero-title">Vision &amp; Mission &amp; Value</h2>
    <div class="vmv-hero-line" aria-hidden="true"></div>
    <p class="vmv-hero-desc">카야가 꿈꾸는 세상은 세상의 모든 소외된 이웃들이<br />스스로 설 수 있는 방법을 찾게 하는 것입니다.</p>
  </section>
  <div class="vmv-content">
    <div class="vmv-row">
      <div class="vmv-row-label">비전</div>
      <p class="vmv-row-body">카야는 인종, 종교, 이념의 벽을 넘어 모든 소외된 이웃들이 스스로의 성장을 통해 가정과 사회의 변혁을 이끄는 세상을 꿈꿉니다.</p>
    </div>
    <div class="vmv-row">
      <div class="vmv-row-label">미션</div>
      <p class="vmv-row-body">카야는 사람 중심의 프로젝트 개발을 통해 세상의 모든 소외된 이웃들이 스스로 설 수 있는 방법을 찾게 합니다.</p>
    </div>
    <div id="value" class="values-orbit-section" aria-labelledby="values-heading">
      <div class="values-orbit-section__head">
        <h3 id="values-heading" class="values-orbit-section__title">핵심가치</h3>
        <div class="values-orbit-section__underline" aria-hidden="true"></div>
      </div>
      <div class="values-orbit-section__body">
        <div class="values-orbit" aria-label="핵심가치 5가지">
          <img
            class="values-orbit__bgimg"
            src="/images/Khayah/intro/values_bubble.png"
            alt=""
            aria-hidden="true"
          />
          <div class="values-orbit__center">
            <div class="values-orbit__center-title">5 Values</div>
            <div class="values-orbit__center-sub">카야가 생각하는 중요한 가치들</div>
          </div>

          <div class="values-orbit__node values-orbit__node--v1">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble1.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 11a4 4 0 100-8 4 4 0 000 8z"/><path d="M4 20a8 8 0 0116 0"/></svg>
                  </div>
                  <div class="values-orbit__key">인간존엄</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">인간 그 자체의 존엄함을 존중하며, 인간의 도구화를 지양합니다.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v2">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble2.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div class="values-orbit__key">비차별과 협력</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">인종, 종교, 이념의 벽을 넘어 사람을 섬기고 협력합니다.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v3">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble3.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                  </div>
                  <div class="values-orbit__key">전문성</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">차별화된 역량과 전문성을 갖추고 활동합니다.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v4">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble4.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  </div>
                  <div class="values-orbit__key">혁신</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">잘못된 관행을 배제하고 혁신적인 아이디어로 변화를 추구합니다.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v5">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble5.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 6.5 7-6.5z"/></svg>
                  </div>
                  <div class="values-orbit__key">사회적 책임</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">이웃을 사랑하는 참된 그리스도인의 삶을 실천합니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  },
  '카야/카야-스토리': {
    title: '인사말',
    content: `
<div class="greeting-modern">
  <div class="intro-strip">
    <span class="intro-strip-label">KHAYAH Foundation</span>
    <div class="intro-strip-divider"></div>
    <span class="intro-strip-label">나눔 · 섬김 · 사랑</span>
  </div>
  <div class="content">
    <div class="main-grid">
      <aside class="sidebar">
        <h2 class="sidebar-title">
          함께하는<br>
          <em>마음으로</em>
        </h2>
        <p class="sidebar-meta">
          카야(KHAYAH)<br>
          대표 최순태<br><br>
          나눔과 섬김의<br>
          실천을 위하여
        </p>
        <span class="sidebar-tag">Representative's Message</span>
      </aside>
      <article class="article">
        <p class="article-lead">
          남을 돕는다는 것은 어디선가 보고 들은 것처럼 결코 쉬운 일은 아닌 듯 보입니다. 내가 힘겹게 얻어낸 것의 일부분을 떼어 주거나, 천금 같은 나의 귀중한 시간을 쪼개서 써야 하기 때문이지요. 하지만 그 쉽지 않은 일에 대한 보상은 남다릅니다.
        </p>
        <p class="article-body">
          나눔과 도움을 실천하는 일을 업으로 삼은 이후 가장 많이 받는 질문 중 하나는 &lsquo;어쩌다 이쪽 일을 시작하게 되었느냐&rsquo;입니다. 보통 잘 이해가 되지 않는다는 표정들을 하고 계시지요. 저의 대답은 항상 간단합니다. &lsquo;당신도 나와 같은 경험을 하게 되면 그 답을 알게 될 겁니다.&rsquo; 무미건조해 보일지도 모르지만, 전 감사하게도 언제나 진심으로 대답할 수 있었습니다.
        </p>
        <p class="article-body">
          길거리에서 무거운 짐을 들고 가는 노인을 도와주신 경험이 다들 한 번씩은 있으실 겁니다. 전혀 어렵고 대단한 일이 아닙니다. 기분이 어떠셨는지요? 저는 나눔을 직업으로 삼으면서 그 기분을 매 순간 느끼며 살아가고 있습니다. 한 생명을 살리고, 한 학생이 나의 도움으로 웃으며 자라나는 모습을 보는 것은 이 세상 그 어떤 기쁨과도 견줄 수 없습니다.
        </p>
        <p class="article-body">
          여러분, 지금 주위를 한번 둘러보시기 바랍니다. 단 몇 분 거리, 또는 몇 시간 거리에, 여러분의 관심과 작은 손길로 환하게 웃을 수 있는 이웃들이 너무도 많이 있습니다. 그들에게 손을 내미는 일에 주저하지 마시기 바랍니다. &lsquo;나중에&rsquo;, &lsquo;돈 많이 벌면&rsquo;, &lsquo;시간 될 때&rsquo;만 할 수 있는 일이 절대 아닙니다. 지금 당장, 돈 없어도, 시간이 많지 않아도, 어느 때고 할 수 있는 것이 바로 나눔입니다.
        </p>
        <p class="article-body">
          이 세상의 모든 생명은 모두 하나님의 귀한 창조물이며, 고통 받는 이들을 불쌍히 여기고 돕는 것은 이 땅 위의 모든 이들이 가슴에 품고 살아가야 하는 소명입니다. 다시 살아남을 뜻하는 단체명 카야처럼, 여러분의 인생에도 진정한 부흥, 카야가 휘몰아치기를 기원합니다.
        </p>
      </article>
    </div>
  </div>
  <section class="sig-section">
    <div class="sig-inner">
      <p class="sig-quote">&ldquo;카야와 함께, 여러분의 삶에도<br>진정한 나눔, 진정한 변화가<br>함께하기를 기원합니다.&rdquo;</p>
      <div class="sig-info">
        <p class="sig-role">KHAYAH 대표</p>
        <p class="sig-name">Choi Soon-tae</p>
        <p class="sig-name-ko">최 순 태</p>
        <div class="sig-line"></div>
      </div>
    </div>
  </section>
</div>
`,
  },
  '카야/카야-연혁': {
    title: '카야 연혁',
    content: KHAYAH_HISTORY_PAGE_HTML,
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
    content: '<p>카야의 최신 소식, 공지사항, 활동소식, 연간소식지, 재정보고를 확인하실 수 있습니다.</p><p><a href="/소식/공지사항">공지사항</a> · <a href="/소식/활동소식">활동소식</a> · <a href="/소식/연간소식지">연간소식지</a> · <a href="/소식/언론보도">언론보도</a> · <a href="/소식/재정보고">재정보고</a></p>',
  },
  '소식/활동소식': {
    title: '활동소식',
    content: '<p>카야의 일상과 현장 소식을 전합니다.</p>',
  },
  '소식/연간소식지': {
    title: '연간소식지',
    content: '<p>카야와 함께 변화하는 이 땅 곳곳의 이야기를 연간소식지로 전합니다.</p>',
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
