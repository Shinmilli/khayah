/** 조직도 · 이사회 · 전문위원 (정적 본문, 추후 CMS로 대체 가능) */

export const KHAYAH_ORG_CHART_HTML = `
<div class="khayah-org-chart">
  <p class="khayah-org-chart__lead" data-k="org.lead" data-k-mode="html">카야는 국제개발협력사업, 대외협력홍보, 경영지원의 세 부문이 유기적으로 협력하여 공동의 목표를 실현합니다.<br />이사회는 조직의 주요 의사결정과 책임 있는 운영을 이끌고,<br />전문위원은 분야별 전문지식과 경험을 바탕으로 사업의 전문성을 강화합니다.</p>
  <figure class="khayah-org-chart__figure">
    <img
      class="khayah-org-chart__img"
      data-k="org.image" data-k-mode="src" data-k-alt="org.imageAlt"
      src="/images/about/org-chart.jpg"
      width="1020"
      height="849"
      alt="카야 조직도: 국제개발협력사업, 대외협력홍보, 경영지원 세 부문이 맞물리고, 양옆에 이사회와 전문위원이 함께함"
      decoding="async"
      loading="lazy"
    />
  </figure>
</div>
`.trim()

const KHAYAH_DIRECTORS_GRID_HTML = `
<div class="khayah-board-grid" data-org="directors" role="list">
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>이사</span> 최순태</div>
    <div class="khayah-board-role">카야 대표이사</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>상임이사</span> 김선우</div>
    <div class="khayah-board-role">카야 상임이사</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>이사</span> 김경휘</div>
    <div class="khayah-board-role">전주예수대 사회복지학과 교수</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>이사</span> 이재혁</div>
    <div class="khayah-board-role">성남시의료원 가정의학과 전문의</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>이사</span> 이필우</div>
    <div class="khayah-board-role">법무법인 강남 변호사</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>이사</span> Stephan Hyosik Rhee</div>
    <div class="khayah-board-role">Leeway Global Network, Inc. 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>감사</span> 홍민</div>
    <div class="khayah-board-role">법률사무소 에스제이파트너스 변호사</div>
  </div>
</div>
`.trim()

const KHAYAH_EXPERTS_GRID_HTML = `
<div class="khayah-board-grid" data-org="experts" role="list">
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 정재훈</div>
    <div class="khayah-board-role">인류학박사(교육 인류학), 국제개발협력 컨설턴트</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 임진호</div>
    <div class="khayah-board-role">(전)한국기술교육대학교 개도국기술이전연구소 교수</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 최윤석</div>
    <div class="khayah-board-role">매표화학 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 황남기</div>
    <div class="khayah-board-role">(주)합격캠프 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 이재운</div>
    <div class="khayah-board-role">홍콩 중문대학교 법학과 교수</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 오나영</div>
    <div class="khayah-board-role">ONA Creation 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 김찬민</div>
    <div class="khayah-board-role">성균관대학교 통계학과 교수</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 노형우</div>
    <div class="khayah-board-role">(주)코아스 사장</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 이진영</div>
    <div class="khayah-board-role">(주)The Organic 디오 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 고현학</div>
    <div class="khayah-board-role">신한라이프 신강남지점 지점장</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 정영미</div>
    <div class="khayah-board-role">준오헤어 미금지점 원장</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 박래형</div>
    <div class="khayah-board-role">노무라종합연구소 뉴욕 지부 컨설팅 부문 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 나용범</div>
    <div class="khayah-board-role">(주)한국C&amp;S 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 김창현</div>
    <div class="khayah-board-role">AA Studio 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 변선주</div>
    <div class="khayah-board-role">CINCO PANES 대표</div>
  </div>
  <div class="khayah-board-cell" role="listitem">
    <div class="khayah-board-name"><span>전문위원</span> 김은수</div>
    <div class="khayah-board-role">Child Fund International Research &amp; Learning Senior Advisor</div>
  </div>
</div>
`.trim()

/** 허브 탭·단독 페이지 공통: 왼쪽 제목 · 오른쪽 본문 */
export const KHAYAH_ORG_BOARD_MERGED_HTML = `
<div class="khayah-org-board-merged kaya-org-page">
  <article class="kaya-org" id="org-chart" aria-labelledby="khayah-split-org">
    <p class="kaya-kicker">ORGANIZATION · 조직도</p>
    <h2 id="khayah-split-org" class="kaya-display" data-k="org.title" data-k-mode="html">각자의 전문성이 모여<br /><span class="kaya-wine">하나의 변화를 만듭니다.</span></h2>
    ${KHAYAH_ORG_CHART_HTML}
  </article>
  <article class="kaya-people" id="directors" aria-labelledby="khayah-split-directors">
    <div class="kaya-people__frame">
      <div class="kaya-people__head">
        <p class="kaya-kicker">PEOPLE · 함께하는 사람들</p>
        <h2 id="khayah-split-directors" class="kaya-display kaya-display--sub" data-k="org.peopleTitle" data-k-mode="html">카야의 성장과 변화를 <span class="kaya-wine">함께 만드는 사람들</span></h2>
      </div>
      <div class="kaya-people__panel">
        <section class="kaya-people__group" aria-labelledby="khayah-board-directors">
          <div class="kaya-people__hd">
            <span class="kaya-people__tri" aria-hidden="true"></span>
            <h3 id="khayah-board-directors">이사회</h3>
            <p class="kaya-people__en">BOARD OF DIRECTORS</p>
          </div>
          <div class="kaya-people__vline" aria-hidden="true"></div>
          <div class="kaya-people__rule" aria-hidden="true"></div>
          <div class="kaya-people__dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          ${KHAYAH_DIRECTORS_GRID_HTML}
        </section>
        <section class="kaya-people__group kaya-people__group--experts" id="experts" aria-labelledby="khayah-split-experts">
          <div class="kaya-people__hd">
            <span class="kaya-people__tri" aria-hidden="true"></span>
            <h3 id="khayah-split-experts">전문위원회</h3>
            <p class="kaya-people__en">ADVISORY COMMITTEE</p>
          </div>
          <div class="kaya-people__vline" aria-hidden="true"></div>
          <div class="kaya-people__rule" aria-hidden="true"></div>
          <div class="kaya-people__dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          ${KHAYAH_EXPERTS_GRID_HTML}
        </section>
      </div>
    </div>
  </article>
</div>
`.trim()

/** 기존 단일 페이지용(동일 본문) */
export const KHAYAH_BOARD_PAGE_HTML = KHAYAH_ORG_BOARD_MERGED_HTML
