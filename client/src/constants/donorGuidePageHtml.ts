import { NANUM_DONATE_URL } from './nanumDonate'

/**
 * 후원 안내·후원 방법 (국문).
 * 후원하기·신청서 버튼은 NANUM_DONATE_URL 하나.
 * 계좌는 후원 방법에만 둔다.
 * ‘함께 만든 변화’는 hidden.
 *
 * 시안 사진
 * - 후원 안내 상단 → /images/donor-guide/guide-class.jpg
 * - 후원이 닿는 곳 → /images/donor-guide/guide-place.jpg
 * - 함께 만든 변화 → /images/donor-guide/guide-story.jpg (숨김)
 * - 신청 절차 STEP 1 → /images/donor-guide/step1-member.png
 * - 신청 절차 STEP 2 → /images/donor-guide/step2-pay.png
 * - 신청 절차 STEP 3 → /images/donor-guide/step3-sign.png
 */
export const DONOR_GUIDE_PAGE_HTML = `
<div class="sup sup--guide">
  <div class="sup-wrap" data-sec="guide.hero">
    <p class="sup-crumb">홈 › 후원 › <b>후원 안내</b></p>
    <section class="sup-hero" aria-label="후원 소개">
      <div class="sup-hero__copy">
        <span class="sup-kicker">후원 안내</span>
        <h1 class="sup-title" data-k="guide.title" data-k-mode="html">한 번의 도움보다,<br>스스로 서는 힘을 함께 키웁니다.</h1>
        <p data-k="guide.lead" data-k-mode="html">후원자님의 나눔이 어디에, 어떻게 쓰이는지<br>이 페이지에서 투명하게 알려 드립니다.</p>
        <div class="sup-actions">
          <a class="sup-btn" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener"><span data-k="donate.label">지금 바로 후원하기 ♥</span></a>
          <a class="sup-btn sup-btn--line" href="/support/method" data-k="guide.heroBtn2">후원 방법 보기</a>
        </div>
      </div>
      <figure class="sup-photo sup-hero__photo">
        <img data-k="guide.photo" data-k-mode="src" data-k-alt="guide.photoAlt" src="/images/donor-guide/guide-class.jpg" alt="교실에서 공부하는 아이들" />
      </figure>
    </section>
  </div>

  <section class="sup-band" data-sec="guide.where" aria-labelledby="sup-where">
    <div class="sup-wrap">
      <div class="sup-center">
        <span class="sup-kicker" data-k="guide.whereKicker">WHERE YOUR GIFT GOES</span>
        <h2 id="sup-where" class="sup-h2" data-k="guide.whereTitle">후원이 닿는 곳</h2>
        <p data-k="guide.whereLead">후원금은 외부 지원만으로는 채우기 어려운 해외 교육 현장에 쓰입니다.</p>
      </div>
      <div class="sup-split">
        <article class="sup-place">
          <img data-k="guide.placePhoto" data-k-mode="src" data-k-alt="guide.placeAlt" src="/images/donor-guide/guide-place.jpg" alt="[샘플] 미얀마 교육 현장" />
          <div>
            <span class="sup-tag" data-k="guide.placeTag">지금 후원이 가장 필요한 곳 · 미얀마</span>
            <h3 data-k="guide.placeTitle">미얀마 양곤 · 만달레이</h3>
            <p data-k="guide.placeBody">현재 카야의 후원금은 대부분 미얀마 지부의 교육 사업에 쓰이고 있습니다. 양곤 Education Center와 만달레이 지역에서 현지 지부가 직접 아이들을 만나고 있습니다.</p>
            <a class="sup-more" data-k-href="guide.placeHref" href="#" hidden>자세히 보기 →</a>
          </div>
        </article>
        <div class="sup-side">
          <div class="sup-item" data-item="guide.item.0">
            <span class="sup-ico" data-icon="guide.item.0.icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-5h4v5"></path></svg></span>
            <div>
              <h3 data-k="guide.item.0.title">배움의 공간 운영</h3>
              <p data-k="guide.item.0.body">교육센터와 아동친화공간(CFS)의 운영비, 교재와 학습 환경을 마련합니다.</p>
            </div>
          </div>
          <div class="sup-item" data-item="guide.item.1">
            <span class="sup-ico" data-icon="guide.item.1.icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4z"></path><path d="M20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"></path></svg></span>
            <div>
              <h3 data-k="guide.item.1.title">수준에 맞춘 학습 지원</h3>
              <p data-k="guide.item.1.body">Dream Seekers 독서클럽, 수준별 맞춤 학습지, 방과후 학습으로 아이마다 필요한 배움을 채웁니다.</p>
            </div>
          </div>
          <div class="sup-item" data-item="guide.item.2">
            <span class="sup-ico" data-icon="guide.item.2.icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z"></path></svg></span>
            <div>
              <h3 data-k="guide.item.2.title">재난 이후 회복 지원</h3>
              <p data-k="guide.item.2.body">지진으로 일상이 흔들린 아이들이 마음의 안정을 되찾고 학업을 이어가도록 돕습니다.</p>
            </div>
          </div>
          <div class="sup-item" data-item="guide.item.3" hidden>
            <span class="sup-ico" data-icon="guide.item.3.icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20a7 7 0 0114 0"></path></svg></span>
            <div>
              <h3 data-k="guide.item.3.title"></h3>
              <p data-k="guide.item.3.body"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sup-impact" data-sec="guide.impact" hidden aria-labelledby="sup-impact">
    <div class="sup-wrap">
      <div class="sup-head">
        <div>
          <span class="sup-kicker">TOGETHER WITH YOU</span>
          <h2 id="sup-impact" class="sup-h2">후원으로 함께 만든 변화</h2>
        </div>
        <a class="sup-more" href="#sup-impact">카야의 변화 더 보기 →</a>
      </div>
      <div class="sup-cards">
        <div class="sup-card"><b>— 명</b><span>함께한 사람들</span><span>People Reached</span></div>
        <div class="sup-card"><b>— 명</b><span>참여 아동·청소년·청년</span><span>Students Reached</span></div>
        <div class="sup-card"><b>— 곳</b><span>협력기관</span><span>Partners</span></div>
        <div class="sup-card"><b>— 명</b><span>참여 교사</span><span>Teachers Trained</span></div>
      </div>
      <p class="sup-note">집계 기간 [YYYY.MM ~ YYYY.MM] · 누적 기준 · 최종 갱신 [YYYY.MM.DD]</p>
      <article class="sup-split">
        <img src="/images/donor-guide/guide-story.jpg" alt="[샘플] 변화 이야기 대표 사진" />
        <div>
          <span class="sup-tag">변화의 이야기 · [국가 / 사업명]</span>
          <h3>[변화 중심 제목 — 예: 배움을 이어가게 된 한 학생의 이야기]</h3>
          <p>[2~3문장 사례 요약. 참여 전의 상황, 카야와 함께한 활동, 지금 달라진 모습을 짧게 소개합니다.]</p>
          <a class="sup-more" href="#sup-impact">변화의 이야기 보기 →</a>
        </div>
      </article>
    </div>
  </section>

  <section class="sup-band sup-band--sand" data-sec="guide.open" aria-labelledby="sup-open">
    <div class="sup-wrap">
      <div class="sup-head">
        <div>
          <span class="sup-kicker" data-k="guide.openKicker">TRANSPARENCY</span>
          <h2 id="sup-open" class="sup-h2" data-k="guide.openTitle">후원금, 투명하게 운영합니다</h2>
        </div>
        <a class="sup-more" href="/about/transparency">투명경영 바로가기 →</a>
      </div>
      <div class="sup-cards">
        <div class="sup-card">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6"></path></svg>
          <h3 data-k="guide.open.0.title">기부금 모금액 및 활용실적 공개</h3>
          <p data-k="guide.open.0.body">후원자 여러분의 소중한 기부금이 투명하게 사용될 수 있도록 연간 기부금 모금액 및 활용실적을 홈페이지에 공개합니다.</p>
        </div>
        <div class="sup-card">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v14H7z"></path><path d="M14 3v4h4M10 12h5M10 16h5"></path></svg>
          <h3 data-k="guide.open.1.title">공익법인 결산서류 공시</h3>
          <p data-k="guide.open.1.body">관련 법령에 따라 공익법인 결산서류를 국세청 홈택스에 공시하여 기관의 재정 운영과 회계 정보를 투명하게 공개합니다.</p>
        </div>
        <div class="sup-card">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z"></path><path d="M9 9h6M9 13h4"></path></svg>
          <h3 data-k="guide.open.2.title">기부금 영수증 발급</h3>
          <p data-k="guide.open.2.body">후원자 여러분의 소중한 나눔에 대해 기부금영수증을 발급해 드리며, 국세청 연말정산 간소화를 통해 편리하게 기부 내역을 확인하실 수 있도록 지원합니다.</p>
        </div>
      </div>
      <p class="sup-note" data-k="donate.receiptNote">카야인터내셔널이 발급합니다. 신청 시 주민등록번호를 입력하시면 연말정산 간소화 서비스에서 바로 확인하실 수 있습니다.</p>
    </div>
  </section>

  <section class="sup-block" id="give" data-sec="guide.give" aria-labelledby="sup-give">
    <div class="sup-wrap">
      <div class="sup-center">
        <span class="sup-kicker" data-k="guide.giveKicker">WAYS TO GIVE</span>
        <h2 id="sup-give" class="sup-h2" data-k="guide.giveTitle">나에게 맞는 후원을 선택해 주세요</h2>
      </div>
      <div class="sup-cards">
        <div class="sup-card sup-card--plain">
          <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"></rect><path d="M3.5 10h17M8 3v4M16 3v4"></path></svg>
          <h3 data-k="guide.give.0.title">정기후원</h3>
          <p data-k="guide.give.0.body">매월 일정 금액을 정기적으로 후원합니다. 꾸준한 후원은 현장 활동이 끊기지 않고 이어지게 합니다.</p>
          <span data-k="guide.give.0.meta">CMS 자동이체 · 신용카드 · 휴대폰 결제</span>
        </div>
        <div class="sup-card sup-card--plain">
          <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>
          <h3 data-k="guide.give.1.title">일시후원</h3>
          <p data-k="guide.give.1.body">지정하신 금액을 1회 후원합니다. 한 번의 나눔도 현장 활동에 소중한 힘이 됩니다.</p>
          <span data-k="guide.give.1.meta">계좌이체 · 신용카드 · 휴대폰 결제</span>
        </div>
        <div class="sup-card sup-card--plain">
          <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path></svg>
          <h3 data-k="guide.give.2.title">기념일후원</h3>
          <p data-k="guide.give.2.body">생일, 첫돌, 결혼기념일 등 특별한 날에 지정하신 금액을 후원합니다.</p>
          <span data-k="guide.give.2.meta">계좌이체 · 신용카드 · 휴대폰 결제</span>
        </div>
      </div>
      <div class="sup-cta">
        <h3 data-k="guide.giveCtaTitle">오늘의 나눔이 내일의 배움이 됩니다</h3>
        <a class="sup-btn" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener"><span data-k="donate.label">지금 바로 후원하기 ♥</span></a>
        <div class="sup-safe">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg>
          <p data-k="guide.giveSafe">후원 신청은 후원 관리 서비스 '해피나눔' 페이지로 이동해 안전하게 진행됩니다. CMS 자동이체·신용카드·휴대폰 결제가 모두 가능하며, 기부금 영수증은 카야인터내셔널이 발급합니다.</p>
        </div>
        <a class="sup-more" href="/support/method">후원 방법 자세히 보기 →</a>
      </div>
    </div>
  </section>

  <div class="sup-wrap" data-sec="guide.contact">
    <section class="sup-contact" aria-label="후원 문의">
      <div>
        <h2 data-k="guide.contactTitle">후원 문의</h2>
        <p data-k="guide.contactLead">온라인 신청이 어려우시면 전화로 문의해 주세요.</p>
      </div>
      <div class="sup-actions">
        <a class="sup-contact" href="tel:07051212198"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h3l2 5-2 1a12 12 0 006 6l1-2 5 2v3a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z"></path></svg><span>070-5121-2198</span></a>
        <a class="sup-contact" href="mailto:khayahinternational@gmail.com"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg><span>khayahinternational@gmail.com</span></a>
      </div>
    </section>
  </div>
</div>
`

