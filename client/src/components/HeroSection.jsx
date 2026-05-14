import React, { useEffect, useRef, useState } from 'react';
import './HeroSection.css';

// Region → state abbreviation mapping
const REGION_STATES = {
  'East Coast': ['ME','NH','VT','MA','RI','CT','NY','NJ','DE','MD','DC','VA','NC','SC','GA','FL'],
  'West Coast': ['WA','OR','CA','AK','HI'],
  'Midwest':    ['OH','IN','IL','MI','WI','MN','IA','MO','ND','SD','NE','KS'],
  'South':      ['TX','OK','AR','LA','MS','AL','TN','KY','WV'],
};

// Full state name → abbreviation
const STATE_ABBR = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','District of Columbia':'DC',
  'Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL',
  'Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA',
  'Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN',
  'Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV',
  'New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY',
  'North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR',
  'Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',
  'Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA',
  'Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
  // allow DC variants
  'DC':'DC','D.C.':'DC','Washington DC':'DC','Washington D.C.':'DC',
};

const toAbbr = (state = '') => STATE_ABBR[state] || state.slice(0, 2).toUpperCase();

const TABS = ['All States', 'East Coast', 'West Coast', 'Midwest', 'South'];
const PANEL_LIMIT = 6;   // max items in featured panel
const TICK_MS = 2500;    // auto-rotate interval

const HeroSection = () => {
  const [temples, setTemples]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeRegion, setActiveRegion] = useState('All States');
  const [activeIdx, setActiveIdx]   = useState(0);
  const timerRef = useRef(null);

  // ── Fetch temples once ───────────────────────────────────────────
  useEffect(() => {
    let ignore = false;
    fetch('/api/temples')
      .then((r) => r.json())
      .then((data) => {
        if (!ignore && Array.isArray(data)) setTemples(data);
      })
      .catch(() => {})   // silently fail — hero still renders without the list
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  // ── Filter temples by selected region tab ────────────────────────
  const filteredTemples = (() => {
    if (activeRegion === 'All States') return temples.slice(0, PANEL_LIMIT);
    const abbrs = REGION_STATES[activeRegion] || [];
    return temples
      .filter((t) => abbrs.includes(toAbbr(t.state)))
      .slice(0, PANEL_LIMIT);
  })();

  // ── Auto-rotate active item ──────────────────────────────────────
  useEffect(() => {
    if (filteredTemples.length === 0) return;
    // Reset index when filter changes
    setActiveIdx(0);
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % filteredTemples.length);
    }, TICK_MS);
    return () => clearInterval(timerRef.current);
  }, [filteredTemples.length, activeRegion]);

  const handleTabClick = (tab) => {
    setActiveRegion(tab);
    setActiveIdx(0);
  };

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
          {loading && (
            // Skeleton rows while loading
            Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="hero__featured-item hero__featured-item--skeleton">
                <span className="hero__featured-dot" />
                <span className="hero__featured-name hero__featured-skeleton-text" />
                <span className="hero__featured-state hero__featured-skeleton-abbr" />
              </li>
            ))
          )}

          {!loading && filteredTemples.length === 0 && (
            <li className="hero__featured-item">
              <span className="hero__featured-name" style={{ opacity: 0.5 }}>
                No temples in this region
              </span>
            </li>
          )}

          {!loading && filteredTemples.map((temple, i) => (
            <li
              key={temple.id}
              className={`hero__featured-item ${i === activeIdx ? 'hero__featured-item--active' : ''}`}
              onClick={() => setActiveIdx(i)}
              style={{ cursor: 'pointer' }}
            >
              <span className="hero__featured-dot" />
              <span className="hero__featured-name">{temple.name}</span>
              <span className="hero__featured-state">{toAbbr(temple.state)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Region tabs - bottom left */}
      <div className="hero__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`hero__tab ${activeRegion === tab ? 'hero__tab--active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
