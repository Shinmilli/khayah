import { Link } from 'react-router-dom'

/** 카야 소개 / 카야 후원하기 호버 박스 (mfn hover_color) */
export function HomeHoverBoxes() {
  return (
    <section className="section equal-height no-margin-h">
      <div className="section_wrapper clearfix">
        <div className="items_group">
          <div className="column one-second column_hover_color">
            <div className="hover_color hover_color_wrapper">
              <div className="hover_color_bg" style={{ backgroundColor: '#727272' }} />
              <div className="hover_color_content">
                <h3 className="white nomargin">카야 소개</h3>
                <h4 className="white nomargin">About Khayah</h4>
                <Link to="/카야/카야소개" className="button btn_border">
                  <span className="button_label">자세히 보기</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="column one-second column_hover_color">
            <div className="hover_color hover_color_wrapper khayahRed">
              <div className="hover_color_bg" style={{ backgroundColor: '#b20838' }} />
              <div className="hover_color_content">
                <h3 className="white nomargin">카야 후원하기</h3>
                <h4 className="white nomargin">Sponsor Khayah</h4>
                <Link to="/후원가이드/후원자-가이드" className="button btn_border">
                  <span className="button_label">자세히 보기</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 사람을 키우고 섬기는 개발 NGO 헤딩 섹션 */
export function HomeHeading() {
  return (
    <section className="section">
      <div className="section_wrapper clearfix">
        <div className="column one column_fancy_heading">
          <h2>사람을 키우고 섬기는 개발 NGO</h2>
          <h3>Development NGO raising and serving people</h3>
          <div className="image_frame">
            <img
              src="/images/home_charity2_sep1.png"
              alt=""
              className="hr_img"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/** 국내사업 / 해외사업 포토박스 (mfn photo_box) */
export function HomePhotoBoxes() {
  const items = [
    {
      img: '/images/domestic.png',
      title: '국내사업',
      sub: 'Domestic Services',
      desc: '우리 옆에 있지만 소외된 이웃과 함께합니다.',
      link: '/국내사업',
    },
    {
      img: '/images/overseas.png',
      title: '해외사업',
      sub: 'Overseas Services',
      desc: '네팔, 미얀마, 키르기스스탄 등에서 개발협력 사업을 진행합니다.',
      link: '/해외사업',
    },
  ]

  return (
    <section className="section">
      <div className="section_wrapper clearfix">
        <div className="items_group">
          {items.map((item) => (
            <div key={item.link} className="column one-half column_photo_box">
              <div className="photo_box">
                <div className="image_frame">
                  <div className="image_wrapper">
                    <img src={item.img} alt={item.title} />
                  </div>
                </div>
                <div className="desc_wrapper">
                  <h3>{item.title}</h3>
                  <h4>{item.sub}</h4>
                  <p>{item.desc}</p>
                  <Link to={item.link} className="button">
                    <span className="button_label">자세히 보기</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
