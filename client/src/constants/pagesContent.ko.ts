import { KHAYAH_ORG_BOARD_MERGED_HTML } from './khayahOrgBoardHtml'
import { KHAYAH_LOCATION_PAGE_HTML } from './khayahLocationPageHtml'
import { KHAYAH_HISTORY_PAGE_HTML } from './khayahHistoryHtml'
import { DONOR_GUIDE_PAGE_HTML, SUPPORT_METHOD_PAGE_HTML } from './donorGuidePageHtml'

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
<section class="kaya-intro">
  <div class="kaya-intro__copy">
    <p class="kaya-kicker">WHO WE ARE · 카야는</p>
    <h2 class="kaya-display" data-k="intro.headline" data-k-mode="html">한 사람의 성장이<br /><span class="kaya-wine">세상을 밝히는 빛</span>이<br />되도록</h2>
    <p class="kaya-lead" data-k="intro.lead">카야는 교육을 통해 사람을 키우고, 그 사람이 다시 이웃과 지역을 변화시키는 길을 함께 걷습니다.</p>
    <div class="kaya-chips">
      <span class="kaya-chip kaya-chip--on" data-k="intro.chip.0">해외 지부 2곳</span>
      <span class="kaya-chip" data-k="intro.chip.1">이사·전문위원 [00]명</span>
      <span class="kaya-chip" data-k="intro.chip.2">설립 [0000]년</span>
    </div>
  </div>
  <figure class="kaya-intro__photo">
    <img data-k="intro.photo" data-k-mode="src" data-k-alt="intro.photoAlt" src="/images/about/kaya-intro.jpg" alt="키르기스스탄 STEM 교육 현장" />
    <figcaption><span data-k="intro.captionKicker">현장</span><b data-k="intro.caption">키르기스스탄 STEM 교육</b></figcaption>
  </figure>
</section>
<section class="kaya-identity" id="about">
  <div class="kaya-wrap">
  <div class="kaya-identity__intro">
    <p class="kaya-kicker">IDENTITY · 정의와 방향</p>
    <h2 class="kaya-display kaya-display--sub">카야가 존재하는 이유와<br /><span class="kaya-wine">나아갈 방향</span></h2>
  </div>
  <div class="kaya-identity__list">
    <article class="kaya-id">
      <span class="kaya-id__no">01</span>
      <div>
        <p class="kaya-id__en">DEFINITION</p>
        <h3>정의</h3>
        <p class="kaya-id__point" data-k="intro.definitionPoint">카야는 사람을 키우고 섬기는 개발 NGO입니다.</p>
        <p data-k="intro.definition">카야는 올바른 배움과 인도를 통해 성장한 한 사람이 큰 변화를 이끌어 낼 수 있다고 믿습니다. 그렇게 성장한 사람들이 온 땅 곳곳에서 세상을 밝히는 빛이 되기를 소망합니다.</p>
      </div>
    </article>
    <article class="kaya-id" id="vision">
      <span class="kaya-id__no">02</span>
      <div>
        <p class="kaya-id__en">VISION</p>
        <h3>비전</h3>
        <p data-k="intro.vision">카야는 인종과 종교, 이념의 벽을 넘어 모든 소외된 이웃이 스스로 성장하여 가정과 사회의 변화를 이끄는 세상을 꿈꿉니다.</p>
      </div>
    </article>
    <article class="kaya-id">
      <span class="kaya-id__no">03</span>
      <div>
        <p class="kaya-id__en">MISSION</p>
        <h3>미션</h3>
        <p data-k="intro.mission">카야는 사람 중심의 사업 개발을 통해 세상의 모든 소외된 이웃이 스스로 설 수 있는 길을 함께 찾습니다.</p>
      </div>
    </article>
  </div>
  </div>
</section>
<section class="kaya-values" id="value" aria-labelledby="values-heading">
  <div class="kaya-values__head">
    <p class="kaya-kicker">CORE VALUES · 핵심가치</p>
    <h2 id="values-heading" class="kaya-display kaya-display--sub">카야가 지키는<br /><span class="kaya-wine">다섯 가지 가치</span></h2>
  </div>
  <div class="kaya-values__scroll">
    <div class="kaya-values__stage" aria-label="핵심가치 5가지">
      <div class="kaya-values__ring" aria-hidden="true"></div>
      <div class="kaya-values__core">
        <span>5 Values</span>
        <span>카야의 핵심가치</span>
      </div>
      <div class="kaya-values__node" style="left: 268px; top: 86px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path></svg>
        <span data-k="intro.value.0.title">인간 존엄</span>
      </div>
      <p class="kaya-values__desc" style="left: 30px; top: 116px; width: 220px; text-align: right" data-k="intro.value.0.desc">모든 사람이 지닌 고유한 존엄성을 존중하며, 사람을 모든 사업의 중심에 둡니다.</p>
      <div class="kaya-values__node" style="left: 492px; top: 86px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3.2"></circle><circle cx="16.5" cy="9" r="2.6"></circle><path d="M2.5 20c1-3.5 3-5 5.5-5s4.5 1.5 5.5 5M14 15.5c3 0 5.5 1.5 6.5 4.5"></path></svg>
        <span data-k="intro.value.1.title">비차별과 협력</span>
      </div>
      <p class="kaya-values__desc" style="left: 632px; top: 116px; width: 230px" data-k="intro.value.1.desc">인종·종교·이념의 차이를 넘어 모든 이웃을 존중하고, 지역사회와 협력합니다.</p>
      <div class="kaya-values__node" style="left: 199px; top: 299px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M9 7V5h6v2M3 12h18"></path></svg>
        <span data-k="intro.value.2.title">전문성</span>
      </div>
      <p class="kaya-values__desc" style="left: 0; top: 326px; width: 185px; text-align: right" data-k="intro.value.2.desc">현장에서 쌓은 역량과 전문성을 바탕으로 일합니다.</p>
      <div class="kaya-values__node" style="left: 561px; top: 299px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"></path></svg>
        <span data-k="intro.value.3.title">혁신</span>
      </div>
      <p class="kaya-values__desc" style="left: 700px; top: 316px; width: 180px" data-k="intro.value.3.desc">현장의 목소리에 귀 기울이며, 새로운 방법으로 지속 가능한 변화를 모색합니다.</p>
      <div class="kaya-values__node" style="left: 380px; top: 430px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg>
        <span data-k="intro.value.4.title">사회적 책임</span>
      </div>
      <p class="kaya-values__desc" style="left: 290px; top: 572px; width: 300px; text-align: center" data-k="intro.value.4.desc">이웃을 사랑하는 참된 그리스도인의 삶을 실천합니다.</p>
    </div>
  </div>
</section>
`,
  },
  'about/greeting': {
    title: '인사말',
    content: `
