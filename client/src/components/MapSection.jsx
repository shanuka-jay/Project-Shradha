import React from 'react';
import './MapSection.css';

const MapSection = () => {
  return (
    <section className="mapsec">
      <div className="mapsec__inner">
        {/* Tag top-left */}
        <div className="mapsec__tag">
          <span className="mapsec__tag-dot" />
          Saddha Network
        </div>

        {/* Globe centered */}
        <div className="mapsec__globe-outer">
          <div className="mapsec__globe">
            {/* Decorative continent blobs */}
            <svg className="mapsec__globe-map" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="105" cy="120" rx="52" ry="38" fill="#4caf50" opacity="0.55"/>
              <ellipse cx="170" cy="105" rx="34" ry="26" fill="#43a047" opacity="0.5"/>
              <ellipse cx="145" cy="175" rx="42" ry="28" fill="#4caf50" opacity="0.52"/>
              <ellipse cx="220" cy="100" rx="28" ry="22" fill="#388e3c" opacity="0.48"/>
              <ellipse cx="80" cy="165" rx="24" ry="16" fill="#66bb6a" opacity="0.45"/>
              <ellipse cx="240" cy="170" rx="18" ry="14" fill="#43a047" opacity="0.42"/>
              <ellipse cx="60" cy="100" rx="16" ry="12" fill="#81c784" opacity="0.4"/>
            </svg>

            {/* Info panel */}
            <div className="mapsec__panel">
              <div className="mapsec__panel-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <p className="mapsec__panel-title">Interactive Temple Map</p>
              <p className="mapsec__panel-sub">
                Locate the nearest United States Vihara, Meditation center, or monastery near you.
              </p>
              <a href="/map" className="mapsec__panel-btn">Go to Map →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
