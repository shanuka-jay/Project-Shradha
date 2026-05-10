import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './Layout.css'

export default function Layout() {
  const { token } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setUnreadCount(data.unreadContacts || 0)
      } catch { /* ignore */ }
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 60000)
    return () => clearInterval(interval)
  }, [token])

  // Close sidebar on wider screens
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="layout">
      <Sidebar
        unreadCount={unreadCount}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="layout-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="layout-main">
        <Topbar
          onMenuClick={() => setSidebarOpen(s => !s)}
          unreadCount={unreadCount}
        />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
