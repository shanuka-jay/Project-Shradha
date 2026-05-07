import React from 'react';
import './StatsSection.css';

const TempleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.5">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.5">
    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16"/>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a050" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const stats = [
  { Icon: TempleIcon, value: '17+', label: 'Temples Listed' },
  { Icon: CalendarIcon, value: '1966', label: 'Est. Year' },
  { Icon: MapIcon, value: '15+', label: 'States Covered' },
  { Icon: StarIcon, value: '5+', label: 'Traditions' },
];

const StatsSection = () => {
  return (
    <section className="stats">
      <div className="stats__grid">
        {stats.map(({ Icon, value, label }, i) => (
          <div key={i} className="stats__card">
            <div className="stats__icon-wrap">
              <Icon />
            </div>
            <span className="stats__value">{value}</span>
            <span className="stats__label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
