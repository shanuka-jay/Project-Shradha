import React from 'react';
import './AboutSection.css';
import img1 from '../assets/images  for home page/about saddha fisrt image.jpg';
import img2 from '../assets/images  for home page/center buddisht temple image .jpg';

const AboutSection = () => {
  return (
    <section className="about">
      <div className="about__inner">
        {/* Left - Text content */}
        <div className="about__card">
          <p className="about__label"><span className="about__label-dash">—</span> About Saddha</p>
          <h2 className="about__heading">
            Preserving <em>Dhamma</em><br />Across America
          </h2>
          <p className="about__body">
            Saddha.org is a sacred directory connecting Sri Lankan Buddhist communities across all 50 states of the USA. Founded by Ven. Manthreethenne Saddhaloka Thero, we document the history, contact details, and locations of every temple.
          </p>
          <p className="about__body about__body--2">
            Whether you are a devotee seeking your nearest temple or a researcher exploring Sri Lankan Buddhism in the diaspora, this platform serves as your guide.
          </p>

          <div className="about__features">
            <div className="about__feature">
              <span className="about__feature-num">01</span>
              <div>
                <p className="about__feature-title">Interactive USA Map</p>
                <p className="about__feature-desc">Click any state to view all Sri Lankan Buddhist temples in that region.</p>
              </div>
            </div>
            <div className="about__feature">
              <span className="about__feature-num">02</span>
              <div>
                <p className="about__feature-title">Temple Histories & Details</p>
                <p className="about__feature-desc">Full information including founding story, chief monk, address, and contact details.</p>
              </div>
            </div>
            <div className="about__feature">
              <span className="about__feature-num">03</span>
              <div>
                <p className="about__feature-title">Community Connection</p>
                <p className="about__feature-desc">Find monks, events, Dhamma schools, and meditation programs near you.</p>
              </div>
            </div>
          </div>

          <a href="/about" className="about__cta">Read Our Story →</a>
        </div>

        {/* Right - 2x2 Image mosaic grid */}
        <div className="about__images">
          <div className="about__img about__img--1">
            <img src={img1} alt="Buddhist monks in temple" />
          </div>
          <div className="about__img about__img--2">
            <img src={img2} alt="Buddhist temple exterior" />
          </div>
          <div className="about__img about__img--3">
            <img src={img2} alt="Buddhist meditation ceremony" />
          </div>
          <div className="about__img about__img--4">
            <img src={img1} alt="Temple interior with golden light" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
