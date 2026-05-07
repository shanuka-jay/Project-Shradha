import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Logo & tagline */}
        <div className="footer__brand">
          <p className="footer__logo">Sadd<span>ha</span>.org</p>
          <p className="footer__tagline">
            A sacred directory of Sri Lankan Buddhist Temples across the United States, preserving Dhamma and community across the nation.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link">f</a>
            <a href="#" className="footer__social-link">in</a>
            <a href="#" className="footer__social-link">yt</a>
          </div>
        </div>

        {/* Pages */}
        <div className="footer__col">
          <p className="footer__col-title">Pages</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/map">Temple Map</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Regions */}
        <div className="footer__col">
          <p className="footer__col-title">Regions</p>
          <ul>
            <li><a href="#">East Coast</a></li>
            <li><a href="#">West Coast</a></li>
            <li><a href="#">Midwest</a></li>
            <li><a href="#">South</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <p className="footer__col-title">Contact</p>
          <ul>
            <li>saddha.usa@gmail.com</li>
            <li>+1 240 351 1765</li>
            <li>Washington DC, USA</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Saddha.org — All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
