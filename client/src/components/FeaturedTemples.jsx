import React, { useState } from 'react';
import './FeaturedTemples.css';
import templeImg from '../assets/images  for home page/center buddisht temple image .jpg';

const temples = [
  {
    name: 'Dharma Vijaya Buddhist Vihara',
    state: 'California',
    address: '1847 Crenshaw Blvd, Los Angeles, CA 90019',
    desc: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    img: templeImg,
  },
  {
    name: 'Washington Buddhist Vihara',
    state: 'Washington DC',
    address: '5017 16th Street NW, Washington, DC 20011',
    desc: 'The Washington Buddhist Vihara is one of the oldest Sri Lankan Buddhist temples in the United States, founded in 1966.',
    img: templeImg,
  },
  {
    name: 'Blue Lotus Buddhist Temple',
    state: 'Illinois',
    address: '221 Dean Street, Woodstock, IL 60098',
    desc: 'Blue Lotus Buddhist Temple offers a peaceful environment for meditation and learning Buddhist teachings in the Midwest.',
    img: templeImg,
  },
];

const FeaturedTemples = () => {
  const [current, setCurrent] = useState(0);
  const t = temples[current];

  return (
    <section className="featured">
      <div className="featured__inner">
        {/* Header */}
        <div className="featured__header">
          <div>
            <p className="featured__label">Directory</p>
            <h2 className="featured__heading">Featured <em>Temples</em></h2>
          </div>
          <div className="featured__header-right">
            <a href="/map" className="featured__view-all">View All on Map →</a>
            <div className="featured__arrows">
              <button
                className="featured__arrow-btn"
                onClick={() => setCurrent((c) => (c - 1 + temples.length) % temples.length)}
                aria-label="Previous"
              >‹</button>
              <button
                className="featured__arrow-btn"
                onClick={() => setCurrent((c) => (c + 1) % temples.length)}
                aria-label="Next"
              >›</button>
            </div>
          </div>
        </div>

        {/* Temple card */}
        <div className="featured__card">
          {/* Left - image */}
          <div className="featured__card-img">
            <img src={t.img} alt={t.name} />
          </div>

          {/* Right - details */}
          <div className="featured__card-info">
            <p className="featured__card-state">{t.state}</p>
            <h3 className="featured__card-name">{t.name}</h3>
            <p className="featured__card-address">{t.address}</p>
            <p className="featured__card-desc">{t.desc}</p>
            <a href="/map" className="featured__card-cta">Explore on Map →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTemples;
