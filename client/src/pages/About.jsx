import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import './About.css'

const About = () => {
  const revealRefs = useRef([])
  revealRefs.current = []

  const [monks, setMonks] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [allMediaImages, setAllMediaImages] = useState([])
  const [monksLoading, setMonksLoading] = useState(true)
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState(null)

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
    return () => { revealRefs.current.forEach((el) => observer.unobserve(el)) }
  }, [monks, galleryImages])

  // Fetch monks from backend (public endpoint)
  useEffect(() => {
    fetch('/api/monks')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.monks || [])
        setMonks(list.filter((m) => m.status === 'published'))
      })
      .catch(() => setMonks([]))
      .finally(() => setMonksLoading(false))
  }, [])

  // Fetch all media images from /api/media (public Cloudinary listing)
  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((data) => {
        const files = Array.isArray(data.files) ? data.files : []
        // Exclude monk profile photos and temple chief-monk photos from the
        // public gallery — they belong to their respective profiles.
        const urls = files
          .map((f) => f.url || f.secure_url)
          .filter((url) => url && !url.includes('/uploads/monks/') && !url.includes('/uploads/temple-monks/'))
        setAllMediaImages(urls)
        setGalleryImages(urls.slice(0, 7)) // show exactly 7 in the grid
      })
      .catch(() => {
        // Fallback to local assets when no media yet
        const fallback = [1, 2, 3, 4, 5, 6, 7].map((i) => `/src/assets/images/gallery_${i}.jpg`)
        setAllMediaImages(fallback)
        setGalleryImages(fallback)
      })
      .finally(() => setGalleryLoading(false))
  }, [])

  const openGalleryModal = () => {
    setGalleryModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeGalleryModal = () => {
    setGalleryModalOpen(false)
    setZoomedImage(null)
    document.body.style.overflow = ''
  }

  // Carousel scroll
  const carouselRef = useRef(null)
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return
    const card = carouselRef.current.querySelector('.teacher-card')
    const cardWidth = card ? card.offsetWidth + 25 : 340
    if (direction === 'left') {
      carouselRef.current.scrollLeft -= cardWidth
    } else {
      carouselRef.current.scrollLeft += cardWidth
    }
  }

  // Local fallback images for gallery (used when API returns nothing)
  const localFallback = [1, 2, 3, 4, 5, 6, 7].map((i) => `/src/assets/images/gallery_${i}.jpg`)

  return (
    <div className="about-page">
      {/* HERO */}
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

      {/* FOUNDER */}
      <section id="founder" className="section-padding intro">
        <div className="intro-left reveal" ref={addToRefs}>
          <div className="founder-card">
            <img src="/src/assets/images/monk1_portrait.jpg" alt="Ven. Saddhaloka" />
            <div className="founder-meta">
              <p className="founder-name">
                <span className="founder-dot"></span>
                Ven. Manthreethenne Saddhaloka Thero
              </p>
              <p className="founder-role">Founder - Washington Buddhist Vihara, DC</p>
            </div>
          </div>
        </div>
        <div className="intro-right reveal" ref={addToRefs}>
          <span className="label-gold">THE FOUNDER</span>
          <h2 className="intro-heading">
            A Vision to <span className="gold-italic">Unite</span><br />
            Buddhist America
          </h2>
          <div className="intro-text">
            <p>Ven. Manthreethenne Saddhaloka Thero is the Chief Monk of the <strong>Washington Buddhist Vihara</strong> at 5017, 16th Street NW, Washington DC — one of the most historically significant Sri Lankan Buddhist centers in the United States.</p>
            <p>Driven by a deep commitment to the Dhamma and the well-being of the Sri Lankan diaspora, Venerable Thero initiated the <strong>Saddha.org</strong> project — a comprehensive digital directory connecting every Sri Lankan Buddhist temple across all 50 states of America.</p>
            <p>His vision is simple yet profound: <em>no devotee should ever struggle to find their nearest temple.</em> Through technology and community collaboration, Saddha.org makes the sacred accessible to all.</p>
          </div>
          <div className="stats-row">
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

      {/* WHAT WE STAND FOR */}
      <section className="section-padding stand-for">
        <div className="section-header">
          <span className="label-gold reveal" ref={addToRefs}>WHAT WE STAND FOR</span>
          <h2 className="reveal" ref={addToRefs}>Empowering the <span className="gold-italic">Community</span></h2>
        </div>
        <div className="cards-row">
          {[
            {
              title: "Digital Temple Directory",
              desc: "A centralized database of every Sri Lankan Buddhist temple in the USA, providing essential information for every devotee.",
              icon: <path d="M12 7V3L2 12h3v9h14v-9h3L12 7zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            },
            {
              title: "Interactive Live Map",
              desc: "Navigate through the spiritual landscape with our intuitive map system, making it easier than ever to find your spiritual home.",
              icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            },
            {
              title: "Cultural Preservation",
              desc: "Safeguarding Dhamma and Sri Lankan heritage for future generations through digital archiving and community initiatives.",
              icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            }
          ].map((item, idx) => (
            <div key={idx} className="stand-card reveal" ref={addToRefs}>
              <svg className="stand-icon" viewBox="0 0 24 24">{item.icon}</svg>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <Link to="#" className="read-more">READ MORE →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-padding timeline-section">
        <div className="section-header">
          <span className="label-gold reveal" ref={addToRefs}>OUR LEGACY</span>
          <h2 className="reveal" ref={addToRefs}>Our <span className="gold-italic">Journey</span></h2>
        </div>
        <div className="timeline-container">
          <div className="timeline-line"></div>
          {[
            { year: "1966", title: "Washington Buddhist Vihara Founded", desc: "The first Sri Lankan Buddhist temple in the USA, established in the heart of Washington D.C.", right: true },
            { year: "1980s", title: "West Coast Expansion", desc: "Expansion into California and the West Coast to serve growing communities.", right: false },
            { year: "2000s", title: "National Growth", desc: "A period of rapid growth with temples established in almost every major state.", right: true },
            { year: "2024", title: "Saddha.org Launched", desc: "The birth of a unified digital platform to connect all Sri Lankan temples across America.", right: false },
            { year: "2025", title: "73 Temples & Growing", desc: "Our mission continues as we strive to map every sacred space across the 50 states.", right: true },
          ].map((item, idx) => (
            <div key={idx} className={`timeline-item ${item.right ? 'right' : ''} reveal`} ref={addToRefs}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <p className="timeline-text"><strong>{item.title}</strong></p>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO GALLERY — images come from /api/media (Cloudinary) */}
      <section className="section-padding gallery-section">
        <span className="label-gold reveal" ref={addToRefs}>PHOTO GALLERY</span>
        <h2 className="reveal" ref={addToRefs}>Moments of <span className="gold-italic">Dhamma</span></h2>
        <p className="gallery-intro reveal" ref={addToRefs}>
          Explore the vibrant beauty of Sri Lankan Buddhist temples and communities across the USA through our curated photo gallery.
        </p>

        {galleryLoading ? (
          <div className="gallery-loading reveal" ref={addToRefs}>
            <div className="loading-spinner"></div>
            <p>Loading gallery…</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {(galleryImages.length > 0 ? galleryImages : localFallback).map((url, i) => (
              <div
                key={i}
                className="gallery-item reveal"
                ref={addToRefs}
                onClick={openGalleryModal}
              >
                <img src={url} alt={`Gallery ${i + 1}`} loading="lazy" />
                <div className="gallery-item-overlay">
                  <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {allMediaImages.length > 7 && (
          <button
            className="btn btn-gold gallery-btn"
            onClick={openGalleryModal}
          >
            View More Photos &nbsp;→
          </button>
        )}
        {allMediaImages.length <= 7 && allMediaImages.length > 0 && (
          <button
            className="btn btn-gold gallery-btn"
            onClick={openGalleryModal}
          >
            View Gallery &nbsp;→
          </button>
        )}
      </section>

      {/* FULL-SCREEN GALLERY MODAL — rendered via portal to escape parent CSS stacking context */}
      {galleryModalOpen && ReactDOM.createPortal(
        <div className="gallery-modal-overlay" onClick={closeGalleryModal}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="gallery-modal-header">
              <div className="gallery-modal-title">
                <h3>Photo Gallery</h3>
                <span className="gallery-modal-count">{allMediaImages.length} photos</span>
              </div>
              <button className="gallery-modal-close" onClick={closeGalleryModal}>✕</button>
            </div>

            {/* Masonry Grid */}
            <div className="gallery-modal-body">
              <div className="gallery-modal-grid">
                {allMediaImages.map((url, i) => (
                  <div
                    key={i}
                    className="gallery-modal-item"
                    onClick={() => setZoomedImage(url)}
                  >
                    <img src={url} alt={`Photo ${i + 1}`} loading="lazy" />
                    <div className="gallery-modal-item-overlay">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Zoomed single image */}
          {zoomedImage && (
            <div className="gallery-zoom-overlay" onClick={() => setZoomedImage(null)}>
              <button className="gallery-zoom-close" onClick={(e) => { e.stopPropagation(); setZoomedImage(null) }}>✕</button>
              <img src={zoomedImage} alt="Zoomed" className="gallery-zoom-img" />
              <p className="gallery-zoom-hint">Click anywhere to close</p>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* GUARDIANS OF THE DHAMMA — Monk carousel from DB */}
      <section className="section-padding carousel-section">
        <div className="section-header">
          <span className="label-gold reveal" ref={addToRefs}>OUR VENERABLE TEACHERS</span>
          <h2 className="reveal" ref={addToRefs}>Guardians of the <span className="gold-italic">Dhamma</span></h2>
          <p className="carousel-intro reveal" ref={addToRefs}>
            Meet the venerable monks and spiritual leaders who guide our communities and preserve the Dhamma for future generations.
          </p>
        </div>

        <div className="carousel-wrapper">
          <button className="nav-btn nav-btn-left" onClick={() => scrollCarousel('left')} aria-label="Scroll left">←</button>
          <div className="carousel-container" ref={carouselRef}>
            {monksLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="teacher-card teacher-card-skeleton">
                  <div className="skeleton-portrait"></div>
                  <div className="skeleton-line wide"></div>
                  <div className="skeleton-line narrow"></div>
                </div>
              ))
            ) : monks.length > 0 ? (
              monks.map((monk) => (
                <div key={monk.id} className="teacher-card">
                  <div className="teacher-portrait">
                    {monk.profilePhoto ? (
                      <img src={monk.profilePhoto} alt={monk.displayName || monk.legalName} />
                    ) : (
                      <div className="portrait-placeholder"><span>🧘</span></div>
                    )}
                  </div>
                  <div className="teacher-info">
                    <h4>{monk.displayName || monk.legalName}</h4>
                    <p className="teacher-title">{monk.titles || monk.role || ''}</p>
                    <p className="teacher-temple">{monk.temple?.name || monk.residence || ''}</p>
                    <Link to={`/monks/${monk.id}`} className="read-more">VIEW PROFILE →</Link>
                  </div>
                </div>
              ))
            ) : (
              [
                { name: "Ven. Saddhaloka Thero", loc: "Washington Buddhist Vihara, DC", img: "/src/assets/images/monk1_portrait.jpg", id: "1" },
                { name: "Ven. P. Seelawimala", loc: "West Coast Buddhist Center, CA", img: "/src/assets/images/monk_portrait.jpg", id: "2" },
                { name: "Ven. B. Saranapala", loc: "East Coast Dhamma Center, NY", img: "/src/assets/images/monk3.jpg", id: "3" },
              ].map((teacher, idx) => (
                <div key={idx} className="teacher-card">
                  <div className="teacher-portrait">
                    <img src={teacher.img} alt={teacher.name} />
                  </div>
                  <div className="teacher-info">
                    <h4>{teacher.name}</h4>
                    <p className="teacher-temple">{teacher.loc}</p>
                    <Link to={`/monks/${teacher.id}`} className="read-more">VIEW PROFILE →</Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="nav-btn nav-btn-right" onClick={() => scrollCarousel('right')} aria-label="Scroll right">→</button>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section-padding values-section">
        <div className="section-header">
          <span className="label-gold reveal" ref={addToRefs}>OUR CORE VALUES</span>
          <h2 className="reveal" ref={addToRefs}>The <span className="gold-italic">Dhamma</span> We Live By</h2>
        </div>
        <div className="values-grid">
          {[
            { title: "Dhamma", subtitle: "THE TEACHINGS", text: "Upholding the authentic teachings of the Buddha as preserved in the Theravada tradition.", icon: <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /> },
            { title: "Sangha", subtitle: "COMMUNITY", text: "Fostering a united community of monks, lay people, and visitors across all 50 states.", icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /> },
            { title: "Saddha", subtitle: "FAITH & TRUST", text: "Building deep trust and faith in the path to liberation through clarity and guidance.", icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /> },
            { title: "Metta", subtitle: "LOVING KINDNESS", text: "Extending loving kindness to all beings without distinction — the foundation of all Buddhist practice.", icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /> },
            { title: "Pariyatti", subtitle: "STUDY & LEARNING", text: "Encouraging deep study of the Pali Canon and Dhamma texts to understand the Path clearly.", icon: <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" /> },
            { title: "Preservation", subtitle: "CULTURE & FUTURE", text: "Documenting and preserving Sri Lankan Buddhist heritage in America for current and future generations.", icon: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96z" /> },
          ].map((value, idx) => (
            <div key={idx} className="value-card reveal" ref={addToRefs}>
              <svg className="value-icon" viewBox="0 0 24 24">{value.icon}</svg>
              <h3>{value.title}</h3>
              <span className="value-subtitle">{value.subtitle}</span>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-block reveal" ref={addToRefs}>
        <img className="cta-bg-img" src="/src/assets/images/cta_banner.jpg" alt="CTA Banner" />
        <div className="cta-content">
          <h2 className="cta-heading">Find a Temple, <span className="gold-italic">Near You</span></h2>
          <p>Explore our interactive map to discover Sri Lankan Buddhist temples across America.</p>
          <div className="cta-btns">
            <Link to="/map" className="btn btn-gold">Explore the Map</Link>
            <Link to="/contact" className="btn btn-outline-white">Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