<div class="greeting-modern">
  <section class="gm-hero">
    <div class="gm-hero__copy">
      <p class="sidebar-kicker">REPRESENTATIVE'S MESSAGE · 대표 인사말</p>
      <h2 class="sidebar-title" data-k="greet.title" data-k-mode="html"><span class="gm-wine">함께하는</span> 마음으로</h2>
      <p class="sidebar-sub" data-k="greet.sub">나눔과 섬김의 실천을 위하여</p>
      <div class="gm-who">
        <span class="gm-badge">대표</span>
        <span class="sidebar-role" data-k="greet.role">카야(KHAYAH) 대표</span>
        <span class="sidebar-name" data-k="greet.name">최순태</span>
      </div>
    </div>
    <div class="gm-photo">
      <div class="gm-photo__back" aria-hidden="true"></div>
      <div class="gm-photo__mark" aria-hidden="true">&ldquo;</div>
      <img class="sidebar-photo" data-k="greet.photo" data-k-mode="src" data-k-alt="greet.photoAlt" src="/images/about/greeting-representative.png" alt="카야(KHAYAH) 대표 최순태" width="512" height="630" />
    </div>
  </section>
  <section class="gm-band">
    <blockquote class="article-lead">
      <span class="article-quote-mark" aria-hidden="true">&ldquo;</span>
      <p class="article-lead-text" data-k="greet.lead" data-k-mode="html">남을 돕는다는 것은 어디선가 보고 들은 것처럼 결코 쉬운 일은 아닌 듯 보입니다.<br />내가 힘겹게 얻어낸 것의 일부분을 떼어 주거나,<br />천금 같은 나의 귀중한 시간을 쪼개서 써야 하기 때문이지요.<br /><span class="gm-wine">하지만 그 쉽지 않은 일에 대한 보상은 남다릅니다.</span></p>
    </blockquote>
  </section>
  <article class="article">
      <p class="article-body" data-k="greet.body.0" data-k-mode="html">
        나눔과 도움을 실천하는 일을 업으로 삼은 이후 가장 많이 받는 질문 중 하나는 &lsquo;어쩌다 이쪽 일을 시작하게 되었느냐&rsquo;입니다. 보통 잘 이해가 되지 않는다는 표정들을 하고 계시지요.
      </p>
      <p class="article-body" data-k="greet.body.1" data-k-mode="html">
        저의 대답은 항상 간단합니다.<br /><strong>&lsquo;당신도 나와 같은 경험을 하게 되면 그 답을 알게 될 겁니다.&rsquo;</strong> 무미건조해 보일지도 모르지만,<br />전 감사하게도 언제나 진심으로 대답할 수 있었습니다.
      </p>
      <p class="article-body" data-k="greet.body.2" data-k-mode="html">
        길거리에서 무거운 짐을 들고 가는 노인을 도와주신 경험이 다들 한 번씩은 있으실 겁니다.<br />전혀 어렵고 대단한 일이 아닙니다. 기분이 어떠셨는지요? 저는 나눔을 직업으로 삼으면서 그 기분을 매 순간 느끼며 살아가고 있습니다. <span class="gm-mark">한 생명을 살리고, 한 학생이 나의 도움으로 웃으며 자라나는 모습을 보는 것은 이 세상 그 어떤 기쁨과도 견줄 수 없습니다.</span>
      </p>
      <p class="article-body" data-k="greet.body.3" data-k-mode="html">
        여러분, 지금 주위를 한번 둘러보시기 바랍니다.<br />단 몇 분 거리, 또는 몇 시간 거리에, 여러분의 관심과 작은 손길로 환하게 웃을 수 있는 이웃들이 너무도 많이 있습니다.
      </p>
      <p class="article-body" data-k="greet.body.4" data-k-mode="html">
        그들에게 손을 내미는 일에 주저하지 마시기 바랍니다.<br />&lsquo;나중에&rsquo;, &lsquo;돈 많이 벌면&rsquo;, &lsquo;시간 될 때&rsquo;만 할 수 있는 일이 절대 아닙니다. <span class="gm-mark">지금 당장, 돈 없어도, 시간이 많지 않아도, 어느 때고 할 수 있는 것이 바로 나눔입니다.</span>
      </p>
      <p class="article-body" data-k="greet.body.5" data-k-mode="html">
        이 세상의 모든 생명은 모두 하나님의 귀한 창조물이며, 고통 받는 이들을 불쌍히 여기고 돕는 것은 이 땅 위의 모든 이들이 가슴에 품고 살아가야 하는 소명입니다. 다시 살아남을 뜻하는 단체명 카야처럼, <strong class="gm-wine">여러분의 인생에도 진정한 부흥, 카야가 휘몰아치기를 기원합니다.</strong>
      </p>
      <p class="article-sign"><span class="article-sign-role" data-k="greet.signRole">카야(KHAYAH) 대표</span> <strong data-k="greet.signName">최순태</strong></p>
    </article>
  <section class="gm-closing">
    <div class="gm-closing__inner">
      <span class="gm-closing__mark" aria-hidden="true">&ldquo;</span>
      <p class="gm-closing__text" data-k="greet.quote" data-k-mode="html">카야와 함께, 여러분의 삶에도<br />진정한 나눔, 진정한 변화가<br />함께하기를 기원합니다.</p>
      <div class="gm-closing__rule" aria-hidden="true"></div>
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
<div class="dom-intro">
  <section class="dom-intro__top">
    <div class="dom-intro__copy">
      <p class="dom-kicker">OVERSEAS · 해외사업</p>
      <h2 data-k="ovs.title" data-k-mode="html">교육으로 <span>변화의 주체</span>를 세웁니다.</h2>
      <p data-k="ovs.lead">현지 주민과 함께 배우고 실행하며, 지역사회가 스스로 변화의 힘을 키우도록 돕습니다.</p>
    </div>
    <figure class="dom-photo">
      <img data-k="ovs.photo" data-k-mode="src" data-k-alt="ovs.photoAlt" src="/images/business/overseas-intro.jpg" alt="학습지를 든 미얀마 아이들" />
    </figure>
  </section>
  <section class="dom-principles">
    <p class="dom-kicker">PRINCIPLES · 해외사업 원칙</p>
    <div class="dom-pr">
      <span>01</span>
      <div>
        <h3 data-k="ovs.p.0.title">참여와 협력</h3>
        <p data-k="ovs.p.0.body" data-k-mode="html">카야는 현지 주민을 단순한 수혜자가 아닌 변화의 주체이자 협력 파트너로 존중합니다.<br />서로의 경험과 지식을 나누며 지역에 필요한 변화를 함께 만들어갑니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>02</span>
      <div>
        <h3 data-k="ovs.p.1.title">현지와의 동화</h3>
        <p data-k="ovs.p.1.body" data-k-mode="html">지속적인 변화는 현지 주민이 참여하고, 그 변화의 의미를 함께 이해할 때 가능합니다.<br />카야는 지역의 삶과 맥락을 충분히 이해하고 신뢰를 쌓는 ‘현지와의 동화’를 모든 사업의 출발점으로 삼습니다.<br />주민과 사업의 방향을 함께 정하고, 자발적 참여를 이끌어냅니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>03</span>
      <div>
        <h3 data-k="ovs.p.2.title">참여적 방법론</h3>
        <p data-k="ovs.p.2.body" data-k-mode="html">조사와 분석, 기획과 실행, 모니터링과 평가의 전 과정에 주민이 참여합니다.<br />주민의 경험과 의견을 사업에 반영하고, 변화와 성과도 함께 확인합니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>04</span>
      <div>
        <h3 data-k="ovs.p.3.title">지속가능성(sustainability)</h3>
        <p data-k="ovs.p.3.body" data-k-mode="html">지역사회의 자원과 협력체계를 기반으로, 외부 지원이 끝난 후에도 지역이 스스로 운영을 이어갈 수 있도록 합니다.<br />카야는 사업의 전 과정에서 지속가능한 운영의 조건을 연구하고 실천합니다.</p>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/overseas/education': {
    title: '교육',
    content: `
<div class="oedu-page">
  <section class="oedu-lead">
    <p class="dom-kicker">해외사업 · 교육</p>
    <h2 data-k="oedu.title" data-k-mode="html">Learning today, <span>Leading tomorrow!</span></h2>
    <p data-k="oedu.desc">카야는 교육을 통해 지역이 변화의 힘을 키우도록 돕습니다. 삶의 기초역량부터 직업훈련, 교육 환경 개선까지 현장과 함께 설계하고 실행합니다.</p>
  </section>
  <section class="oedu-block">
    <div class="oedu-wrap">
      <div class="oedu-ax">
        <div class="oedu-axh">
          <p class="oedu-axe">FOUNDATIONAL CAPACITY BUILDING</p>
          <p class="oedu-axt" data-k="oedu.0.title" data-k-mode="html">기초역량<br />강화사업</p>
        </div>
        <div>
          <p class="oedu-axs">Power to accept change</p>
          <p class="oedu-tx" data-k="oedu.0.body">스스로 배우고 삶의 과제에 대응하는 힘은 지속적인 성장의 토대입니다. 카야는 읽기·쓰기·수리력 등 기초학습과 자기이해·의사소통·문제해결 등 삶의 역량을 함께 키웁니다. 참여자가 배움을 이어가고, 자신과 공동체를 이해하며 주체적으로 살아가도록 지원합니다.</p>
        </div>
      </div>
      <div class="oedu-bxg">
        <div class="oedu-bxc">
          <p class="oedu-bxt">기초학습역량</p>
          <p class="oedu-bxd">국어(읽기·쓰기·말하기), 수리, 영어, 과학 등 지속적인 학업과 심화 학습으로 이어지도록 지원하는 필수 기초지식과 학습능력</p>
        </div>
        <div class="oedu-bxc">
          <p class="oedu-bxt">Life Skills</p>
          <p class="oedu-bxd">자기이해, 의사소통, 대인관계, 건강·재정관리, 비판적·창의적 사고, 문제해결 등 일상과 삶의 과제에 주체적이고 사회협력적으로 대응하기 위한 기본 역량</p>
        </div>
      </div>
      <div class="oedu-photos">
        <img data-k="oedu.0.photo.0" data-k-mode="src" data-k-alt="oedu.0.cap.0" src="/images/business/overseas-edu-foundation-1.jpg" alt="학습지를 들고 있는 아이들" />
        <img data-k="oedu.0.photo.1" data-k-mode="src" data-k-alt="oedu.0.cap.1" src="/images/business/overseas-edu-foundation-2.jpg" alt="수학 수업을 듣는 학생들" />
        <img data-k="oedu.0.photo.2" data-k-mode="src" data-k-alt="oedu.0.cap.2" src="/images/business/overseas-edu-foundation-3.jpg" alt="Life Skills 교육 현장" />
      </div>
    </div>
  </section>
  <section class="oedu-block oedu-block--sand">
    <div class="oedu-wrap">
      <div class="oedu-ax">
        <div class="oedu-axh">
          <p class="oedu-axe">FUTURE-ORIENTED EDUCATION</p>
          <p class="oedu-axt" data-k="oedu.1.title" data-k-mode="html">미래지향<br />교육</p>
        </div>
        <div>
          <p class="oedu-axs">Dream Seekers</p>
          <p class="oedu-tx" data-k="oedu.1.body">청소년과 청년이 변화하는 사회를 이해하고 자신의 미래를 주도적으로 설계하도록 돕습니다. 지역의 교육·산업 환경과 참여자의 관심을 바탕으로 진로·직업교육과 미래 분야 역량을 위한 STEM 교육을 함께 운영하며, 배운 것을 삶과 지역의 과제에 적용하는 힘을 키웁니다.</p>
        </div>
      </div>
      <div class="oedu-bxg">
        <div class="oedu-bxc">
          <p class="oedu-bxt">맞춤형 진로·직업훈련</p>
          <p class="oedu-bxd">자신의 흥미와 강점, 직업과 공동체의 가치를 이해하고 다양한 직업과 삶의 경로를 탐색합니다. 기술교육, 멘토링, 진로체험 등 필요에 맞는 지원으로 구체화합니다.</p>
          <p class="oedu-flow">인식개선 → 탐색 → 설계 → 실행<small>4단계 맞춤형 지원</small></p>
        </div>
        <div class="oedu-bxc">
          <p class="oedu-bxt">융합 탐구 교육</p>
          <p class="oedu-bxd">과학·기술·공학·수학을 연결하여 질문하고, 실험과 프로젝트 활동을 통해 탐구하며 문제해결 역량을 키웁니다.</p>
          <p class="oedu-flow">인식확산형(진로강연·박람회) → 단기 집중 체험형(캠프) → 심화탐구형(클럽) → 문제해결기획 경연형(콘테스트)<small>4단계 심화 지원</small></p>
        </div>
      </div>
      <div class="oedu-photos">
        <img data-k="oedu.1.photo.0" data-k-mode="src" data-k-alt="oedu.1.cap.0" src="/images/business/overseas-edu-future-1.jpg" alt="Life Design 진로탐색" />
        <img data-k="oedu.1.photo.1" data-k-mode="src" data-k-alt="oedu.1.cap.1" src="/images/business/overseas-edu-future-2.jpg" alt="직업기술 체험 현장" />
        <img data-k="oedu.1.photo.2" data-k-mode="src" data-k-alt="oedu.1.cap.2" src="/images/business/overseas-edu-future-3.jpg" alt="STEM 융합 탐구 수업" />
      </div>
    </div>
  </section>
  <section class="oedu-block">
    <div class="oedu-wrap">
      <div class="oedu-ax">
        <div class="oedu-axh">
          <p class="oedu-axe">EDUCATION QUALITY IMPROVEMENT</p>
          <p class="oedu-axt" data-k="oedu.2.title" data-k-mode="html">교육 질<br />개선사업</p>
        </div>
        <div>
          <p class="oedu-axs">EQUIP (Education Quality Improvement Program)</p>
          <p class="oedu-tx" data-k="oedu.2.body">배움의 기회를 넓히고 교육 격차를 줄이는 일과 함께, 교실에서 이루어지는 교육의 질을 높입니다. 교사와 학교, 지역사회가 협력해 수업과 학습환경을 개선하도록 지원합니다. 현장의 필요에 맞는 교사교육과 교육자료, 학습 지원을 연결하고, 그 경험을 함께 돌아보며 더 나은 교육 방법을 발전시킵니다.</p>
        </div>
      </div>
      <div class="oedu-bxg">
        <div class="oedu-bxc">
          <p class="oedu-bxt">교사 역량 강화</p>
          <p class="oedu-bxs">교육자</p>
          <p class="oedu-bxd">필수적이고 선진적인 교수법 발굴과 교육, 학교 운영·리더십 역량 강화, 교사 간 수업 경험 공유</p>
        </div>
        <div class="oedu-bxc">
          <p class="oedu-bxt">학습 콘텐츠 및 교육환경 개선</p>
          <p class="oedu-bxs">학습자</p>
          <p class="oedu-bxd">교육 패러다임 및 교육 정책 기조에 발맞추는 학습자료와 학습공간 개선</p>
        </div>
        <div class="oedu-bxc">
          <p class="oedu-bxt">학부모·지역사회 협력</p>
          <p class="oedu-bxs">지원자</p>
          <p class="oedu-bxd">학습 독려를 위한 학부모와 지역사회 참여·인식개선, 안전하고 집중할 수 있는 학습환경 조성, 현장 필요에 따른 장학 지원</p>
        </div>
      </div>
      <div class="oedu-photos">
        <img data-k="oedu.2.photo.0" data-k-mode="src" data-k-alt="oedu.2.cap.0" src="/images/business/overseas-edu-quality-1.jpg" alt="교사 역량강화 연수" />
        <img data-k="oedu.2.photo.1" data-k-mode="src" data-k-alt="oedu.2.cap.1" src="/images/business/overseas-edu-quality-2.jpg" alt="이러닝 교육 플랫폼으로 공부하는 학생" />
        <img data-k="oedu.2.photo.2" data-k-mode="src" data-k-alt="oedu.2.cap.2" src="/images/business/overseas-edu-quality-3.jpg" alt="학부모 인식개선 행사" />
      </div>
    </div>
  </section>
  <section class="oedu-cta">
    <p>지금 진행 중인 해외 교육 사업은 진행사업 페이지에서 볼 수 있습니다.</p>
    <a class="oedu-pj" href="/business/overseas/education/projects"><span data-k="oedu.cta">해외 교육 진행사업 확인하기</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
  </section>
  <section class="dom-more">
    <div class="dom-wrap">
      <p class="dom-kicker">MORE · 다른 사업 보기</p>
      <div class="dom-more__row">
        <a class="dom-go" href="/business/overseas">해외사업 소개<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/overseas/volunteer">해외봉사단<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/domestic">국내사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/overseas/volunteer': {
    title: '해외봉사단',
    content: `
