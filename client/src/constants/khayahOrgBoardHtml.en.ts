/** Org chart · Board of Directors · Expert Advisors (static content, CMS-ready) */

export const KHAYAH_ORG_CHART_HTML = `
<div class="khayah-org-chart">
  <p class="khayah-org-chart__lead">A diagram of Khayah's operational structure.<br />Three central areas work together organically, supported by the Board of Directors and Expert Advisors.</p>
  <figure class="khayah-org-chart__figure">
    <img
      class="khayah-org-chart__img"
      src="/images/Khayah/org-chart-diagram.png"
      width="640"
      height="640"
      alt="KHAYAH org chart: Domestic Civic Programs, International Development Cooperation, Management Support, Board of Directors, and Expert Advisors"
      decoding="async"
      loading="lazy"
    />
  </figure>
</div>
`.trim()

const KHAYAH_DIRECTORS_GRID_HTML = `
<div class="khayah-board-grid" role="list">
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Soontae Choi Director</div>
    <div class="khayah-board-role">CEO, Khayah</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Sun Woo Kim Director</div>
    <div class="khayah-board-role">Executive Director, Khayah</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Kyounghui Kim Director</div>
    <div class="khayah-board-role">Professor, Department of Social Welfare, Jeonju University of Jesus</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Jaehyuk Lee Director</div>
    <div class="khayah-board-role">Family Medicine Specialist, Seongnam Medical Center</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Pil Woo Lee Director</div>
    <div class="khayah-board-role">Attorney, Law Firm Gangnam</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Stephan Hyosik Rhee Director</div>
    <div class="khayah-board-role">CEO, Leeway Global Network, Inc.</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Min Hong Auditor</div>
    <div class="khayah-board-role">Attorney, SJ Partners Law Office</div>
  </div>
  <div class="khayah-board-cell khayah-board-cell--empty" aria-hidden="true"></div>
</div>
`.trim()

const KHAYAH_EXPERTS_GRID_HTML = `
<div class="khayah-board-grid" role="list">
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Youn Seok Choi Expert Advisor</div>
    <div class="khayah-board-role">CEO, Maepyo Chemical</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Hwang Nam Gi Expert Advisor</div>
    <div class="khayah-board-role">CEO, Hapgyeok Camp Co., Ltd.</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Jae Woon Lee Expert Advisor</div>
    <div class="khayah-board-role">Professor, Department of Law, CUHK (Hong Kong)</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Nayoung Oh Expert Advisor</div>
    <div class="khayah-board-role">CEO, ONA Creation</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Chan Min Kim Expert Advisor</div>
    <div class="khayah-board-role">Professor, Department of Statistics, Sungkyunkwan University</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Hyeong Woo Noh Expert Advisor</div>
    <div class="khayah-board-role">President, Coas Co., Ltd.</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Lee Jin Young Expert Advisor</div>
    <div class="khayah-board-role">CEO, The Organic Dio Co., Ltd.</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Ray Park Expert Advisor</div>
    <div class="khayah-board-role">Branch Manager, Shinhan Life Sin Gangnam Branch</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Jung Young Mi Expert Advisor</div>
    <div class="khayah-board-role">Director, Juno Hair Migeum Branch</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Ray Park Expert Advisor</div>
    <div class="khayah-board-role">Head of Consulting, Nomura Research Institute New York Office</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Yong Beom Na Expert Advisor</div>
    <div class="khayah-board-role">CEO, Korea C&amp;S Co., Ltd.</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Chang Hyun Kim Expert Advisor</div>
    <div class="khayah-board-role">CEO, AA Studio</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Timothy Kim Expert Advisor</div>
    <div class="khayah-board-role">Senior Advisor, Child Fund International Research &amp; Learning</div>
  </div>
  <div class="khayah-board-cell khayah-board-cell--empty" aria-hidden="true"></div>
</div>
`.trim()

/** Hub tabs & standalone pages: left title · right body */
export const KHAYAH_ORG_BOARD_MERGED_HTML = `
<div class="khayah-org-board-merged">
  <article class="khayah-split-row" id="org-chart" aria-labelledby="khayah-split-org">
    <h2 id="khayah-split-org" class="khayah-split-row__title">Org Chart</h2>
    <div class="khayah-split-row__body">
      ${KHAYAH_ORG_CHART_HTML}
    </div>
  </article>
  <article class="khayah-split-row" id="directors" aria-labelledby="khayah-split-directors">
    <h2 id="khayah-split-directors" class="khayah-split-row__title">Board of Directors</h2>
    <div class="khayah-split-row__body">
      ${KHAYAH_DIRECTORS_GRID_HTML}
    </div>
  </article>
  <article class="khayah-split-row" id="experts" aria-labelledby="khayah-split-experts">
    <h2 id="khayah-split-experts" class="khayah-split-row__title">Expert Advisors</h2>
    <div class="khayah-split-row__body">
      ${KHAYAH_EXPERTS_GRID_HTML}
    </div>
  </article>
</div>
`.trim()

/** Legacy single-page export (same content) */
export const KHAYAH_BOARD_PAGE_HTML = KHAYAH_ORG_BOARD_MERGED_HTML
