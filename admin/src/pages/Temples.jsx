import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from '../components/ConfirmDialog'
import './Temples.css'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','DC']
const hasCoords = (temple) => Number.isFinite(Number(temple.lat)) && Number.isFinite(Number(temple.lng))

export default function Temples() {
  const { token } = useAuth()
  const [temples, setTemples] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [toggling, setToggling] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const limit = 15

  async function fetchTemples() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (search)       params.set('search', search)
    if (filterState)  params.set('state', filterState)
    if (filterStatus) params.set('status', filterStatus)
    try {
      const res = await fetch(`/api/admin/temples?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setTemples(data.temples || [])
      setTotal(data.total || 0)
    } catch {
      toast.error('Failed to load temples.')
    }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTemples() }, [page, filterState, filterStatus])
  useEffect(() => {
    const t = setTimeout(() => fetchTemples(), 350)
    return () => clearTimeout(t)
  }, [search])

  function handleDelete(id, name) {
    setConfirm({
      title: 'Delete Temple',
      message: `"${name}" will be permanently removed from the directory. This cannot be undone.`,
      confirmLabel: 'Yes, Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: () => doDelete(id, name),
    })
  }

  async function doDelete(id, name) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/temples/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Delete failed')
      toast.success(`"${name}" deleted successfully.`)
      fetchTemples()
    } catch {
      toast.error(`Failed to delete "${name}".`)
    }
    finally { setDeleting(null) }
  }

  async function togglePublish(t) {
    const newStatus = t.status === 'published' ? 'draft' : 'published'
    setToggling(t.id)
    try {
      const res = await fetch(`/api/admin/temples/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...t, status: newStatus, services: t.services || [], images: t.images || [] }),
      })
      if (!res.ok) throw new Error('Update failed')
      setTemples(ts => ts.map(x => x.id === t.id ? { ...x, status: newStatus } : x))
      toast.success(`"${t.name}" set to ${newStatus}.`)
    } catch {
      toast.error(`Failed to update status for "${t.name}".`)
    }
    finally { setToggling(null) }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="temples-page">
      <ConfirmDialog config={confirm} onClose={() => setConfirm(null)} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Temples</h1>
          <p className="page-desc">{total} temple{total !== 1 ? 's' : ''} in the directory</p>
        </div>
        <Link to="/temples/new" className="btn-primary-action">＋ Add New Temple</Link>
      </div>

      <div className="filter-bar">
        <input type="search" className="filter-input" placeholder="Search temples…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <select className="filter-select" value={filterState} onChange={e => { setFilterState(e.target.value); setPage(1) }}>
          <option value="">All States</option>
          {US_STATES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="temples-table-wrap">
        {loading ? (
          <div className="table-loading">Loading temples…</div>
        ) : temples.length === 0 ? (
          <div className="table-empty">
            <i className="fas fa-place-of-worship" style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}></i>
            <p>No temples found.</p>
            <Link to="/temples/new" className="btn-primary-action" style={{ marginTop:'1rem', display:'inline-flex' }}>Add first temple</Link>
          </div>
        ) : (
          <table className="temples-table">
            <thead>
              <tr>
                <th>Temple</th>
                <th>State</th>
                <th>Chief Monk</th>
                <th>Status</th>
                <th>Map</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {temples.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="td-temple-name">{t.name}</div>
                    {t.address && <div className="td-temple-addr">{t.address}</div>}
                  </td>
                  <td style={{ color:'var(--text-2)', fontSize:'0.85rem' }}>{t.state}</td>
                  <td style={{ color:'var(--text-2)', fontSize:'0.85rem' }}>{t.chiefMonk || <span style={{ color:'var(--muted)' }}>—</span>}</td>
                  <td>
                    <button
                      onClick={() => togglePublish(t)}
                      disabled={toggling === t.id}
                      className={`badge badge-${t.status || 'published'}`}
                      style={{ border:'none', cursor:'pointer', transition:'opacity 0.15s' }}
                      title="Click to toggle publish/draft"
                    >
                      {toggling === t.id ? '…' : (t.status || 'published')}
                    </button>
                  </td>
                  <td style={{ textAlign:'center' }}>
                    {hasCoords(t)
                      ? <i className="fas fa-map-marker-alt" title={`${Number(t.lat).toFixed(4)}, ${Number(t.lng).toFixed(4)}`} style={{ color:'#16a34a', fontSize:'1rem' }}></i>
                      : <i className="fas fa-exclamation-triangle" title="No coordinates" style={{ color:'#dc2626', fontSize:'0.8rem' }}></i>}
                  </td>
                  <td className="td-date">{new Date(t.createdAt).toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric' })}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/temples/${t.id}/edit`} className="action-btn action-edit" title="Edit"><i className="fas fa-edit"></i></Link>
                      <button
                        className="action-btn action-delete" title="Delete"
                        disabled={deleting === t.id}
                        onClick={() => handleDelete(t.id, t.name)}
                      >{deleting === t.id ? '…' : <i className="fas fa-times"></i>}</button>
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
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="page-btn">← Prev</button>
          <span className="page-info">Page {page} of {totalPages} · {total} total</span>
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="page-btn">Next →</button>
        </div>
      )}
    </div>
  )
}
