/** 조직도 · 이사회 · 전문위원 (정적 본문, 추후 CMS로 대체 가능) */

export const KHAYAH_ORG_CHART_HTML = `
<div class="khayah-org-chart">
  <p class="khayah-org-chart__lead">카야의 운영 구조를 도식으로 나타낸 것입니다.<br />중앙의 세 영역이 유기적으로 맞물리고, 이사회·전문위원이 함께합니다.</p>
  <figure class="khayah-org-chart__figure">
    <img
      class="khayah-org-chart__img"
      src="/images/Khayah/org-chart-diagram.png"
      width="640"
      height="640"
      alt="KHAYAH 조직도: 국내시민사업·국제개발협력사업·경영지원과 이사회·전문위원"
      decoding="async"
      loading="lazy"
    />
  </figure>
</div>
`.trim()

const KHAYAH_DIRECTORS_GRID_HTML = `
<div class="khayah-board-grid" role="list">
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">최순태 이사</div>
    <div class="khayah-board-role">카야 대표이사</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">김선우 이사</div>
    <div class="khayah-board-role">카야 상임이사</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">김경휘 이사</div>
    <div class="khayah-board-role">전주예수대 사회복지학과 교수</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">이재혁 이사</div>
    <div class="khayah-board-role">성남시의료원 가정의학과 전문의</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">이필우 이사</div>
    <div class="khayah-board-role">법무법인 강남 변호사</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">Stephan Hyosik Rhee 이사</div>
    <div class="khayah-board-role">Leeway Global Network, Inc. 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">홍민 감사</div>
    <div class="khayah-board-role">법률사무소 에스제이파트너스 변호사</div>
  </div>
  <div class="khayah-board-cell khayah-board-cell--empty" aria-hidden="true"></div>
</div>
`.trim()

const KHAYAH_EXPERTS_GRID_HTML = `
<div class="khayah-board-grid" role="list">
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">최윤석 전문위원</div>
    <div class="khayah-board-role">매표화학 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">황남기 전문위원</div>
    <div class="khayah-board-role">(주)합격캠프 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">이재운 전문위원</div>
    <div class="khayah-board-role">홍콩 중문대학교 법학과 교수</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">오나영 전문위원</div>
    <div class="khayah-board-role">ONA Creation 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">김찬민 전문위원</div>
    <div class="khayah-board-role">성균관대학교 통계학과 교수</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">노형우 전문위원</div>
    <div class="khayah-board-role">(주)코아스 사장</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">이진영 전문위원</div>
    <div class="khayah-board-role">(주)The Organic 디오 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">고현학 전문위원</div>
    <div class="khayah-board-role">신한라이프 신강남지점 지점장</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">정영미 전문위원</div>
    <div class="khayah-board-role">준오헤어 미금지점 원장</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">박래형 전문위원</div>
    <div class="khayah-board-role">노무라종합연구소 뉴욕 지부 컨설팅 부문 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">나용범 전문위원</div>
    <div class="khayah-board-role">(주)한국C&amp;S 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">김창현 전문위원</div>
    <div class="khayah-board-role">AA Studio 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name">김은수 전문위원</div>
    <div class="khayah-board-role">Child Fund International Research &amp; Learning Senior Advisor</div>
  </div>
  <div class="khayah-board-cell khayah-board-cell--empty" aria-hidden="true"></div>
</div>
`.trim()

/** 허브 탭·단독 페이지 공통: 왼쪽 제목 · 오른쪽 본문 */
export const KHAYAH_ORG_BOARD_MERGED_HTML = `
<div class="khayah-org-board-merged">
  <article class="khayah-split-row" id="org-chart" aria-labelledby="khayah-split-org">
    <h2 id="khayah-split-org" class="khayah-split-row__title">조직도</h2>
    <div class="khayah-split-row__body">
      ${KHAYAH_ORG_CHART_HTML}
    </div>
  </article>
  <article class="khayah-split-row" id="directors" aria-labelledby="khayah-split-directors">
    <h2 id="khayah-split-directors" class="khayah-split-row__title">이사회</h2>
    <div class="khayah-split-row__body">
      ${KHAYAH_DIRECTORS_GRID_HTML}
    </div>
  </article>
  <article class="khayah-split-row" id="experts" aria-labelledby="khayah-split-experts">
    <h2 id="khayah-split-experts" class="khayah-split-row__title">전문위원</h2>
    <div class="khayah-split-row__body">
      ${KHAYAH_EXPERTS_GRID_HTML}
    </div>
  </article>
</div>
`.trim()

/** 기존 단일 페이지용(동일 본문) */
export const KHAYAH_BOARD_PAGE_HTML = KHAYAH_ORG_BOARD_MERGED_HTML
