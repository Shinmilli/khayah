/**
 * 카야 소개 안의 CI.
 * 임시 사진: [CI 이미지] → /images/logo/khayah_logo.png
 * 드라이브의 CI 이미지가 오면 이 src만 교체한다.
 * 십자가 이미지와 로고 아래 International 글씨는 넣지 않는다.
 */
export const KHAYAH_CI_PAGE_HTML = `
<section id="ci" class="kaya-ci" aria-labelledby="khayah-ci-heading">
  <div class="kaya-wrap">
  <div class="kaya-ci__copy">
    <p class="kaya-kicker">CORPORATE IDENTITY · CI</p>
    <h2 id="khayah-ci-heading" class="kaya-display kaya-display--sub">회복을 담은 이름, <span class="kaya-wine">KHAYAH</span></h2>
    <p class="kaya-ci__lead">카야(KHAYAH)는 부흥과 소생을 뜻하는 히브리어에서 온 이름입니다.<br />로고의 두 모양이 합쳐져 가장 귀한 존재, 인간의 모습을 이룹니다.</p>
    <div class="kaya-ci__formula">
      <div class="kaya-ci__bit">
        <span>둥근 Y자</span>
        <b>만물을 지으신<br />하나님의 손</b>
      </div>
      <span class="kaya-ci__op" aria-hidden="true">+</span>
      <div class="kaya-ci__bit">
        <span>작은 원</span>
        <b>하늘과 땅,<br />곧 지구</b>
      </div>
      <span class="kaya-ci__op" aria-hidden="true">=</span>
      <div class="kaya-ci__bit kaya-ci__bit--result">
        <span>인간</span>
        <b>하나님의 형상대로<br />지음받은 존재</b>
      </div>
    </div>
    <p>하나님께서 그 손으로 아름다운 만물을 지으셨듯, 카야 또한 그 마음으로 세상을 품고자 합니다.</p>
    <p class="kaya-ci__recover">하나님께서 태초에 지으신 모든 것을 보시기에 좋았던 처음의 모습, 곧 <span class="kaya-wine">회복</span>을 추구합니다.</p>
  </div>
  <div class="kaya-ci__card">
    <div class="kaya-ci__mark">
      <img class="kaya-ci__logo" data-k="ci.image" data-k-mode="src" data-k-alt="ci.imageAlt" src="/images/logo/khayah_logo.png" alt="KHAYAH" />
    </div>
    <ol class="kaya-ci__meanings">
      <li><span>01</span><div><b>KHAYAH 영문 표기</b><p>부흥과 소생을 뜻하는 히브리어에서 유래한 이름입니다.</p></div></li>
      <li><span>02</span><div><b>둥근 Y자</b><p>아름다운 만물을 지으신 하나님의 손을 상징합니다.</p></div></li>
      <li><span>03</span><div><b>작은 원</b><p>하나님께서 창조하신 하늘과 땅, 곧 지구를 의미합니다.</p></div></li>
      <li><span>04</span><div><b>인간</b><p>하나님의 형상대로 지음받은 가장 귀한 존재, 인간을 나타냅니다.</p></div></li>
    </ol>
  </div>
  </div>
</section>
`.trim()
