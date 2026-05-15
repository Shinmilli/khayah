import { KHAYAH_ORG_BOARD_MERGED_HTML } from './khayahOrgBoardHtml'
import { KHAYAH_LOCATION_PAGE_HTML } from './khayahLocationPageHtml'
import { KHAYAH_HISTORY_PAGE_HTML } from './khayahHistoryHtml'
import { DONOR_GUIDE_PAGE_HTML } from './donorGuidePageHtml'
import { NANUM_DONATE_URL } from './nanumDonate'

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
    content: KHAYAH_LOCATION_PAGE_HTML,
  },
  '카야/조직도': {
    title: '조직도',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  '카야/이사회-전문위원': {
    title: '이사회 / 전문위원',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  '카야/핵심사업': {
    title: '핵심사업',
    content: '<p>카야의 핵심 사업을 소개합니다. <a href="/사업/진행사업">진행사업</a>에서 상세 내용을 확인하실 수 있습니다.</p>',
  },
  '해외사업': {
    title: '해외사업',
    content: `
<div class="overseas-page">
  <section class="overseas-hero">
    <div class="ov-wrap">
      <p class="overseas-kicker">해외 사업</p>
      <h1 class="overseas-title">카야는 세계 곳곳의 소외된 이웃들이<br />변화를 이끌 수 있는 주체가 되도록 노력합니다.</h1>
      <p class="overseas-lead">
        카야는 단순한 지원을 넘어, 현지 주민과 함께 배우고 함께 실행하는 개발협력 사업을 지향합니다.
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
              단순 후원 기관과 수혜자의 관계가 아닌, 참여와 협력의 관계로 서로가 서로에게 배웁니다.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">02</div>
          <div>
            <h2 class="overseas-h2">현지와의 동화</h2>
            <p class="overseas-desc">
              진정한 변화는 현지 주민의 참여 의지와 그 변화에 대한 올바른 인식이 뒷받침 될 때만 가능합니다.
              이를 위해 카야는 모든 프로젝트에 현지와의 동화 단계를 필수 요소로 삼고, 그들의 자발적 참여를 이끌어냅니다.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">03</div>
          <div>
            <h2 class="overseas-h2">참여적 방법론</h2>
            <p class="overseas-desc">
              프로젝트의 전 과정(조사, 분석, 기획, 실행, 모니터링&amp;평가) 속에 현지 주민을 참여시키는 참여적 방법론을 활용합니다.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">04</div>
          <div>
            <h2 class="overseas-h2">지속가능성</h2>
            <p class="overseas-desc">
              지속가능한 개발협력사업이 될 수 있도록 프로젝트의 전 과정을 연구하고 해답을 찾아 나갑니다.
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
          <p class="overseas-card__desc">해외 현지 아동·청소년의 배움이 이어지도록 교육 지원 사업을 진행합니다.</p>
          <a class="overseas-card__btn" href="/해외사업/교육">자세히 보기</a>
        </div>

        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm1.1 5.6h-2.2v3.3H7.6v2.2h3.3v3.3h2.2v-3.3h3.3v-2.2h-3.3V7.6Z"/>
            </svg>
          </div>
          <h2 class="overseas-card__title">보건의료</h2>
          <p class="overseas-card__desc">주민 스스로 공중위생과 건강을 개선할 수 있는 역량을 키우는 데 집중합니다.</p>
          <a class="overseas-card__btn" href="/해외사업/보건의료">자세히 보기</a>
        </div>

        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 1 1-7.07 2.93A9.96 9.96 0 0 1 12 2Zm6.6 9h-3.2a18 18 0 0 0-1-5 8 8 0 0 1 4.2 5ZM12 4c-1.2 1.6-2 4.2-2.2 7h4.4c-.2-2.8-1-5.4-2.2-7Zm-3.4 2a18 18 0 0 0-1 5H4.4a8 8 0 0 1 4.2-5ZM4.4 13h3.2c.2 1.8.6 3.5 1 5a8 8 0 0 1-4.2-5Zm7.6 7c1.2-1.6 2-4.2 2.2-7H9.8c.2 2.8 1 5.4 2.2 7Zm3.4-2c.4-1.5.8-3.2 1-5h3.2a8 8 0 0 1-4.2 5Z"/>
            </svg>
          </div>
          <h2 class="overseas-card__title">진행사업</h2>
          <p class="overseas-card__desc">카야의 해외 프로젝트가 현장에서 어떻게 진행되는지 한눈에 확인할 수 있습니다.</p>
          <a class="overseas-card__btn" href="/사업/진행사업">자세히 보기</a>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  '해외사업/교육': {
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
        <h2 class="ov-edu-head__ko">기초역량\n강화사업</h2>
        <div>
          <p class="ov-edu-head__en">Power to accept change</p>
          <p class="ov-edu-head__p">
            사람 또는 지역이 변화하기 위해서는 그 변화를 받아들일 수 있는 역량이 우선되어야 합니다.
            카야는 다양한 프로그램을 통해 모든 참여자들의 기초 역량을 강화하는데 중점을 두며,
            이는 향후 이들이 삶 속에서 겪게 되는 여러 고난의 상황에서 큰 힘을 발휘합니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="기초역량 강화사업 구성">
        <div class="ov-edu-table__row" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Life Skills</p>
            <p class="ov-edu-cell__p" role="cell">
              의사소통, 대인관계, 재정관리, 건강관리, 문제해결 능력 등 삶을 영위하는 데 있어 기본적인 소양 교육을 진행
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">독서클럽 (꿈꾸는 다락방)</p>
            <p class="ov-edu-cell__p" role="cell">
              Life Skills 교육 시 제공되는 책을 읽고 함께 토론하며 상호간의 배움을 통해 생각의 장을 넓혀감
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">멘토링</p>
            <p class="ov-edu-cell__p" role="cell">
              카야와 함께 하는 현지 각 분야 전문가 풀을 활용하여, 청소년&middot;청년들에게 필요한 분야의 다양한 멘토링을 제공
            </p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="활동 이미지">
        <div class="ov-edu-img" aria-hidden="true"><div class="ov-edu-img__cap">학습 활동</div></div>
        <div class="ov-edu-img" aria-hidden="true"><div class="ov-edu-img__cap">독서클럽</div></div>
        <div class="ov-edu-img" aria-hidden="true"><div class="ov-edu-img__cap">교육 환경</div></div>
      </div>
    </div>
  </section>

  <section class="ov-edu-section" style="background:rgba(0,0,0,0.03)">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <h2 class="ov-edu-head__ko">맞춤형\n직업훈련</h2>
        <div>
          <p class="ov-edu-head__en">Dream Seekers</p>
          <p class="ov-edu-head__p">
            카야는 지원하는 지역 내 기업환경을 고려함과 동시에 지역 주민의 다양성도 함께 존중 받을 수 있도록
            충분한 사전조사와 분석 후 맞춤형 직업 기술교육 프로그램을 설계합니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="맞춤형 직업훈련 구성">
        <div class="ov-edu-table__row ov-edu-table__row--2" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">참여자 맞춤형</p>
            <p class="ov-edu-cell__p" role="cell">
              올바른 교육의 부재로 삶을 어떻게 영위해 나가야 하는지, 어떤 직업을 선택할 수 있는지 생각조차 못해본
              청소년 및 청년들이 다양한 프로그램을 통해 자신의 적성을 찾고 직업을 준비할 수 있는 기회를 제공
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">기업 맞춤형</p>
            <p class="ov-edu-cell__p" role="cell">
              프로젝트 대상 국가 및 지역 내 유망한 산업 및 기업들과 연계하여 빈민들에게는 일자리를,
              기업에게는 훈련된 고급 인력을 제공하며, 인력 수요 공급의 연결고리 역할을 통해 지역 경제 발전을 도모
            </p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="활동 이미지">
        <div class="ov-edu-img" aria-hidden="true"><div class="ov-edu-img__cap">기술 훈련</div></div>
        <div class="ov-edu-img" aria-hidden="true"><div class="ov-edu-img__cap">현장 실습</div></div>
        <div class="ov-edu-img" aria-hidden="true"><div class="ov-edu-img__cap">일자리 연계</div></div>
      </div>
    </div>
  </section>

  <section class="ov-edu-section">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <h2 class="ov-edu-head__ko">교육 질\n개선사업</h2>
        <div>
          <p class="ov-edu-head__en">Better learning environment</p>
          <p class="ov-edu-head__p">
            배움의 질은 교실 밖 환경과도 연결됩니다. 카야는 현지 상황에 맞는 교육 지원을 통해
            학생과 교사가 더 나은 환경에서 학습하고 성장할 수 있도록 돕습니다.
          </p>
        </div>
      </div>

      <div class="ov-edu-quality" aria-label="교육 질 개선사업 예시">
        <div class="ov-edu-qcard">
          <h3 class="ov-edu-qcard__title">학습 환경 개선</h3>
          <p class="ov-edu-qcard__p">
            교실&middot;학습 공간의 기본 인프라를 점검하고, 현장에서 지속적으로 유지될 수 있는 개선 방안을 함께 마련합니다.
          </p>
        </div>
        <div class="ov-edu-qcard">
          <h3 class="ov-edu-qcard__title">수업 역량 강화</h3>
          <p class="ov-edu-qcard__p">
            교사와 학습 보조 인력의 역량을 강화하고, 학생 참여 중심의 수업이 확산될 수 있도록 교육 자료와 방법을 지원합니다.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  '해외사업/보건의료': {
    title: '보건의료',
    content: `
<div class="ov-health-page">
  <section class="ov-health-hero">
    <div class="ov-health-wrap">
      <p class="ov-health-kicker">해외사업 · 보건의료</p>
      <h1 class="ov-health-title">영양상태, 공중위생 및 주거환경 개선을 위한<br />주민들의 보건 역량을 키웁니다.</h1>
      <p class="ov-health-desc">
        카야가 지원하는 지역들은 개발도상국 내에서도 보건 환경이 매우 열악한 빈민 마을들입니다.
        카야는 일회성 의료서비스 지원보다는 주민들 스스로 깨끗한 보건 환경을 마련하도록 인도하는
        주민참여형 건강케어 프로젝트로 보다 근본적인 해결 방법 마련에 집중합니다.
      </p>
      <div class="ov-health-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="ovh-block ovh-block--ltr">
    <div class="ov-health-wrap">
      <div class="ovh-block__head ovh-block__head--cols-4">
        <h2 class="ovh-block__title">지역사회기반\n주민참여형\n건강 케어</h2>
        <p class="ovh-block__desc">
          지역 내 1차 보건의료기관과 연계된 주민조직의 건강증진 활동을 통하여 지역 주민 스스로의 건강 돌봄 능력 배양
        </p>
      </div>

      <div class="ovh-cards ovh-cards--scroll" aria-label="주요 활동" tabindex="0">
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
        <h2 class="ovh-block__title">모자보건</h2>
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
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M8 56V22l24-12 24 12v34H40V40H24v16zm21-26h6v6h6v6h-6v6h-6v-6h-6v-6h6z"/></svg>
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
        <h2 class="ovh-block__title">학교보건</h2>
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
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">체육활동 지원 · 헬스스카웃 건강증진</span></li>
      </ol>
    </div>
  </section>
</div>
`,
  },
  '국내사업': {
    title: '국내사업',
    content: `
<div class="domestic-page">
  <section class="domestic-hero">
    <div class="dom-wrap">
      <p class="domestic-kicker">국내사업</p>
      <h1 class="domestic-title">카야는 국내 곳곳의 소외된 이웃들이<br />변화의 주체가 되도록 노력합니다.</h1>
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
            <h2 class="domestic-h2">가치창출형 · 미래지향적 교육</h2>
            <p class="domestic-desc">
              현장 중심의 사업 구조를 만들고, 도움이 필요한 이웃을 발굴해 삶의 변화를 돕습니다.
              자립을 위한 역량을 키우고, 지속 가능한 성장을 준비하는 교육 프로그램을 진행합니다.
            </p>
          </div>
        </li>

        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">02</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">민간 중심의 복지 사각지대 지원</h2>
            <p class="domestic-desc">
              공공 지원만으로는 닿기 어려운 영역의 필요를 살피고, 지역과 연대하여 실제적인 도움을 연결합니다.
              위기 상황에서 다시 일어설 수 있도록, 생활·교육·심리적 지원의 통로를 함께 만듭니다.
            </p>
          </div>
        </li>

        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">03</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">지역사회와 함께 만드는 사회적 가치</h2>
            <p class="domestic-desc">
              문제를 ‘해결해 주는’ 방식이 아니라, 당사자가 자신의 삶을 주도할 수 있도록 돕는 접근을 지향합니다.
              교육과 참여를 통해 공동체가 스스로 변화할 수 있는 기반을 확장해 나갑니다.
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
            국내 현장에서 필요한 역량을 키우고, 배움이 실천으로 이어지도록 돕는 교육 프로그램을 진행합니다.
          </p>
          <a class="domestic-card__btn" href="/국내사업/교육">자세히 보기</a>
        </div>

        <div class="domestic-card">
          <div class="domestic-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM18.92 8h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM18.49 14h-3.38c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2zm-1.23-4h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.9 4.33 3.56z"/>
            </svg>
          </div>
          <h2 class="domestic-card__title">지원사업</h2>
          <p class="domestic-card__desc">
            국내에서 진행 중인 사업을 한눈에 확인하고, 현장에서 이어지는 변화의 과정을 함께 살펴볼 수 있습니다.
          </p>
          <a class="domestic-card__btn" href="/사업/진행사업">자세히 보기</a>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  '국내사업/교육': {
    title: '교육',
    content: `
<div class="edu-page">
  <section class="edu-ref-hero">
    <div class="edu-wrap">
      <p class="edu-ref-hero__kicker">국내사업 · 교육</p>
      <h1 class="edu-ref-hero__title">우리 이웃들이 꿈과 희망을 이어갈 수 있도록<br />다양한 교육 프로그램을 제공합니다.</h1>
      <p class="edu-ref-hero__desc">
        카야는 교육을 통해 개인의 성장과 공동체의 변화를 함께 만들어가고자 합니다.
        국내에서 일하고 있는 외국인 노동자, 탈북 청년, 청소년 등 다양한 이웃들이
        스스로의 역량을 키우고 배운 것을 다시 나눌 수 있도록 ‘사회적 가치’를 바탕으로 교육과 경험의 기회를 제공합니다.
      </p>
      <div class="edu-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="edu-ref-section">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">1</span> Education Program</p>
          <h2 class="edu-ref-h2">외국인노동자 권익증진</h2>
          <p class="edu-ref-sub">기술교육 및 창업교육, 문화탐방, 인식개선 사업</p>
          <p class="edu-ref-p">
            국내에서 일하고 있는 외국인 노동자들에게 ‘사회적 가치’를 토대로 한 각종 기술교육 및 창업교육을 실시하여,
            이들의 귀국 후 활동을 통해 개발도상국의 지역 사회 발전 및 소외된 이들에 대한 나눔을 추구합니다.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <div class="edu-ref-media__caption">프로그램 현장</div>
        </div>
      </div>
    </div>
  </section>

  <section class="edu-ref-section is-flipped" style="background:rgba(250,247,248,0.7)">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div class="edu-ref-media" aria-hidden="true">
          <div class="edu-ref-media__caption">교육 · 멘토링</div>
        </div>
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">2</span> Education Program</p>
          <h2 class="edu-ref-h2">탈북청년 창업교육</h2>
          <p class="edu-ref-sub">소셜 비지니스와 국내·외 창업, 국제개발협력 교육</p>
          <p class="edu-ref-p">
            탈북 청년들에게 사회적 가치와 기업가 정신을 토대로 한 소셜 비지니스 교육을 통해
            한국 사회 일원으로서의 자부심을 키움과 동시에 국내외 다양한 분야로의 진출을 함께 모색합니다.
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
          <h2 class="edu-ref-h2">청소년 미래교육</h2>
          <p class="edu-ref-sub">민주시민, 세계시민 양성</p>
          <p class="edu-ref-p">
            2017년 KDI(한국개발연구원) 조사에 의하면 우리나라 대학생의 80%가 고등학교 시절을 '전쟁터'로 기억하고 있다고 합니다.
            경쟁이 당연한 사회에서 교육 받는 아이들을 위해 진정한 민주시민, 세계시민으로 거듭날 수 있는 각종 교육 프로그램을 운영합니다.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <div class="edu-ref-media__caption">청소년 성장 프로그램</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  '사업/옹호사업': {
    title: '옹호사업',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">옹호사업</p>
      <h1 class="adv-title">존중과 협력, 나눔의 가치를 아는<br />올바른 세계시민을 키워냅니다.</h1>
      <p class="adv-desc">
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
  '후원/후원-안내': {
    title: '후원 안내',
    content: DONOR_GUIDE_PAGE_HTML,
  },
  '후원/후원신청': {
    title: '후원신청',
    content: '<p>후원 신청 및 정기후원 안내 페이지입니다. 문의: khayahkorea@gmail.com / 031 689 3639</p>',
  },
  '후원/정기후원': {
    title: '정기후원',
    content: `<p>정기 후원 참여 방법을 안내합니다. <a href="${NANUM_DONATE_URL}" target="_blank" rel="noopener noreferrer">후원 신청</a> · 문의: 031 689 3639</p>`,
  },
  '후원/일시후원': {
    title: '일시후원',
    content: '<p>일시 후원 및 계좌 안내입니다. <a href="/후원/후원-안내">후원 안내</a>를 함께 확인해 주세요.</p>',
  },
  '후원/물품후원': {
    title: '물품후원',
    content: '<p>물품 후원 절차 및 문의 안내입니다.</p>',
  },
  '후원/자원봉사': {
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
    content: '<p>카야와 함께할 수 있는 방법을 안내합니다. <a href="/소식/공지사항">공지사항</a> · <a href="/소식/활동소식">활동소식</a></p>',
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
