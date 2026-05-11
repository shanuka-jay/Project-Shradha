import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">Sadd<span>ha</span>.org</Link>
          <p className="footer-desc">A sacred digital directory of Sri Lankan<br/>Buddhist Temples across the United<br/>States.</p>
        </div>
        <div className="footer-col">
          <h4>PAGES</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/map">Temple Map</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>REGIONS</h4>
          <ul>
            <li><a href="#">East Coast</a></li>
            <li><a href="#">West Coast</a></li>
            <li><a href="#">Midwest</a></li>
            <li><a href="#">South</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>CONTACT</h4>
          <ul>
            <li><a href="mailto:saddha.usa@gmail.com">saddha.usa@gmail.com</a></li>
            <li>+1 240 351 1765</li>
            <li>Washington DC, USA</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Saddha.org — All Rights Reserved</p>
        <p>Designed & Built by Fuchsius</p>
      </div>
    </footer>
  )
}

export default Footer
