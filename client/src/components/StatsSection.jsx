import React from 'react';
import './StatsSection.css';

const stats = [
  { icon: '🏛', value: '17+', label: 'Temples Listed' },
  { icon: '📅', value: '1966', label: 'Est. Year' },
  { icon: '🗺', value: '15+', label: 'States Covered' },
  { icon: '✦', value: '5+', label: 'Traditions' },
];

const StatsSection = () => {
  return (
    <section className="stats">
      <div className="stats__grid">
        {stats.map((s, i) => (
          <div key={i} className="stats__card">
            <span className="stats__icon">{s.icon}</span>
            <span className="stats__value">{s.value}</span>
            <span className="stats__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
