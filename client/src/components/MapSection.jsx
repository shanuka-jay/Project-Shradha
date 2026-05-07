import React from 'react';
import './MapSection.css';

const MapSection = () => {
  return (
    <section className="map-sec">
      <div className="map-sec__inner">
        {/* Left: globe visual */}
        <div className="map-sec__globe-wrap">
          <div className="map-sec__tag">
            <span className="map-sec__tag-dot" />
            Saddha Network
          </div>
          <div className="map-sec__globe">
            <div className="map-sec__globe-bg" />
            <div className="map-sec__globe-panel">
              <p className="map-sec__globe-title">Interactive Temple Map</p>
              <p className="map-sec__globe-sub">
                Locate the nearest United States Vihara, Meditation center, or monastery near you.
              </p>
              <a href="/map" className="map-sec__globe-btn">Go to Map →</a>
            </div>
          </div>
        </div>

        {/* Right: text */}
        <div className="map-sec__text">
          <p className="map-sec__label">Interactive Map</p>
          <h2 className="map-sec__heading">
            Explore Temples<br />
            Across <em>America</em>
          </h2>
          <p className="map-sec__body">
            Our interactive USA map lets you explore Sri Lankan Buddhist temples by state. Click on any region to see temples, their contact info, and directions.
          </p>
          <a href="/map" className="map-sec__cta">Open Full Map →</a>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
