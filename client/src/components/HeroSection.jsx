import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      {/* Background image */}
      <div className="hero__bg" />

      {/* Overlay gradient */}
      <div className="hero__overlay" />

      {/* Social sidebar */}
      <div className="hero__socials">
        <a href="#" className="hero__social-link" aria-label="Facebook">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        <a href="#" className="hero__social-link" aria-label="Instagram">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>
        <a href="#" className="hero__social-link" aria-label="YouTube">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
          </svg>
        </a>
      </div>

      {/* Main hero content */}
      <div className="hero__content">
        <div className="hero__text">
          <p className="hero__pretitle">
            <span className="hero__pretitle-line" />
            Sri Lankan Buddhist Temples · USA
          </p>
          <h1 className="hero__heading">
            Discover<br />
            <span className="hero__heading--italic">Sacred</span><br />
            Temples
          </h1>
          <p className="hero__body">
            Explore 73+ Sri Lankan Buddhist temples across the<br />
            United States. Find your nearest temple, learn its history,<br />
            and connect with the Dhamma community near you.
          </p>
          <div className="hero__buttons">
            <a href="/map" className="hero__btn hero__btn--primary">Explore the Map →</a>
            <a href="/about" className="hero__btn hero__btn--outline">Learn More</a>
          </div>
        </div>
      </div>

      {/* Right arrow */}
      <button className="hero__arrow" aria-label="Next slide">›</button>

      {/* Scroll hint */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>SCROLL</span>
      </div>

      {/* Featured panel - bottom right */}
      <div className="hero__featured">
        <p className="hero__featured-label">Featured</p>
        <ul className="hero__featured-list">
          <li className="hero__featured-item hero__featured-item--active">
            <span className="hero__featured-dot" />
            <span className="hero__featured-name">Washington Buddhist Vihara</span>
            <span className="hero__featured-state">DC</span>
          </li>
          <li className="hero__featured-item">
            <span className="hero__featured-dot" />
            <span className="hero__featured-name">Blue Lotus Buddhist Temple</span>
            <span className="hero__featured-state">IL</span>
          </li>
          <li className="hero__featured-item">
            <span className="hero__featured-dot" />
            <span className="hero__featured-name">Dharma Vijaya Buddhist Vihara</span>
            <span className="hero__featured-state">CA</span>
          </li>
          <li className="hero__featured-item">
            <span className="hero__featured-dot" />
            <span className="hero__featured-name">Georgia Buddhist Vihara</span>
            <span className="hero__featured-state">GA</span>
          </li>
          <li className="hero__featured-item">
            <span className="hero__featured-dot" />
            <span className="hero__featured-name">Great Lakes Buddhist Vihara</span>
            <span className="hero__featured-state">MI</span>
          </li>
        </ul>
      </div>

      {/* Region tabs - bottom left */}
      <div className="hero__tabs">
        <button className="hero__tab hero__tab--active">All States</button>
        <button className="hero__tab">East Coast</button>
        <button className="hero__tab">West Coast</button>
        <button className="hero__tab">Midwest</button>
        <button className="hero__tab">South</button>
      </div>
    </section>
  );
};

export default HeroSection;
