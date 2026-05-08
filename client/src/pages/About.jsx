import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './About.css'

const About = () => {
  const revealRefs = useRef([])
  revealRefs.current = []

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold: 0.1 }
    )

    revealRefs.current.forEach((el) => observer.observe(el))

    return () => {
      revealRefs.current.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const scrollCarousel = (direction) => {
    const container = document.querySelector('.carousel-container')
    const scrollAmount = 400
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount
    } else {
      container.scrollLeft += scrollAmount
    }
  }

  return (
    <div className="about-page">
      {/* 2. HERO SECTION REDESIGNED */}
      <section className="hero">
        <img className="hero-bg-img" src="/src/assets/images/about-banner.png" alt="Saddha Banner" />
        <div className="hero-overlay"></div>
        
        <div className="hero-grid">
          <div className="hero-content">
            <span className="label-story">OUR STORY</span>
            <h1 className="hero-heading">
              Preserving <span className="gold-italic">Dhamma</span><br />
              Across America
            </h1>
            <p className="hero-subtext">
              Saddha.org was born from a vision to connect Sri Lankan Buddhist communities scattered across all 50 states — one temple, one community, one Dhamma at a time.
            </p>
            <a href="#founder" className="btn-founder">
              MEET THE FOUNDER <span>↓</span>
            </a>
          </div>

          <div className="hero-center">
            <img className="monk-main-img" src="/src/assets/images/monk_portrait.jpg" alt="Ven. Saddhaloka Thero" />
          </div>

          <div className="hero-right">
            <div className="side-images">
              <img className="side-img" src="/src/assets/images/temple_ceremony.jpg" alt="Temple Ceremony" />
              <img className="side-img" src="/src/assets/images/stupa.jpg" alt="White Stupa" />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Strip */}
      <div className="quote-strip">
        <p>"The Dhamma is not bound by borders — it belongs to all who seek the path to liberation."</p>
        <span className="quote-author">— VEN. MANTHREETHENNE SADDHALOKA THERO</span>
      </div>

      {/* 3. THE FOUNDER SECTION */}
      <section id="founder" className="section-padding intro">
        <div className="intro-left reveal" ref={addToRefs}>
          <div className="founder-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <img src="/src/assets/images/monk1_portrait.jpg" alt="Ven. Saddhaloka" style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }} />
            <div className="founder-meta">
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '700' }}>
                <span style={{ width: '8px', height: '8px', background: '#C9A84C', borderRadius: '50%' }}></span>
                Ven. Manthreethenne Saddhaloka Thero
              </p>
              <p style={{ fontSize: '12px', color: '#888', marginLeft: '18px' }}>Founder - Washington Buddhist Vihara, DC</p>
            </div>
          </div>
        </div>
        <div className="intro-right reveal" ref={addToRefs}>
          <span className="label-gold">THE FOUNDER</span>
          <h2 className="intro-heading">
            A Vision to <span className="gold-italic">Unite</span><br />
            Buddhist America
          </h2>
          <div className="intro-text" style={{ fontSize: '15px', lineHeight: '1.8' }}>
            <p>Ven. Manthreethenne Saddhaloka Thero is the Chief Monk of the <strong>Washington Buddhist Vihara</strong> at 5017, 16th Street NW, Washington DC — one of the most historically significant Sri Lankan Buddhist centers in the United States.</p>
            <p>Driven by a deep commitment to the Dhamma and the well-being of the Sri Lankan diaspora, Venerable Thero initiated the <strong>Saddha.org</strong> project — a comprehensive digital directory connecting every Sri Lankan Buddhist temple across all 50 states of America.</p>
            <p>His vision is simple yet profound: <em>no devotee should ever struggle to find their nearest temple.</em> Through technology and community collaboration, Saddha.org makes the sacred accessible to all.</p>
          </div>
          <div className="stats-row" style={{ marginTop: '50px' }}>
            <div className="stat-card">
              <span className="stat-num">73</span>
              <span className="stat-label">Temples Listed</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">28</span>
              <span className="stat-label">States Covered</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">50</span>
              <span className="stat-label">Years of Heritage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "WHAT WE STAND FOR" SECTION */}
      <section className="section-padding stand-for" style={{ background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="label-gold reveal" ref={addToRefs}>WHAT WE STAND FOR</span>
          <h2 className="reveal" ref={addToRefs} style={{ fontSize: '42px' }}>
            Empowering the <span className="gold-italic">Community</span>
          </h2>
        </div>
        <div className="cards-row">
          {[
            {
              title: "Digital Temple Directory",
              desc: "A centralized database of every Sri Lankan Buddhist temple in the USA, providing essential information for every devotee.",
              icon: (
                <svg className="stand-icon" viewBox="0 0 24 24">
                  <path d="M12 7V3L2 12h3v9h14v-9h3L12 7zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
              )
            },
            {
              title: "Interactive Live Map",
              desc: "Navigate through the spiritual landscape with our intuitive map system, making it easier than ever to find your spiritual home.",
              icon: (
                <svg className="stand-icon" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              )
            },
            {
              title: "Cultural Preservation",
              desc: "Safeguarding Dhamma and Sri Lankan heritage for future generations through digital archiving and community initiatives.",
              icon: (
                <svg className="stand-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              )
            }
          ].map((item, idx) => (
            <div key={idx} className="stand-card reveal" ref={addToRefs} style={{ background: '#fafaf7', border: '1px solid #eee' }}>
              {item.icon}
              <h3 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '20px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.7', marginBottom: '30px' }}>{item.desc}</p>
              <Link to="#" className="read-more">READ MORE →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. "OUR JOURNEY" TIMELINE SECTION */}
      <section className="section-padding timeline-section" style={{ background: '#f5f0e8' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="label-gold reveal" ref={addToRefs}>OUR LEGACY</span>
          <h2 className="reveal" ref={addToRefs} style={{ fontSize: '42px' }}>Our <span className="gold-italic">Journey</span></h2>
        </div>
        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          <div className="timeline-item right reveal" ref={addToRefs}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">1966</span>
              <p className="timeline-text"><strong>Washington Buddhist Vihara Founded</strong></p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>The first Sri Lankan Buddhist temple in the USA, established in the heart of Washington D.C.</p>
            </div>
          </div>

          <div className="timeline-item reveal" ref={addToRefs}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">1980s</span>
              <p className="timeline-text"><strong>West Coast Expansion</strong></p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>Expansion into California and the West Coast to serve growing communities.</p>
            </div>
          </div>

          <div className="timeline-item right reveal" ref={addToRefs}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">2000s</span>
              <p className="timeline-text"><strong>National Growth</strong></p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>A period of rapid growth with temples established in almost every major state.</p>
            </div>
          </div>

          <div className="timeline-item reveal" ref={addToRefs}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">2024</span>
              <p className="timeline-text"><strong>Saddha.org Launched</strong></p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>The birth of a unified digital platform to connect all Sri Lankan temples across America.</p>
            </div>
          </div>

          <div className="timeline-item right reveal" ref={addToRefs}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">2025</span>
              <p className="timeline-text"><strong>73 Temples & Growing</strong></p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>Our mission continues as we strive to map every sacred space across the 50 states.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "MOMENTS OF DHAMMA" PHOTO GALLERY SECTION */}
      <section className="section-padding gallery-section">
        <span className="label-gold reveal" ref={addToRefs}>PHOTO GALLERY</span>
        <h2 className="reveal" ref={addToRefs} style={{ fontSize: '42px', marginBottom: '15px' }}>Moments of <span className="gold-italic">Dhamma</span></h2>
        <p className="reveal" ref={addToRefs} style={{ color: 'var(--secondary-text)', maxWidth: '600px', margin: '0 auto', fontSize: '15px', lineHeight: '1.6' }}>
          Explore the vibrant beauty of Sri Lankan Buddhist temples and communities across the USA through our curated photo gallery.
        </p>
        
        <div className="gallery-grid">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="gallery-item reveal" ref={addToRefs}>
              <img src={`/src/assets/images/gallery_${i}.jpg`} alt={`Gallery ${i}`} />
            </div>
          ))}
        </div>
        
        <Link to="#" className="btn-founder" style={{ width: 'auto', display: 'inline-flex', padding: '15px 30px' }}>VIEW GALLERY →</Link>
      </section>

      {/* 7. "GUARDIANS OF THE DHAMMA" CAROUSEL SECTION */}
      <section className="section-padding carousel-section">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="label-gold reveal" ref={addToRefs}>OUR VENERABLE TEACHERS</span>
          <h2 className="reveal" ref={addToRefs} style={{ fontSize: '42px' }}>Guardians of the <span className="gold-italic">Dhamma</span></h2>
          <p className="reveal" ref={addToRefs} style={{ color: 'var(--secondary-text)', maxWidth: '700px', margin: '15px auto 0', fontSize: '15px' }}>
            Meet the venerable monks and spiritual leaders who guide our communities and preserve the Dhamma for future generations.
          </p>
        </div>
        
        <div className="carousel-container reveal" ref={addToRefs}>
          {[
            { name: "Ven. Saddhaloka Thero", loc: "Washington Buddhist Vihara, DC", img: "/src/assets/images/monk1_portrait.jpg" },
            { name: "Ven. P. Seelawimala", loc: "West Coast Buddhist Center, CA", img: "/src/assets/images/monk_portrait.jpg" },
            { name: "Ven. B. Saranapala", loc: "East Coast Dhamma Center, NY", img: "/src/assets/images/monk3.jpg" }
          ].map((teacher, idx) => (
            <div key={idx} className="teacher-card">
              <div className="teacher-portrait">
                <img src={teacher.img} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="teacher-info">
                <h4>{teacher.name}</h4>
                <p>{teacher.loc}</p>
                <Link to="#" className="read-more">VIEW PROFILE →</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-nav-wrapper">
          <button className="nav-btn" onClick={() => scrollCarousel('left')}>←</button>
          <button className="nav-btn" onClick={() => scrollCarousel('right')}>→</button>
        </div>
      </section>

      {/* 8. "THE DHAMMA WE LIVE BY" VALUES SECTION */}
      <section className="section-padding" style={{ background: '#fafaf7' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="label-gold reveal" ref={addToRefs}>OUR CORE VALUES</span>
          <h2 className="reveal" ref={addToRefs} style={{ fontSize: '42px' }}>
            The <span className="gold-italic">Dhamma</span> We Live By
          </h2>
        </div>
        <div className="values-grid">
          {[
            { 
              title: "Dhamma", 
              subtitle: "THE TEACHINGS",
              text: "Upholding the authentic teachings of the Buddha as preserved in the Theravada tradition across generations of monks.",
              icon: <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            },
            { 
              title: "Sangha", 
              subtitle: "COMMUNITY",
              text: "Fostering a united community of monks, lay people, and visitors across all 50 states of America.",
              icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            },
            { 
              title: "Saddha", 
              subtitle: "FAITH & TRUST",
              text: "Building deep trust and faith in the path to liberation through clarity, consistency, and compassionate guidance.",
              icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            },
            { 
              title: "Metta", 
              subtitle: "LOVING KINDNESS",
              text: "Extending loving kindness to all beings without distinction — the foundation of all Buddhist practice.",
              icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            },
            { 
              title: "Pariyatti", 
              subtitle: "STUDY & LEARNING",
              text: "Encouraging deep study of the Pali Canon and Dhamma texts to understand the Path clearly.",
              icon: <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
            },
            { 
              title: "Preservation", 
              subtitle: "CULTURE & FUTURE",
              text: "Documenting and preserving Sri Lankan Buddhist heritage in America for current and future generations.",
              icon: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56-.6 1.11-1.06 2.31-1.38 3.56zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
            }
          ].map((value, idx) => (
            <div key={idx} className="value-card reveal" ref={addToRefs}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <svg className="value-icon" viewBox="0 0 24 24" style={{ marginBottom: '10px' }}>
                  {value.icon}
                </svg>
                <h3 style={{ fontSize: '20px' }}>{value.title}</h3>
                <span style={{ fontSize: '10px', letterSpacing: '1px', color: 'var(--primary-gold)', fontWeight: '700' }}>{value.subtitle}</span>
              </div>
              <p style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. "FIND A TEMPLE NEAR YOU" FULL-WIDTH CTA SECTION */}
      <section className="cta-block reveal" ref={addToRefs}>
        <img className="cta-bg-img" src="/src/assets/images/cta_banner.jpg" alt="CTA Banner" />
        <div className="cta-content">
          <h2 className="cta-heading" style={{ fontSize: '48px', fontWeight: '400' }}>Find a Temple, <span className="gold-italic">Near You</span></h2>
          <p style={{ marginBottom: '40px', opacity: '0.8', fontSize: '15px' }}>Explore our interactive map to discover Sri Lankan Buddhist temples across America.</p>
          <div className="hero-btns" style={{ justifyContent: 'center' }}>
            <Link to="/map" className="btn btn-gold" style={{ borderRadius: '30px', padding: '15px 40px' }}>Explore the Map</Link>
            <Link to="/contact" className="btn btn-outline-white" style={{ borderRadius: '30px', padding: '15px 40px' }}>Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
