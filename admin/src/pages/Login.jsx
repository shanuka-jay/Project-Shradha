import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login(data.token, data.admin)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      {/* Left decorative panel */}
      <div className="login-left">
        <div className="login-left-inner">
          <i className="fas fa-dharmachakra login-dharma"></i>
          <h1 className="login-brand">Saddha.org</h1>
          <p className="login-tagline">Temple Directory<br />Administration</p>
          <div className="login-deco-lines">
            <span /><span /><span />
          </div>
          <p className="login-quote">"May all beings be happy,<br />peaceful, and free from suffering."</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Admin Sign In</h2>
            <p>Saddha Temple Directory · Admin Panel</p>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-wrap">
                <i className="fas fa-envelope login-input-icon"></i>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrap">
                <i className="fas fa-lock login-input-icon"></i>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? <span className="login-spinner"><i className="fas fa-spinner fa-spin"></i> Signing in…</span>
                : 'Sign In to Admin Panel'}
            </button>
          </form>


        </div>
      </div>
    </div>
  )
}
