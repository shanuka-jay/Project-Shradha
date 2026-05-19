import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from '../components/ConfirmDialog'

const ROLE_PALETTE = {
  'Abbot':            { bg: '#fef3c7', color: '#92400e' },
  'Chief Incumbent':  { bg: '#dbeafe', color: '#1e40af' },
  'President':        { bg: '#f3e8ff', color: '#6b21a8' },
  'Registrar':        { bg: '#dcfce7', color: '#15803d' },
  'Head Monk':        { bg: '#ffe4e6', color: '#9f1239' },
  'Teacher':          { bg: '#fef9c3', color: '#854d0e' },
}
function RoleBadge({ role }) {
  if (!role) return null
  const c = ROLE_PALETTE[role] || { bg: 'var(--brown-100)', color: 'var(--brown-700)' }
  return (
    <span style={{
      display: 'inline-block', padding: '0.18rem 0.65rem',
      borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
      background: c.bg, color: c.color, letterSpacing: '0.02em',
    }}>{role}</span>
  )
}

export default function Monks() {
  const { token } = useAuth()
  const [monks, setMonks] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [toggling, setToggling] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const limit = 11

  const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:3000'

  async function fetchMonks() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (search) params.set('search', search)
    if (filterStatus) params.set('status', filterStatus)
    try {
      const res = await fetch(`/api/admin/monks?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMonks(data.monks || [])
      setTotal(data.total || 0)
    } catch {
      toast.error('Failed to load monk profiles.')
    }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMonks() }, [page, filterStatus])
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchMonks() }, 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    function close(e) { if (!e.target.closest('.mk-menu-wrap')) setOpenMenu(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  function handleDelete(id, name) {
    setOpenMenu(null)
    setConfirm({
      title: 'Delete Monk Profile',
      message: `The profile for "${name}" will be permanently removed. This cannot be undone.`,
      confirmLabel: 'Yes, Delete',
      variant: 'danger',
      onConfirm: () => doDelete(id, name),
    })
  }

  async function doDelete(id, name) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/monks/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      toast.success(`Profile for "${name}" deleted.`)
      fetchMonks()
    } catch {
      toast.error(`Failed to delete profile for "${name}".`)
    }
    finally { setDeleting(null) }
  }

  async function toggleStatus(monk) {
    const newStatus = monk.status === 'published' ? 'draft' : 'published'
    setToggling(monk.id)
    setOpenMenu(null)
    try {
      const res = await fetch(`/api/admin/monks/${monk.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...monk, status: newStatus, languages: monk.languages || [], socialLinks: monk.socialLinks || {} }),
      })
      if (!res.ok) throw new Error('Update failed')
      const displayName = monk.displayName || monk.legalName
      toast.success(`"${displayName}" set to ${newStatus}.`)
      fetchMonks()
    } catch {
      toast.error(`Failed to update status for "${monk.displayName || monk.legalName}".`)
    }
    finally { setToggling(null) }
  }

  function handleViewPage(monkId) {
    window.open(`${clientUrl}/monks/${monkId}?preview=admin`, '_blank')
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ padding: '2rem', maxWidth: 1300 }}>
      <ConfirmDialog config={confirm} onClose={() => setConfirm(null)} />

      <style>{`
        .mk-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        @media(max-width:1100px){.mk-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:640px){.mk-grid{grid-template-columns:1fr;}}

        .mk-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; transition:box-shadow .18s,transform .18s; }
        .mk-card:hover { box-shadow:var(--shadow); transform:translateY(-2px); }
        .mk-card-photo { width:100%; height:200px; object-fit:cover; object-position:top center; display:block; background:var(--surface-2); }
        .mk-card-photo-ph { width:100%; height:200px; background:var(--surface-2); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:2.8rem; }
        .mk-card-body { padding:1rem 1.1rem .75rem; flex:1; display:flex; flex-direction:column; gap:.2rem; }
        .mk-card-name { font-family:var(--font-display); font-size:1.05rem; font-weight:600; color:var(--text); line-height:1.3; margin-top:.3rem; }
        .mk-card-temple { font-size:.78rem; color:var(--text-3); margin-top:.05rem; }
        .mk-card-contact { display:flex; flex-direction:column; gap:.18rem; margin-top:.55rem; }
        .mk-card-contact-row { display:flex; align-items:center; gap:.45rem; font-size:.78rem; color:var(--text-2); }
        .mk-card-contact-row i { width:13px; text-align:center; color:var(--text-3); flex-shrink:0; }

        .mk-card-footer { display:flex; align-items:center; gap:.5rem; padding:.6rem 1.1rem; border-top:1px solid var(--border); background:var(--brown-50); }
        .mk-btn-edit { flex:1; padding:.42rem 0; background:var(--brown-700); color:#f5e8c8; border:none; border-radius:var(--radius-sm); font-size:.78rem; font-weight:500; font-family:var(--font-body); cursor:pointer; text-align:center; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; transition:background .14s; }
        .mk-btn-edit:hover { background:var(--brown-800); }
        .mk-btn-view { flex:1; padding:.42rem 0; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:var(--radius-sm); font-size:.78rem; font-weight:500; font-family:var(--font-body); cursor:pointer; text-align:center; transition:background .14s; }
        .mk-btn-view:hover { background:var(--surface-2); }

        .mk-menu-wrap { position:relative; }
        .mk-menu-trigger { width:30px; height:30px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--surface); color:var(--text-2); font-size:.95rem; letter-spacing:.05em; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .14s; }
        .mk-menu-trigger:hover { background:var(--surface-2); }
        .mk-menu-dropdown { position:absolute; right:0; bottom:calc(100% + 4px); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); box-shadow:var(--shadow); min-width:145px; z-index:60; overflow:hidden; }
        .mk-menu-item { display:flex; align-items:center; gap:.5rem; padding:.5rem .9rem; font-size:.8rem; color:var(--text); cursor:pointer; background:none; border:none; width:100%; text-align:left; font-family:var(--font-body); transition:background .12s; }
        .mk-menu-item:hover { background:var(--surface-2); }
        .mk-menu-item.danger { color:#b91c1c; }
        .mk-menu-item.danger:hover { background:#fef2f2; }
        .mk-menu-sep { height:1px; background:var(--border); margin:.2rem 0; }

        .mk-add-card { border:2px dashed var(--border-2); border-radius:var(--radius); min-height:310px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.45rem; cursor:pointer; text-decoration:none; color:var(--text-3); transition:border-color .18s,background .18s; }
        .mk-add-card:hover { border-color:var(--brown-400); background:var(--brown-50); color:var(--brown-600); }
        .mk-add-icon { width:42px; height:42px; border:1.5px solid currentColor; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; opacity:.6; }
        .mk-add-label { font-size:.92rem; font-weight:500; margin-top:.2rem; }
        .mk-add-sub { font-size:.76rem; opacity:.7; text-align:center; max-width:130px; }

        .mk-bottom { display:flex; align-items:center; justify-content:space-between; margin-top:1.75rem; font-size:.78rem; color:var(--text-3); }
        .mk-empty { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:4rem 2rem; gap:.75rem; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); color:var(--text-3); }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">Venerable Monks</h1>
          <p className="page-desc">Manage monk profiles across all temples</p>
        </div>
        <Link to="/monks/new" className="btn-primary-action">＋ Add Monk Profile</Link>
      </div>

      <div className="filter-bar">
        <input type="search" className="filter-input" placeholder="Search profiles…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ flex: 1, maxWidth: 480 }} />
        <select className="filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading
        ? <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-3)' }}>Loading profiles…</div>
        : (
          <div className="mk-grid">
            {monks.length === 0 && (
              <div className="mk-empty">
                <i className="fas fa-praying-hands" style={{ fontSize: '2.5rem' }} />
                <p>No profiles found. Use the tile below to add the first one.</p>
              </div>
            )}

            {monks.map(m => {
              const contact = m.email || m.contactInfo || m.templePhone || ''
              const isPhone = contact && /^\+?[\d\s\-()+]+$/.test(contact.trim())
              return (
                <div className="mk-card" key={m.id}>
                  {m.profilePhoto
                    ? <img className="mk-card-photo" src={m.profilePhoto} alt={m.legalName} />
                    : <div className="mk-card-photo-ph"><i className="fas fa-praying-hands" /></div>
                  }
                  <div className="mk-card-body">
                    <RoleBadge role={m.role} />
                    <div className="mk-card-name">{m.displayName || m.legalName}</div>
                    {m.temple?.name && <div className="mk-card-temple">{m.temple.name}</div>}
                    {contact && (
                      <div className="mk-card-contact">
                        <div className="mk-card-contact-row">
                          <i className={`fas fa-${isPhone ? 'phone' : 'envelope'}`} />
                          <span>{contact}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mk-card-footer">
                    <Link to={`/monks/${m.id}/edit`} className="mk-btn-edit">Edit Profile</Link>
                    <button className="mk-btn-view" onClick={() => handleViewPage(m.id)}>
                      View Page
                    </button>
                    <div className="mk-menu-wrap">
                      <button className="mk-menu-trigger" onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}>···</button>
                      {openMenu === m.id && (
                        <div className="mk-menu-dropdown">
                          <button className="mk-menu-item" disabled={toggling === m.id} onClick={() => toggleStatus(m)}>
                            <i className={`fas fa-${m.status === 'published' ? 'eye-slash' : 'eye'}`} style={{ width: 14 }} />
                            {toggling === m.id ? 'Updating…' : m.status === 'published' ? 'Set Draft' : 'Publish'}
                          </button>
                          <div className="mk-menu-sep" />
                          <button className="mk-menu-item danger" disabled={deleting === m.id}
                            onClick={() => handleDelete(m.id, m.legalName)}>
                            <i className="fas fa-trash" style={{ width: 14 }} />
                            {deleting === m.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            <Link to="/monks/new" className="mk-add-card">
              <div className="mk-add-icon">＋</div>
              <div className="mk-add-label">Add Another Monk</div>
              <div className="mk-add-sub">Click to create a new profile for the directory</div>
            </Link>
          </div>
        )
      }

      <div className="mk-bottom">
        <span>SHOWING {monks.length} OF {total} PROFILES</span>
        {totalPages > 1 && (
          <div className="pagination" style={{ margin: 0 }}>
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className="page-btn" onClick={() => setPage(n)}
                style={n === page ? { background: 'var(--brown-700)', color: '#fff', border: '1px solid var(--brown-700)' } : {}}>
                {n}
              </button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        )}
      </div>
    </div>
  )
}
