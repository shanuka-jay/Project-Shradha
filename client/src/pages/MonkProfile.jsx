import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import './MonkProfile.css';

const Icon = ({ name, size = 18, color = 'currentColor' }) => {
  const icons = {
    user: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    ),
    link: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M3.9 12c0-1.7 1.4-3.1 3.1-3.1h4V7H7C4.2 7 2 9.2 2 12s2.2 5 5 5h4v-1.9H7c-1.7 0-3.1-1.4-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1h-4V17h4c2.8 0 5-2.2 5-5s-2.2-5-5-5z"/>
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    ),
    temple: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      </svg>
    ),
    share: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M18 16.1c-.8 0-1.4.3-1.9.8L8.9 12.7c.1-.2.1-.5.1-.7s0-.5-.1-.7l7.1-4.2c.5.5 1.2.9 2 .9 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .2 0 .5.1.7L7.9 9.9C7.4 9.4 6.7 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.7 0 1.4-.3 1.9-.8l7.2 4.2c-.1.2-.1.4-.1.6 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9-1.2-2.9-2.8-2.9z"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.4 4.1 12 4.1 12 4.1s-4.4 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9C6.8 18 12 18 12 18s4.4 0 6.7-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.2-.2-3.2zM9.7 14V9.6l5.7 2.2L9.7 14z"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5v-1.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/>
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 17.9c-3.9-.5-7-3.8-7-7.9 0-.6.1-1.2.2-1.8L9 15v1c0 1.1.9 2 2 2v1.9zm6.9-2.5c-.3-.8-1-1.4-1.9-1.4h-1v-3c0-.6-.4-1-1-1H8v-2h2c.6 0 1-.4 1-1V7h2c1.1 0 2-.9 2-2v-.4c2.9 1.2 5 4.1 5 7.4 0 2.1-.8 4-2.1 5.4z"/>
      </svg>
    ),
    wikipedia: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12.09 13.33l-1.78-4.5L8.5 13.5H7l2.5-6.5h1.2l1.8 4.6 1.8-4.6h1.2L18 13.5h-1.5l-1.8-4.67-1.72 4.5h-.89zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
      </svg>
    ),
    back: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

const MonkProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const [monk, setMonk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Admin preview banner ──────────────────────────────────────────────────
  // When admin clicks "View Page", the URL includes ?preview=admin
  // This shows a banner at the top so admin can get back easily
  const isAdminPreview = searchParams.get('preview') === 'admin';
  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5173';

  function handleBackToAdmin() {
    // Try to close the tab (works if it was opened by window.open)
    // Falls back to navigating directly to the admin monks page
    window.close();
    setTimeout(() => {
      window.location.href = `${adminUrl}/monks`;
    }, 300);
  }
  // ─────────────────────────────────────────────────────────────────────────

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => observer.observe(el));
    return () => revealRefs.current.forEach((el) => observer.unobserve(el));
  }, [monk]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/monks/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Monk not found');
        return r.json();
      })
      .then((data) => setMonk(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const social = monk?.socialLinks
    ? typeof monk.socialLinks === 'string'
      ? JSON.parse(monk.socialLinks)
      : monk.socialLinks
    : {};

  if (loading) {
    return (
      <div className="monk-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile…</p>
      </div>
    );
  }

  if (error || !monk) {
    return (
      <div className="monk-error">
        <h2>Profile Not Found</h2>
        <p>{error || 'This monk profile does not exist or has been removed.'}</p>
        <button className="btn-back-inline" onClick={() => navigate('/about')}>← Back to About</button>
      </div>
    );
  }

  const displayName = monk.displayName || monk.legalName;
  const languages = Array.isArray(monk.languages) ? monk.languages.join(' • ') : (monk.languages || '');

  return (
    <div className="profile-page">

      {/* ── ADMIN PREVIEW BANNER ─────────────────────────────────────────── */}
      {/* Only visible when opened from admin via ?preview=admin in URL      */}
      {isAdminPreview && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          background: '#1e293b',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1.5rem',
          fontSize: '0.82rem',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          gap: '1rem',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>👁</span>
            Admin Preview — this is how the public sees this page
          </span>
          <button
            onClick={handleBackToAdmin}
            style={{
              background: '#f59e0b',
              color: '#1c1917',
              border: 'none',
              borderRadius: '6px',
              padding: '0.38rem 1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.82rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ← Back to Admin
          </button>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {/* ── HERO BANNER ── */}
      <section className="profile-hero">
        <img src="/src/assets/images/ab.jpg" alt="Banner" className="hero-banner-img" />
        <div className="hero-banner-overlay"></div>

        <button className="btn-back" onClick={() => navigate(-1)}>
          <Icon name="back" size={16} color="white" /> Go Back
        </button>

        <div className="hero-content-wrapper">
          <div className="monk-header-info">
            <div className="avatar-container">
              {monk.profilePhoto ? (
                <img src={monk.profilePhoto} alt={displayName} className="monk-avatar" />
              ) : (
                <div className="monk-avatar avatar-placeholder">🧘</div>
              )}
            </div>
            <div className="header-text-block">
              <h1 className="monk-name">{displayName}</h1>
              {monk.titles && <p className="monk-subtitle">{monk.titles}</p>}
              {monk.residence && (
                <p className="monk-subtitle">
                  <Icon name="location" size={14} color="rgba(255,255,255,0.7)" /> {monk.residence}
                </p>
              )}
              <div className="header-actions">
                {monk.email && (
                  <a href={`mailto:${monk.email}`} className="btn-action btn-gold">
                    <Icon name="mail" size={14} color="white" /> Send Message
                  </a>
                )}
                {monk.temple?.name && (
                  <Link to={`/temples/${monk.linkedTempleId}`} className="btn-action btn-outline">
                    <Icon name="temple" size={14} color="white" /> View Temple
                  </Link>
                )}
                <button
                  className="btn-action btn-outline"
                  onClick={() => navigator.share
                    ? navigator.share({ title: displayName, url: window.location.href })
                    : navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <Icon name="share" size={14} color="white" /> Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO-COLUMN BODY ── */}
      <div className="profile-container">

        {/* SIDEBAR */}
        <aside className="profile-sidebar">

          {/* Profile Details card */}
          <div className="profile-card reveal" ref={addToRefs}>
            <h3 className="card-header">
              <Icon name="user" size={18} color="var(--primary-gold)" /> Profile Details
            </h3>
            <div className="details-list">
              {monk.legalName && (
                <div className="detail-item">
                  <span className="label">LEGAL NAME</span>
                  <p className="value">{monk.legalName}</p>
                </div>
              )}
              {monk.role && (
                <div className="detail-item">
                  <span className="label">ROLE</span>
                  <p className="value">{monk.role}</p>
                </div>
              )}
              {monk.dateOfBirth && (
                <div className="detail-item">
                  <span className="label">DATE OF BIRTH</span>
                  <p className="value">{monk.dateOfBirth}</p>
                </div>
              )}
              {monk.nationality && (
                <div className="detail-item">
                  <span className="label">NATIONALITY</span>
                  <p className="value">{monk.nationality}</p>
                </div>
              )}
              {monk.ordinationDate && (
                <div className="detail-item">
                  <span className="label">ORDINATION DATE</span>
                  <p className="value">{monk.ordinationDate}</p>
                </div>
              )}
              {monk.residence && (
                <div className="detail-item">
                  <span className="label">RESIDENCE</span>
                  <p className="value">{monk.residence}</p>
                </div>
              )}
              {languages && (
                <div className="detail-item">
                  <span className="label">LANGUAGES</span>
                  <p className="value">{languages}</p>
                </div>
              )}
              {monk.temple?.name && (
                <div className="detail-item">
                  <span className="label">LINKED TEMPLE</span>
                  <p className="value">{monk.temple.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Connect card */}
          {(monk.email || monk.templePhone || social.website || social.facebook || social.youtube) && (
            <div className="profile-card reveal" ref={addToRefs} style={{ marginTop: '24px' }}>
              <h3 className="card-header">
                <Icon name="link" size={18} color="var(--primary-gold)" /> Connect
              </h3>
              <div className="connect-content">
                {monk.email && (
                  <>
                    <span className="label">OFFICIAL EMAIL</span>
                    <a href={`mailto:${monk.email}`} className="value gold-val email-link">{monk.email}</a>
                  </>
                )}
                {monk.templePhone && (
                  <>
                    <span className="label" style={{ marginTop: '16px' }}>PHONE</span>
                    <p className="value">{monk.templePhone}</p>
                  </>
                )}
                <div className="social-icons">
                  {social.youtube   && (
                    <a href={social.youtube} target="_blank" rel="noreferrer" className="social-btn" title="YouTube">
                      <Icon name="youtube" size={16} color="currentColor" />
                    </a>
                  )}
                  {social.facebook  && (
                    <a href={social.facebook} target="_blank" rel="noreferrer" className="social-btn" title="Facebook">
                      <Icon name="facebook" size={16} color="currentColor" />
                    </a>
                  )}
                  {social.wikipedia && (
                    <a href={social.wikipedia} target="_blank" rel="noreferrer" className="social-btn" title="Wikipedia">
                      <Icon name="wikipedia" size={16} color="currentColor" />
                    </a>
                  )}
                  {social.website   && (
                    <a href={social.website} target="_blank" rel="noreferrer" className="social-btn" title="Website">
                      <Icon name="globe" size={16} color="currentColor" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="profile-main">

          {/* Biography */}
          {(monk.biography || monk.quote) && (
            <div className="profile-card reveal" ref={addToRefs}>
              <span className="section-label">— BIOGRAPHY</span>
              <h2 className="section-heading">About <span className="gold-italic">the Venerable</span></h2>
              {monk.titles && <p className="section-subheading">{monk.titles}</p>}

              {monk.quote && (
                <div className="quote-block">
                  <p>"{monk.quote}"</p>
                </div>
              )}

              {monk.biography && (
                <div className="bio-text">
                  {monk.biography.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contact & Enquiries */}
          {(monk.email || monk.templePhone || monk.address || monk.appointment) && (
            <div className="profile-card reveal" ref={addToRefs} style={{ marginTop: '24px' }}>
              <span className="section-label">— GET IN TOUCH</span>
              <h2 className="section-heading">Contact <span className="gold-italic">&amp; Enquiries</span></h2>
              <p className="section-subheading">For Dhamma guidance, retreat bookings or media enquiries</p>

              <div className="contact-grid">
                {monk.email && (
                  <div className="contact-cell">
                    <span className="label">Email</span>
                    <p className="value">{monk.email}</p>
                  </div>
                )}
                {monk.templePhone && (
                  <div className="contact-cell">
                    <span className="label">Temple Office</span>
                    <p className="value">{monk.templePhone}</p>
                  </div>
                )}
                {monk.address && (
                  <div className="contact-cell">
                    <span className="label">Address</span>
                    <p className="value">{monk.address}</p>
                  </div>
                )}
                {monk.appointment && (
                  <div className="contact-cell">
                    <span className="label">Appointment</span>
                    <p className="value">{monk.appointment}</p>
                  </div>
                )}
              </div>

              {monk.email && (
                <a
                  href={`mailto:${monk.email}`}
                  className="btn-action btn-gold full-width"
                  style={{ marginTop: '32px', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
                >
                  <Icon name="temple" size={16} color="white" /> Request Dhamma Guidance
                </a>
              )}
            </div>
          )}

          {!monk.biography && !monk.quote && !monk.email && !monk.templePhone && (
            <div className="profile-card reveal" ref={addToRefs}>
              <p style={{ color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                Full profile details are being compiled. Please check back soon.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MonkProfile;