<div class="voln-page">
  <section class="voln-lead">
    <p class="dom-kicker">해외사업 · 해외봉사단</p>
    <h2 data-k="vol.title" data-k-mode="html">현지 과제를 함께 푸는 <span>국제협력활동</span></h2>
    <p data-k="vol.desc" data-k-mode="html">카야는 국내 청소년·청년과 기업 등 경험과 열정을 가진 다양한 참여자가 현지의 과제를 이해하고<br />주민과 함께 해결방안을 찾도록 지원합니다.<br />필요에 맞는 실천 모델을 제안하고 실행하며, 지역사회의 지속가능한 변화와 참여자의 성장이 함께 이뤄지도록 합니다.</p>
  </section>
  <section class="voln-plan">
    <p class="dom-kicker">PLANNING · 봉사기획</p>
    <h3 data-k="vol.block.0.title">철학과 전문성을 담은 봉사기획</h3>
    <p class="voln-tx">10년 이상 축적한 국제개발협력·교육분야 경험을 바탕으로 지역의 문제를 발굴·분석해 맞춤형 봉사활동을 기획합니다.<br />현지에 적합한 변화를 만들고, 봉사단원이 세계시민성·문제해결력·적응력·전문성 활용 역량을 키우도록 지원합니다.</p>
    <div class="voln-cards">
      <div class="voln-card">
        <p class="voln-card__title" data-k="vol.panel.0.title">국제개발협력 전문성</p>
        <ul>
          <li><span>1</span><span>현지 지역 분석을 통한 주제 발굴</span></li>
          <li><span>2</span><span>적정성·실행가능성 파악 현지조사</span></li>
          <li><span>3</span><span>조사기반 활동 모델(Action Plan) 기획</span></li>
          <li><span>4</span><span>현지 정부·전문기관 네트워킹을 활용한 현지준비</span></li>
          <li><span>5</span><span>활동 후 현지 지속관리 체계 구축</span></li>
          <li><span>6</span><span>활동 모니터링 및 평가 통한 성과분석</span></li>
          <li><span>7</span><span>평가 반영한 지속·후속 활동 기획</span></li>
        </ul>
      </div>
      <div class="voln-card">
        <p class="voln-card__title" data-k="vol.panel.1.title">교육 분야 전문성</p>
        <ul>
          <li><span>1</span><span>주제 맞춤 인식개선 및 교육 활동 기획</span></li>
          <li><span>2</span><span>파견전 봉사단원 역량강화교육 기획<small>(봉사단원 정체성, 세계시민성, 주제 전문성, 건강·안전관리, 팀활동 역량, 활동기획력)</small></span></li>
          <li><span>3</span><span>봉사단원 주도 세부활동 기획 반영<small>(전문성 활용기회, 문제해결력, 적응력, 커뮤니케이션, 외국어, 조사·분석력, 행정력 등 개인역량 성장)</small></span></li>
        </ul>
      </div>
    </div>
  </section>
  <section class="voln-ops">
    <div class="voln-wrap">
      <p class="dom-kicker">OPERATION · 운영 전 과정</p>
      <h3 data-k="vol.block.1.title">봉사단 사업 전 과정 운영 전문성</h3>
      <p class="voln-tx">카야는 봉사단 사업의 운영 주기 전체를 이해하고, 전 과정을 운영할 수 있는 매뉴얼과 시스템을 갖추어 안정적으로 운영합니다.</p>
      <div class="voln-steps">
        <div><b>STEP 1</b><span>홍보·모집</span></div>
        <div><b>STEP 2</b><span>심사</span></div>
        <div><b>STEP 3</b><span>선발</span></div>
        <div><b>STEP 4</b><span>현지 사전조사 및 국내외 사전준비</span></div>
        <div><b>STEP 5</b><span>국내교육 및 단원주도 활동기획</span></div>
        <div><b>STEP 6</b><span>발대식 및 봉사단 파견</span></div>
        <div><b>STEP 7</b><span>현장 활동 지원 및 인솔·안전 관리</span></div>
        <div><b>STEP 8</b><span>활동 결과 모음 및 성과분석</span></div>
        <div><b>STEP 9</b><span>성과공유회</span></div>
        <div><b>STEP 10</b><span>후속 활동 및 지속 확산 관리</span></div>
      </div>
    </div>
  </section>
  <section class="voln-photos">
    <img data-k="vol.photo.0" data-k-mode="src" data-k-alt="vol.photo.0.alt" src="/images/business/volunteer-group.jpg" alt="2026 경기청년 기후특사단 단체 사진" />
    <img data-k="vol.photo.1" data-k-mode="src" data-k-alt="vol.photo.1.alt" src="/images/business/volunteer-field.jpg?v=2" alt="키르기스스탄 기념 식수" />
    <img data-k="vol.photo.2" data-k-mode="src" data-k-alt="vol.photo.2.alt" src="/images/business/volunteer-launch.jpg" alt="경기청년 기후특사단 발대식" />
  </section>
  <section class="voln-cta">
    <p>지금 진행 중인 해외봉사단 사업은 진행사업 페이지에서 볼 수 있습니다.</p>
    <a class="voln-pj" href="/business/overseas/volunteer/projects"><span data-k="vol.cta">해외봉사단 진행사업 확인하기</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
  </section>
  <section class="dom-more">
    <div class="dom-wrap">
      <p class="dom-kicker">MORE · 다른 사업 보기</p>
      <div class="dom-more__row">
        <a class="dom-go" href="/business/overseas">해외사업 소개<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/overseas/education">해외 교육<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/domestic">국내사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/domestic': {
    title: '국내사업',
    content: `
<div class="dom-intro">
  <section class="dom-intro__top">
    <div class="dom-intro__copy">
      <p class="dom-kicker">DOMESTIC · 국내사업</p>
      <h2 data-k="dom.title" data-k-mode="html">배움을 실천의 기회로 <span>연결합니다</span>.</h2>
      <p data-k="dom.lead">카야는 현장의 필요에 맞는 교육과 지원을 잇고, 개인의 경험이 지역사회의 변화로 이어지도록 함께합니다.</p>
    </div>
    <figure class="dom-photo">
      <img data-k="dom.photo" data-k-mode="src" data-k-alt="dom.photoAlt" src="/images/business/domestic-edu-2.jpg" alt="Dream Seekers 캠프 발표" />
    </figure>
  </section>
  <section class="dom-principles">
    <p class="dom-kicker">PRINCIPLES · 국내사업 원칙</p>
    <div class="dom-pr">
      <span>01</span>
      <div>
        <h3 data-k="dom.p.0.title">가치지향적 &amp; 미래지향적 교육</h3>
        <p data-k="dom.p.0.body">한국 사회의 구조와 교육 체계 속에서 충분히 드러나지 않은 과제를 발견하고, 개선할 방안을 모색하고, 새로운 가치 창출과 미래를 준비하는 교육개발 프로젝트를 진행합니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>02</span>
      <div>
        <h3 data-k="dom.p.1.title">인간 중심 &amp; 자연친화적 교육</h3>
        <p data-k="dom.p.1.body">카야는 사람을 개발의 수단이 아닌 존엄한 주체로 존중합니다. 지역사회와 자연환경의 미래를 함께 고려하며 무분별한 개발을 지양하고, 사람의 성장과 생태계의 지속가능성이 상생하는 교육을 실천합니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>03</span>
      <div>
        <h3 data-k="dom.p.2.title">국내에서 세계로 이어지는 개발협력</h3>
        <p data-k="dom.p.2.body">진로 탐색, 소셜 창업, 기후·환경 교육을 통해 국내에서 쌓은 경험과 전문성을 해외 개발협력 현장으로 연결합니다. 청소년과 청년, 외국인 노동자, 탈북 청년의 배움이 각 지역의 문화와 필요에 맞게 활용되어 지역사회에 기여하도록 지원합니다.</p>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/domestic/education': {
    title: '교육',
    content: `
