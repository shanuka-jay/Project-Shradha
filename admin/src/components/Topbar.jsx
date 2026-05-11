import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Topbar.css'

const PAGE_TITLES = {
  '/':             'Dashboard',
  '/temples':      'Temples',
  '/temples/new':  'Add New Temple',
  '/monks':        'Monks & Profiles',
  '/monks/new':    'Add Monk Profile',
  '/events':       'Events',
  '/events/new':   'Add New Event',
  '/messages':     'Contact Messages',
  '/media':        'Media Library',
  '/map':          'Map Management',
}

export default function Topbar({ onMenuClick, unreadCount }) {
  const { admin } = useAuth()
  const { pathname } = useLocation()

  let title = 'Admin'
  if (pathname.endsWith('/edit')) {
    if (pathname.includes('/temples/')) title = 'Edit Temple'
    else if (pathname.includes('/monks/')) title = 'Edit Monk Profile'
    else if (pathname.includes('/events/')) title = 'Edit Event'
  } else {
    const match = Object.keys(PAGE_TITLES)
      .filter(k => pathname === k || pathname.startsWith(k + '/'))
      .sort((a, b) => b.length - a.length)[0]
    if (match) title = PAGE_TITLES[match]
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile hamburger */}
        <button className="topbar-hamburger" onClick={onMenuClick} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <span className="topbar-breadcrumb">
          <span className="topbar-site">Saddha.org</span>
          <span className="topbar-sep">/</span>
          <span className="topbar-page">{title}</span>
        </span>
      </div>

      <div className="topbar-right">
        {/* Unread messages indicator */}
        {unreadCount > 0 && (
          <div className="topbar-notif" title={`${unreadCount} unread messages`}>
            <i className="fas fa-envelope"></i>
            <span className="topbar-notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
          </div>
        )}

        <div className="topbar-admin">
          <div className="topbar-admin-info">
            <span className="topbar-admin-name">{admin?.name || 'Admin'}</span>
            <span className="topbar-admin-role">
              {admin?.role === 'superadmin' ? '★ Super Administrator' : 'Administrator'}
            </span>
          </div>
          <div className="topbar-avatar">
            {(admin?.name || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
