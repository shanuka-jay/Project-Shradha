import React from 'react';
import './HowHelps.css';

const features = [
  {
    icon: (
      // Torii gate / Temple Directory
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="2" y1="6" x2="22" y2="6"/>
        <line x1="4" y1="6" x2="4" y2="20"/>
        <line x1="20" y1="6" x2="20" y2="20"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <line x1="7" y1="10" x2="7" y2="20"/>
        <line x1="17" y1="10" x2="17" y2="20"/>
        <path d="M2 6 Q12 2 22 6"/>
      </svg>
    ),
    title: 'Temple Directory',
    desc: 'A comprehensive database of all 73 Sri Lankan Buddhist temples across the USA — complete with contact details, history, and monk information.',
  },
  {
    icon: (
      // Magnifying glass / Search & Discover
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16.5" y1="16.5" x2="22" y2="22"/>
      </svg>
    ),
    title: 'Search & Discover',
    desc: 'Search temples by name, state, or region. Filter results by tradition or offerings to find exactly what you\'re seeking.',
  },
  {
    icon: (
      // Map pin / Interactive Map
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    title: 'Interactive Map',
    desc: 'A real interactive map with precise temple locations. Navigate, zoom, and explore — get directions with one click.',
  },
  {
    icon: (
      // Scroll / Temple Histories
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6"/>
        <path d="M4 4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
        <line x1="9" y1="14" x2="13" y2="14"/>
      </svg>
    ),
    title: 'Temple Histories',
    desc: 'Read rich historical narratives, founding stories, and cultural significance for every vihara — preserving heritage for future generations.',
  },
  {
    icon: (
      // Calendar / Events & Programs
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Events & Programs',
    desc: 'Discover Dhamma teachings, Poya day programs, meditation retreats, and community events happening at viharas near you.',
  },
  {
    icon: (
      // Plus / Add Your Temple
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    title: 'Add Your Temple',
    desc: 'Know of a temple not yet listed? Submit it through our contact form and help us build the most complete directory of Sri Lankan Buddhism in America.',
  },
];

const HowHelps = () => {
  return (
    <section className="howhelps">
      <div className="howhelps__inner">
        <div className="howhelps__header">
          <h2 className="howhelps__heading">
            How Saddha<em>.org</em> Helps
          </h2>
          {/* Ornamental divider matching the design */}
          <div className="howhelps__divider">
            <span className="howhelps__divider-line" />
            <span className="howhelps__divider-label">What We Offer</span>
            <span className="howhelps__divider-line" />
          </div>
        </div>

        <div className="howhelps__grid">
          {features.map((f, i) => (
            <div key={i} className="howhelps__card">
              <div className="howhelps__icon">{f.icon}</div>
              <h3 className="howhelps__card-title">{f.title}</h3>
              <p className="howhelps__card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default HowHelps;

