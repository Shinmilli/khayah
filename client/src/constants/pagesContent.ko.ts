import { KHAYAH_ORG_BOARD_MERGED_HTML } from './khayahOrgBoardHtml'
import { KHAYAH_LOCATION_PAGE_HTML } from './khayahLocationPageHtml'
import { KHAYAH_HISTORY_PAGE_HTML } from './khayahHistoryHtml'
import { DONOR_GUIDE_PAGE_HTML } from './donorGuidePageHtml'

/**
 * 워드프레스 페이지별 정적 콘텐츠 (DB 마이그레이션 전 fallback)
 * 키: pathname (앞 슬래시 제외, 예: "about/khayah", "business/overseas")
 */
export interface StaticPage {
  title: string
  /** HTML 또는 텍스트 */
  content: string
}

export const PAGES_STATIC_KO: Record<string, StaticPage> = {
  'about/khayah': {
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
  'about/greeting': {
    title: '인사말',
    content: `
<div class="greeting-modern">
  <div class="main-grid">
    <aside class="sidebar">
      <img class="sidebar-photo" src="/images/about/greeting-representative.png" alt="카야(KHAYAH) 대표 최순태" width="512" height="630" />
      <p class="sidebar-kicker">Representative's Message</p>
      <h2 class="sidebar-title">함께하는 마음으로</h2>
      <p class="sidebar-sub">나눔과 섬김의 실천을 위하여</p>
      <div class="sidebar-rule"></div>
      <p class="sidebar-role">카야(KHAYAH) 대표</p>
      <p class="sidebar-name">최순태</p>
    </aside>
    <article class="article">
      <div class="article-lead">
        <span class="article-quote-mark" aria-hidden="true">&ldquo;</span>
        <p class="article-lead-text">남을 돕는다는 것은 어디선가 보고 들은 것처럼 결코 쉬운 일은 아닌 듯 보입니다. 내가 힘겹게 얻어낸 것의 일부분을 떼어 주거나, 천금 같은 나의 귀중한 시간을 쪼개서 써야 하기 때문이지요. 하지만 그 쉽지 않은 일에 대한 보상은 남다릅니다.</p>
      </div>
      <p class="article-body">
        나눔과 도움을 실천하는 일을 업으로 삼은 이후 가장 많이 받는 질문 중 하나는 &lsquo;어쩌다 이쪽 일을 시작하게 되었느냐&rsquo;입니다. 보통 잘 이해가 되지 않는다는 표정들을 하고 계시지요. 저의 대답은 항상 간단합니다. &lsquo;당신도 나와 같은 경험을 하게 되면 그 답을 알게 될 겁니다.&rsquo; 무미건조해 보일지도 모르지만, 전 감사하게도 언제나 진심으로 대답할 수 있었습니다.
      </p>
      <p class="article-body">
        길거리에서 무거운 짐을 들고 가는 노인을 도와주신 경험이 다들 한 번씩은 있으실 겁니다. 전혀 어렵고 대단한 일이 아닙니다. 기분이 어떠셨는지요? 저는 나눔을 직업으로 삼으면서 그 기분을 매 순간 느끼며 살아가고 있습니다. <strong>한 생명을 살리고, 한 학생이 나의 도움으로 웃으며 자라나는 모습을 보는 것은 이 세상 그 어떤 기쁨과도 견줄 수 없습니다.</strong>
      </p>
      <p class="article-body">
        여러분, 지금 주위를 한번 둘러보시기 바랍니다. 단 몇 분 거리, 또는 몇 시간 거리에, 여러분의 관심과 작은 손길로 환하게 웃을 수 있는 이웃들이 너무도 많이 있습니다. 그들에게 손을 내미는 일에 주저하지 마시기 바랍니다. &lsquo;나중에&rsquo;, &lsquo;돈 많이 벌면&rsquo;, &lsquo;시간 될 때&rsquo;만 할 수 있는 일이 절대 아닙니다. 지금 당장, 돈 없어도, 시간이 많지 않아도, 어느 때고 할 수 있는 것이 바로 나눔입니다.
      </p>
      <p class="article-body">
        이 세상의 모든 생명은 모두 하나님의 귀한 창조물이며, 고통 받는 이들을 불쌍히 여기고 돕는 것은 이 땅 위의 모든 이들이 가슴에 품고 살아가야 하는 소명입니다. 다시 살아남을 뜻하는 단체명 카야처럼, 여러분의 인생에도 진정한 부흥, 카야가 휘몰아치기를 기원합니다.
      </p>
      <p class="article-sign"><span class="article-sign-role">카야(KHAYAH) 대표</span> <strong>최순태</strong></p>
    </article>
  </div>
  <section class="sig-section">
    <div class="sig-inner">
      <div class="sig-quote">
        <span class="sig-quote-mark" aria-hidden="true">&ldquo;</span>
        <p class="sig-quote-text">카야와 함께, 여러분의 삶에도<br>진정한 나눔, 진정한 변화가<br>함께하기를 기원합니다.<span class="sig-quote-mark sig-quote-mark--close">&rdquo;</span></p>
      </div>
      <div class="sig-info">
        <p class="sig-role">Representative, KHAYAH International</p>
        <p class="sig-name">Choi Soon-tae</p>
        <p class="sig-name-ko">최 순 태</p>
      </div>
    </div>
  </section>
</div>
`,
  },
  'about/history': {
    title: '카야 연혁',
    content: KHAYAH_HISTORY_PAGE_HTML,
  },
  'about/location': {
    title: '오시는 길',
    content: KHAYAH_LOCATION_PAGE_HTML,
  },
  'about/financial-report': {
    title: '재정보고',
    content: '<p>연간 재정보고 및 사업보고 자료를 안내합니다.</p>',
  },
  'about/org-chart': {
    title: '조직도',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  'about/directors': {
    title: '이사회 / 전문위원',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  'business/overseas': {
    title: '해외사업',
    content: `
<div class="overseas-page">
  <section class="overseas-hero">
    <div class="ov-wrap">
      <p class="overseas-kicker">해외 사업</p>
      <h1 class="overseas-title">카야는 현지 주민과 함께 교육의 기회를 넓힘으로 주도적 성장을 지원하고,<br />지역사회의 변화를 이끄는 주체가 될 수 있는 기반을 마련합니다.</h1>
      <p class="overseas-lead">
        현지 주민과 함께 배우고 함께 실행하며, 지역사회가 스스로 변화의 힘을 키우는 개발협력을 지향합니다.
      </p>
      <div class="overseas-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="overseas-section">
    <div class="ov-wrap">
      <ol class="overseas-list" aria-label="해외사업 핵심 원칙">
        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">01</div>
          <div>
            <h2 class="overseas-h2">참여와 협력</h2>
            <p class="overseas-desc">
              카야는 현지 주민을 단순 후원과 수혜의 관계가 아닌, 참여와 협력의 관계로 존중합니다.
              서로의 경험과 지식을 나누며, 지역사회가 필요로 하는 변화를 함께 만들어갑니다.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">02</div>
          <div>
            <h2 class="overseas-h2">현지와의 동화</h2>
            <p class="overseas-desc">
              진정한 변화는 현지 주민의 참여 의지와 그 변화에 대한 올바른 인식이 뒷받침 될 때만 가능합니다.
              이를 위해 카야는 모든 프로젝트에 지역과 주민의 삶을 이해하고 충분한 대화와 신뢰를 형성하는 현지와의 동화 단계를 필수 요소로 삼아 사업 방향을 정하고 공유하며, 그들의 자발적 참여를 이끌어냅니다.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">03</div>
          <div>
            <h2 class="overseas-h2">참여적 방법론</h2>
            <p class="overseas-desc">
              프로젝트의 전 과정(조사, 분석, 기획, 실행, 모니터링&amp;평가) 속에 주민이 참여하도록 하며, 주민의 경험과 의견을 사업에 반영하고, 사업과 개선 성과도 함께 확인합니다.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">04</div>
          <div>
            <h2 class="overseas-h2">지속가능성</h2>
            <p class="overseas-desc">
              프로젝트 지역의 자원활용과 협력체계를 바탕으로 지역사회 안에서 지속가능한 운영을 이어가는 개발협력사업이 될 수 있도록 프로젝트의 전 과정을 연구하고 해답을 찾아 나갑니다.
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</div>
`,
  },
  'business/overseas/education': {
    title: '교육',
    content: `
<div class="ov-edu-page">
  <section class="ov-edu-hero">
    <div class="ov-edu-wrap">
      <p class="ov-edu-kicker">해외사업 · 교육</p>
      <h1 class="ov-edu-title">Learning today,<br />Leading tomorrow!</h1>
      <p class="ov-edu-desc">
        카야는 교육을 통해 지역이 변화의 힘을 키울 수 있도록 돕습니다.
        삶의 기초역량부터 직업훈련, 교육 환경 개선까지 현장과 함께 설계하고 실행합니다.
      </p>
      <div class="ov-edu-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="ov-edu-section">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <div class="ov-edu-head__titles">
          <p class="ov-edu-head__kicker">Foundational Capacity Building</p>
          <h2 class="ov-edu-head__ko">기초역량\n강화사업</h2>
        </div>
        <div>
          <p class="ov-edu-head__en">Power to accept change</p>
          <p class="ov-edu-head__p">
            스스로 배우고 삶의 과제에 대응하는 힘은 지속적인 성장의 토대입니다. 카야는 읽기·쓰기·수리력 등 기초학습과 자기이해·의사소통·문제해결 등 삶의 역량을 함께 키웁니다. 참여자가 배움을 이어가고, 자신과 공동체를 이해하며 주체적으로 살아갈 수 있도록 지원합니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="기초역량 강화사업 구성">
        <div class="ov-edu-table__row ov-edu-table__row--2" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">기초학습역량</p>
            <p class="ov-edu-cell__p" role="cell">
              국어(읽기·쓰기·말하기), 수리, 영어, 과학 등 지속적인 학업과 심화 학습으로 이어지도록 지원하는 필수 기초지식과 학습능력
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Life Skills</p>
            <p class="ov-edu-cell__p" role="cell">
              자기이해, 의사소통, 대인관계, 건강·재정관리, 비판적·창의적 사고, 문제해결 등 일상과 삶의 과제에 주체적이고 사회협력적으로 대응하기 위한 기본 역량
            </p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="활동 이미지">
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-foundation-1.jpg" alt="학습지를 들고 있는 아이들" loading="lazy" />
          <div class="ov-edu-img__cap">기초학업 학습지</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-foundation-2.jpg" alt="수학 수업을 듣는 학생들" loading="lazy" />
          <div class="ov-edu-img__cap">수학·과학 기초역량</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-foundation-3.jpg" alt="Life Skills 교육 현장" loading="lazy" />
          <div class="ov-edu-img__cap">Life Skills</div>
        </div>
      </div>
    </div>
  </section>

  <section class="ov-edu-section ov-edu-section--surface">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <div class="ov-edu-head__titles">
          <p class="ov-edu-head__kicker">Future-Oriented Education</p>
          <h2 class="ov-edu-head__ko">미래지향\n교육</h2>
        </div>
        <div>
          <p class="ov-edu-head__en">Dream Seekers</p>
          <p class="ov-edu-head__p">
            카야는 청소년과 청년이 변화하는 사회를 이해하고 자신의 미래를 주도적으로 설계하도록 돕습니다. 지역의 교육·산업 환경과 참여자의 관심을 바탕으로 미래를 설계하는 진로·탐색교육과 미래 주요 분야 역량개발을 위한 STEM 교육을 통하여, 배운 것을 삶과 지역사회의 과제에 적용하는 역량을 키웁니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="미래지향 교육 구성">
        <div class="ov-edu-table__row ov-edu-table__row--2" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">맞춤형 진로·직업훈련</p>
            <p class="ov-edu-cell__p" role="cell">
              자신의 흥미와 강점, 직업 및 공동체의 가치를 이해하고 다양한 직업과 삶의 경로 탐색을 기술교육, 멘토링, 진로체험 등 필요에 맞는 지원으로 구체화합니다.
            </p>
            <p class="ov-edu-cell__steps">인식개선 → 탐색 → 설계 → 실행<br />4단계 맞춤형 지원</p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">STEM 융합·탐구 교육</p>
            <p class="ov-edu-cell__p" role="cell">
              과학·기술·공학·수학을 연결하여 질문하고, 실험과 프로젝트 활동을 통해 탐구하며 문제해결 역량을 키웁니다.
            </p>
            <p class="ov-edu-cell__steps">인식확산형(진로강연·박람회) → 단기 집중 체험형(캠프) → 심화탐구형(클럽) → 문제해결기획 경연형(콘테스트)<br />4단계 심화 지원</p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip ov-edu-strip--2" aria-label="활동 이미지">
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-future-2.jpg" alt="직업기술 체험 현장" loading="lazy" />
          <div class="ov-edu-img__cap">직업기술 체험</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-future-3.jpg" alt="STEM 융합 탐구 수업" loading="lazy" />
          <div class="ov-edu-img__cap">STEM 융합 탐구 교육</div>
        </div>
      </div>
    </div>
  </section>

  <section class="ov-edu-section">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <div class="ov-edu-head__titles">
          <p class="ov-edu-head__kicker">Education Quality Improvement</p>
          <h2 class="ov-edu-head__ko">교육 질\n개선사업</h2>
        </div>
        <div>
          <p class="ov-edu-head__en">EQUIP (Education Quality Improvement Program)</p>
          <p class="ov-edu-head__p">
            배움의 기회를 넓히고 교육 격차를 줄이는 일과 함께, 교실에서 이루어지는 교육의 질을 높입니다. 카야는 교사와 학교, 지역사회가 협력하여 수업과 학습환경을 개선하도록 지원합니다. 현장의 필요에 맞는 교사교육과 교육자료, 학습 지원을 연결하고, 그 경험을 함께 돌아보며 더 나은 교육방법을 발전시킵니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="교육 질 개선사업 구성">
        <div class="ov-edu-table__row" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">교사 역량 강화<br />(교육자)</p>
            <p class="ov-edu-cell__p" role="cell">필수적이고 선진적인 교수법 발굴과 교육, 학교 운영·리더십 역량 강화, 교사 간 수업 경험 공유</p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">학습 콘텐츠 및 교육환경 개선<br />(학습자)</p>
            <p class="ov-edu-cell__p" role="cell">교육 패러다임 및 교육 정책 기조에 발맞추는 학습자료와 학습공간 개선</p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">학부모·지역사회 협력<br />(지원자)</p>
            <p class="ov-edu-cell__p" role="cell">학습 독려를 위한 학부모 및 지역사회 참여와 인식개선, 안전하고 집중할 수 있는 학습환경 조성, 현장 필요에 따른 장학 지원</p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="활동 이미지">
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-1.jpg" alt="교사 역량강화 연수" loading="lazy" />
          <div class="ov-edu-img__cap">교사역량강화</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-2.jpg" alt="이러닝 교육 플랫폼으로 공부하는 학생" loading="lazy" />
          <div class="ov-edu-img__cap">이러닝 교육 플랫폼</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-3.jpg" alt="학부모 인식개선 행사" loading="lazy" />
          <div class="ov-edu-img__cap">학부모 인식개선</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/overseas/volunteer': {
    title: '해외봉사단',
    content: `
<div class="ov-health-page">
  <section class="ov-health-hero">
    <div class="ov-health-wrap">
      <p class="ov-health-kicker">해외사업 · 해외봉사단</p>
      <h1 class="ov-health-title">해외봉사단</h1>
      <p class="ov-health-desc">
        카야는 국내 청(소)년 및 기업 등 다양한 분야 경험과 열정을 가진 참여자들이 현지 지역사회 과제를 직접 이해하고, 함께 해결방안을 찾는 국제협력활동 기회를 제공합니다. 현지에 필요한 실천 모델을 제안하고 실행하며 지역사회의 지속가능한 변화와 참여자의 동반 성장이 함께 이뤄지도록 합니다.
      </p>
      <div class="ov-health-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="ov-health-section">
    <div class="ov-health-wrap">
      <h2 class="ovh-block__title">국제개발협력 철학과 전문성이 녹아진 봉사기획</h2>
      <p class="ov-health-desc ov-health-desc--left">
        10년 넘는 국제개발 및 교육분야 전문성으로 파견 지역사회의 필요 과제 발굴과 활동 기획으로 지속가능한 변화를 만들고, 참여하는 봉사단원의 세계시민성·전문성 활용·문제해결 및 적응력 등 전인적 역량강화로 동반 성장하는 현지 필요기반 맞춤 봉사활동을 기획합니다.
      </p>
      <div class="ovh-panels">
        <article class="ovh-panel">
          <h3 class="ovh-panel__title">국제개발협력 전문성</h3>
          <ol class="ovh-rail">
            <li>현지 지역 분석을 통한 주제 발굴</li>
            <li>적정성·실행가능성 파악 현지조사</li>
            <li>조사기반 활동 모델(Action Plan) 기획</li>
            <li>현지 정부·전문기관 네트워킹을 활용한 현지준비</li>
            <li>활동 후 현지 지속관리 체계 구축</li>
            <li>활동 모니터링 및 평가를 통한 성과분석</li>
            <li>평가를 반영한 지속·후속 활동 기획</li>
          </ol>
        </article>
        <article class="ovh-panel">
          <h3 class="ovh-panel__title">교육 분야 전문성</h3>
          <ol class="ovh-rail">
            <li>주제 맞춤 인식개선 및 교육 활동 기획</li>
            <li>파견 전 봉사단원 역량강화교육 기획 (봉사단원 정체성, 세계시민성, 주제 전문성, 건강·안전관리, 팀활동 역량, 활동기획력)</li>
            <li>봉사단원 주도 세부활동 기획 반영 (전문성 활용기회, 문제해결력, 적응력, 커뮤니케이션, 외국어, 조사·분석력, 행정력 등 개인역량 성장)</li>
          </ol>
        </article>
      </div>
    </div>
  </section>

  <section class="ov-health-section ov-health-section--alt">
    <div class="ov-health-wrap">
      <h2 class="ovh-block__title">봉사단 사업 전 생애주기 운영 전문성</h2>
      <p class="ov-health-desc ov-health-desc--left">
        카야는 봉사단 사업 운영 생애주기에 대한 이해를 바탕으로, 전 과정을 운영할 수 있는 매뉴얼과 시스템을 구축하여 안정적으로 전문 운영합니다.
      </p>
      <ol class="ovh-life">
        <li><span class="ovh-life__no">1</span><span class="ovh-life__name">홍보·모집</span></li>
        <li><span class="ovh-life__no">2</span><span class="ovh-life__name">심사</span></li>
        <li><span class="ovh-life__no">3</span><span class="ovh-life__name">선발</span></li>
        <li><span class="ovh-life__no">4</span><span class="ovh-life__name">국내교육과 활동기획 및 국내외 사전준비</span></li>
        <li><span class="ovh-life__no">5</span><span class="ovh-life__name">발대식 및 봉사단 파견</span></li>
        <li><span class="ovh-life__no">6</span><span class="ovh-life__name">현장 활동 인솔 및 지원과 안전 관리</span></li>
        <li><span class="ovh-life__no">7</span><span class="ovh-life__name">성과분석</span></li>
        <li><span class="ovh-life__no">8</span><span class="ovh-life__name">성과공유회 및 확산</span></li>
      </ol>
    </div>
  </section>

  <section class="ovh-gallery" aria-label="해외봉사단 현장">
    <div class="ov-health-wrap">
      <div class="ovh-shot-row">
        <figure class="ovh-shot">
          <img src="/images/business/volunteer-group.jpg" alt="2026년 경기청년 기후특사단 몽골 파견 단체 사진" />
        </figure>
        <figure class="ovh-shot">
          <img src="/images/business/volunteer-field.jpg?v=2" alt="현지에서 나무를 심는 봉사단원" />
        </figure>
        <figure class="ovh-shot">
          <img src="/images/business/volunteer-launch.jpg" alt="2025년 경기청년 기후특사단 발대식" />
        </figure>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/domestic': {
    title: '국내사업',
    content: `
<div class="domestic-page">
  <section class="domestic-hero">
    <div class="dom-wrap">
      <p class="domestic-kicker">국내사업</p>
      <h1 class="domestic-title">카야는 배움과 실천의 기회를 연결하여,<br />우리 이웃이 자신의 삶과 지역사회의 변화를 이끌도록 함께합니다.</h1>
      <p class="domestic-lead">
        국내 현장에서 필요한 교육과 지원을 연결하고, 당사자의 목소리가 지역의 변화로 이어지도록 함께합니다.
      </p>
      <div class="domestic-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="domestic-section">
    <div class="dom-wrap">
      <ol class="domestic-list" aria-label="국내사업 핵심 내용">
        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">01</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">가치지향적 &amp; 미래지향적 교육</h2>
            <p class="domestic-desc">
              현재 한국 사회 구조와 교육 시스템 하에서 드러나지 않고 있는 문제와 이슈들을 발견하고, 이를 개선할 수 있는 방안을 마련하여 새로운 ‘가치 창출’과 ‘미래’를 준비하는 교육개발 프로젝트를 진행합니다.
            </p>
          </div>
        </li>

        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">02</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">인간 중심 &amp; 자연친화적 교육</h2>
            <p class="domestic-desc">
              카야는 사람을 개발의 수단이 아닌 존엄한 주체로 존중합니다. 모든 사업에서 지역사회와 자연환경의 현재와 미래를 함께 고려하며, 생태계와 상생하지 않는 무분별한 개발을 지양합니다. 사람의 성장과 자연의 지속가능성이 함께하는 교육을 실천합니다.
            </p>
          </div>
        </li>

        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">03</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">국내에서 세계로 이어지는 개발협력</h2>
            <p class="domestic-desc">
              카야는 진로 탐색과 역량개발, 소셜 창업과 자립, 기후·환경 교육을 통해 국내에서 쌓은 경험과 전문성을 해외 개발협력 현장으로 연결합니다. 청소년과 청년, 외국인 노동자, 탈북 청년 등 참여자의 배움이 각 지역의 사회·문화적 환경과 필요에 맞게 활용되고, 지역사회에 기여할 수 있도록 함께합니다.
            </p>
          </div>
        </li>
      </ol>

    </div>
  </section>
</div>
`,
  },
  'business/domestic/education': {
    title: '교육',
    content: `
<div class="edu-page">
  <section class="edu-ref-hero">
    <div class="edu-wrap">
      <p class="edu-ref-hero__kicker">국내사업 · 교육</p>
      <h1 class="edu-ref-hero__title">현지 주민과 함께 교육의 기회를 넓히고,<br />지역사회가 스스로 성장할 수 있는 기반을 마련합니다.</h1>
      <p class="edu-ref-hero__desc">
        카야는 교육을 통해 개인의 성장과 공동체의 변화를 함께 만들어갑니다.
        외국인 노동자, 탈북 청년, 청소년 등 다양한 이웃이 자신의 역량을 키우고 배움을 나눌 수 있도록,
        사회적 가치를 바탕으로 교육과 경험의 기회를 제공합니다.
      </p>
      <div class="edu-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="edu-ref-section">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">1</span> Education Program</p>
          <h2 class="edu-ref-h2">진로 탐색과 미래역량개발 지원</h2>
          <p class="edu-ref-sub">자기이해 / Life Design / 직업기초역량 / 진로 체험·멘토링 / 사회·문화 체험</p>
          <p class="edu-ref-p">
            청소년과 청년이 자신을 이해하고 미래를 주도적으로 설계할 수 있도록 단계적인 진로교육을 제공합니다.
            자기이해에서 공동체와 직업세계에 대한 이해, 진로 탐색과 설계로 이어지는 배움을 통해 자신의 가능성을 발견하고,
            선택한 미래를 구체적인 실천으로 옮기도록 지원합니다.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-2.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">진로 탐색과 미래역량개발 지원</div>
        </div>
      </div>
    </div>
  </section>

  <section class="edu-ref-section is-flipped" style="background:rgba(250,247,248,0.7)">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-1.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">사회적 가치 기반 소셜 창업과 자립 역량 강화</div>
        </div>
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">2</span> Education Program</p>
          <h2 class="edu-ref-h2">사회적 가치 기반 소셜 창업과 자립 역량 강화</h2>
          <p class="edu-ref-sub">소셜 비즈니스 교육 / 국내외 창업 / 국제개발협력 교육</p>
          <p class="edu-ref-p">
            사회적 가치와 기업가정신을 바탕으로, 외국인 노동자와 탈북 청년, 교육과 진로 기회에서 소외된 청(소)년의 창업과 자립을 지원합니다.
            참여자가 자신의 경험과 강점을 발견하고, 지역사회의 필요를 사업 아이디어로 발전시키며 국내외에서 새로운 진로와 활동 기회를 모색하도록 함께합니다.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="edu-ref-section">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">3</span> Education Program</p>
          <h2 class="edu-ref-h2">기후·환경 인식개선과 실천 확산</h2>
          <p class="edu-ref-sub">기후·환경 교육 / 주제별 북클럽 / 인식개선 콘텐츠 제작·배포 / 기후위기 대응 봉사단 교육 및 활동</p>
          <p class="edu-ref-p">
            기후위기를 이해하고 일상과 지역사회에서 변화를 실천하는 세계시민의 성장을 지원합니다.
            관련 교육과 북클럽, 콘텐츠 제작, 봉사활동을 통해 환경문제를 자신의 삶과 연결하고,
            개인의 실천이 지역사회와 국제적 협력으로 이어지도록 돕습니다.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-3.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">기후·환경 인식개선과 실천 확산</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy': {
    title: '연구사업',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">연구사업</p>
      <h1 class="adv-title">현장의 경험을 연구하고<br />교육과 개발협력의 방법을 발전시켜,<br />지속가능한 변화를 만드는 실천에 연결합니다.</h1>
      <p class="adv-lead">
        카야는 사람의 성장과 지역사회의 변화가 이어질 수 있도록 교육과 개발협력의 방법을 연구합니다.
        현장에서 발견한 질문을 바탕으로 교육모델과 사업 운영방식을 발전시키고, 그 경험을 다시 현장과 나눕니다.
        국내외 실천과 연구를 연결하여 지속가능한 변화의 기반을 마련합니다.
      </p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-section" aria-label="연구사업 가치">
    <div class="adv-wrap">
      <ol class="adv-list">
        <li class="adv-item">
          <p class="adv-num">01</p>
          <div class="adv-body">
            <h2 class="adv-h2">현장 기반의 연구</h2>
            <p class="adv-item-desc">카야의 연구는 현장에서 출발합니다. 국내외 현장에서 발견한 실제적인 문제와 참여자들의 목소리를 바탕으로, 이론에 그치지 않고 현장에 즉시 적용할 수 있는 유의미한 시사점을 도출합니다.</p>
          </div>
        </li>
        <li class="adv-item">
          <p class="adv-num">02</p>
          <div class="adv-body">
            <h2 class="adv-h2">참여와 주도성의 방법론</h2>
            <p class="adv-item-desc">개발협력과 교육이 일방적인 전달이 되지 않도록, 주민과 참여자가 스스로 문제를 정의하고 해결하는 ‘참여적 개발협력 방법론’을 연구합니다. 지역사회의 맥락을 존중하며 자립의 기반을 다지는 구조를 만듭니다.</p>
          </div>
        </li>
        <li class="adv-item">
          <p class="adv-num">03</p>
          <div class="adv-body">
            <h2 class="adv-h2">배움의 연결과 확산</h2>
            <p class="adv-item-desc">현장의 경험과 연구 결과를 교육 모델 및 콘텐츠로 체계화합니다. 카야 아카데미, 세미나, 지식공유 플랫폼을 통해 실천가 및 시민사회와 배움을 나누며 더 나은 교육과 개발협력의 표준을 함께 만들어갑니다.</p>
          </div>
        </li>
        <li class="adv-item">
          <p class="adv-num">04</p>
          <div class="adv-body">
            <h2 class="adv-h2">지속가능한 소셜 임팩트</h2>
            <p class="adv-item-desc">사회적 가치가 단발성 지원에 그치지 않고 자립적인 생태계로 자리 잡을 수 있도록 소셜 비즈니스 모델과 지속가능한 사업 구조를 탐색합니다. 사람의 성장과 사회적 가치 창출이 선순환하는 구조를 연구합니다.</p>
          </div>
        </li>
      </ol>
    </div>
  </section>

  <section class="adv-methods" aria-label="연구사업 하위 메뉴">
    <div class="adv-wrap">
      <div class="adv-hub-cards">
        <article class="adv-hub-card">
          <div class="adv-hub-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.4 2 8.4l10 5 10-5-10-5Zm-7.2 7.3v4.8c0 1.5 3.6 4 7.2 4s7.2-2.5 7.2-4v-4.8l-7.2 3.6-7.2-3.6Z" />
            </svg>
          </div>
          <h2 class="adv-hub-card__title">교육연구 사업</h2>
          <p class="adv-hub-card__desc">현장의 경험을 바탕으로 사람의 성장과 지역사회의 변화를 이끄는 교육·개발협력 모델과 방법을 연구하고 나눕니다.</p>
          <a class="adv-hub-card__btn" href="/khayah/business/advocacy/education-research">자세히 보기</a>
        </article>
        <article class="adv-hub-card">
          <div class="adv-hub-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h2 class="adv-hub-card__title">소셜비즈니스</h2>
          <p class="adv-hub-card__desc">사회적 가치가 지속가능한 변화와 자립으로 이어질 수 있는 소셜비즈니스 모델과 사업 구조를 연구합니다.</p>
          <a class="adv-hub-card__btn" href="/khayah/business/advocacy/social-business">자세히 보기</a>
        </article>
        <article class="adv-hub-card">
          <div class="adv-hub-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h7.2L14 7.2H20v13H4Zm2 4v10h12V9.2h-5.2L10.6 6H6Z" />
            </svg>
          </div>
          <h2 class="adv-hub-card__title">진행사업</h2>
          <p class="adv-hub-card__desc">연구를 통해 발전시킨 모델과 방법을 국내외 현장에 적용하고, 그 경험과 성과를 다시 연구와 실천으로 이어갑니다.</p>
          <a class="adv-hub-card__btn" href="/khayah/business/projects">자세히 보기</a>
        </article>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy/social-business': {
    title: '소셜비즈니스',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">연구사업 · 소셜비즈니스</p>
      <h1 class="adv-title">소셜비즈니스</h1>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-study" aria-label="소셜비즈니스">
    <div class="adv-wrap">
      <article class="adv-study__card adv-study__card--solo">
        <div class="adv-study__body">
          <h2 class="adv-study__title">사회적 가치와 지속가능성</h2>
          <ul class="adv-tags">
            <li>소셜 비즈니스</li>
            <li>컬러앤컴포트(사회적기업)</li>
            <li>소셜임팩트</li>
          </ul>
          <p class="adv-study__desc">사회적 가치가 지속적인 실천으로 이어질 수 있는 운영과 사업의 구조를 탐색합니다. 소셜 비즈니스의 경험을 바탕으로 자립과 사회적 성과의 연결 가능성을 살펴봅니다.</p>
        </div>
      </article>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy/education-research': {
    title: '교육연구',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">연구사업 · 교육연구</p>
      <h1 class="adv-title">교육연구</h1>
      <p class="adv-lead">교육모델과 학습방법, 지식공유와 아카데미, 참여적 개발협력 방법론을 연구합니다.</p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-study" aria-label="교육연구 내용">
    <div class="adv-wrap">
      <ol class="adv-study__list">
        <li class="adv-study__card">
          <p class="adv-study__no">01</p>
          <div class="adv-study__body">
            <h2 class="adv-study__title">교육모델과 학습방법</h2>
            <ul class="adv-tags">
              <li>Dream Seekers</li>
              <li>Life Design</li>
              <li>이러닝(SEEM)</li>
              <li>동료학습</li>
            </ul>
            <p class="adv-study__desc">참여자가 자신을 이해하고 배움을 삶에 적용할 수 있는 교육모델을 연구합니다. 현장의 경험을 교육과정과 콘텐츠로 정리하고 개선합니다.</p>
          </div>
        </li>
        <li class="adv-study__card">
          <p class="adv-study__no">02</p>
          <div class="adv-study__body">
            <h2 class="adv-study__title">지식공유와 아카데미</h2>
            <ul class="adv-tags">
              <li>카야아카데미</li>
              <li>국제개발협력·ODA 교육</li>
              <li>강의·세미나</li>
            </ul>
            <p class="adv-study__desc">현장의 경험과 연구 내용을 강의와 세미나, 교육자료로 나눕니다. 실천가와 참여자가 함께 배우고 개발협력의 전문성을 키우는 장을 마련합니다.</p>
          </div>
        </li>
        <li class="adv-study__card">
          <p class="adv-study__no">03</p>
          <div class="adv-study__body">
            <h2 class="adv-study__title">참여적 개발협력 방법론</h2>
            <ul class="adv-tags">
              <li>국제개발협력</li>
              <li>전문가 그룹</li>
              <li>개발의 관점과 방법</li>
            </ul>
            <p class="adv-study__desc">주민의 참여와 주도성을 바탕으로 사업을 조사·기획·실행·평가하는 방법을 연구합니다. 지역의 맥락을 이해하고 현지의 역량을 키우는 접근을 모색합니다.</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</div>
`,
  },
  'business/projects': {
    title: '진행사업',
    content: '<p>국내외 현장에서 이어지는 카야의 활동과 사업별 이야기를 만나보세요.</p><p><a href="/khayah/business/projects/nepal">네팔</a> · <a href="/khayah/business/projects/myanmar">미얀마</a> · <a href="/khayah/business/projects/kyrgyzstan">키르기즈스탄</a> · <a href="/khayah/business/projects/domestic">국내</a></p>',
  },
  'business/projects/nepal': {
    title: '네팔',
    content: '<p>네팔 현지 교육·보건·공동체 개발 사업을 진행합니다.</p>',
  },
  'business/projects/myanmar': {
    title: '미얀마',
    content: '<p>미얀마 도시빈민마을 청소년 꿈도서관 지원 등 교육·보건 사업을 진행합니다.</p>',
  },
  'business/projects/kyrgyzstan': {
    title: '키르기즈스탄',
    content: '<p>키르기스스탄 도시빈민학생 STEM 역량 강화, 청년 프로젝트 등 사업을 진행합니다.</p>',
  },
  'business/projects/domestic': {
    title: '국내',
    content: '<p>국내 진행사업을 안내합니다.</p>',
  },
  'support/guide': {
    title: '후원 안내',
    content: DONOR_GUIDE_PAGE_HTML,
  },
  'support/apply': {
    title: '후원신청',
    content: '<p>후원 신청 및 정기후원 안내 페이지입니다. 문의: khayahinternational@gmail.com / 070.5121.2198</p>',
  },
  'news': {
    title: '소식',
    content: '<p>카야의 최신 소식, 공지사항, 활동소식, 연간소식지를 확인하실 수 있습니다.</p><p><a href="/khayah/news/announcements">공지사항</a> · <a href="/khayah/news/activities">활동소식</a> · <a href="/khayah/news/newsletter">연간소식지</a> · <a href="/khayah/news/press">언론보도</a></p>',
  },
  'news/activities': {
    title: '활동소식',
    content: '<p>카야의 일상과 현장 소식을 전합니다.</p>',
  },
  'news/newsletter': {
    title: '연간소식지',
    content: '<p>카야와 함께 변화하는 이 땅 곳곳의 이야기를 연간소식지로 전합니다.</p>',
  },
  'news/press': {
    title: '언론보도',
    content: '<p>언론 보도 및 보도자료를 안내합니다.</p>',
  },
  'news/inquiry': {
    title: '고객 문의',
    content: '',
  },
  'together': {
    title: '카야와 함께',
    content: '<p>카야와 함께할 수 있는 방법을 안내합니다. <a href="/khayah/news/announcements">공지사항</a> · <a href="/khayah/news/activities">활동소식</a></p>',
  },
  'together/announcements': {
    title: '공지사항',
    content: '<p>카야와 함께하기 관련 공지사항입니다.</p>',
  },
  'together/news': {
    title: '카야소식',
    content: '<p>카야소식 목록입니다.</p>',
  },
}