<div class="dedu-page">
  <section class="dedu-lead">
    <p class="dom-kicker">국내사업 · 교육</p>
    <h2 data-k="dedu.title" data-k-mode="html">교육으로 스스로 <span>성장할 수 있는 기반</span>을 만듭니다.</h2>
    <p data-k="dedu.desc">카야는 교육으로 개인의 성장과 공동체의 변화를 함께 만듭니다. 외국인 노동자, 탈북 청년, 청소년 등 이웃이 자신의 역량을 키우고 배움을 나누도록, 사회적 가치에 기반한 교육과 경험의 기회를 제공합니다.</p>
  </section>
  <section class="dedu-programs">
    <div class="dedu-row">
      <div>
        <p class="dedu-label">EDUCATION PROGRAM 01</p>
        <h3 data-k="dedu.0.title">진로 탐색과 미래역량개발 지원</h3>
        <div class="dedu-tags" data-k="dedu.0.sub" data-k-mode="chips"><span>자기이해</span><span>Life Design</span><span>직업기초역량</span><span>진로 체험·멘토링</span><span>사회·문화 체험</span></div>
        <p>청소년과 청년이 자신을 이해하고 미래를 주도적으로 설계하도록 단계적 진로교육을 제공합니다. 자기이해에서 공동체와 직업세계에 대한 이해, 진로 탐색과 설계로 이어지는 배움을 통해 가능성을 발견하고 구체적인 실천으로 옮기도록 돕습니다.</p>
      </div>
      <figure class="dedu-photo">
        <img data-k="dedu.0.photo" data-k-mode="src" data-k-alt="dedu.0.caption" src="/images/business/domestic-edu-2.jpg" alt="Dream Seekers 캠프 발표 (진로 탐색과 미래역량개발 지원)" />
      </figure>
    </div>
    <div class="dedu-row">
      <figure class="dedu-photo">
        <img data-k="dedu.1.photo" data-k-mode="src" data-k-alt="dedu.1.caption" src="/images/business/domestic-edu-1.jpg" alt="자연순환유기농업 기술교육 (소셜 창업과 자립 역량 강화)" />
      </figure>
      <div>
        <p class="dedu-label">EDUCATION PROGRAM 02</p>
        <h3 data-k="dedu.1.title">사회적 가치기반 소셜 창업과 자립 역량 강화</h3>
        <div class="dedu-tags" data-k="dedu.1.sub" data-k-mode="chips"><span>소셜 비즈니스 교육</span><span>국내외 창업</span><span>국제개발협력 교육</span></div>
        <p>사회적 가치와 기업가정신을 바탕으로 외국인 노동자, 탈북 청년, 소외된 청(소)년의 창업과 자립을 돕습니다. 경험과 강점을 바탕으로 지역사회의 필요를 사업 아이디어로 발전시키며 새로운 진로와 기회를 모색합니다.</p>
      </div>
    </div>
    <div class="dedu-row">
      <div>
        <p class="dedu-label">EDUCATION PROGRAM 03</p>
        <h3 data-k="dedu.2.title">기후·환경 인식개선과 실천 확산</h3>
        <div class="dedu-tags" data-k="dedu.2.sub" data-k-mode="chips"><span>기후·환경 교육</span><span>주제별 북클럽</span><span>인식개선 콘텐츠 제작·배포</span><span>기후위기 대응 봉사단 교육·활동</span></div>
        <p>기후위기를 이해하고 일상과 지역사회에서 실천하는 세계시민의 성장을 돕습니다. 교육과 북클럽, 콘텐츠 제작, 봉사활동을 통해 환경문제를 자신의 삶과 연결하고, 개인의 실천이 지역사회와 국제협력으로 이어지도록 지원합니다.</p>
      </div>
      <figure class="dedu-photo">
        <img data-k="dedu.2.photo" data-k-mode="src" data-k-alt="dedu.2.caption" src="/images/business/domestic-edu-3.jpg" alt="2024 경기청년 기후특사단 국내교육 (기후·환경 인식개선)" />
      </figure>
    </div>
  </section>
  <section class="dedu-cta">
    <p>지금 진행 중인 국내교육 사업은 진행사업 페이지에서 볼 수 있습니다.</p>
    <a class="dedu-pj" href="/business/domestic/projects"><span data-k="dedu.cta">국내 진행사업 확인하기</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
  </section>
  <section class="dom-more">
    <div class="dom-wrap">
      <p class="dom-kicker">MORE · 다른 사업 보기</p>
      <div class="dom-more__row">
        <a class="dom-go" href="/business/overseas">해외사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/advocacy">연구사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/social">소셜비즈니스<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy': {
    title: '연구사업',
    content: `
<div class="dom-intro">
  <section class="dom-intro__top">
    <div class="dom-intro__copy">
      <p class="dom-kicker">RESEARCH · 연구사업</p>
      <h2 data-k="res.title">현장의 경험을 연구하고 교육과 개발협력의 방법을 발전시켜, 지속가능한 변화를 만드는 실천에 연결합니다.</h2>
      <p data-k="res.lead">카야는 사람의 성장과 지역사회의 변화가 이어질 수 있도록 교육과 개발협력의 방법을 연구합니다. 현장에서 발견한 질문을 바탕으로 교육모델과 사업 운영방식을 발전시키고, 그 경험을 다시 현장과 나눕니다.</p>
    </div>
    <figure class="dom-photo">
      <img data-k="res.photo" data-k-mode="src" data-k-alt="res.photoAlt" src="/images/business/overseas-edu-quality-1.jpg" alt="키르기스스탄 교사 연수" />
    </figure>
  </section>
  <section class="dom-principles">
    <p class="dom-kicker">PRINCIPLES · 연구사업 원칙</p>
    <div class="dom-pr">
      <span>01</span>
      <div>
        <h3 data-k="res.p.0.title">현장 기반의 연구</h3>
        <p data-k="res.p.0.body" data-k-mode="html">카야의 연구는 <strong>현장에서 출발</strong>합니다. 국내외 현장에서 발견한 실제적인 문제와 <strong>참여자들의 목소리</strong>를 바탕으로, 이론에 그치지 않고 <strong>현장에 즉시 적용</strong>할 수 있는 유의미한 시사점을 도출합니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>02</span>
      <div>
        <h3 data-k="res.p.1.title">참여와 주도성의 방법론</h3>
        <p data-k="res.p.1.body" data-k-mode="html">개발협력과 교육이 일방적인 전달이 되지 않도록, 주민과 참여자가 스스로 문제를 정의하고 해결하는 <strong>‘참여적 개발협력 방법론’</strong>을 연구합니다. 지역사회의 맥락을 존중하며 <strong>자립의 기반</strong>을 다지는 구조를 만듭니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>03</span>
      <div>
        <h3 data-k="res.p.2.title">배움의 연결과 확산</h3>
        <p data-k="res.p.2.body" data-k-mode="html">현장의 경험과 연구 결과를 <strong>교육 모델 및 콘텐츠</strong>로 체계화합니다. <strong>카야 아카데미</strong>, <strong>세미나</strong>, <strong>지식공유 플랫폼</strong>을 통해 실천가 및 시민사회와 배움을 나누며 더 나은 교육과 개발협력의 표준을 함께 만들어갑니다.</p>
      </div>
    </div>
    <div class="dom-pr">
      <span>04</span>
      <div>
        <h3 data-k="res.p.3.title">지속가능한 소셜 임팩트</h3>
        <p data-k="res.p.3.body" data-k-mode="html">사회적 가치가 단발성 지원에 그치지 않고 <strong>자립적인 생태계</strong>로 자리 잡을 수 있도록 <strong>소셜 비즈니스 모델</strong>과 지속가능한 사업 구조를 탐색합니다. <strong>사람의 성장</strong>과 <strong>사회적 가치 창출</strong>이 선순환하는 구조를 연구합니다.</p>
      </div>
    </div>
  </section>
  <section class="dom-programs" aria-label="연구사업 분야">
    <div class="dom-wrap">
      <p class="dom-kicker">PROGRAMS · 연구사업 분야</p>
      <div class="dom-programs__row">
        <a class="dom-ic" data-k-href="res.card.0.href" href="/business/advocacy/projects">
          <span class="dom-ic__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path></svg></span>
          <span class="dom-ic__title" data-k="res.card.0.title">교육연구 사업</span>
          <span class="dom-ic__desc" data-k="res.card.0.desc">현장의 경험을 바탕으로, 사람의 성장과 지역사회의 변화를 이끄는 교육·개발협력 모델과 방법을 연구하고 나눕니다.</span>
          <span class="dom-ic__more">자세히 보기 →</span>
        </a>
        <a class="dom-ic" data-k-href="res.card.1.href" href="/business/social">
          <span class="dom-ic__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"></path></svg></span>
          <span class="dom-ic__title" data-k="res.card.1.title">소셜비즈니스</span>
          <span class="dom-ic__desc" data-k="res.card.1.desc">사회적 가치가 지속가능한 변화와 자립으로 이어지는 소셜비즈니스 모델과 사업 구조를 연구합니다.</span>
          <span class="dom-ic__more">자세히 보기 →</span>
        </a>
        <a class="dom-ic" data-k-href="res.card.2.href" href="/business/advocacy/projects">
          <span class="dom-ic__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span>
          <span class="dom-ic__title" data-k="res.card.2.title">진행사업</span>
          <span class="dom-ic__desc" data-k="res.card.2.desc">연구로 발전시킨 모델과 방법을 국내외 현장에 적용하고, 그 경험과 성과를 다시 연구와 실천으로 잇습니다.</span>
          <span class="dom-ic__more">자세히 보기 →</span>
        </a>
      </div>
    </div>
  </section>
  <section class="res-cta">
    <p>지금 진행 중인 연구사업은 진행사업 페이지에서 볼 수 있습니다.</p>
    <a class="res-pj" href="/business/advocacy/projects"><span data-k="res.cta">연구사업 진행사업 확인하기</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
  </section>
  <section class="dom-more">
    <div class="dom-wrap">
      <p class="dom-kicker">MORE · 다른 사업 보기</p>
      <div class="dom-more__row">
        <a class="dom-go" href="/business/domestic">국내사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/overseas">해외사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/social">소셜비즈니스<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
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
      <h1 class="adv-title">현장의 경험을 배움의 모델로 발전시키고,<br />더 나은 교육과 개발협력의 방법을 만들어갑니다.</h1>
      <p class="adv-lead">카야는 개발협력과 교육 현장의 경험을 바탕으로 지속가능한 소셜비즈니스 모델로 발전시킵니다. 교육서비스와 사회적 가치 기반 사업을 통해 수익과 공익이 함께 순환하는 구조를 만들고, 창출된 가치를 다시 교육과 지역사회의 성장에 연결합니다.</p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-study" aria-label="소셜비즈니스">
    <div class="adv-wrap">
      <div class="ov-edu-head">
        <div class="ov-edu-head__titles">
          <p class="ov-edu-head__kicker">Social Business</p>
          <h2 class="ov-edu-head__ko">소셜 비즈니스</h2>
        </div>
        <div>
          <ul class="adv-tags">
            <li>카야 아카데미</li>
            <li>컬러앤컴포트(사회적기업)</li>
            <li>소셜임팩트</li>
          </ul>
          <p class="ov-edu-head__p">사회적 가치가 지속적인 실천으로 이어질 수 있는 운영과 사업의 구조를 탐색합니다. 소셜 비즈니스의 창출 수익으로 카야인터내셔널의 지속가능한 운영과 공익사업을 지원하며, 소셜 비즈니스 경험을 바탕으로 자립과 사회적 성과의 연결 가능성을 살펴봅니다.</p>
        </div>
      </div>

      <div class="adv-split" role="table" aria-label="소셜 비즈니스 구성">
        <div class="adv-split__col">
          <h3 class="adv-split__title">카야 아카데미</h3>
          <p class="adv-split__lead">카야인터내셔널 개발협력사업 기반 개발된 교육 프로그램과 콘텐츠를 비즈니스 모델로 발전시킨 교육사업 브랜드</p>
          <ul class="adv-split__list">
            <li>
              <img class="adv-split__flag" src="/images/business/flag-mm.png" alt="" />
              <div><strong>미얀마</strong> | 교육기관 운영<span>(서비스) 기초교육 방문-온라인 학습, Pre-School</span></div>
            </li>
            <li>
              <img class="adv-split__flag" src="/images/business/flag-kg.png" alt="" />
              <div><strong>키르기스스탄</strong> | STEM 이러닝<span>(서비스) 수학·과학 STEM 과목 온라인 학습</span></div>
            </li>
            <li>
              <img class="adv-split__flag" src="/images/business/flag-kr.png" alt="" />
              <div><strong>한국</strong> | 해외 청소년·청년 초청 진로캠프<span>(서비스) 진로설계 워크숍, 대학탐방, 직업·문화체험</span></div>
            </li>
          </ul>
        </div>
        <div class="adv-split__col">
          <h3 class="adv-split__title">컬러앤컴포트</h3>
          <p class="adv-split__lead">라이프스타일 제품 판매 수익금으로 소외된 아이들의 교육과 성장 지원</p>
          <ul class="adv-split__list">
            <li>
              <img class="adv-split__logo" src="/images/business/color-comfort-logo.png" alt="Color &amp; Comfort" />
              <div><strong>판매 제품</strong> | 페이크삭스, 디자인 양말<span>(서비스) 기업·행사 단체 구매, 임직원·고객 선물, 판매·유통 협력</span></div>
            </li>
          </ul>
        </div>
      </div>

      <div class="ov-edu-strip ov-edu-strip--4" aria-label="소셜 비즈니스 사진">
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/research-social-1.jpg" alt="미얀마 Pre-School" loading="lazy" />
          <div class="ov-edu-img__cap">미얀마 Pre-School</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/research-social-2.jpg" alt="키르기스스탄 STEM 이러닝" loading="lazy" />
          <div class="ov-edu-img__cap">키르기스스탄 STEM 이러닝</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/research-social-3.jpg" alt="한국 초청 진로캠프" loading="lazy" />
          <div class="ov-edu-img__cap">한국 초청 진로캠프</div>
        </div>
        <div class="ov-edu-img">
          <img class="ov-edu-img__photo" src="/images/business/research-social-4.jpg" alt="컬러앤컴포트" loading="lazy" />
          <div class="ov-edu-img__cap">컬러앤컴포트</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/social': {
    title: '소셜비즈니스',
    content: `
