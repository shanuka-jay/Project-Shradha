import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Monks() {
  const { token } = useAuth()
  const [monks, setMonks] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleting, setDeleting] = useState(null)
  const limit = 15

  async function fetchMonks() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (search) params.set('search', search)
    if (filterStatus) params.set('status', filterStatus)
    try {
      const res = await fetch(`/api/admin/monks?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setMonks(data.monks || [])
      setTotal(data.total || 0)
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMonks() }, [page, filterStatus])
  useEffect(() => { const t = setTimeout(() => fetchMonks(), 350); return () => clearTimeout(t) }, [search])

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete profile for "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/monks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      fetchMonks()
    } catch { }
    finally { setDeleting(null) }
  }

  async function toggleStatus(monk) {
    const newStatus = monk.status === 'published' ? 'draft' : 'published'
    await fetch(`/api/admin/monks/${monk.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...monk, status: newStatus, languages: monk.languages || [], socialLinks: monk.socialLinks || {} }),
    })
    fetchMonks()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ padding: '2rem', maxWidth: 1200 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Monks / Profiles</h1>
          <p className="page-desc">{total} profile{total !== 1 ? 's' : ''} in the directory</p>
        </div>
        <Link to="/monks/new" className="btn-primary-action">＋ Add New Profile</Link>
      </div>

      <div className="filter-bar">
        <input type="search" className="filter-input" placeholder="Search by name…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <select className="filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="temples-table-wrap">
        {loading ? <div className="table-loading">Loading profiles…</div>
        : monks.length === 0 ? (
          <div className="table-empty">
            <i className="fas fa-praying-hands" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}></i>
            <p>No profiles found.</p>
            <Link to="/monks/new" className="btn-primary-action" style={{ marginTop: '1rem' }}>Add first profile</Link>
          </div>
        ) : (
          <table className="temples-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Linked Temple</th>
                <th>Nationality</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {monks.map(m => (
                <tr key={m.id}>
                  <td>
                    {m.profilePhoto
                      ? <img src={m.profilePhoto} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                      : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-praying-hands" style={{ fontSize: '1.2rem' }}></i></div>}
                  </td>
                  <td>
                    <div className="td-temple-name">{m.legalName}</div>
                    {m.displayName && <div className="td-temple-addr">{m.displayName}</div>}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{m.role || '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{m.temple?.name || '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{m.nationality || '—'}</td>
                  <td>
                    <button onClick={() => toggleStatus(m)} className={`badge badge-${m.status}`} style={{ border: 'none', cursor: 'pointer' }}>
                      {m.status}
                    </button>
                  </td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/monks/${m.id}/edit`} className="action-btn action-edit" title="Edit">✎</Link>
                      <button className="action-btn action-delete" title="Delete" disabled={deleting === m.id}
                        onClick={() => handleDelete(m.id, m.legalName)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="page-btn">← Prev</button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="page-btn">Next →</button>
        </div>
      )}
    </div>
  )
}
