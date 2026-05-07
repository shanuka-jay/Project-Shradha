import React from 'react';
import './ContactSection.css';
import connectImg from '../assets/images  for home page/connect with us bg.jpg';

const ContactSection = () => {
  return (
    <section className="contact">
      <div className="contact__inner">
        {/* Header */}
        <div className="contact__header">
          <h2 className="contact__heading">
            We'd love to <em>hear</em> from you
          </h2>
        </div>

        <div className="contact__body">
          {/* Left - Connect card */}
          <div className="contact__card" style={{ backgroundImage: `url(${connectImg})` }}>
            <div className="contact__card-overlay" />
            <div className="contact__card-content">
              <h3>Connect<br /><span>With Us</span></h3>
              <p>Have a question about a temple? Want to add a missing temple to our directory? Or simply connect with the Saddha community? Drop us a message.</p>
              <div className="contact__info">
                <div className="contact__info-row">
                  <span className="contact__info-icon">📍</span>
                  <span>5017 16th St NW, Washington DC 20011</span>
                </div>
                <div className="contact__info-row">
                  <span className="contact__info-icon">📞</span>
                  <span>+1 240 351 1765</span>
                </div>
                <div className="contact__info-row">
                  <span className="contact__info-icon">✉</span>
                  <span>saddha.usa@gmail.com</span>
                </div>
              </div>
              <div className="contact__social">
                <a href="#" className="contact__social-link">f</a>
                <a href="#" className="contact__social-link">in</a>
                <a href="#" className="contact__social-link">yt</a>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="contact__form-wrap">
            <h3 className="contact__form-title">Send a Message</h3>
            <p className="contact__form-sub">We'll get back to you within 2–3 business days.</p>
            <form className="contact__form">
              <div className="contact__form-row">
                <div className="contact__form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="Your first name" />
                </div>
                <div className="contact__form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Your last name" />
                </div>
              </div>
              <div className="contact__form-group">
                <label>Email Address</label>
                <input type="email" placeholder="yourname@email.com" />
              </div>
              <div className="contact__form-group">
                <label>Temple Name (if applicable)</label>
                <input type="text" placeholder="Temple name if relevant" />
              </div>
              <div className="contact__form-group">
                <label>Purpose</label>
                <input type="text" placeholder="e.g. Add temple, general inquiry" />
              </div>
              <div className="contact__form-group">
                <label>Your Message</label>
                <textarea rows={4} placeholder="Type your message here..." />
              </div>
              <button type="submit" className="contact__submit">
                ✉ Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