<div class="sbiz sbiz--intro">
  <section class="sbiz-hero sbiz-hero--center" data-sec="soc.hero">
    <p class="sbiz-kicker">SOCIAL BUSINESS · 소셜비즈니스</p>
    <h2 class="sbiz-title" data-k="soc.title" data-k-mode="html">현장의 경험에서 출발한 <span class="wn">소셜비즈니스</span></h2>
    <p class="sbiz-lead" data-k="soc.lead" data-k-mode="html">카야는 개발협력과 교육 현장에서 쌓은 경험을 바탕으로 소셜비즈니스를 운영합니다.<br>각 사업은 저마다의 방식으로 사회적 가치를 만듭니다.</p>
  </section>
  <section class="sbiz-band">
    <div class="sbiz-split">
      <figure class="sbiz-photo sbiz-col">
        <!-- 칸: [사진] KHAYAH Academy 전경 → /images/business/research-social-1.jpg -->
        <img data-k="soc.aca.photo" data-k-mode="src" src="/images/business/research-social-1.jpg" alt="KHAYAH Academy 전경" />
        <figcaption data-k="soc.aca.caption">KHAYAH Academy 전경</figcaption>
      </figure>
      <div class="sbiz-col">
        <div class="sbiz-brand">
          <span class="sbiz-logo">카야 아카데미<br>로고</span>
          <div>
            <p class="sbiz-since">KHAYAH ACADEMY · 2024~</p>
            <h3 class="sbiz-name" data-k="soc.aca.name">카야 아카데미</h3>
          </div>
        </div>
        <p class="sbiz-lead" data-k="soc.aca.lead">카야가 미얀마 개발협력 현장에서 개발한 교육 프로그램과 학습지로 2024년에 설립한 사회적기업입니다.</p>
        <dl class="sbiz-facts">
          <div class="sbiz-fact"><dt>구분</dt><dd>미얀마 사회적기업</dd></div>
          <div class="sbiz-fact"><dt>활동 지역</dt><dd>미얀마 · 키르기스스탄</dd></div>
          <div class="sbiz-fact"><dt>하는 일</dt><dd>Pre-School 운영, 수학·영어 학습지, STEM 온라인 학습</dd></div>
        </dl>
        <a class="sbiz-more" data-k="soc.aca.more" data-k-href="soc.aca.href" href="/business/social/academy">카야 아카데미 자세히 보기</a>
      </div>
    </div>
  </section>
  <section class="sbiz-hero">
    <div class="sbiz-split">
      <div class="sbiz-col">
        <div class="sbiz-brand">
          <!-- 칸: C&C 로고 → /images/business/color-comfort-logo.png -->
          <span class="sbiz-logo"><img data-k="soc.cnc.logo" data-k-mode="src" src="/images/business/color-comfort-logo.png" alt="C&amp;C 로고" /></span>
          <div>
            <p class="sbiz-since">COLOR &amp; COMFORT · 2021~</p>
            <h3 class="sbiz-name" data-k="soc.cnc.name">컬러앤컴포트</h3>
          </div>
        </div>
        <p class="sbiz-lead" data-k="soc.cnc.lead">다양한 색감과 한끝 다른 편안함을 담은 힐링 라이프스타일 브랜드입니다.</p>
        <dl class="sbiz-facts">
          <div class="sbiz-fact"><dt>구분</dt><dd>예비사회적기업</dd></div>
          <div class="sbiz-fact"><dt>활동 지역</dt><dd>한국</dd></div>
          <div class="sbiz-fact"><dt>하는 일</dt><dd>양말·라이프스타일 제품 판매, 기업·단체 구매</dd></div>
        </dl>
        <a class="sbiz-more" data-k="soc.cnc.more" data-k-href="soc.cnc.href" href="/business/social/color-and-comfort">컬러앤컴포트 자세히 보기</a>
      </div>
      <figure class="sbiz-photo sbiz-col">
        <!-- 칸: [사진] 컬러앤컴포트 제품 연출컷 → /images/business/research-social-4.jpg -->
        <img data-k="soc.cnc.photo" data-k-mode="src" src="/images/business/research-social-4.jpg" alt="컬러앤컴포트 제품 연출컷" />
        <figcaption data-k="soc.cnc.caption">컬러앤컴포트 제품 연출컷</figcaption>
      </figure>
    </div>
  </section>
  <section class="dom-more">
    <div class="dom-wrap">
      <p class="dom-kicker">MORE · 다른 사업 보기</p>
      <div class="dom-more__row">
        <a class="dom-go" href="/business/domestic">국내사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/overseas">해외사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/advocacy">연구사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/social/academy': {
    title: '카야 아카데미',
    content: `
<div class="sbiz sbiz--aca">
  <section class="sbiz-hero">
    <div class="sbiz-split sbiz-split--wide">
      <div class="sbiz-col">
        <p class="sbiz-kicker">KHAYAH ACADEMY · 2024~</p>
        <h2 class="sbiz-title" data-k="aca.title" data-k-mode="html">아이들의 <span class="wn">첫 배움</span>을 여는 곳</h2>
        <p class="sbiz-lead" data-k="aca.lead" data-k-mode="html">카야 아카데미는 2024년 미얀마에 설립한 카야의 사회적기업입니다.<br>개발협력 현장에서 만든 학습지와 교육 프로그램을 Pre-School과 학습지 교육으로 운영합니다.</p>
      </div>
      <figure class="sbiz-photo sbiz-col">
        <!-- 칸: [사진] KHAYAH Academy Pre-School 교실 → /images/business/overseas-edu-foundation-1.jpg -->
        <img data-k="aca.heroPhoto" data-k-mode="src" src="/images/business/overseas-edu-foundation-1.jpg" alt="KHAYAH Academy Pre-School 교실" />
        <figcaption data-k="aca.heroCaption">KHAYAH Academy Pre-School 교실</figcaption>
      </figure>
    </div>
  </section>
  <section class="sbiz-band">
    <div class="sbiz-split sbiz-split--start">
      <div class="sbiz-col">
        <p class="sbiz-kicker">01 · PRE-SCHOOL</p>
        <h3 class="sbiz-sub">Pre-School</h3>
        <p class="sbiz-lead">놀이와 기초학습으로 아이들이 즐겁게 배움을 시작하도록 합니다.</p>
        <dl class="sbiz-facts sbiz-facts--soft">
          <div class="sbiz-fact"><dt>기관명</dt><dd>KHAYAH Academy International Early Years</dd></div>
          <div class="sbiz-fact"><dt>위치</dt><dd>미얀마 양곤</dd></div>
          <div class="sbiz-fact"><dt>대상</dt><dd data-k="aca.pre.target">[대상 연령 확인 필요]</dd></div>
          <div class="sbiz-fact"><dt>교육 내용</dt><dd data-k="aca.pre.study">[영어·기초학습·놀이활동 등 확인 필요]</dd></div>
        </dl>
      </div>
      <div class="sbiz-photos sbiz-col">
        <figure class="sbiz-photo">
          <!-- 칸: [사진] 교실 수업 → /images/business/overseas-edu-foundation-3.jpg -->
          <img src="/images/business/overseas-edu-foundation-3.jpg" alt="교실 수업" />
          <figcaption>교실 수업</figcaption>
        </figure>
        <figure class="sbiz-photo">
          <!-- 칸: [사진] 놀이 활동 → /images/business/overseas-edu-foundation-1.jpg -->
          <img src="/images/business/overseas-edu-foundation-1.jpg" alt="놀이 활동" />
          <figcaption>놀이 활동</figcaption>
        </figure>
        <figure class="sbiz-photo">
          <!-- 칸: [사진] 행사 → /images/business/volunteer-group.jpg -->
          <img src="/images/business/volunteer-group.jpg" alt="행사" />
          <figcaption>행사</figcaption>
        </figure>
        <figure class="sbiz-photo">
          <!-- 칸: [사진] 원 외관 → /images/business/research-social-1.jpg -->
          <img src="/images/business/research-social-1.jpg" alt="원 외관" />
          <figcaption>원 외관</figcaption>
        </figure>
      </div>
    </div>
  </section>
  <section class="sbiz-hero">
    <div class="sbiz-split sbiz-split--start">
      <div class="sbiz-photos sbiz-col">
        <figure class="sbiz-photo">
          <!-- 칸: [사진] 학습지 표지 → /images/business/overseas-edu-foundation-1.jpg -->
          <img src="/images/business/overseas-edu-foundation-1.jpg" alt="학습지 표지" />
          <figcaption>학습지 표지</figcaption>
        </figure>
        <figure class="sbiz-photo">
          <!-- 칸: [사진] 학습지 활용 수업 → /images/business/overseas-edu-foundation-1.jpg -->
          <img src="/images/business/overseas-edu-foundation-1.jpg" alt="학습지 활용 수업" />
          <figcaption>학습지 활용 수업</figcaption>
        </figure>
      </div>
      <div class="sbiz-col">
        <p class="sbiz-kicker">02 · WORKBOOKS</p>
        <h3 class="sbiz-sub">학습지</h3>
        <p class="sbiz-lead">미얀마 도시빈민마을에서 개발한 Self-Care 학습지를 심화한 수학·영어 학습지입니다.<br>키르기스스탄에서는 사립 중·고등학교를 대상으로 STEM 온라인 학습 플랫폼을 운영합니다.</p>
        <dl class="sbiz-facts">
          <div class="sbiz-fact"><dt>과목</dt><dd>수학 · 영어 (수준별)</dd></div>
          <div class="sbiz-fact"><dt>대상</dt><dd>아동·청소년 (수준별)</dd></div>
          <div class="sbiz-fact"><dt>학습 방식</dt><dd>방문 학습 · 온라인 학습</dd></div>
        </dl>
      </div>
    </div>
  </section>
  <section class="sbiz-band sbiz-band--short">
    <div class="sbiz-inner">
      <div class="sbiz-csr"><b>CSR</b><p data-k="aca.csr">카야 아카데미는 양곤 Dream Seekers Education Center와 만달레이 아동친화공간 운영을 지원합니다.</p></div>
      <div class="sbiz-news">
        <span>카야 아카데미 소식</span>
        <a class="sbiz-btn sbiz-btn--line" data-k-href="aca.facebook" href="#" hidden>페이스북</a>
        <a class="sbiz-btn sbiz-btn--line" data-k-href="aca.instagram" href="#" hidden>인스타그램</a>
      </div>
    </div>
  </section>
  <section class="dom-more">
    <div class="dom-wrap">
      <p class="dom-kicker">MORE · 다른 사업 보기</p>
      <div class="dom-more__row">
        <a class="dom-go" href="/business/social/color-and-comfort">컬러앤컴포트<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/overseas">해외사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/advocacy">연구사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/social/color-and-comfort': {
    title: '컬러앤컴포트',
    content: `
