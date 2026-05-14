import React, { useEffect, useState } from 'react';
import './FeaturedTemples.css';
import fallbackImg from '../assets/images  for home page/center buddisht temple image .jpg';

const MAX_FEATURED = 6;
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80';

const getImage = (temple) =>
  temple.mainImage || temple.imageUrl || temple.images?.[0] || FALLBACK_IMAGE;

const getDesc = (temple) =>
  temple.overview || temple.description || 'A cherished Buddhist temple serving the local community with Dhamma teachings, meditation programs, and cultural events.';

// ── Skeleton loader card ──────────────────────────────────────────
const SkeletonCard = () => (
  <div className="featured__layout featured__skeleton">
    <div className="featured__skeleton-img" />
    <div className="featured__info">
      <div className="featured__skeleton-line featured__skeleton-line--short" />
      <div className="featured__skeleton-line featured__skeleton-line--title" />
      <div className="featured__skeleton-line featured__skeleton-line--mid" />
      <div className="featured__skeleton-line" />
      <div className="featured__skeleton-line" />
      <div className="featured__skeleton-line featured__skeleton-line--short" />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────
const FeaturedTemples = () => {
  const [temples, setTemples]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [current, setCurrent]   = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchTemples() {
      setLoading(true);
      setError('');
      try {
        const res  = await fetch('/api/temples');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load temples');
        if (!ignore) {
          // Take up to MAX_FEATURED published temples
          setTemples((Array.isArray(data) ? data : []).slice(0, MAX_FEATURED));
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchTemples();
    return () => { ignore = true; };
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + temples.length) % temples.length);
  const next = () => setCurrent((c) => (c + 1) % temples.length);

  const t = temples[current] || null;

  return (
    <section className="featured">
      <div className="featured__inner">

        {/* Section header */}
        <div className="featured__header">
          <div className="featured__header-left">
            <p className="featured__label">Directory</p>
            <h2 className="featured__heading">Featured <em>Temples</em></h2>
          </div>
          <div className="featured__header-right">
            <a href="/map" className="featured__view-all">View All on Map →</a>
            {!loading && temples.length > 1 && (
              <div className="featured__arrows">
                <button className="featured__arrow-btn" onClick={prev} aria-label="Previous">‹</button>
                <button className="featured__arrow-btn" onClick={next} aria-label="Next">›</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && <SkeletonCard />}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="featured__error">
            ⚠️ Could not load temples: {error}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && temples.length === 0 && (
          <div className="featured__empty">
            <p>No featured temples to display yet.</p>
            <a href="/map" className="featured__info-cta" style={{ marginTop: '12px' }}>Browse the Map →</a>
          </div>
        )}

        {/* ── Temple card ── */}
        {!loading && !error && t && (
          <div className="featured__layout">
            {/* Left — image */}
            <div className="featured__img-wrap">
              <img
                src={getImage(t)}
                alt={t.name}
                onError={(e) => { e.currentTarget.src = fallbackImg; }}
              />
              <div className="featured__img-overlay" />
              {/* Counter badge */}
              {temples.length > 1 && (
                <span className="featured__counter">
                  {current + 1} / {temples.length}
                </span>
              )}
            </div>

            {/* Right — info */}
            <div className="featured__info">
              <p className="featured__info-state">{t.state}</p>
              <h3 className="featured__info-name">{t.name}</h3>
              {t.address && (
                <p className="featured__info-address">📍 {t.address}</p>
              )}
              {t.chiefMonk && (
                <p className="featured__info-monk">Chief Monk: {t.chiefMonk}</p>
              )}
              <p className="featured__info-desc">{getDesc(t)}</p>
              <a href="/map" className="featured__info-cta">Explore on Map →</a>
            </div>
          </div>
        )}

        {/* Dot indicators */}
        {!loading && temples.length > 1 && (
          <div className="featured__dots">
            {temples.map((_, i) => (
              <button
                key={i}
                className={`featured__dot ${i === current ? 'featured__dot--active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to temple ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedTemples;
