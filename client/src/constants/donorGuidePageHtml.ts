import { NANUM_DONATE_URL } from './nanumDonate'

/** 후원 안내 정적 페이지 본문 (경로: 후원/후원-안내) */
export const DONOR_GUIDE_PAGE_HTML = `
<div class="sg-page">
  <div id="sg-toast" class="sg-toast" hidden role="status" aria-live="polite"></div>

  <section class="sg-hero" aria-label="후원 소개">
    <div class="sg-wrap">
      <p class="sg-hero__lead">
        카야는 단순 일회성지원이 아닌<br />
        <span class="sg-hero__strong">지속적이고 자발적인 변혁</span>이<br />
        일어날 수 있는 개발을 지원합니다.
      </p>
    </div>
  </section>

  <section class="sg-section" aria-labelledby="sg-accounts-heading">
    <div class="sg-wrap">
      <h2 id="sg-accounts-heading" class="sg-h2">카야 인터내셔널 후원계좌</h2>
      <p class="sg-note">예금주: (사)카야인터내셔널</p>
      <dl class="sg-accounts">
        <div class="sg-account"><dt>우리</dt><dd><span class="sg-mono">1005-403-029492</span></dd></div>
        <div class="sg-account"><dt>농협</dt><dd><span class="sg-mono">301-1122-4444-01</span></dd></div>
        <div class="sg-account"><dt>국민</dt><dd><span class="sg-mono">584101-01-286346</span></dd></div>
        <div class="sg-account"><dt>신한</dt><dd><span class="sg-mono">100-034-744590</span></dd></div>
      </dl>
      <div class="sg-cta-row">
        <a class="sg-btn sg-btn--primary" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener noreferrer">후원하기 ♥</a>
      </div>
    </div>
  </section>

  <section class="sg-section sg-section--surface" aria-labelledby="sg-types-heading">
    <div class="sg-wrap">
      <h2 id="sg-types-heading" class="sg-h2">후원금 종류</h2>
      <div class="sg-cards sg-cards--3">
        <article class="sg-card">
          <span class="sg-card__icon sg-card__icon--red" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" stroke-width="2"/></span>
          <h3 class="sg-card__title">정기후원</h3>
          <p class="sg-card__p">매월 1회 일정 금액을 정기적으로 후원합니다.</p>
        </article>
        <article class="sg-card">
          <span class="sg-card__icon sg-card__icon--red" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></span>
          <h3 class="sg-card__title">일시후원</h3>
          <p class="sg-card__p">지정하신 금액을 1회 후원합니다.</p>
        </article>
        <article class="sg-card">
          <span class="sg-card__icon sg-card__icon--red" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6L12 2z"/></span>
          <h3 class="sg-card__title">기념일후원</h3>
          <p class="sg-card__p">생일, 첫돌, 결혼기념일 등의 특별한 날에 지정하신 금액을 후원합니다.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="sg-section" aria-labelledby="sg-apply-heading">
    <div class="sg-wrap">
      <h2 id="sg-apply-heading" class="sg-h2">후원 신청 및 납부 방법</h2>
      <div class="sg-cards sg-cards--3">
        <article class="sg-card sg-card--accent">
          <span class="sg-card__icon sg-card__icon--blue" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></span>
          <h3 class="sg-card__title">신청 안내</h3>
          <ul class="sg-ul">
            <li>후원 신청 홈페이지 또는 모바일웹을 통해서 진행합니다. <strong>후원하기</strong>를 눌러 주세요.</li>
            <li>회원가입: 후원 신청 시 회원가입은 자동으로 진행됩니다.</li>
            <li>후원 납부 방법: CMS 자동이체, 신용카드, 휴대폰 결제, 계좌이체</li>
          </ul>
        </article>
        <article class="sg-card sg-card--accent">
          <span class="sg-card__icon sg-card__icon--blue" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="17" cy="11" r="2.5"/><path d="M7 15h6M7 11h4"/></span>
          <h3 class="sg-card__title">후원회원이 되면</h3>
          <ul class="sg-ul">
            <li>카야 소식지 및 연례보고서를 통해 정기적인 사업 보고와 함께 후원금의 사용처를 확인할 수 있습니다.</li>
            <li>후원을 통해 기부금 영수증을 발급받을 수 있으며, 연말정산 시 소득공제 혜택을 받을 수 있습니다.</li>
            <li>카야 후원자님과 함께하는 활동 및 모임에 참여할 수 있습니다.</li>
          </ul>
        </article>
        <article class="sg-card sg-card--accent">
          <span class="sg-card__icon sg-card__icon--blue" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></span>
          <h3 class="sg-card__title">후원 추천하기</h3>
          <p class="sg-card__p">주변 분들에게도 나눔의 기쁨을 누릴 수 있는 방법을 알려 주세요.</p>
          <p class="sg-card__p sg-card__p--tight">아래 코드를 복사해 카톡이나 문자로 주변에 후원을 추천하실 수 있습니다.</p>
          <button type="button" class="sg-btn sg-btn--outline" id="sg-copy-nanum">코드 복사</button>
        </article>
      </div>
    </div>
  </section>

  <section class="sg-section sg-section--surface" aria-labelledby="sg-payrules-heading">
    <div class="sg-wrap">
      <div class="sg-paynote">
        <span class="sg-paynote__bulb" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg></span>
        <div class="sg-paynote__body">
          <h2 id="sg-payrules-heading" class="sg-h2 sg-paynote__title">후원 납부 방법</h2>
          <ul class="sg-ul sg-ul--plain">
            <li><strong>정기 결제 시</strong> CMS 자동이체, 카드 결제, 휴대폰 결제</li>
            <li><strong>기념일 후원 및 일시 결제 시</strong> 계좌이체, 카드 결제, 휴대폰 결제</li>
            <li><strong>개인정보 변경</strong> 카야의 소식 및 정보를 알려 드릴 수 있도록 개인정보 변경 시 꼭 알려 주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="sg-section" aria-labelledby="sg-methods-heading">
    <div class="sg-wrap">
      <h2 id="sg-methods-heading" class="sg-h2">후원금 납부 방법</h2>
      <ol class="sg-method-list">
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">01</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">CMS 자동이체 <span class="sg-badge">권장</span></h3>
            <p>후원자님의 은행계좌에서 매월 후원금이 자동이체됩니다.</p>
            <p>정기결제인 경우 매월 <strong>10일, 15일, 25일</strong> 중 선택 가능하며, 해당일에 출금이 이뤄집니다.</p>
            <p>자동이체 등록 시 승인 문자가 발송됩니다.</p>
            <p>정기후원일에 잔액이 부족할 경우 당월에 한해 재출금이 시도됩니다.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">02</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">신용카드</h3>
            <p>후원자님의 신용카드 또는 체크카드로 후원금이 자동결제됩니다.</p>
            <p>후원 신청 시 실시간 승인(결제)이 이뤄지며, 익월부터 해당 일에 매월 자동결제됩니다.</p>
            <p>후원 신청 시 승인(결제) 문자와 매월 결제 문자가 발송됩니다.</p>
            <p>신용카드 유효기간 만료·재발급 등 정보가 바뀌면 후원이 이뤄지지 않을 수 있으니, 카야 대표번호 <a href="tel:070-5121-2198">070-5121-2198</a> 또는 이메일 <a href="mailto:khayahinternational@gmail.com">khayahinternational@gmail.com</a>으로 변경 사항을 알려 주세요.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">03</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">휴대폰 결제 <span class="sg-badge sg-badge--muted">소액 결제 시 이용</span></h3>
            <p>후원자님의 통신사를 통해 소액결제가 됩니다.</p>
            <p class="sg-warn"><strong>알뜰폰</strong>은 해당 결제방법을 이용하실 수 없습니다. (KT / SK / LG 3사만 가능)</p>
            <p>후원 신청 시 실시간 승인(결제)이 이뤄지며, 익월부터 해당일에 매월 자동결제됩니다.</p>
            <p>후원 신청 시 승인(결제) 문자와 매월 결제 문자가 발송됩니다.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">04</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h11M7 10l3-3M7 10l3 3"/><path d="M17 14H6M17 14l-3-3M17 14l-3 3"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">계좌이체</h3>
            <p>일시후원, 기념일 후원 등 카야 후원계좌로 직접 입금하는 방법입니다.</p>
            <dl class="sg-accounts sg-accounts--inline">
              <div class="sg-account"><dt>우리</dt><dd><span class="sg-mono">1005-403-029492</span></dd></div>
              <div class="sg-account"><dt>농협</dt><dd><span class="sg-mono">301-1122-4444-01</span></dd></div>
              <div class="sg-account"><dt>국민</dt><dd><span class="sg-mono">584101-01-286346</span></dd></div>
              <div class="sg-account"><dt>신한</dt><dd><span class="sg-mono">100-034-744590</span></dd></div>
            </dl>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">05</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">기타 후원</h3>
            <p>기업후원, 물품후원, 자원봉사, 재능기부 등은 카야로 직접 문의 바랍니다.</p>
          </div>
        </li>
      </ol>
      <div class="sg-contact-card">
        <h3 class="sg-contact-card__title">문의</h3>
        <p class="sg-contact-card__row"><span class="sg-contact-card__label">T</span> <a href="tel:070-5121-2198">070-5121-2198</a></p>
        <p class="sg-contact-card__row"><span class="sg-contact-card__label">E</span> <a href="mailto:khayahinternational@gmail.com">khayahinternational@gmail.com</a></p>
      </div>
    </div>
  </section>

  <section class="sg-band" aria-label="Support Guide">
    <div class="sg-wrap sg-band__inner">
      <p class="sg-band__en">Support Guide</p>
      <p class="sg-band__ko">카야는 지속적이고 자발적인 변혁이 일어날 수 있는<br />개발을 지원합니다.</p>
    </div>
  </section>

  <section class="sg-section sg-section--steps" aria-labelledby="sg-step1-heading">
    <div class="sg-wrap">
      <div class="sg-step">
        <div class="sg-step__text">
          <p class="sg-step__label">STEP 1.</p>
          <h2 id="sg-step1-heading" class="sg-step__title">정보 입력</h2>
          <p class="sg-step__lead">후원자님의 정보를 입력해 주세요.</p>
          <p class="sg-step__sub">정보 입력 시 회원으로 자동 등록됩니다.</p>
          <span class="sg-step__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg></span>
        </div>
        <figure class="sg-step__fig">
          <img src="/images/donor-guide/step1-info.jpg" alt="후원 신청 화면 예시: 회원정보 입력 단계" width="640" height="420" loading="eager" decoding="async" />
        </figure>
      </div>
    </div>
  </section>

  <section class="sg-section sg-section--surface sg-section--steps" aria-labelledby="sg-step2-heading">
    <div class="sg-wrap">
      <div class="sg-step sg-step--reverse">
        <div class="sg-step__text">
          <p class="sg-step__label">STEP 2.</p>
          <h2 id="sg-step2-heading" class="sg-step__title">결제정보</h2>
          <p class="sg-step__lead">결제정보를 입력해 주세요.</p>
          <ul class="sg-ul sg-ul--tight">
            <li>결제방식(정기·일시)과 결제수단(자동이체·카드결제·휴대폰)에 따라 결제정보 창이 조금씩 달라집니다.</li>
            <li>후원자님의 계좌번호 또는 카드 정보 등을 정확히 입력해 주세요.</li>
          </ul>
          <span class="sg-step__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2.55" y="2.6" width="18.9" height="18.8" rx="2.65" stroke-width="2.45"/><g stroke-width="1.72"><line x1="5.7" y1="8.05" x2="11.85" y2="8.05"/><line x1="5.7" y1="12" x2="11.85" y2="12"/><line x1="5.7" y1="15.95" x2="11.85" y2="15.95"/><circle cx="16.25" cy="12" r="2.25"/></g></svg></span>
        </div>
        <figure class="sg-step__fig">
          <img src="/images/donor-guide/step2-payment.jpg" alt="후원 신청 화면 예시: 결제정보 입력 단계" width="640" height="420" loading="eager" decoding="async" />
        </figure>
      </div>
    </div>
  </section>

  <section class="sg-footer-cta" aria-label="문의 및 후원">
    <div class="sg-wrap sg-footer-cta__inner">
      <p class="sg-footer-cta__hint">온라인 신청이 어려우시면 전화로 문의해 주세요.</p>
      <p class="sg-footer-cta__phone-label">대표번호</p>
      <p class="sg-footer-cta__phone"><a href="tel:070-5121-2198">070-5121-2198</a></p>
      <a class="sg-btn sg-btn--primary sg-btn--lg" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener noreferrer">후원하기 ♥</a>
    </div>
  </section>
</div>
`.trim()
