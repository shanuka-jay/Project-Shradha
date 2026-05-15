import React from 'react';
import './QuoteBanner.css';

const QuoteBanner = () => {
  return (
    <section className="quote">
      <div className="quote__inner">
        <blockquote className="quote__text">
          "The Dhamma is not bound by borders — it belongs to all<br />
          who seek the path to liberation."
        </blockquote>
        <div className="quote__divider" />
        <p className="quote__author">Ven. Manthreethenne Saddhitha Thero</p>
        <p className="quote__role">Founder, Saddha.org · Washington DC</p>
        <div className="quote__dots">
          <span className="quote__dot quote__dot--active" />
          <span className="quote__dot" />
          <span className="quote__dot" />
        </div>
      </div>
    </section>
  );
};

export default QuoteBanner;
