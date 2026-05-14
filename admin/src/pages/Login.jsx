import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword]   = useState('')
  const [remember, setRemember]   = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      })

      // Read as text first — res.json() crashes if the body is empty
      const text = await res.text()
      let data = {}
      if (text) {
        try { data = JSON.parse(text) }
        catch { throw new Error(`Server error (${res.status}) — check that the backend is running`) }
      }

      if (!res.ok) throw new Error(data.error || `Login failed (${res.status})`)
      login(data.token, data.admin)
      navigate('/', { replace: true })
    } catch (err) {
      // Network-level failure (backend not reachable at all)
      if (err.name === 'TypeError') {
        setError('Cannot reach the server — make sure the backend is running on port 5001')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lp-root">

      {/* ── Left: hero image panel ── */}
      <div className="lp-hero">
        <div className="lp-hero-overlay" />

        {/* Top-left brand */}
        <div className="lp-hero-top">
          <div className="lp-brand">
            <span className="lp-brand-name">Saddha<span className="lp-brand-dot">.org</span></span>
            <span className="lp-admin-badge">Admin Portal</span>
          </div>
        </div>

        {/* Bottom-left content */}
        <div className="lp-hero-bottom">
          <p className="lp-eyebrow"><span className="lp-eyebrow-line" />SRI LANKAN BUDDHIST TEMPLES - USA</p>
          <h1 className="lp-hero-heading">
            Manage the<br />
            <span className="lp-hero-gold">Sacred Directory</span>
          </h1>
          <p className="lp-hero-desc">
            The Saddha.org admin portal gives you full control over the temple
            directory — add temples, manage monk profiles, upload photos, and
            respond to community inquiries.
          </p>
          <div className="lp-stats">
            <div className="lp-stat">
              <span className="lp-stat-num">73</span>
              <span className="lp-stat-label">TEMPLES LISTED</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-num">28</span>
              <span className="lp-stat-label">STATES COVERED</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-num">12</span>
              <span className="lp-stat-label">MONK PROFILES</span>
            </div>
          </div>
          <div className="lp-hero-links">
            <a href="/" className="lp-hero-link">↩ Return to Saddha.org</a>
            <a href="mailto:support@saddha.org" className="lp-hero-link">Contact Support</a>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="lp-form-panel">
        <div className="lp-form-inner">

          {/* Secure label */}
          <p className="lp-secure-label"><span className="lp-secure-dot" />SECURE ADMIN ACCESS</p>

          <h2 className="lp-form-title">Welcome Back</h2>
          <p className="lp-form-subtitle">
            Sign in to the Saddha.org admin dashboard to manage<br />the temple directory.
          </p>

          {error && (
            <div className="lp-error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="lp-form">

            <div className="lp-field">
              <label htmlFor="lp-username">USERNAME</label>
              <input
                id="lp-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="lp-field">
              <div className="lp-field-header">
                <label htmlFor="lp-password">PASSWORD</label>
                <a href="#" className="lp-forgot">Forgot Password?</a>
              </div>
              <input
                id="lp-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <label className="lp-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <span>Remember me for 30 days</span>
            </label>

            <button type="submit" className="lp-submit" disabled={loading}>
              {loading ? 'Signing in…' : '→ SIGN IN TO DASHBOARD'}
            </button>
          </form>

          <div className="lp-security-note">
            <span className="lp-lock">○</span>
            Secured with encrypted authentication. Only authorised administrators can access this portal.
          </div>

        </div>
      </div>

    </div>
  )
}
