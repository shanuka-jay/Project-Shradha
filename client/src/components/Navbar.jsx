import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          Sadd<span>ha</span>.org
        </Link>
        
        {/* Hamburger Icon */}
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>HOME</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>ABOUT</Link></li>
            <li><Link to="/map" className={location.pathname === '/map' ? 'active' : ''} onClick={closeMenu}>MAP</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>CONTACT</Link></li>
          </ul>
          <Link to="/map" className="btn-explore" onClick={closeMenu}>EXPLORE MAP</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
