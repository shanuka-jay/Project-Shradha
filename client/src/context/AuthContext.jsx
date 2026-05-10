import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

// Decode JWT payload without a library
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return true
  // exp is in seconds; add a 30-second buffer
  return Date.now() / 1000 > payload.exp - 30
}

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(null)
  const [token, setToken]   = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: read from localStorage and validate token
  useEffect(() => {
    const storedToken = localStorage.getItem('saddha_token')
    const storedAdmin = localStorage.getItem('saddha_admin')

    if (storedToken && !isTokenExpired(storedToken) && storedAdmin) {
      try {
        setToken(storedToken)
        setAdmin(JSON.parse(storedAdmin))
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem('saddha_token')
        localStorage.removeItem('saddha_admin')
      }
    } else {
      // Token missing or expired — clear storage silently
      localStorage.removeItem('saddha_token')
      localStorage.removeItem('saddha_admin')
    }

    setLoading(false)
  }, [])

  // Verify token against server every 5 minutes while app is open
  useEffect(() => {
    if (!token) return

    async function verifyToken() {
      try {
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 401 || res.status === 403) {
          // Server rejected token — force logout
          logout()
        }
      } catch {
        // Network error — don't force logout, just retry later
      }
    }

    verifyToken()
    const interval = setInterval(verifyToken, 5 * 60 * 1000) // every 5 min
    return () => clearInterval(interval)
  }, [token])

  function login(tokenVal, adminData) {
    localStorage.setItem('saddha_token', tokenVal)
    localStorage.setItem('saddha_admin', JSON.stringify(adminData))
    setToken(tokenVal)
    setAdmin(adminData)
  }

  function logout() {
    localStorage.removeItem('saddha_token')
    localStorage.removeItem('saddha_admin')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
