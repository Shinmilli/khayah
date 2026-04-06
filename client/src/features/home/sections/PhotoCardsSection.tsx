import { Link } from 'react-router-dom'
import { HOME_PHOTO_CARDS } from '../homeData'

export function PhotoCardsSection() {
  return (
    <section className="section">
      <div className="section_wrapper clearfix">
        <div className="items_group">
          {HOME_PHOTO_CARDS.map((item) => (
            <div key={item.link} className="column one-half column_photo_box">
              <div className="photo_box">
                <div className="image_frame">
                  <div className="image_wrapper">
                    <img src={item.img} alt={item.title} />
                  </div>
                </div>
                <div className="desc_wrapper">
                  <h3>{item.title}</h3>
                  <h4>{item.subtitle}</h4>
                  <p>{item.description}</p>
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
