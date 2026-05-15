import React from 'react';
import './AboutSection.css';
import img1 from '../assets/images  for home page/about saddha fisrt image.jpg';
import img2 from '../assets/images  for home page/center buddisht temple image .jpg';

const AboutSection = () => {
  return (
    <div className="s">
      <div className="c">
        <div className="inner">
          <div className="card">
            <p className="lbl"><span className="lbl-line"></span>About Saddha</p>
            <h2 className="h">Preserving <em>Dhamma</em><br />Across America</h2>
            <p className="body">Saddha.org is a sacred directory connecting Sri Lankan Buddhist communities across all 50 states of the USA. Founded by Ven. Manthreethenne Saddhaloka Thero, we document the history, contact details, and locations of every temple.</p>
            <p className="body body2">Whether you are a devotee seeking your nearest temple or a researcher exploring Sri Lankan Buddhism in the diaspora, this platform serves as your guide.</p>
            <div className="feats">
              <div className="feat"><span className="num">01</span><div><p className="ft">Interactive USA Map</p><p className="fd">Click any state to view all Sri Lankan Buddhist temples in that region.</p></div></div>
              <div className="feat"><span className="num">02</span><div><p className="ft">Temple Histories &amp; Details</p><p className="fd">Full information including founding story, chief monk, address, and contact details.</p></div></div>
              <div className="feat"><span className="num">03</span><div><p className="ft">Community Connection</p><p className="fd">Find monks, events, Dhamma schools, and meditation programs near you.</p></div></div>
            </div>
            <a className="cta" href="#">Read Our Story →</a>
          </div>
          <div className="imgs">
            <div className="col">
              <div className="img lt">
                <img src={img1} alt="Temple" referrerPolicy="no-referrer" />
              </div>
              <div className="img lb">
                <img src={img2} alt="Lotus" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="col">
              <div className="img rt">
                <img src={img2} alt="Details" referrerPolicy="no-referrer" />
              </div>
              <div className="img rb">
                <img src={img1} alt="Candle" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
