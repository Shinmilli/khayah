import { Link } from 'react-router-dom'
import { HOME_ACTION_BOXES } from '../homeData'

export function ActionBoxesSection() {
  return (
    <section className="section equal-height no-margin-h">
      <div className="section_wrapper clearfix">
        <div className="items_group">
          {HOME_ACTION_BOXES.map((box) => (
            <div key={box.link} className="column one-second column_hover_color">
              <div className={`hover_color hover_color_wrapper${box.emphasis ? ' khayahRed' : ''}`}>
                <div className="hover_color_bg" style={{ backgroundColor: box.backgroundColor }} />
                <div className="hover_color_content">
                  <h3 className="white nomargin">{box.title}</h3>
                  <h4 className="white nomargin">{box.subtitle}</h4>
                  <Link to={box.link} className="button btn_border">
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
