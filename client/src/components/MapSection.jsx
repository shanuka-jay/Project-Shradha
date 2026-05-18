import React from 'react';
import './MapSection.css';
import globeImg from '../assets/Interactive Map Preview.png';

const MapSection = () => {
  return (
    <section className="mapsec">
      <div className="mapsec__inner">

        {/* Tag top-left info card */}
        <div className="mapsec__tag">
          <div className="mapsec__tag-header">
            <div className="mapsec__tag-dot" />
            <span className="mapsec__tag-name">Saddha.org Network</span>
          </div>
          <p className="mapsec__tag-sub">Sri Lankan Buddhist Viharas • USA</p>
          <a href="/map" className="mapsec__tag-livebtn">
            <span className="mapsec__tag-livebtn-dot" />
            Live Map
          </a>
        </div>

        {/* Globe — image displayed as-is, no circular crop */}
        <div className="mapsec__globe-outer">
          <div className="mapsec__globe">
            {/* Full uncropped globe image */}
            <img
              src={globeImg}
              alt="Interactive Map Globe"
              className="mapsec__globe-img"
            />

            {/* Info panel overlaid at center of globe */}
            <div className="mapsec__panel">
              <div className="mapsec__panel-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="mapsec__panel-title">Interactive Temple Map</p>
              <p className="mapsec__panel-sub">
                Locate the nearest United States Vihara, meditation center, or monastery near you.
              </p>
              <a href="/map" className="mapsec__panel-btn">Open Full Map</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MapSection;
