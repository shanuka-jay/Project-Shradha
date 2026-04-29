import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
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
        setForm({ name: '', email: '', message: '' })
      }
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  return (
    <div className="contact">
      <h1>Contact Us</h1>
      {submitted ? (
        <p className="success">✅ Message sent! We will get back to you soon.</p>
      ) : (
        <div className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your message"
              rows={5}
              required
            />
          </div>
          <button className="btn-submit" onClick={handleSubmit}>Send Message</button>
        </div>
      )}
    </div>
  )
}

export default Contact