<div class="sbiz sbiz--cnc">
  <section class="sbiz-hero">
    <div class="sbiz-split sbiz-split--wide">
      <div class="sbiz-col">
        <p class="sbiz-kicker">COLOR &amp; COMFORT</p>
        <h2 class="sbiz-title" data-k="cnc.title" data-k-mode="html">다채로운 색, 한끝 다른 <span class="wn">편안함</span></h2>
        <p class="sbiz-lead" data-k="cnc.lead" data-k-mode="html">컬러앤컴포트는 카야인터내셔널이 설립한 힐링 라이프스타일 브랜드입니다.<br>다양한 색감과 편안한 착용감의 양말로 일상에 작은 쉼을 전합니다.</p>
      </div>
      <figure class="sbiz-photo sbiz-col">
        <!-- 칸: [사진] 브랜드 대표 연출컷 → /images/business/research-social-4.jpg -->
        <img data-k="cnc.heroPhoto" data-k-mode="src" src="/images/business/research-social-4.jpg" alt="브랜드 대표 연출컷" />
        <figcaption data-k="cnc.heroCaption">브랜드 대표 연출컷</figcaption>
      </figure>
    </div>
  </section>
  <section class="sbiz-band sbiz-band--soft">
    <p class="sbiz-kicker sbiz-center">BRAND · 브랜드 이야기</p>
    <div class="sbiz-cells">
      <div class="sbiz-cell"><strong>Color</strong><span>기분까지 밝혀 주는 다양한 색감</span></div>
      <div class="sbiz-cell"><strong>Comfort</strong><span>하루 종일 편안한 착용감</span></div>
      <div class="sbiz-cell"><strong>Value</strong><span>사회적 가치를 담아 운영하는 브랜드</span></div>
    </div>
    <p class="sbiz-note" data-k="cnc.note">컬러앤컴포트의 수익은 카야인터내셔널의 공익사업에 쓰입니다.</p>
  </section>
  <section class="sbiz-hero sbiz-hero--flush">
    <p class="sbiz-kicker">PRODUCTS · 제품</p>
    <div class="sbiz-photos sbiz-photos--3">
      <figure class="sbiz-photo">
        <!-- 칸: [사진] 페이크삭스 → /images/business/research-social-4.jpg -->
        <img src="/images/business/research-social-4.jpg" alt="페이크삭스" />
        <figcaption>페이크삭스</figcaption>
      </figure>
      <figure class="sbiz-photo">
        <!-- 칸: [사진] 디자인 양말 → /images/business/research-social-4.jpg -->
        <img src="/images/business/research-social-4.jpg" alt="디자인 양말" />
        <figcaption>디자인 양말</figcaption>
      </figure>
      <figure class="sbiz-photo">
        <!-- 칸: [사진] 선물 패키지 → /images/business/research-social-4.jpg -->
        <img src="/images/business/research-social-4.jpg" alt="선물 패키지" />
        <figcaption>선물 패키지</figcaption>
      </figure>
    </div>
  </section>
  <section class="sbiz-hero">
    <p class="sbiz-kicker">WITH US · 구매 방법</p>
    <div class="sbiz-steps">
      <div class="sbiz-step"><b>01</b><strong>기업·행사 단체 구매</strong><span>행사 기념품, 답례품</span></div>
      <div class="sbiz-step"><b>02</b><strong>임직원·고객 선물</strong><span>명절·연말 선물세트</span></div>
      <div class="sbiz-step"><b>03</b><strong>판매·유통 협력</strong><span>입점, 유통 제휴</span></div>
    </div>
    <div class="sbiz-actions">
      <a class="sbiz-btn" data-k="cnc.storeLabel" data-k-href="cnc.store" href="https://smartstore.naver.com/colorncomfort?NaPm=ct%3Dmvsy3sck%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3Dnull%7Chk%3D5d38ad1506acfc1d183fc24edac1ef4f7068b1a4" target="_blank" rel="noopener">온라인 스토어 바로가기</a>
      <a class="sbiz-btn sbiz-btn--line" data-k="cnc.kakaoLabel" data-k-href="cnc.kakao" href="https://pf.kakao.com/_xiTjks" target="_blank" rel="noopener">단체 구매 문의</a>
    </div>
    <div class="sbiz-news">
      <span>컬러앤컴포트 소식</span>
      <a class="sbiz-btn sbiz-btn--line" data-k-href="cnc.instagram" href="#" hidden>인스타그램</a>
    </div>
  </section>
  <section class="dom-more">
    <div class="dom-wrap">
      <p class="dom-kicker">MORE · 다른 사업 보기</p>
      <div class="dom-more__row">
        <a class="dom-go" href="/business/social/academy">카야 아카데미<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/overseas">해외사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
        <a class="dom-go" href="/business/domestic">국내사업<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
      </div>
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
      <h1 class="adv-title">현장의 경험을 배움의 모델로 발전시키고,<br />더 나은 교육과 개발협력의 방법을 만들어갑니다.</h1>
      <p class="adv-lead">카야는 국내의 사업 현장에서 축적한 경험을 바탕으로 교육모델과 학습방법, 참여적 개발협력 방법론을 연구합니다. 현장에서 검증된 경험을 교육과정과 콘텐츠로 체계화하고, 강의·세미나·아카데미를 통해 실천가와 참여자에게 다시 나누며 배움과 실천의 선순환을 만들어갑니다.</p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-study" aria-label="교육연구 내용">
    <div class="adv-wrap">
      <article class="adv-copy">
        <div class="ov-edu-head">
          <div class="ov-edu-head__titles">
            <p class="ov-edu-head__kicker">Education Models and Learning Methods</p>
            <h2 class="ov-edu-head__ko">교육모델과 학습방법</h2>
          </div>
          <div>
            <ul class="adv-tags">
              <li>Dream Seekers</li>
              <li>Life Design</li>
              <li>STEM 이러닝(SEEM)</li>
              <li>동료학습</li>
              <li>4단계 진로교육</li>
            </ul>
            <p class="ov-edu-head__p">참여자가 자신을 이해하고 배움을 삶에 적용할 수 있는 교육모델을 연구합니다. 현장의 경험을 교육과정과 콘텐츠로 정리하고 개선합니다.</p>
          </div>
        </div>
        <div class="ov-edu-strip" aria-label="교육모델과 학습방법 사진">
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-edu-model-1.jpg" alt="Life Design" loading="lazy" />
            <div class="ov-edu-img__cap">Life Design</div>
          </div>
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-edu-model-2.jpg" alt="STEM 이러닝(SEEM)" loading="lazy" />
            <div class="ov-edu-img__cap">STEM 이러닝(SEEM)</div>
          </div>
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-edu-model-3.jpg" alt="진로 인식확산" loading="lazy" />
            <div class="ov-edu-img__cap">진로 인식확산(1단계)</div>
          </div>
        </div>
      </article>

      <article class="adv-copy">
        <div class="ov-edu-head">
          <div class="ov-edu-head__titles">
            <p class="ov-edu-head__kicker">Knowledge Sharing and the Academy</p>
            <h2 class="ov-edu-head__ko">지식공유와 아카데미</h2>
          </div>
          <div>
            <ul class="adv-tags">
              <li>카야아카데미</li>
              <li>국제개발협력 ODA 교육</li>
              <li>강의·세미나</li>
            </ul>
            <p class="ov-edu-head__p">현장의 경험과 연구 내용을 강의와 세미나, 교육자료로 나눕니다. 실천가와 참여자가 함께 배우고 개발협력의 전문성을 키우는 장을 마련합니다.</p>
          </div>
        </div>
        <div class="ov-edu-strip" aria-label="지식공유와 아카데미 사진">
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-academy-1.jpg" alt="인솔자 교육" loading="lazy" />
            <div class="ov-edu-img__cap">인솔자 교육</div>
          </div>
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-academy-2.jpg" alt="해외봉사단 교육" loading="lazy" />
            <div class="ov-edu-img__cap">해외봉사단 교육</div>
          </div>
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-academy-3.jpg" alt="외국인 노동자 교육" loading="lazy" />
            <div class="ov-edu-img__cap">외국인 노동자 교육</div>
          </div>
        </div>
      </article>

      <article class="adv-copy">
        <div class="ov-edu-head">
          <div class="ov-edu-head__titles">
            <p class="ov-edu-head__kicker">Participatory Development Cooperation</p>
            <h2 class="ov-edu-head__ko">참여적 개발협력 방법론</h2>
          </div>
          <div>
            <ul class="adv-tags">
              <li>국제개발협력</li>
              <li>전문가 그룹</li>
              <li>개발의 관점과 방법</li>
            </ul>
            <p class="ov-edu-head__p">주민의 참여와 주도성을 바탕으로 사업을 조사·기획·실행·평가하는 방법을 연구합니다. 지역의 맥락을 이해하고 현지의 역량을 키우는 접근을 모색합니다.</p>
          </div>
        </div>
        <div class="ov-edu-strip" aria-label="참여적 개발협력 사진">
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-participation-1.jpg" alt="주민 참여" loading="lazy" />
            <div class="ov-edu-img__cap">주민 참여</div>
          </div>
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-participation-2.jpg" alt="학부모 참여" loading="lazy" />
            <div class="ov-edu-img__cap">학부모 참여</div>
          </div>
          <div class="ov-edu-img">
            <img class="ov-edu-img__photo" src="/images/business/research-participation-3.jpg" alt="현지 전문가 참여" loading="lazy" />
            <div class="ov-edu-img__cap">현지 전문가 참여</div>
          </div>
        </div>
      </article>
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
  'support/method': {
    title: '후원 방법',
    content: SUPPORT_METHOD_PAGE_HTML,
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

