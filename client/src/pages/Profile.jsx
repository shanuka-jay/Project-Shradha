import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => observer.observe(el));

    return () => {
      revealRefs.current.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="profile-page">
      {/* 1. HERO BANNER */}
      <section className="profile-hero">
        <div className="hero-gradient-overlay"></div>
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
        
        <div className="hero-content-wrapper">
          <div className="monk-header-info">
            <div className="avatar-container">
              <img src="/src/assets/images/monk1_portrait.jpg" alt="Ven. Manthreethenne Saddhaloka Thero" className="monk-avatar" />
              <span className="online-dot"></span>
            </div>
            <div className="header-text-block">
              <h1 className="monk-name">
                Ven. Manthreethenne<br />
                <span>Saddhaloka Thero</span>
              </h1>
              <p className="monk-subtitle">
                Senior Dhamma Teacher • Pali Scholar • 📍 Kandy, Sri Lanka
              </p>
              <div className="header-actions">
                <button className="btn-action btn-gold">🏛 Request Dhamma Talk</button>
                <button className="btn-action btn-outline">✉ Send Message</button>
                <button className="btn-action btn-outline">⤴ Share Profile</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO-COLUMN CONTENT */}
      <div className="profile-container">
        <aside className="profile-sidebar">
          {/* Card 1: Profile Details */}
          <div className="profile-card reveal" ref={addToRefs}>
            <h3 className="card-header"><span className="icon">👤</span> Profile Details</h3>
            <div className="details-list">
              <div className="detail-item">
                <span className="label">LEGAL NAME</span>
                <p className="value gold-link">Harold Edward Musson</p>
              </div>
              <div className="detail-item">
                <span className="label">DATE OF BIRTH</span>
                <p className="value">5 January 1920</p>
              </div>
              <div className="detail-item">
                <span className="label">NATIONALITY</span>
                <p className="value gold-link">British • Sri Lankan Resident</p>
              </div>
              <div className="detail-item">
                <span className="label">ORDINATION DATE</span>
                <p className="value gold-link">24 June 1954 • Received Upasampadā</p>
              </div>
              <div className="detail-item">
                <span className="label">RESIDENCE</span>
                <p className="value gold-link">Bundala Forest Hermitage, Southern Province, Sri Lanka</p>
              </div>
              <div className="detail-item">
                <span className="label">LANGUAGES</span>
                <p className="value gold-link">English • Pali • Sinhala • French</p>
              </div>
            </div>
          </div>

          {/* Card 2: Connect */}
          <div className="profile-card reveal" ref={addToRefs} style={{ marginTop: '24px' }}>
            <h3 className="card-header"><span className="icon">⤴</span> Connect</h3>
            <div className="connect-content">
              <span className="label">OFFICIAL EMAIL</span>
              <a href="mailto:contact@saddha.org" className="value gold-link">contact@saddha.org</a>
              <div className="social-icons">
                <a href="#" className="social-btn">YT</a>
                <a href="#" className="social-btn">FB</a>
                <a href="#" className="social-btn">SP</a>
                <a href="#" className="social-btn">W</a>
                <a href="#" className="social-btn">✦</a>
              </div>
            </div>
          </div>
        </aside>

        <main className="profile-main">
          {/* Card 1: Biography */}
          <div className="profile-card reveal" ref={addToRefs}>
            <span className="section-label">— BIOGRAPHY</span>
            <h2 className="section-heading">About <span className="gold-italic">the Venerable</span></h2>
            <p className="section-subheading">A life dedicated to the Dhamma and its precise articulation</p>
            
            <div className="quote-block">
              <p>"The purpose of the Dhamma is not to give a beautiful philosophy but to end suffering. Every single word in the Suttas has a precise meaning — and that meaning leads directly to liberation."</p>
            </div>

            <div className="bio-text">
              <p>Venerable Ñāṇavīra Thera (Harold Edward Musson, 1920–1965) was a British-born Theravāda monk who spent the later years of his life in Sri Lanka and produced some of the most penetrating and philosophically rigorous Dhamma writing of the 20th century. His seminal work, <em>Notes on Dhamma</em>, is regarded as a landmark contribution to the understanding of the Pali Canon in the modern era.</p>
              <p>After receiving his ordination in 1954 at Vajirarama under the guidance of Venerable Ñāṇatiloka Thera, he retreated to the <span className="gold-link">Bundala</span> Forest Hermitage in the Southern Province where he spent his remaining years in intensive study and meditation. His letters and notes — now collected and published posthumously — continue to guide practitioners and scholars worldwide.</p>
              <p>His approach combined a strict adherence to the original Pali texts with a phenomenological inquiry influenced by existentialist thinkers such as Kierkegaard, Husserl and Heidegger — though always in service of direct meditative experience rather than mere intellectual exercise.</p>
              <p>Known for his uncompromising commitment to the truth, his life was a testament to the transformative power of the Buddha's teachings when applied with total honesty and intellectual integrity. His legacy remains a beacon for those seeking a deeper, more profound engagement with the path to liberation.</p>
            </div>
          </div>

          {/* Card 2: Contact & Enquiries */}
          <div className="profile-card reveal" ref={addToRefs} style={{ marginTop: '24px' }}>
            <span className="section-label">— GET IN TOUCH</span>
            <h2 className="section-heading">Contact <span className="gold-italic">& Enquiries</span></h2>
            <p className="section-subheading">For Dhamma guidance, retreat bookings or media enquiries</p>

            <div className="contact-grid">
              <div className="contact-cell">
                <span className="label">Email</span>
                <p className="value">✉ contact@saddha.org</p>
              </div>
              <div className="contact-cell">
                <span className="label">Temple Office</span>
                <p className="value">📞 +94 81 234 5678</p>
              </div>
              <div className="contact-cell">
                <span className="label">Address</span>
                <p className="value">📍 Bundala Forest Hermitage, Southern Province</p>
              </div>
              <div className="contact-cell">
                <span className="label">Appointment</span>
                <p className="value">📅 By prior arrangement only</p>
              </div>
            </div>
            
            <button className="btn-action btn-gold full-width" style={{ marginTop: '32px' }}>
              🏛 Request Dhamma Guidance
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
