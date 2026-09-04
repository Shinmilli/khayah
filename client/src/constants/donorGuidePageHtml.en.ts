import { NANUM_DONATE_URL } from './nanumDonate'

/** Donor guide static page content (path: support/guide) */
export const DONOR_GUIDE_PAGE_HTML = `
<div class="sg-page">
  <div id="sg-toast" class="sg-toast" hidden role="status" aria-live="polite"></div>

  <section class="sg-hero" aria-label="Support introduction">
    <div class="sg-wrap">
      <p class="sg-hero__lead">
        Khayah supports development where<br />
        <span class="sg-hero__strong">sustained, voluntary transformation</span><br />
        can take place — not one-time aid alone.
      </p>
    </div>
  </section>

  <section class="sg-section" aria-labelledby="sg-accounts-heading">
    <div class="sg-wrap">
      <h2 id="sg-accounts-heading" class="sg-h2">Khayah International Donation Accounts</h2>
      <p class="sg-note">Account holder: Khayah International</p>
      <dl class="sg-accounts">
        <div class="sg-account"><dt>Woori</dt><dd><span class="sg-mono">1005-403-029492</span></dd></div>
        <div class="sg-account"><dt>NH</dt><dd><span class="sg-mono">301-1122-4444-01</span></dd></div>
        <div class="sg-account"><dt>KB</dt><dd><span class="sg-mono">584101-01-286346</span></dd></div>
        <div class="sg-account"><dt>Shinhan</dt><dd><span class="sg-mono">100-034-744590</span></dd></div>
      </dl>
      <div class="sg-cta-row">
        <a class="sg-btn sg-btn--primary" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener noreferrer">Donate ♥</a>
      </div>
    </div>
  </section>

  <section class="sg-section sg-section--surface" aria-labelledby="sg-types-heading">
    <div class="sg-wrap">
      <h2 id="sg-types-heading" class="sg-h2">Types of Donations</h2>
      <div class="sg-cards sg-cards--3">
        <article class="sg-card">
          <span class="sg-card__icon sg-card__icon--red" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" stroke-width="2"/></span>
          <h3 class="sg-card__title">Monthly Giving</h3>
          <p class="sg-card__p">Support Khayah with a fixed amount each month.</p>
        </article>
        <article class="sg-card">
          <span class="sg-card__icon sg-card__icon--red" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></span>
          <h3 class="sg-card__title">One-Time Gift</h3>
          <p class="sg-card__p">Make a single donation in the amount you choose.</p>
        </article>
        <article class="sg-card">
          <span class="sg-card__icon sg-card__icon--red" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6L12 2z"/></span>
          <h3 class="sg-card__title">Commemorative Gift</h3>
          <p class="sg-card__p">Give on special occasions such as birthdays, first birthdays, or wedding anniversaries.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="sg-section" aria-labelledby="sg-apply-heading">
    <div class="sg-wrap">
      <h2 id="sg-apply-heading" class="sg-h2">How to Apply and Pay</h2>
      <div class="sg-cards sg-cards--3">
        <article class="sg-card sg-card--accent">
          <span class="sg-card__icon sg-card__icon--blue" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></span>
          <h3 class="sg-card__title">Application Guide</h3>
          <ul class="sg-ul">
            <li>Apply through our website or mobile web. Please click <strong>Donate</strong>.</li>
            <li>Membership: You are automatically registered when you apply to donate.</li>
            <li>Payment methods: CMS auto-debit, credit card, mobile payment, bank transfer</li>
          </ul>
        </article>
        <article class="sg-card sg-card--accent">
          <span class="sg-card__icon sg-card__icon--blue" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="17" cy="11" r="2.5"/><path d="M7 15h6M7 11h4"/></span>
          <h3 class="sg-card__title">As a Supporter</h3>
          <ul class="sg-ul">
            <li>Receive regular program reports and annual reports through Khayah's newsletter, so you can see how your donations are used.</li>
            <li>Receive a donation receipt for tax purposes and benefit from income tax deductions at year-end.</li>
            <li>Join activities and gatherings with fellow Khayah supporters.</li>
          </ul>
        </article>
        <article class="sg-card sg-card--accent">
          <span class="sg-card__icon sg-card__icon--blue" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></span>
          <h3 class="sg-card__title">Refer a Friend</h3>
          <p class="sg-card__p">Tell others how they too can experience the joy of sharing.</p>
          <p class="sg-card__p sg-card__p--tight">Copy the code below and share it via messaging apps to recommend Khayah to friends and family.</p>
          <button type="button" class="sg-btn sg-btn--outline" id="sg-copy-nanum">Copy Code</button>
        </article>
      </div>
    </div>
  </section>

  <section class="sg-section sg-section--surface" aria-labelledby="sg-payrules-heading">
    <div class="sg-wrap">
      <div class="sg-paynote">
        <span class="sg-paynote__bulb" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg></span>
        <div class="sg-paynote__body">
          <h2 id="sg-payrules-heading" class="sg-h2 sg-paynote__title">Payment Methods</h2>
          <ul class="sg-ul sg-ul--plain">
            <li><strong>Recurring payments:</strong> CMS auto-debit, card payment, mobile payment</li>
            <li><strong>Commemorative and one-time payments:</strong> bank transfer, card payment, mobile payment</li>
            <li><strong>Personal information updates:</strong> Please notify us when your contact details change so we can keep you informed about Khayah's news and activities.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="sg-section" aria-labelledby="sg-methods-heading">
    <div class="sg-wrap">
      <h2 id="sg-methods-heading" class="sg-h2">How to Pay</h2>
      <ol class="sg-method-list">
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">01</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">CMS Auto-Debit <span class="sg-badge">Recommended</span></h3>
            <p>Your donation is automatically withdrawn from your bank account each month.</p>
            <p>For recurring gifts, you may choose the <strong>10th, 15th, or 25th</strong> of each month as your payment date.</p>
            <p>You will receive a confirmation text when auto-debit is set up.</p>
            <p>If your balance is insufficient on the scheduled date, a retry will be attempted once within the same month.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">02</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">Credit Card</h3>
            <p>Your donation is charged automatically to your credit or debit card.</p>
            <p>Your first payment is processed in real time when you apply; subsequent monthly payments are charged on the same date each month.</p>
            <p>You will receive confirmation texts when you apply and for each monthly payment.</p>
            <p>If your card expires or is reissued, donations may not go through. Please contact Khayah at <a href="tel:070-5121-2198">070-5121-2198</a> or <a href="mailto:khayahinternational@gmail.com">khayahinternational@gmail.com</a> with any changes.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">03</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">Mobile Payment <span class="sg-badge sg-badge--muted">For small amounts</span></h3>
            <p>Payment is processed through your mobile carrier.</p>
            <p class="sg-warn"><strong>MVNO (budget phone) plans</strong> are not eligible. Available for KT, SK, and LG subscribers only.</p>
            <p>Your first payment is processed in real time when you apply; subsequent monthly payments are charged on the same date each month.</p>
            <p>You will receive confirmation texts when you apply and for each monthly payment.</p>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">04</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h11M7 10l3-3M7 10l3 3"/><path d="M17 14H6M17 14l-3-3M17 14l-3 3"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">Bank Transfer</h3>
            <p>Deposit directly into a Khayah donation account for one-time or commemorative gifts.</p>
            <dl class="sg-accounts sg-accounts--inline">
              <div class="sg-account"><dt>Woori</dt><dd><span class="sg-mono">1005-403-029492</span></dd></div>
              <div class="sg-account"><dt>NH</dt><dd><span class="sg-mono">301-1122-4444-01</span></dd></div>
              <div class="sg-account"><dt>KB</dt><dd><span class="sg-mono">584101-01-286346</span></dd></div>
              <div class="sg-account"><dt>Shinhan</dt><dd><span class="sg-mono">100-034-744590</span></dd></div>
            </dl>
          </div>
        </li>
        <li class="sg-method">
          <div class="sg-method__head">
            <span class="sg-method__num" aria-hidden="true">05</span>
            <span class="sg-method__icon sg-method__icon--pay" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></span>
          </div>
          <div class="sg-method__body">
            <h3 class="sg-method__title">Other Ways to Give</h3>
            <p>For corporate sponsorship, in-kind donations, volunteering, or pro bono support, please contact Khayah directly.</p>
          </div>
        </li>
      </ol>
      <div class="sg-contact-card">
        <h3 class="sg-contact-card__title">Contact</h3>
        <p class="sg-contact-card__row"><span class="sg-contact-card__label">T</span> <a href="tel:070-5121-2198">070-5121-2198</a></p>
        <p class="sg-contact-card__row"><span class="sg-contact-card__label">E</span> <a href="mailto:khayahinternational@gmail.com">khayahinternational@gmail.com</a></p>
      </div>
    </div>
  </section>

  <section class="sg-band" aria-label="Support Guide">
    <div class="sg-wrap sg-band__inner">
      <p class="sg-band__en">Support Guide</p>
      <p class="sg-band__ko">Khayah supports development where<br />sustained, voluntary transformation can take place.</p>
    </div>
  </section>

  <section class="sg-section sg-section--steps" aria-labelledby="sg-step1-heading">
    <div class="sg-wrap">
      <div class="sg-step">
        <div class="sg-step__text">
          <p class="sg-step__label">STEP 1.</p>
          <h2 id="sg-step1-heading" class="sg-step__title">Enter Your Information</h2>
          <p class="sg-step__lead">Please enter your information.</p>
          <p class="sg-step__sub">You will be automatically registered as a member when you submit your information.</p>
          <span class="sg-step__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg></span>
        </div>
        <figure class="sg-step__fig">
          <img src="/images/donor-guide/step1-info.jpg" alt="Donation application screen: member information step" width="640" height="420" loading="eager" decoding="async" />
        </figure>
      </div>
    </div>
  </section>

  <section class="sg-section sg-section--surface sg-section--steps" aria-labelledby="sg-step2-heading">
    <div class="sg-wrap">
      <div class="sg-step sg-step--reverse">
        <div class="sg-step__text">
          <p class="sg-step__label">STEP 2.</p>
          <h2 id="sg-step2-heading" class="sg-step__title">Payment Information</h2>
          <p class="sg-step__lead">Please enter your payment information.</p>
          <ul class="sg-ul sg-ul--tight">
            <li>The payment form varies slightly depending on your payment type (recurring or one-time) and method (auto-debit, card, or mobile).</li>
            <li>Please enter your bank account or card details accurately.</li>
          </ul>
          <span class="sg-step__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2.55" y="2.6" width="18.9" height="18.8" rx="2.65" stroke-width="2.45"/><g stroke-width="1.72"><line x1="5.7" y1="8.05" x2="11.85" y2="8.05"/><line x1="5.7" y1="12" x2="11.85" y2="12"/><line x1="5.7" y1="15.95" x2="11.85" y2="15.95"/><circle cx="16.25" cy="12" r="2.25"/></g></svg></span>
        </div>
        <figure class="sg-step__fig">
          <img src="/images/donor-guide/step2-payment.jpg" alt="Donation application screen: payment information step" width="640" height="420" loading="eager" decoding="async" />
        </figure>
      </div>
    </div>
  </section>

  <section class="sg-footer-cta" aria-label="Contact and donate">
    <div class="sg-wrap sg-footer-cta__inner">
      <p class="sg-footer-cta__hint">If online application is difficult, please call us.</p>
      <p class="sg-footer-cta__phone-label">Main number</p>
      <p class="sg-footer-cta__phone"><a href="tel:070-5121-2198">070-5121-2198</a></p>
      <a class="sg-btn sg-btn--primary sg-btn--lg" href="${NANUM_DONATE_URL}" target="_blank" rel="noopener noreferrer">Donate ♥</a>
    </div>
  </section>
</div>
`.trim()
