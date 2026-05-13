import React from 'react';
import './HowHelps.css';

const features = [
  {
    icon: '🏛',
    title: 'Temple Directory',
    desc: 'A comprehensive database of Sri Lankan Buddhist temples across all 50 states, with history, photos, and information.'
  },
  {
    icon: '🔍',
    title: 'Search & Discover',
    desc: 'Search temples by name, state, or region. Filter results to find exactly what you\'re looking for.'
  },
  {
    icon: '🗺',
    title: 'Interactive Map',
    desc: 'A real-time map with precise temple locations. Zoom in anywhere and find temples, centers, and monasteries.'
  },
  {
    icon: '📖',
    title: 'Temple Histories',
    desc: 'Each temple has a dedicated page with its founding story, chief monk, address, and all contact details.'
  },
  {
    icon: '🎉',
    title: 'Events & Programs',
    desc: 'Stay informed about upcoming Dhamma talks, meditation retreats, religious holidays, and community events.'
  },
  {
    icon: '✚',
    title: 'Add Your Temple',
    desc: 'Temple administrators can submit missing temples for inclusion, helping the Sri Lankan Buddhist community grow.'
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
          <p className="howhelps__sub">Sri Lanka's Buddhist heritage, across the United States.</p>
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
