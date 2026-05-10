import { useState } from 'react'
import AdminLayout from './AdminLayout'
import { useNavigate } from 'react-router-dom'
import './AdminLayout.css'
import './MonksDirectory.css'

/* ── Static monk data ── */
const allMonks = [
  {
    id: 1,
    name: 'Ven. Manthreethenne Saddhaloka',
    temple: 'Sri Dalada Maligawa',
    role: 'Abbot',
    phone: '+94 81 223 4226',
    email: 'saddhaloka@saddha.org',
    photo: null,
  },
  {
    id: 2,
    name: 'Ven. Dr. Walpola Piyananda',
    temple: 'Dhamma Vijaya Buddhist Vihara',
    role: 'Chief Incumbent',
    phone: '+1 (323) 737-5084',
    email: 'w.piyananda@saddha.org',
    photo: null,
  },
  {
    id: 3,
    name: 'Ven. Dr. Henepola Gunaratana',
    temple: 'Bhavana Society Forest Monastery',
    role: 'President',
    phone: '+1 (304) 856-3241',
    email: 'bhante.g@saddha.org',
    photo: null,
  },
  {
    id: 4,
    name: 'Ven. Peradeniye Sujatha',
    temple: 'Peradeniye University Vihara',
    role: 'Registrar',
    phone: '+94 81 238 9150',
    email: 'p.sujatha@saddha.org',
    photo: null,
  },
]

const ROLE_COLORS = {
  Abbot: { bg: '#FFF7E6', color: '#7A5C1E' },
  'Chief Incumbent': { bg: '#F5EEE0', color: '#6B5A3E' },
  President: { bg: '#FDECEA', color: '#8B3A3A' },
  Registrar: { bg: '#E8F5E9', color: '#2E7D32' },
}

function RoleBadge({ role }) {
  const s = ROLE_COLORS[role] || { bg: '#F0F0F0', color: '#555' }
  return (
    <span className="monk-role-badge" style={{ background: s.bg, color: s.color }}>
      {role}
    </span>
  )
}

/* Monk photo gradient overlay placeholder */
function MonkPhotoPlaceholder({ name }) {
  const initials = name
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
  return (
    <div className="monk-photo-placeholder">
      <div className="monk-initials">{initials}</div>
    </div>
  )
}

export default function MonksDirectory() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const TOTAL = 12
  const PER_PAGE = 6

  const filtered = allMonks.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.temple.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      {/* ── Topbar ── */}
      <div className="monks-topbar">
        <div className="monks-topbar-left">
          <span className="monks-topbar-breadcrumb">
            <span className="breadcrumb-site">Saddha.org</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-page">Monks</span>
          </span>
        </div>
        <div className="monks-topbar-right">
          <button className="topbar-bell" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          <div className="topbar-user">
            <div className="user-info">
              <span className="user-name">Bhikkhu Sangha</span>
              <span className="user-role">Admin Access</span>
            </div>
            <div className="user-avatar">BS</div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="monks-content">
        {/* Header row */}
        <div className="monks-header">
          <div>
            <h1 className="monks-title">Venerable Monks</h1>
            <p className="monks-subtitle">Manage monk profiles across all temples</p>
          </div>
          <button
            id="add-monk-btn"
            className="add-monk-btn"
            onClick={() => navigate('/admin/monks/new')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Monk Profile
          </button>
        </div>

        {/* Search bar */}
        <div className="monks-searchbar-wrap">
          <svg className="monks-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="monks-search-input"
            type="text"
            className="monks-search-input"
            placeholder="Search profiles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Card Grid */}
        <div className="monks-grid">
          {filtered.map(monk => (
            <div key={monk.id} className="monk-card" id={`monk-card-${monk.id}`}>
              {/* Photo area */}
              <div className="monk-photo-area">
                <MonkPhotoPlaceholder name={monk.name} />
                <div className="monk-photo-overlay" />
              </div>

              {/* Info area */}
              <div className="monk-info">
                <RoleBadge role={monk.role} />
                <h2 className="monk-name">{monk.name}</h2>
                <p className="monk-temple">{monk.temple}</p>

                <div className="monk-contacts">
                  <div className="monk-contact-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                    </svg>
                    <span>{monk.phone}</span>
                  </div>
                  <div className="monk-contact-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>{monk.email}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="monk-actions">
                  <button
                    className="monk-edit-btn"
                    id={`edit-monk-${monk.id}`}
                    onClick={() => navigate(`/admin/monks/${monk.id}/edit`)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="monk-view-btn"
                    id={`view-monk-${monk.id}`}
                    onClick={() => navigate(`/admin/monks/${monk.id}`)}
                  >
                    View Page
                  </button>
                  <button className="monk-more-btn" aria-label="More options">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Another Monk placeholder card */}
          <div
            className="monk-add-card"
            id="add-another-monk-card"
            onClick={() => navigate('/admin/monks/new')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/admin/monks/new')}
          >
            <div className="monk-add-inner">
              <div className="monk-add-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span className="monk-add-label">Add Another Monk</span>
              <span className="monk-add-sub">Click to create a new<br/>profile for the directory</span>
            </div>
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="monks-footer">
          <span className="monks-showing">SHOWING {filtered.length} OF {TOTAL} PROFILES</span>
          <div className="monks-pagination">
            <button
              className="monks-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              aria-label="Previous page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {[1, 2, 3].map(p => (
              <button
                key={p}
                className={`monks-page-btn monks-page-num ${currentPage === p ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
                aria-current={currentPage === p ? 'page' : undefined}
              >
                {p}
              </button>
            ))}
            <button
              className="monks-page-btn"
              disabled={currentPage === 3}
              onClick={() => setCurrentPage(p => p + 1)}
              aria-label="Next page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
