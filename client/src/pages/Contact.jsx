import { useState } from 'react'
import './Contact.css'
// Note: You need to add 'banner.jpg' and 'vihara.jpg' to your client/src/assets/images/ folder.
import bannerImage from '../assets/images/banner.png'
import viharaImage from '../assets/images/vihara.jpeg'

function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    templeName: '',
    purpose: '',
    message: ''
  })
  
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
        setForm({ firstName: '', lastName: '', email: '', templeName: '', purpose: '', message: '' })
      }
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  return (
    <div className="contact-page">
      {/* Banner Section */}
      <div className="contact-banner" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="banner-subtitle-wrapper">
            <span className="gold-dash">—</span>
            <span className="banner-subtitle">REACH OUT</span>
          </div>
          <h1 className="banner-title">
            We'd Love to<br />
            <span className="banner-title-italic">Hear From You</span>
          </h1>
          <p className="banner-desc">
            Whether you want to add a temple, make a correction, or simply<br/>
            connect with the Saddha.org community — our doors are always<br/>
            open.
          </p>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <a href="/">Home</a> <span className="separator">&gt;</span> <span className="current">Contact</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-main">
        {/* Left Column - Info */}
        <div className="contact-info">
          <div className="info-header">
            <span className="gold-dash">—</span>
            <span className="info-subtitle-main">CONTACT INFORMATION</span>
          </div>
          
          <h2 className="info-title" style={{color:'black'}}>Ven. Manthreethenne<br/>Saddhaloka Thero</h2>
          <div className="info-role">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c19b6c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M20 6L9 17l-5-5"></path></svg> 
             Founder, Washington Buddhist Vihara
          </div>

          <div className="info-cards">
            <div className="info-card">
               <div className="icon-wrapper">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c19b6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               </div>
               <div className="card-text">
                 <h4>ADDRESS</h4>
                 <p>5017 16th St NW, Washington DC 20011, USA</p>
               </div>
            </div>
            <div className="info-card">
               <div className="icon-wrapper">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c19b6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
               </div>
               <div className="card-text">
                 <h4>PHONE (USA)</h4>
                 <p>+1 240 351 1765</p>
               </div>
            </div>
            <div className="info-card">
               <div className="icon-wrapper">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c19b6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
               </div>
               <div className="card-text">
                 <h4>EMAIL</h4>
                 <p>saddha.usa@gmail.com<br/>saddhadc@gmail.com</p>
               </div>
            </div>
          </div>

          <div className="location-image-card">
            <div className="location-img-wrapper">
              <img src={viharaImage} alt="Washington Buddhist Vihara" className="location-img" />
              <div className="location-img-overlay">
                 <span>Washington Buddhist Vihara, D.C.</span>
              </div>
            </div>
            <div className="location-card-content">
              <h4>Washington Buddhist Vihara</h4>
              <p>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#c19b6c" stroke="#c19b6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg> 
                5017 16th St NW, Washington DC 20011
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="contact-form-container">
          {submitted ? (
             <div className="success-message">
               <h3>Thank You!</h3>
               <p>Your message has been sent successfully. We will get back to you within 2-3 business days.</p>
             </div>
          ) : (
            <>
              <div className="form-header">
                <h2>Send a Message</h2>
                <p>Fill out the form below and we'll get back to you within 2-3 business days.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>FIRST NAME</label>
                    <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Your first name" required />
                  </div>
                  <div className="form-group">
                    <label>LAST NAME</label>
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Your last name" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label>TEMPLE NAME (IF APPLICABLE)</label>
                  <input type="text" name="templeName" value={form.templeName} onChange={handleChange} placeholder="Temple name subject to inquiry" />
                </div>
                <div className="form-group">
                  <label>PURPOSE</label>
                  <input type="text" name="purpose" value={form.purpose} onChange={handleChange} placeholder="General Inquiry" />
                </div>
                <div className="form-group">
                  <label>YOUR MESSAGE</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help you?" rows={4} required />
                </div>
                <button type="submit" className="btn-submit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> 
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </div>

    </div>
  )
}

export default Contact
