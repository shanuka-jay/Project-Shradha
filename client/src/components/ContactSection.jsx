import React, { useState } from 'react';
import './ContactSection.css';
import connectImg from '../assets/images  for home page/connect with us bg.jpg';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  templeName: '',
  purpose: '',
  message: '',
};

const ContactSection = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setStatus('error');
      setErrorMsg('Please enter your first and last name.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!form.message.trim()) {
      setStatus('error');
      setErrorMsg('Please write a message before sending.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    }
  };

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

            {/* Success banner */}
            {status === 'success' && (
              <div className="contact__feedback contact__feedback--success">
                ✅ Your message was sent! We'll be in touch soon.
              </div>
            )}

            {/* Error banner */}
            {status === 'error' && (
              <div className="contact__feedback contact__feedback--error">
                ⚠️ {errorMsg}
              </div>
            )}

            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              <div className="contact__form-row">
                <div className="contact__form-group">
                  <label htmlFor="contact-firstName">First Name</label>
                  <input
                    id="contact-firstName"
                    type="text"
                    name="firstName"
                    placeholder="Your first name"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    required
                  />
                </div>
                <div className="contact__form-group">
                  <label htmlFor="contact-lastName">Last Name</label>
                  <input
                    id="contact-lastName"
                    type="text"
                    name="lastName"
                    placeholder="Your last name"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    required
                  />
                </div>
              </div>

              <div className="contact__form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="yourname@email.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  required
                />
              </div>

              <div className="contact__form-group">
                <label htmlFor="contact-templeName">Temple Name (if applicable)</label>
                <input
                  id="contact-templeName"
                  type="text"
                  name="templeName"
                  placeholder="Temple name if relevant"
                  value={form.templeName}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
              </div>

              <div className="contact__form-group">
                <label htmlFor="contact-purpose">Purpose</label>
                <input
                  id="contact-purpose"
                  type="text"
                  name="purpose"
                  placeholder="e.g. Add temple, general inquiry"
                  value={form.purpose}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
              </div>

              <div className="contact__form-group">
                <label htmlFor="contact-message">Your Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Type your message here..."
                  value={form.message}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact__submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>⏳ Sending…</>
                ) : (
                  <>✉ Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
