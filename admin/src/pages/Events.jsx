import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const EVENT_TYPES = ['Dhamma Service','Meditation','School','Celebration','Vesak','Poson Poya','Other']

export default function Events() {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleting, setDeleting] = useState(null)
  const limit = 20

  async function fetchEvents() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (search) params.set('search', search)
    if (filterType) params.set('type', filterType)
    if (filterStatus) params.set('status', filterStatus)
    try {
      const res = await fetch(`/api/admin/events?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setEvents(data.events || [])
      setTotal(data.total || 0)
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEvents() }, [page, filterType, filterStatus])
  useEffect(() => { const t = setTimeout(() => fetchEvents(), 350); return () => clearTimeout(t) }, [search])

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete event "${title}"?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      fetchEvents()
    } catch { }
    finally { setDeleting(null) }
  }

  function formatDateTime(dt) {
    return new Date(dt).toLocaleString('en-US', { month:'short', day:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ padding: '2rem', maxWidth: 1200 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-desc">{total} event{total !== 1 ? 's' : ''} scheduled</p>
        </div>
        <Link to="/events/new" className="btn-primary-action">＋ Add New Event</Link>
      </div>

      <div className="filter-bar">
        <input type="search" className="filter-input" placeholder="Search events…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <select className="filter-select" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }}>
          <option value="">All Types</option>
          {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="temples-table-wrap">
        {loading ? <div className="table-loading">Loading events…</div>
        : events.length === 0 ? (
          <div className="table-empty">
            <i className="fas fa-calendar" style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}></i>
            <p>No events found.</p>
            <Link to="/events/new" className="btn-primary-action" style={{ marginTop:'1rem' }}>Add first event</Link>
          </div>
        ) : (
          <table className="temples-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Temple</th>
                <th>Recurring</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td>
                    <div className="td-temple-name">{ev.title}</div>
                    {ev.description && <div className="td-temple-addr">{ev.description.slice(0, 60)}{ev.description.length > 60 ? '…' : ''}</div>}
                  </td>
                  <td>
                    <span style={{ padding:'0.2rem 0.6rem', background:'var(--brown-100)', color:'var(--brown-700)', borderRadius:99, fontSize:'0.75rem', fontWeight:500 }}>
                      {ev.eventType}
                    </span>
                  </td>
                  <td style={{ fontSize:'0.82rem', color:'var(--text-2)' }}>{formatDateTime(ev.dateTime)}</td>
                  <td style={{ fontSize:'0.85rem', color:'var(--text-2)' }}>{ev.temple?.name || '—'}</td>
                  <td style={{ textAlign:'center', fontSize:'1rem' }}>{ev.recurring ? '🔁' : '—'}</td>
                  <td><span className={`badge badge-${ev.status}`}>{ev.status}</span></td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/events/${ev.id}/edit`} className="action-btn action-edit" title="Edit">✎</Link>
                      <button className="action-btn action-delete" title="Delete" disabled={deleting === ev.id}
                        onClick={() => handleDelete(ev.id, ev.title)}>✕</button>
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
