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
      <h1 class="overseas-title">현지 주민과 함께 교육의 기회를 넓히고,<br />지역사회가 스스로 성장할 수 있는 기반을 마련합니다.</h1>
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

  <section class="overseas-cta" aria-label="해외사업 하위 메뉴">
    <div class="ov-wrap">
      <div class="overseas-cards">
        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.4 2 8.4l10 5 10-5-10-5Zm-7.2 7.3v4.8c0 1.5 3.6 4 7.2 4s7.2-2.5 7.2-4v-4.8l-7.2 3.6-7.2-3.6Z"/>
            </svg>
          </div>
          <h2 class="overseas-card__title">교육</h2>
          <p class="overseas-card__desc">카야는 기초 학습 역량과 진로 탐색과 미래 역량을 함께 키우는 교육 프로그램을 운영하고, 현지 교육의 질을 개선합니다. 이를 통해 주민 스스로 변화의 필요성과 가능성을 인식하고 지역사회의 성장에 주도적으로 참여할 역량과 기반을 만들어갑니다.</p>
          <a class="overseas-card__btn" href="/business/overseas/education">자세히 보기</a>
        </div>

        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm6 0a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 15 11ZM9 13c-3.3 0-6 2.1-6 4.8V20h12v-2.2C15 15.1 12.3 13 9 13Zm6 .5c-.4 0-.8 0-1.2.1 1.8 1.1 3.2 2.8 3.2 4.7V20h4v-1.6c0-2.5-2.4-4.9-6-4.9Z"/>
            </svg>
          </div>
          <h2 class="overseas-card__title">해외봉사단 파견</h2>
          <p class="overseas-card__desc">카야는 국내 청년과 다양한 분야 경험과 열정을 가진 참여자들이 현지 지역사회 과제를 직접 이해하고, 함께 해결방안을 찾는 국제협력활동 기회를 제공합니다. 현지에 필요한 실천 모델을 제안하고 실행하며 지역사회의 지속가능한 변화와 참여자의 동반 성장이 함께 이뤄지도록 합니다.</p>
          <a class="overseas-card__btn" href="/business/overseas/volunteer">자세히 보기</a>
        </div>

        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h7.2L14 7.2H20v13H4Zm2 4v10h12V9.2h-5.2L10.6 6H6Z"/>
            </svg>
          </div>
          <h2 class="overseas-card__title">진행사업</h2>
          <p class="overseas-card__desc">카야의 모든 해외 프로젝트는 ‘사람’ 곧 참여자와 지역의 필요를 중심으로 지역과 주민의 변화를 이끌어 ‘궁극적 자립’에 이를 때까지를 목표로 연구하며 진행하고 있습니다.</p>
          <a class="overseas-card__btn" href="/business/projects">자세히 보기</a>
        </div>
      </div>
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
            사람 또는 지역이 변화하기 위해서는 그 변화를 받아들일 수 있는 역량이 우선되어야 합니다.
            카야는 수학, 과학, 영어, 국어 등과 같은 기초지식 함양과 더불어 자기 및 공동체 이해를 기반한 주체적 삶을 위한 다양한 내면 성장 프로그램을 병행하여 내외가 고루 발전된 인재 성장을 지원합니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="기초역량 강화사업 구성">
        <div class="ov-edu-table__row ov-edu-table__row--2" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">기초학습역량</p>
            <p class="ov-edu-cell__p" role="cell">
              국어(읽기/말하기/쓰기), 영어, 수학, 과학 등 심화교육으로 나아가기 위한 필수 기본 지식
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Life Skills</p>
            <p class="ov-edu-cell__p" role="cell">
              의사소통, 대인관계, 재정관리, 건강관리, 논리/비판/창의적 사고, 문제해결 능력 등
            </p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="활동 이미지">
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-learn.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">학습 활동</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-reading.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">독서클럽</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-env.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">교육 환경</div>
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
            카야는 프로젝트를 펼치는 지역과 참여자 속에서 지역사회 변화를 끌어낼 미래 리더 배출을 지향하며,
            현시대와 글로벌 흐름에 발맞추면서도 속한 국가와 지역사회에서의 미래와 적합성 분석이 반영된 필요 인재 성장 교육 프로그램을 운영합니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="미래지향 교육 구성">
        <div class="ov-edu-table__row" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">맞춤형 직업훈련</p>
            <p class="ov-edu-cell__sub">참여자 맞춤형</p>
            <p class="ov-edu-cell__p" role="cell">
              올바른 교육의 부재로 삶을 어떻게 영위해 나가야 하는지, 어떤 직업을 선택할 수 있는지 생각조차 못해본 청소년 및 청년들이 다양한 프로그램을 통해 자신의 적성을 찾고 직업을 준비할 수 있는 기회를 제공합니다.
            </p>
            <p class="ov-edu-cell__sub">기업 맞춤형</p>
            <p class="ov-edu-cell__p" role="cell">
              프로젝트 대상 국가 및 지역 내 유망한 산업 및 기업들과 연계하여 빈민들에게는 일자리를, 기업에게는 훈련된 고급 인력을 제공하며, 인력 수요 공급의 연결고리 역할을 통해 지역 경제 발전을 돕습니다.
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">멘토링</p>
            <p class="ov-edu-cell__p" role="cell">
              카야와 함께 하는 현지 각 분야 전문가 풀을 활용하여, 청소년&middot;청년들에게 원하는 분야의 다양한 멘토링을 제공합니다.
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">STEM Education</p>
            <p class="ov-edu-cell__p" role="cell">
              과학, 기술, 공학, 수학을 바탕으로 지역 사회와 글로벌 흐름에 맞는 미래 인재의 성장을 지원합니다.
            </p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="활동 이미지">
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-skill.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">기술 훈련</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-field.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">현장 실습</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-job.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">일자리 연계</div>
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
            카야는 교육의 질 개선 활동의 일환으로 네팔 산악지역에 소재한 학교들을 방문하며 현지 교사들에게 올바른 교육법 전수를 위해 노력하는 네팔 NGO HDCS(Human Development &amp; Community Services)를 지원합니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="교육 질 개선사업 구성">
        <div class="ov-edu-table__row" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">교사 교수법 Training</p>
            <ul class="ov-edu-cell__list">
              <li>학교장 및 리더십(리더십과 경영 교육)</li>
              <li>교사 교육(창의적이고 분석적 사고 중심의 교수법 교육)</li>
              <li>학부모(인식개선 교육)</li>
            </ul>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">교육 지원</p>
            <ul class="ov-edu-cell__list">
              <li>독서 교육(Classroom Reading)</li>
              <li>예체능 교육(체육/미술/음악 등)</li>
              <li>학교농장 교육</li>
              <li>장학금 지원</li>
            </ul>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">보건 위생 및 청소년 성교육</p>
            <ul class="ov-edu-cell__list">
              <li>교사 &amp; 학부모 인식개선</li>
              <li>청소년 교육 및 Peer Group 활동</li>
              <li>화장실, 수도 등 위생시설 설치 및 보수</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="활동 이미지">
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-1.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">교사 교육</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-2.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">수업 자료</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-3.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">교실 학습</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/overseas/volunteer': {
    title: '해외봉사단 파견',
    content: `
<div class="ov-health-page">
  <section class="ov-health-hero">
    <div class="ov-health-wrap">
      <p class="ov-health-kicker">해외사업 · 해외봉사단</p>
      <h1 class="ov-health-title">영양상태, 공중위생 및 주거환경 개선을 위한<br />주민들의 보건 역량을 키웁니다.</h1>
      <p class="ov-health-desc">
        카야가 지원하는 지역들은 개발도상국 내에서도 보건 환경이 매우 열악한 빈민 마을들입니다.
        카야는 일회성 의료서비스 지원보다는 주민들 스스로 깨끗한 보건 환경을 마련하도록 인도하는
        주민 참여형 건강케어 프로젝트로 보다 근본적인 해결 방법 마련에 집중합니다.
      </p>
      <div class="ov-health-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="ovh-block ovh-block--ltr">
    <div class="ov-health-wrap">
      <div class="ovh-block__head ovh-block__head--cols-4">
        <div class="ovh-block__title-wrap">
          <p class="ovh-block__en">Community-Based Health Care</p>
          <h2 class="ovh-block__title">지역사회기반\n주민참여형\n건강 케어</h2>
        </div>
        <p class="ovh-block__desc">
          지역 내 1차 보건의료기관과 연계된 주민조직의 건강증진 활동을 통하여 지역 주민 스스로의 건강 돌봄 능력 배양
        </p>
      </div>

      <div class="ovh-cards ovh-cards--scroll" aria-label="주요 활동">
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 16c-2-4-7-5-12-3-3 1-5 4-5 8 0 1 0 2 1 3-2 1-4 4-5 7-2 4-2 9-1 14 1 7 6 13 11 13 2 0 3-1 5-1s2 1 5 1c5 0 10-6 11-13 1-5 1-10-1-14-1-3-3-6-5-7 1-1 1-2 1-3 0-4-2-7-5-8-5-2-10-1-12 3z"/><path d="M30 14c-1-3-1-5 0-7 2-1 4-1 5 1 1 2 0 4-1 6-1 1-3 1-4 0z"/></svg>
          </div>
          <p class="ovh-card__label">영양상태 개선 활동</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 8 8 28v28h18V40h12v16h18V28z"/></svg>
          </div>
          <p class="ovh-card__label">공중위생 및 주거 환경 증진</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 6 4 18l4 2v12l-4 2v6l28 12 28-12v-6l-4-2V20zM12 24l20 8 20-8v8L32 40 12 32z"/></svg>
          </div>
          <p class="ovh-card__label">기초보건교육 및 인식 개선 활동</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 4 8 14v18c0 14 10 24 24 28 14-4 24-14 24-28V14zm-3 16h6v8h8v6h-8v8h-6v-8h-8v-6h8z"/></svg>
          </div>
          <p class="ovh-card__label">지역별 주요 질환 예방 및 관리 활동</p>
        </div>
      </div>
    </div>
  </section>

  <section class="ovh-block ovh-block--rtl ovh-block--alt">
    <div class="ov-health-wrap">
      <div class="ovh-block__head ovh-block__head--cols-5">
        <p class="ovh-block__desc">모성사망률과 영아사망률의 감소를 위한 사업을 진행합니다.</p>
        <div class="ovh-block__title-wrap">
          <p class="ovh-block__en">Maternal and Child Health</p>
          <h2 class="ovh-block__title">모자보건</h2>
        </div>
      </div>

      <div class="ovh-cards ovh-cards--cols-5 ovh-cards--white" aria-label="주요 활동">
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><circle cx="32" cy="12" r="6"/><path d="M40 26c0-3-3-6-8-6s-8 3-8 6v6c-3 2-6 6-6 12 0 5 3 8 6 8v8h16v-8c3 0 6-3 6-8 0-6-3-10-6-12z"/></svg>
          </div>
          <p class="ovh-card__label">산전·산후 관리</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 56C18 46 6 36 6 22c0-7 5-12 12-12 6 0 10 4 14 10 4-6 8-10 14-10 7 0 12 5 12 12 0 14-12 24-26 34z"/><circle cx="22" cy="22" r="3" fill="#fff"/><circle cx="42" cy="22" r="3" fill="#fff"/></svg>
          </div>
          <p class="ovh-card__label">가족계획과 생식건강</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 8 8 28v28h18V40h12v16h18V28z"/></svg>
          </div>
          <p class="ovh-card__label">시설분만을 위한 지원</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M22 4h20v8h-2v6c4 2 6 6 6 12v24c0 4-2 6-6 6H24c-4 0-6-2-6-6V30c0-6 2-10 6-12v-6h-2zm6 8v8h8v-8zm-4 18v6h16v-6zm0 12v6h16v-6z"/></svg>
          </div>
          <p class="ovh-card__label">산모 및 영유아 영양상태 개선</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M48 4 44 8l-4-4-4 4 4 4-20 20-4-2-4 4 14 14 4-4-2-4 20-20 4 4 4-4-4-4 4-4zM12 46l-6 6 4 4 6-6z"/></svg>
          </div>
          <p class="ovh-card__label">영유아 예방접종 및 건강관리 교육</p>
        </div>
      </div>
    </div>
  </section>

  <section class="ovh-block ovh-block--center">
    <div class="ov-health-wrap">
      <div class="ovh-block__head">
        <div class="ovh-block__title-wrap">
          <p class="ovh-block__en">School Health</p>
          <h2 class="ovh-block__title">학교보건</h2>
        </div>
        <p class="ovh-block__desc">
          학령기 아동 및 청소년들의 건강한 신체발달과 올바른 식생활 습관을 위한<br />학교 기반의 보건활동을 진행합니다.
        </p>
      </div>

      <ol class="ovh-numlist" aria-label="학교보건 주요 활동">
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">신체검사</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">위생 및 기초보건교육</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">청소년 성 보건교육</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">학부모 및 교사를 위한 보건 세미나</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">보건책자 개발 및 배포</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">체육활동 지원</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">헬스스카웃 조직을 통한 건강증진 활동</span></li>
      </ol>
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

  <section class="domestic-cta" aria-label="국내사업 하위 메뉴">
    <div class="dom-wrap">
      <div class="domestic-cards">
        <div class="domestic-card">
          <div class="domestic-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.4 2 8.4l10 5 10-5-10-5Zm-7.2 7.3v4.8c0 1.5 3.6 4 7.2 4s7.2-2.5 7.2-4v-4.8l-7.2 3.6-7.2-3.6Z"/>
            </svg>
          </div>
          <h2 class="domestic-card__title">교육</h2>
          <p class="domestic-card__desc">
            카야는 소외된 이웃이 사회와 자연의 일원으로의 성취 방법과 가치를 지향하며 성장할 수 있도록 혁신적인 교육 사업을 진행합니다.
          </p>
          <a class="domestic-card__btn" href="/business/domestic/education">자세히 보기</a>
        </div>
        <div class="domestic-card">
          <div class="domestic-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <h2 class="domestic-card__title">진행사업</h2>
          <p class="domestic-card__desc">
            카야의 모든 국내 프로젝트는 그 속에 ‘사람’과 ‘자연’ 그리고 ‘미래’가 모두 담기도록 연구하며 진행하고 있습니다.
          </p>
          <a class="domestic-card__btn" href="/business/projects">자세히 보기</a>
        </div>
      </div>
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
      <h1 class="edu-ref-hero__title">카야는 교육을 통해 개인의 성장과<br />공동체의 변화를 함께 만들어갑니다.</h1>
      <p class="edu-ref-hero__desc">
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
          <h2 class="edu-ref-h2">진로 탐색과 역량개발 교육</h2>
          <p class="edu-ref-sub">자기이해 / Life Design / 직업기초역량 / 진로 체험·멘토링 / 사회·문화 체험</p>
          <p class="edu-ref-p">
            청소년과 청년이 자신을 이해하고 미래를 주도적으로 설계할 수 있도록 단계적인 진로교육을 제공합니다.
            자기이해에서 공동체와 직업세계에 대한 이해, 진로 탐색과 설계로 이어지는 배움을 통해 자신의 가능성을 발견하고,
            선택한 미래를 구체적인 실천으로 옮기도록 지원합니다.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-2.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">진로 탐색과 역량개발 교육</div>
        </div>
      </div>
    </div>
  </section>

  <section class="edu-ref-section is-flipped" style="background:rgba(250,247,248,0.7)">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-1.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">사회적 가치 기반 소셜 창업과 자립 교육</div>
        </div>
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">2</span> Education Program</p>
          <h2 class="edu-ref-h2">사회적 가치 기반 소셜 창업과 자립 교육</h2>
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
          <h2 class="edu-ref-h2">기후·환경 인식개선 교육</h2>
          <p class="edu-ref-sub">기후·환경 교육 / 주제별 북클럽 / 인식개선 콘텐츠 제작·배포 / 기후위기 대응 봉사단 교육 및 활동</p>
          <p class="edu-ref-p">
            기후위기를 이해하고 일상과 지역사회에서 변화를 실천하는 세계시민의 성장을 지원합니다.
            관련 교육과 북클럽, 콘텐츠 제작, 봉사활동을 통해 환경문제를 자신의 삶과 연결하고,
            개인의 실천이 지역사회와 국제적 협력으로 이어지도록 돕습니다.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-3.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">기후·환경 인식개선 교육</div>
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
      <h1 class="adv-title">존중과 협력, 나눔의 가치를 아는<br />올바른 세계시민을 키워냅니다.</h1>
      <p class="adv-lead">
        카야의 옹호활동은 국제개발협력에 대한 대중과 청소년들의 이해를 돕고
        지구촌 이웃에 대한 존중과 협력, 나눔의 가치를 알게 하여
        올바른 세계시민으로 거듭날 수 있도록 하는데 목표를 두고 있습니다.
      </p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-block adv-block--ltr">
    <div class="adv-wrap">
      <div class="adv-block__head">
        <div class="adv-block__title-wrap">
          <p class="adv-block__en">International Development &amp; ODA</p>
          <h2 class="adv-block__title">국제개발협력과\nODA</h2>
        </div>
        <p class="adv-block__desc">
          국내의 초·중·고등학교 학생들 및 해외 봉사, 시민사회활동 등에 관심을 갖는 일반인을 대상으로
          국제개발협력과 한국의 ODA에 대해 소개하고 그 현황과 문제점을 살펴보며,
          올바른 국제개발협력을 위한 마음가짐과 그 방법에 대해 배워
          모든 국민이 세계시민으로서의 책임감을 갖는 것을 목표로 합니다.
        </p>
      </div>
    </div>
  </section>

  <section class="adv-block adv-block--rtl adv-block--alt">
    <div class="adv-wrap">
      <div class="adv-block__head">
        <p class="adv-block__desc">
          카야는 국제개발협력 및 NGO 활동이 해외의 선교사들에게 실용적인 선교 tool이 될 수 있다고 생각합니다.
          이를 위해 카야의 M&amp;N 사업은 개발협력사업 및 NGO 활동을 통한 전문적인 선교 방법을 연구하며,
          해외 선교 파견을 앞둔 선교사들과 강의, 세미나 등의 여러 방법을 활용하여
          올바른 개발과 실천적인 선교를 연구합니다.
        </p>
        <div class="adv-block__title-wrap">
          <p class="adv-block__en">Mission &amp; NGOs</p>
          <h2 class="adv-block__title">M&amp;N 사업</h2>
        </div>
      </div>

      <ol class="adv-numlist" aria-label="Mission & NGOs 연구 주제">
        <li class="adv-numlist__item"><span class="adv-numlist__label">올바른 개발이 무엇인가?</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">외부로부터의 도움 vs 내부로부터의 도움</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">구제 vs 지역사회개발</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">원조효과성 vs 개발효과성</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">하나님 나라의 가치관과 변혁적 개발</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">개발협력과 전인적 접근</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">자립과 지속가능성</span></li>
        <li class="adv-numlist__item adv-numlist__item--wide">
          <span class="adv-numlist__label">
            개발협력사업의 전문성 기르기
            <span class="adv-numlist__sub">(사업 타당성 조사, 사업 제안서 기획 및 작성, 예산관리, 사업성과 관리 등)</span>
          </span>
        </li>
      </ol>
    </div>
  </section>
</div>
`,
  },
  'business/projects': {
    title: '진행사업',
    content: '<p>국내외 현장에서 이어지는 카야의 활동과 사업별 이야기를 만나보세요.</p><p><a href="/business/projects/nepal">네팔</a> · <a href="/business/projects/myanmar">미얀마</a> · <a href="/business/projects/kyrgyzstan">키르기즈스탄</a> · <a href="/business/projects/domestic">국내</a></p>',
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
    content: '<p>카야의 최신 소식, 공지사항, 활동소식, 연간소식지를 확인하실 수 있습니다.</p><p><a href="/news/announcements">공지사항</a> · <a href="/news/activities">활동소식</a> · <a href="/news/newsletter">연간소식지</a> · <a href="/news/press">언론보도</a></p>',
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
    content: '<p>카야와 함께할 수 있는 방법을 안내합니다. <a href="/news/announcements">공지사항</a> · <a href="/news/activities">활동소식</a></p>',
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

