import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const navItems = [
  { to: '/',         label: 'Dashboard',       icon: 'fas fa-th-large', end: true },
  { to: '/temples',  label: 'Temples',          icon: 'fas fa-place-of-worship' },
  { to: '/monks',    label: 'Monks / Profiles', icon: 'fas fa-praying-hands' },
  { to: '/events',   label: 'Events',           icon: 'fas fa-calendar' },
  { to: '/messages', label: 'Messages',         icon: 'fas fa-envelope', badge: true },
  { to: '/media',    label: 'Media Library',    icon: 'fas fa-images' },
  { to: '/map',      label: 'Map Management',   icon: 'fas fa-map' },
  { to: '/settings', label: 'Settings',         icon: 'fas fa-cog' },
]

export default function Sidebar({ unreadCount, open, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 199, display: 'none'
          }}
          className="sidebar-overlay"
        />
      )}

      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <i className="fas fa-dharmachakra sidebar-dharma"></i>
          <div>
            <div className="sidebar-name">Saddha.org</div>
            <div className="sidebar-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Navigation</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
            >
              <i className={`sidebar-icon ${item.icon}`}></i>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
              {item.badge && unreadCount > 0 && (
                <span className="sidebar-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a
            href={window.location.port === '5173' ? window.location.origin.replace('5173', '3000') : '/'}
            target="_blank"
            rel="noreferrer"
            className="sidebar-link sidebar-link-ext"
          >
            <i className="sidebar-icon fas fa-external-link-alt"></i>
            <span>View Public Site</span>
          </a>
          <button onClick={handleLogout} className="sidebar-logout">
            <i className="sidebar-icon fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

