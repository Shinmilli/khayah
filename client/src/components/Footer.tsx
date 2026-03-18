import { Link } from 'react-router-dom'
import { FOOTER } from '../constants'

function SupportText() {
  const lines = FOOTER.supportText.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function ContactText() {
  const lines = FOOTER.contactText.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

export function Footer() {
  return (
    <footer id="Footer" className="clearfix">
      <div className="widgets_wrapper">
        <div className="container">
          <div className="column one-fourth">
            <div className="widget widget_text">
              <h4>{FOOTER.shortcutTitle}</h4>
              <ul className="footer-links" style={{ lineHeight: '32px' }}>
                <li><Link to="/카야/카야소개">카야소개</Link></li>
                <li><Link to="/후원가이드/후원자-가이드">후원자 가이드</Link></li>
                <li><Link to="/소식">소식/자료</Link></li>
              </ul>
            </div>
          </div>
          <div className="column one-fourth">
            <div className="widget widget_text">
              <h4>{FOOTER.supportTitle}</h4>
              <div className="textwidget">
                <SupportText />
              </div>
            </div>
          </div>
          <div className="column one-fourth">
            <div className="widget widget_text">
              <h4>{FOOTER.contactTitle}</h4>
              <div className="textwidget">
                <ContactText />
              </div>
            </div>
          </div>
          <div className="column one-fourth">
            <div className="widget widget_text">
              <h4>바로가기</h4>
              <ul className="footer-links">
                <li><Link to="/해외사업">해외사업</Link></li>
                <li><Link to="/국내사업">국내사업</Link></li>
                <li><Link to="/해외사업/교육">교육</Link></li>
                <li><Link to="/해외사업/보건의료">보건의료</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_copy">
        <div className="container">
          <div className="column one">
            <a
              id="back_to_top"
              className="button button_left button_js"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <span className="button_icon" aria-hidden>↑</span>
            </a>
            <div className="copyright">
              © {new Date().getFullYear()} 사단법인 카야 인터내셔널. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
