/** 카야 위치안내 — 지도 + 브랜드 + 오시는 길·후원계좌(아이콘 2열, 원형 장식 이미지 없음) */

const MAP_EMBED_SRC =
  'https://maps.google.com/maps?q=' +
  encodeURIComponent('경기도 성남시 분당구 이매동 81-3 방아로 38') +
  '&hl=ko&z=17&output=embed'

const iconHouse = `<svg class="khayah-loc-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.8l6 5.4V18h-2v-6H8v6H6v-6.8l6-5.4z"/></svg>`
const iconPhone = `<svg class="khayah-loc-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8c1.6 3.1 4.5 5.9 7.6 7.6l2.5-2.5c.3-.3.8-.4 1.2-.2 1 .4 2.1.6 3.3.6.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3C9.6 21.3 2.7 14.4 2.7 5.3 2.7 4.6 3.3 4 4 4h3.5c.7 0 1.3.6 1.3 1.3 0 1.1.2 2.3.6 3.3.1.4 0 .9-.2 1.2L6.6 10.8z"/></svg>`
const iconFax = `<svg class="khayah-loc-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M19 8h-1V5H6v3H5c-1.7 0-3 1.3-3 3v6h4v2h12v-2h4v-6c0-1.7-1.3-3-3-3zM8 7h8v1H8V7zm-2 9H5v-4h1v4zm14 0h-1v-4h1v4z"/></svg>`
const iconMail = `<svg class="khayah-loc-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`
const iconHeart = `<svg class="khayah-loc-icon khayah-loc-icon--heart" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`

export const KHAYAH_LOCATION_PAGE_HTML = `
<div class="khayah-location-page">
  <div class="khayah-location-map-wrap">
    <iframe
      class="khayah-location-map"
      title="카야인터내셔널 사무실 위치 (구글 지도)"
      src="${MAP_EMBED_SRC}"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>
  <div class="khayah-location-body">
    <header class="khayah-location-brand">
      <h2 class="khayah-location-brand__name">카야인터내셔널</h2>
      <div class="khayah-location-brand__rule" aria-hidden="true"></div>
    </header>
    <div class="khayah-location-columns">
      <section class="khayah-location-block khayah-location-block--directions" aria-labelledby="khayah-loc-dir-heading">
        <h3 id="khayah-loc-dir-heading" class="khayah-location-block__title">오시는 길</h3>
        <ul class="khayah-location-list">
          <li>
            ${iconHouse}
            <span class="khayah-location-list__text">경기도 성남시 분당구 이매동 81-3 (방아로 38)</span>
          </li>
          <li>
            ${iconPhone}
            <span class="khayah-location-list__text"><a href="tel:07051212198">070.5121.2198</a></span>
          </li>
          <li>
            ${iconFax}
            <span class="khayah-location-list__text">070.8650.3639</span>
          </li>
          <li>
            ${iconMail}
            <span class="khayah-location-list__text"><a href="mailto:khayahinternational@gmail.com">khayahinternational@gmail.com</a></span>
          </li>
        </ul>
      </section>
      <section class="khayah-location-block khayah-location-block--accounts" aria-labelledby="khayah-loc-acc-heading">
        <h3 id="khayah-loc-acc-heading" class="khayah-location-block__title">후원계좌</h3>
        <p class="khayah-location-accounts__holder">예금주 <strong>(사)카야인터내셔널</strong></p>
        <ul class="khayah-location-list khayah-location-list--accounts">
          <li>${iconHeart}<span class="khayah-location-list__text"><strong>우리</strong> 1005-403-029492</span></li>
          <li>${iconHeart}<span class="khayah-location-list__text"><strong>농협</strong> 301-1122-4444-01</span></li>
          <li>${iconHeart}<span class="khayah-location-list__text"><strong>국민</strong> 584101-01-286346</span></li>
          <li>${iconHeart}<span class="khayah-location-list__text"><strong>신한</strong> 100-034-744590</span></li>
        </ul>
      </section>
    </div>
  </div>
</div>
`.trim()