export const SUPPORT_METHOD_PAGE_HTML = `
<div class="sup sup--method">
  <div id="sg-toast" class="sg-toast" hidden role="status" aria-live="polite"></div>
  <div class="sup-wrap">
    <div class="sup-tabs">
      <p class="sup-crumb">홈 › 후원 › <b>후원 방법</b></p>
      <nav aria-label="후원 하위 메뉴">
        <a href="/support/guide">후원 안내</a>
        <a href="#top" aria-current="page">후원 방법</a>
      </nav>
    </div>
    <section id="top" class="sup-intro">
      <span class="sup-kicker">SUPPORT GUIDE</span>
      <h1 class="sup-title" data-k="method.title">후원 방법</h1>
      <p data-k="method.lead">후원 신청부터 납부, 기부금 영수증까지 한 곳에서 안내해 드립니다.</p>
      <nav class="sup-pills" aria-label="이 페이지 목차">
        <a class="sup-pill" href="#happy">해피나눔 안내</a>
        <a class="sup-pill" href="#steps">신청 절차</a>
        <a class="sup-pill" href="#pay">납부 방법</a>
        <a class="sup-pill" href="#receipt">후원회원 혜택·영수증</a>
        <a class="sup-pill" href="#contact">변경·문의</a>
      </nav>
    </section>
  </div>

  <section id="happy" class="sup-band" data-sec="method.happy">
    <div class="sup-wrap sup-two">
      <div>
        <span class="sup-kicker">01 · 해피나눔 안내</span>
        <h2 class="sup-h2" data-k="method.happyTitle" data-k-mode="html">카야의 후원 신청은<br>'해피나눔'에서 진행됩니다</h2>
        <p data-k="method.happyP1">카야는 후원 결제 전문 서비스 ‘해피나눔’의 시스템을 통해 안전하고 편리한 후원 신청 환경을 제공하고 있습니다. 결제 정보는 해당 시스템을 통해 안전하게 처리되며, 카야 홈페이지에는 후원자의 금융 정보가 저장되지 않습니다.</p>
        <p data-k="method.happyP2">보내주신 소중한 후원이 의미 있는 변화로 이어질 수 있도록, 카야는 후원자님과 꾸준히 소통하며 함께하겠습니다.</p>
      </div>
      <div>
        <div class="sup-line"><svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg><div><b data-k="method.happy.0.title">모든 결제 수단 가능</b><p data-k="method.happy.0.body">CMS 자동이체, 신용카드, 휴대폰 결제 등 다양한 방법으로 간편하게 후원하실 수 있습니다.</p></div></div>
        <div class="sup-line"><svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"></path></svg><div><b data-k="method.happy.1.title">회원가입은 자동으로</b><p data-k="method.happy.1.body">후원 신청 시 입력하신 정보를 바탕으로 후원회원 등록이 함께 진행됩니다.</p></div></div>
        <div class="sup-line"><svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z"></path><path d="M9 9h6M9 13h4"></path></svg><div><b data-k="method.happy.2.title">기부금 영수증 발급</b><p data-k="method.happy.2.body">후원금에 대한 기부금 영수증 발급이 가능하며, 국세청 연말정산 간소화 서비스(주민등록정보 제공자)를 통해서도 기부 내역을 확인하실 수 있습니다.</p></div></div>
      </div>
    </div>
  </section>

  <section id="steps" class="sup-block" data-sec="method.steps">
    <div class="sup-wrap">
      <div class="sup-head">
        <div>
          <span class="sup-kicker">02 · 신청 절차</span>
          <h2 class="sup-h2" data-k="method.stepsTitle">한 페이지에서 3단계로 신청하세요</h2>
          <p data-k="method.stepsLead">'후원하기' 버튼을 누르면 (사)카야인터내셔널 후원 신청서가 새 창으로 열립니다.</p>
        </div>
        <a class="sup-more" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener">신청서 바로 열기 →</a>
      </div>
      <div class="sup-steps">
        <article class="sup-step">
          <span class="sup-kicker">STEP 1</span>
          <h3 data-k="method.step.0.title">회원정보 입력</h3>
          <ul data-k="method.step.0.lines" data-k-mode="lines">
            <li>회원명과 휴대전화는 필수입니다.</li>
            <li>주민등록번호를 입력하시면 기부금 내역이 국세청 연말정산 간소화 서비스에 제공됩니다.</li>
            <li>소식지를 받으실 주소를 입력해 주세요.</li>
          </ul>
          <figure class="sup-shot"><img data-k="method.step.0.photo" data-k-mode="src" src="/images/donor-guide/step1-member.png" alt="해피나눔 신청서의 회원정보 입력 화면" /></figure>
        </article>
        <article class="sup-step">
          <span class="sup-kicker">STEP 2</span>
          <h3 data-k="method.step.1.title">결제정보 선택</h3>
          <ul data-k="method.step.1.lines" data-k-mode="lines">
            <li>결제방법(정기·일시)과 결제수단(자동이체·신용카드·휴대폰)을 고릅니다.</li>
            <li>정기후원은 매월 5일·10일·15일·25일 중 결제일을 선택합니다.</li>
            <li>후원금은 1,000원부터 원하시는 금액을 직접 입력할 수 있습니다.</li>
          </ul>
          <figure class="sup-shot"><img data-k="method.step.1.photo" data-k-mode="src" src="/images/donor-guide/step2-pay.png" alt="해피나눔 신청서의 결제정보 선택 화면" /></figure>
        </article>
        <article class="sup-step">
          <span class="sup-kicker">STEP 3</span>
          <h3 data-k="method.step.2.title">동의·전자서명 후 신청</h3>
          <ul data-k="method.step.2.lines" data-k-mode="lines">
            <li>필수 동의 2가지(개인정보 수집·이용, 자동결제)에 체크합니다.</li>
            <li>전자서명은 반드시 예금주 이름으로 해 주세요.</li>
            <li>'신청하기'를 누르면 접수가 완료됩니다.</li>
          </ul>
          <figure class="sup-shot"><img data-k="method.step.2.photo" data-k-mode="src" src="/images/donor-guide/step3-sign.png" alt="해피나눔 신청서의 결제동의와 전자서명 화면" /></figure>
        </article>
      </div>
    </div>
  </section>

  <section id="pay" class="sup-band" data-sec="method.pay">
    <div class="sup-wrap">
      <span class="sup-kicker">03 · 납부 방법</span>
      <h2 class="sup-h2" data-k="method.payTitle">후원 종류별 납부 방법</h2>
      <div class="sup-table-wrap">
        <table class="sup-table">
          <thead>
            <tr>
              <th scope="col">후원 종류</th>
              <th scope="col">CMS 자동이체</th>
              <th scope="col">신용카드</th>
              <th scope="col">휴대폰 결제</th>
              <th scope="col">계좌이체</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">정기후원</th>
              <td>● 권장</td>
              <td>● 권장</td>
              <td>●</td>
              <td class="sup-dash">–</td>
            </tr>
            <tr>
              <th scope="row">일시·기념일후원</th>
              <td class="sup-dash">–</td>
              <td>● 권장</td>
              <td>●</td>
              <td>●</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="sup-pay">
        <div class="sup-panel">
          <h3><span data-k="method.pay.0.title">CMS 자동이체</span> <span class="sup-rec" data-k="method.pay.0.badge">권장</span></h3>
          <ul data-k="method.pay.0.lines" data-k-mode="lines">
            <li>후원자님의 은행 계좌에서 매월 후원금이 자동이체됩니다.</li>
            <li>매월 5일, 10일, 15일, 25일 중 선택하신 날에 출금됩니다.</li>
            <li>평생계좌는 자동이체에 사용할 수 없습니다.</li>
            <li>등록 시 승인 문자가 발송되며, 잔액이 부족한 경우 당월에 한해 재출금이 시도됩니다.</li>
          </ul>
        </div>
        <div class="sup-panel">
          <h3><span data-k="method.pay.1.title">신용카드</span> <span class="sup-rec" data-k="method.pay.1.badge">권장</span></h3>
          <ul data-k="method.pay.1.lines" data-k-mode="lines">
            <li>신용카드 또는 체크카드로 후원금이 결제됩니다.</li>
            <li>신청 시 당월분이 승인 결제되며, 익월부터 약정일에 매월 자동결제됩니다.</li>
            <li>카드 유효기간 만료·재발급 시 후원이 중단될 수 있으니 변경 사항을 알려 주세요.</li>
          </ul>
        </div>
        <div class="sup-panel">
          <h3><span data-k="method.pay.2.title">휴대폰 결제</span> <span class="sup-rec" data-k="method.pay.2.badge" data-k-badge="muted">소액 결제</span></h3>
          <ul data-k="method.pay.2.lines" data-k-mode="lines">
            <li>통신사를 통해 소액결제되며, 신청 시 실시간 승인됩니다.</li>
            <li>익월부터 해당일에 매월 자동결제되고 승인 문자가 발송됩니다.</li>
            <li>알뜰폰은 이용하실 수 없습니다. (KT / SK / LG 3사만 가능)</li>
          </ul>
        </div>
        <div class="sup-panel">
          <h3 data-k="method.payOtherTitle">기타 후원</h3>
          <p data-k="method.payOtherBody">기업후원, 물품후원, 자원봉사, 재능기부 등은 카야로 직접 문의해 주세요.</p>
          <a class="sup-more" href="#contact">문의하기 →</a>
        </div>
      </div>
      <div class="sup-accounts" data-sec="method.account">
        <div class="sup-head">
          <h3 data-k="method.accountTitle">후원 계좌 (일시·기념일후원 계좌이체)</h3>
          <span>예금주 <b data-k="method.holder">(사)카야인터내셔널</b></span>
        </div>
        <div class="sup-account-grid">
          <div class="sup-account"><b>우리</b><span>1005-403-029492</span></div>
          <div class="sup-account"><b>농협</b><span>301-1122-4444-01</span></div>
          <div class="sup-account"><b>국민</b><span>584101-01-286346</span></div>
          <div class="sup-account"><b>신한</b><span>100-034-744590</span></div>
        </div>
        <p class="sup-note" data-k="method.accountNote">계좌이체 후 기부금 영수증이 필요하시면 대표번호 또는 이메일로 성함과 연락처를 알려 주세요.</p>
      </div>
    </div>
  </section>

  <section id="receipt" class="sup-block" data-sec="method.receipt">
    <div class="sup-wrap">
      <span class="sup-kicker">04 · 후원회원 혜택·영수증</span>
      <h2 class="sup-h2" data-k="method.receiptTitle">후원회원이 되시면</h2>
      <div class="sup-cards">
        <div class="sup-card">
          <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h11a3 3 0 013 3v11H7a3 3 0 01-3-3z"></path><path d="M8 9h6M8 13h6"></path></svg>
          <h3 data-k="method.receipt.0.title">소식지·연례보고서</h3>
          <p data-k="method.receipt.0.body">정기적인 사업 보고와 함께 후원금 사용 내역을 확인하실 수 있습니다.</p>
        </div>
        <div class="sup-card">
          <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z"></path><path d="M9 9h6M9 13h4"></path></svg>
          <h3 data-k="method.receipt.1.title">기부금 영수증 발급</h3>
          <p data-k="method.receipt.1.body">후원금에 대한 기부금 영수증 발급이 가능하며, 국세청 연말정산 간소화 서비스(주민등록정보 제공자)에서도 확인하실 수 있습니다.</p>
        </div>
        <div class="sup-card">
          <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.5"></circle><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.8 6 5"></path></svg>
          <h3 data-k="method.receipt.2.title">활동·모임 참여</h3>
          <p data-k="method.receipt.2.body">카야 후원자님과 함께하는 활동과 모임에 참여하실 수 있습니다.</p>
        </div>
      </div>
      <p class="sup-note" data-k="donate.receiptNote">카야인터내셔널이 발급합니다. 신청 시 주민등록번호를 입력하시면 연말정산 간소화 서비스에서 바로 확인하실 수 있습니다.</p>
    </div>
  </section>

  <section id="contact" class="sup-band" data-sec="method.contact">
    <div class="sup-wrap sup-pay">
      <div class="sup-panel">
        <span class="sup-kicker">05 · 변경·문의</span>
        <h2 class="sup-h2" data-k="method.contactTitle">정보 변경과 후원 문의</h2>
        <p data-k="method.contactBody">주소·연락처·결제 정보가 바뀌면 꼭 알려 주세요. 카야의 소식과 기부금 영수증을 정확히 전해 드릴 수 있습니다. 온라인 신청이 어려우시면 전화로도 신청을 도와드립니다.</p>
        <a class="sup-contact" href="tel:07051212198"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h3l2 5-2 1a12 12 0 006 6l1-2 5 2v3a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z"></path></svg><span>070-5121-2198</span></a>
        <a class="sup-contact" href="mailto:khayahinternational@gmail.com"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg><span>khayahinternational@gmail.com</span></a>
      </div>
      <div class="sup-panel">
        <h2 class="sup-h2" data-k="method.recommendTitle">후원 추천하기</h2>
        <p data-k="method.recommendBody">주변 분들에게도 나눔의 기쁨을 전해 주세요. 링크를 복사해 카카오톡이나 문자로 보낼 수 있습니다.</p>
        <button type="button" class="sup-btn--line" id="sg-copy-nanum">후원 링크 복사</button>
      </div>
    </div>
  </section>

  <section class="sup-block" data-sec="method.cta" aria-label="후원 신청">
    <div class="sup-wrap">
      <div class="sup-cta sup-cta--wine">
        <h2 class="sup-h2" data-k="method.ctaTitle">오늘의 나눔이 내일의 배움이 됩니다</h2>
        <p data-k="method.ctaLead">버튼을 누르면 카야 후원 전자 신청 페이지로 이동합니다.</p>
        <a class="sup-btn" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener"><span data-k="donate.label">지금 바로 후원하기 ♥</span></a>
      </div>
    </div>
  </section>
</div>
`
