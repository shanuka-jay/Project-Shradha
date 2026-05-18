import { useState } from 'react'

async function readJsonResponse(res) {
  const text = await res.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Server error (${res.status}) — check that the backend is running`)
  }
}

export default function ForgotPassword({ mode, resetToken, initialEmail = '', onBackToLogin, onResetComplete }) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [resetLink, setResetLink] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleForgotSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setResetLink('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await readJsonResponse(res)

      if (!res.ok) throw new Error(data.error || `Reset request failed (${res.status})`)
      setNotice(data.emailWarning || data.message || 'If an admin account exists for that email, a reset link has been generated.')
      if (data.resetLink) setResetLink(data.resetLink)
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

  async function handleResetSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword: password }),
      })
      const data = await readJsonResponse(res)

      if (!res.ok) throw new Error(data.error || `Password reset failed (${res.status})`)
      onResetComplete(data.message || 'Password reset successful. You can sign in with your new password.')
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

  return (
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
          <span>
            {notice}
            {resetLink && (
              <a className="lp-reset-link" href={resetLink}>Open reset link</a>
            )}
          </span>
        </div>
      )}

      {mode === 'forgot' ? (
        <form onSubmit={handleForgotSubmit} className="lp-form">
          <div className="lp-field">
            <label htmlFor="lp-forgot-email">ADMIN EMAIL</label>
            <input
              id="lp-forgot-email"
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" className="lp-submit" disabled={loading}>
            {loading ? 'Generating link…' : 'GENERATE RESET LINK'}
          </button>

          <button type="button" className="lp-text-button" onClick={onBackToLogin}>
            Back to sign in
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="lp-form">
          <div className="lp-field">
            <label htmlFor="lp-new-password">NEW PASSWORD</label>
            <input
              id="lp-new-password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="lp-field">
            <label htmlFor="lp-confirm-password">CONFIRM PASSWORD</label>
            <input
              id="lp-confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="lp-submit" disabled={loading}>
            {loading ? 'Updating password…' : 'RESET PASSWORD'}
          </button>

          <button type="button" className="lp-text-button" onClick={onBackToLogin}>
            Back to sign in
          </button>
        </form>
      )}
    </>
  )
}
