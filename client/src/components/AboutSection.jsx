import React from 'react';
import './AboutSection.css';
import img1 from '../assets/images  for home page/about saddha fisrt image.jpg';
import img2 from '../assets/images  for home page/center buddisht temple image .jpg';

const AboutSection = () => {
  return (
    <section className="about">
      <div className="about__inner">
        {/* Left - Text */}
        <div className="about__text">
          <p className="about__label">About Saddha</p>
          <h2 className="about__heading">
            Preserving <em>Dhamma</em><br />Across America
          </h2>
          <p className="about__body">
            Saddha.org is a sacred directory connecting Sri Lankan Buddhist communities across all 50 states of the USA. Founded by Ven. Manthreethenne Saddhitha Thero, we document the history, contact details, and locations of every temple.
          </p>
          <p className="about__body about__body--secondary">
            Whether you are a devotee seeking your nearest temple or a researcher exploring Sri Lankan Buddhism in the diaspora, this platform serves as your guide.
          </p>

          <div className="about__features">
            <div className="about__feature">
              <div className="about__feature-dot" />
              <div>
                <p className="about__feature-title">Interactive USA Map</p>
                <p className="about__feature-desc">Click on any state to see all Sri Lankan Buddhist temples in that region.</p>
              </div>
            </div>
            <div className="about__feature">
              <div className="about__feature-dot" />
              <div>
                <p className="about__feature-title">Temple Histories &amp; Details</p>
                <p className="about__feature-desc">Full information including founding story, chief monk, address, and contact details.</p>
              </div>
            </div>
            <div className="about__feature">
              <div className="about__feature-dot" />
              <div>
                <p className="about__feature-title">Community Connection</p>
                <p className="about__feature-desc">Find events, classes, Dhamma programs, and meditation programs near you.</p>
              </div>
            </div>
          </div>

          <a href="/about" className="about__cta">Read Our Story →</a>
        </div>

        {/* Right - Images grid */}
        <div className="about__images">
          <div className="about__img-top">
            <img src={img1} alt="Buddhist monks in meditation" />
          </div>
          <div className="about__img-bottom">
            <img src={img2} alt="Buddhist temple interior" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
