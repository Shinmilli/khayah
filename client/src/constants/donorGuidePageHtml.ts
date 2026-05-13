/** 후원자 가이드 정적 페이지 본문 (후원가이드/후원자-가이드) */
export const DONOR_GUIDE_PAGE_HTML = `
<div class="sg-page">
  <div id="sg-toast" class="sg-toast" hidden role="status" aria-live="polite"></div>

  <section class="sg-hero" aria-label="후원 소개">
    <div class="sg-wrap">
      <p class="sg-hero__lead">
        카야는 단순 일회성지원이 아닌<br />
        지속적이고 자발적인 변혁이<br />
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
        <a class="sg-btn sg-btn--primary" href="https://www.ihappynanum.com/Nanum/B/RAA98AKVRQ" target="_blank" rel="noopener noreferrer">후원하기 ♥</a>
      </div>
    </div>
  </section>

  <section class="sg-section sg-section--surface" aria-labelledby="sg-types-heading">
    <div class="sg-wrap">
      <h2 id="sg-types-heading" class="sg-h2">후원금 종류</h2>
      <div class="sg-cards sg-cards--3">
        <article class="sg-card">
          <h3 class="sg-card__title">정기후원</h3>
          <p class="sg-card__p">매월 1회 일정 금액을 정기적으로 후원합니다.</p>
        </article>
        <article class="sg-card">
          <h3 class="sg-card__title">일시후원</h3>
          <p class="sg-card__p">지정하신 금액을 1회 후원합니다.</p>
        </article>
        <article class="sg-card">
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
          <h3 class="sg-card__title">신청 안내</h3>
          <ul class="sg-ul">
            <li>후원 신청 홈페이지 또는 모바일웹을 통해서 진행합니다. <strong>후원하기</strong>를 눌러 주세요.</li>
            <li>회원가입: 후원 신청 시 회원가입은 자동으로 진행됩니다.</li>
            <li>후원 납부 방법: CMS 자동이체, 신용카드, 휴대폰 결제, 계좌이체</li>
          </ul>
        </article>
        <article class="sg-card sg-card--accent">
          <h3 class="sg-card__title">후원회원이 되면</h3>
          <ul class="sg-ul">
            <li>카야 소식지 및 연례보고서를 통해 정기적인 사업 보고와 함께 후원금의 사용처를 확인할 수 있습니다.</li>
            <li>후원을 통해 기부금 영수증을 발급받을 수 있으며, 연말정산 시 소득공제 혜택을 받을 수 있습니다.</li>
            <li>카야 후원자님과 함께하는 활동 및 모임에 참여할 수 있습니다.</li>
          </ul>
        </article>
        <article class="sg-card sg-card--accent">
          <h3 class="sg-card__title">후원 추천하기</h3>
          <p class="sg-card__p">주변 분들에게도 나눔의 기쁨을 누릴 수 있는 방법을 알려 주세요.</p>
          <p class="sg-card__p sg-card__p--tight">아래 코드를 복사해 카톡이나 문자로 주변에 후원을 추천하실 수 있습니다.</p>
          <button type="button" class="sg-btn sg-btn--outline" id="sg-copy-nanum">코드 복사</button>
        </article>
      </div>
      <aside class="sg-callout" role="note">
        <strong>안내</strong> 개인정보가 바뀌면 카야의 소식 및 정보를 드리기 어려울 수 있으니, 변경 시 꼭 알려 주세요.
      </aside>
    </div>
  </section>

  <section class="sg-section sg-section--surface" aria-labelledby="sg-payrules-heading">
    <div class="sg-wrap">
      <h2 id="sg-payrules-heading" class="sg-h2">후원 납부 방법</h2>
      <ul class="sg-ul sg-ul--plain">
        <li><strong>정기 결제 시</strong> CMS 자동이체, 카드 결제, 휴대폰 결제</li>
        <li><strong>기념일 후원 및 일시 결제 시</strong> 계좌이체, 카드 결제, 휴대폰 결제</li>
        <li><strong>개인정보 변경</strong> 카야의 소식 및 정보를 알려 드릴 수 있도록 개인정보 변경 시 꼭 알려 주세요.</li>
      </ul>
    </div>
  </section>

  <section class="sg-section" aria-labelledby="sg-methods-heading">
    <div class="sg-wrap">
      <h2 id="sg-methods-heading" class="sg-h2">후원금 납부 방법</h2>
      <ol class="sg-method-list">
        <li class="sg-method">
          <div class="sg-method__num" aria-hidden="true">01</div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">CMS 자동이체 <span class="sg-badge">권장</span></h3>
            <p>후원자님의 은행계좌에서 매월 후원금이 자동이체됩니다.</p>
            <p>정기결제인 경우 매월 <strong>10일, 15일, 25일</strong> 중 선택 가능하며, 해당일에 출금이 이뤄집니다.</p>
            <p>자동이체 등록 시 승인 문자가 발송됩니다.</p>
            <p>정기후원일에 잔액이 부족할 경우 당월에 한해 재출금이 시도됩니다.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__num" aria-hidden="true">02</div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">신용카드</h3>
            <p>후원자님의 신용카드 또는 체크카드로 후원금이 자동결제됩니다.</p>
            <p>후원 신청 시 실시간 승인(결제)이 이뤄지며, 익월부터 해당 일에 매월 자동결제됩니다.</p>
            <p>후원 신청 시 승인(결제) 문자와 매월 결제 문자가 발송됩니다.</p>
            <p>신용카드 유효기간 만료·재발급 등 정보가 바뀌면 후원이 이뤄지지 않을 수 있으니, 카야 대표번호 <a href="tel:070-5121-2198">070-5121-2198</a> 또는 이메일 <a href="mailto:khayahinternational@gmail.com">khayahinternational@gmail.com</a>으로 변경 사항을 알려 주세요.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__num" aria-hidden="true">03</div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">휴대폰 결제 <span class="sg-badge sg-badge--muted">소액 결제 시 이용</span></h3>
            <p>후원자님의 통신사를 통해 소액결제가 됩니다.</p>
            <p class="sg-warn"><strong>알뜰폰</strong>은 해당 결제방법을 이용하실 수 없습니다. (KT / SK / LG 3사만 가능)</p>
            <p>후원 신청 시 실시간 승인(결제)이 이뤄지며, 익월부터 해당일에 매월 자동결제됩니다.</p>
            <p>후원 신청 시 승인(결제) 문자와 매월 결제 문자가 발송됩니다.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__num" aria-hidden="true">04</div>
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
          <div class="sg-method__num" aria-hidden="true">05</div>
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
        </div>
        <figure class="sg-step__fig">
          <img src="/images/donor-guide/step1-info.png" alt="후원 신청 화면 예시: 회원정보 입력 단계" width="640" height="420" loading="lazy" decoding="async" />
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
        </div>
        <figure class="sg-step__fig">
          <img src="/images/donor-guide/step2-payment.png" alt="후원 신청 화면 예시: 결제정보 입력 단계" width="640" height="420" loading="lazy" decoding="async" />
        </figure>
      </div>
    </div>
  </section>

  <section class="sg-footer-cta" aria-label="문의 및 후원">
    <div class="sg-wrap sg-footer-cta__inner">
      <p class="sg-footer-cta__hint">온라인 신청이 어려우시면 전화로 문의해 주세요.</p>
      <p class="sg-footer-cta__phone-label">대표번호</p>
      <p class="sg-footer-cta__phone"><a href="tel:070-5121-2198">070-5121-2198</a></p>
      <a class="sg-btn sg-btn--primary sg-btn--lg" href="https://www.ihappynanum.com/Nanum/B/RAA98AKVRQ" target="_blank" rel="noopener noreferrer">후원하기 ♥</a>
    </div>
  </section>
</div>
`.trim()
