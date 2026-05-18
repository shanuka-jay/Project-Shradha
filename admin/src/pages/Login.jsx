import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ForgotPassword from '../components/ForgotPassword'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlResetToken = searchParams.get('resetToken') || ''
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [mode, setMode] = useState(urlResetToken ? 'reset' : 'login')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [heroStats, setHeroStats] = useState({
    totalTemples: null,
    states: null,
    totalMonks: null,
  })

  useEffect(() => {
    if (urlResetToken) {
      setMode('reset')
      setError('')
      setNotice('')
    }
  }, [urlResetToken])

  useEffect(() => {
    let ignore = false

    async function loadHeroStats() {
      try {
        const res = await fetch('/api/admin/login-stats')
        const data = await readJsonResponse(res)
        if (!res.ok) throw new Error(data.error || `Stats failed (${res.status})`)
        if (!ignore) {
          setHeroStats({
            totalTemples: data.totalTemples,
            states: data.states,
            totalMonks: data.totalMonks,
          })
        }
      } catch {
        if (!ignore) {
          setHeroStats({
            totalTemples: null,
            states: null,
            totalMonks: null,
          })
        }
      }
    }

    loadHeroStats()
    return () => { ignore = true }
  }, [])

  async function readJsonResponse(res) {
    const text = await res.text()
    if (!text) return {}

    try {
      return JSON.parse(text)
    } catch {
      throw new Error(`Server error (${res.status}) — check that the backend is running`)
    }
  }

  function showLogin(message = '') {
    setMode('login')
    setSearchParams({})
    setError('')
    setNotice(message)
    setPassword('')
  }

  function showForgotPassword(e) {
    e.preventDefault()
    setMode('forgot')
    setError('')
    setNotice('')
    setPassword('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      })

      const data = await readJsonResponse(res)
      if (!res.ok) throw new Error(data.error || `Login failed (${res.status})`)
      login(data.token, data.admin)
      navigate('/', { replace: true })
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('Cannot reach the server — make sure the backend is running on port 5001')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const title = mode === 'forgot' ? 'Reset Password' : mode === 'reset' ? 'Create New Password' : 'Welcome Back'
  const subtitle = mode === 'forgot'
    ? 'Enter your admin email and we will generate a secure reset link.'
    : mode === 'reset'
      ? 'Set a new password for your Saddha.org admin account.'
      : <>Sign in to the Saddha.org admin dashboard to manage<br />the temple directory.</>

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
              <span className="lp-stat-num">{heroStats.totalTemples ?? '—'}</span>
              <span className="lp-stat-label">TEMPLES LISTED</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-num">{heroStats.states ?? '—'}</span>
              <span className="lp-stat-label">STATES COVERED</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-num">{heroStats.totalMonks ?? '—'}</span>
              <span className="lp-stat-label">MONK PROFILES</span>
            </div>
          </div>
          <div className="lp-hero-links">
            <a href="http://localhost:3000" className="lp-hero-link">↩ Return to Saddha.org</a>
            <a href="mailto:support@saddha.org" className="lp-hero-link">Contact Support</a>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="lp-form-panel">
        <div className="lp-form-inner">

          {/* Secure label */}
          <p className="lp-secure-label"><span className="lp-secure-dot" />SECURE ADMIN ACCESS</p>

          <h2 className="lp-form-title">{title}</h2>
          <p className="lp-form-subtitle">{subtitle}</p>

          {mode === 'login' ? (
            <>
              {error && (
                <div className="lp-error">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {notice && (
                <div className="lp-message">
                  <span>✓</span>
                  <span>{notice}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="lp-form">
                <div className="lp-field">
                  <label htmlFor="lp-username">EMAIL</label>
                  <input
                    id="lp-username"
                    type="text"
                    placeholder="Enter your email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="lp-field">
                  <div className="lp-field-header">
                    <label htmlFor="lp-password">PASSWORD</label>
                    <a href="#" className="lp-forgot" onClick={showForgotPassword}>Forgot Password?</a>
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
            </>
          ) : (
            <ForgotPassword
              mode={mode}
              resetToken={urlResetToken}
              initialEmail={username}
              onBackToLogin={() => showLogin()}
              onResetComplete={message => showLogin(message)}
            />
          )}

          <div className="lp-security-note">
            <span className="lp-lock">○</span>
            Secured with encrypted authentication. Only authorised administrators can access this portal.
          </div>

        </div>
      </div>

    </div>
  )
}
