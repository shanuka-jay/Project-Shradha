import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Messages.css'

export default function Messages() {
  const { token } = useAuth()
  const [messages, setMessages]       = useState([])
  const [total, setTotal]             = useState(0)
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null)
  const [filterUnread, setFilterUnread] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [page, setPage]               = useState(1)
  const limit = 20

  async function fetchMessages() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (filterUnread)  params.set('unread', 'true')
    if (showArchived)  params.set('archived', 'true')
    try {
      const res = await fetch(`/api/admin/messages?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setMessages(data.messages || [])
      setTotal(data.total || 0)
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMessages() }, [page, filterUnread, showArchived])

  async function markRead(id) {
    await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
    })
    setMessages(ms => ms.map(m => m.id === id ? { ...m, read: true } : m))
    if (selected?.id === id) setSelected(s => ({ ...s, read: true }))
  }

  async function handleArchive(id) {
    await fetch(`/api/admin/messages/${id}/archive`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
    })
    setMessages(ms => ms.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Permanently delete this message?')) return
    await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    })
    setMessages(ms => ms.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
    setTotal(t => t - 1)
  }

  function openMessage(msg) {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  const unreadCount  = messages.filter(m => !m.read).length
  const totalPages   = Math.ceil(total / limit)

  return (
    <div className="messages-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Messages</h1>
          <p className="page-desc">{total} message{total !== 1 ? 's' : ''} · {unreadCount} unread</p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap' }}>
          <label className="unread-toggle">
            <input type="checkbox" checked={filterUnread}
              onChange={e => { setFilterUnread(e.target.checked); setShowArchived(false); setPage(1) }} />
            <span>Unread only</span>
          </label>
          <label className="unread-toggle">
            <input type="checkbox" checked={showArchived}
              onChange={e => { setShowArchived(e.target.checked); setFilterUnread(false); setPage(1) }} />
            <span>Archived</span>
          </label>
        </div>
      </div>

      <div className="messages-layout">
        {/* ── List panel ── */}
        <div className="messages-list">
          {loading ? (
            <div className="msg-loading">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="msg-empty">
              <i className="fas fa-envelope" style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}></i>
              <p>No messages found.</p>
            </div>
          ) : (
            messages.map(m => (
              <div
                key={m.id}
                className={`msg-item${selected?.id === m.id ? ' active' : ''}${!m.read ? ' unread' : ''}`}
                onClick={() => openMessage(m)}
              >
                {!m.read && <span className="unread-dot" />}
                <div className="msg-item-name">{m.firstName} {m.lastName}</div>
                <div className="msg-item-email">{m.email}</div>
                <div className="msg-item-preview">
                  {m.message?.slice(0, 72)}{m.message?.length > 72 ? '…' : ''}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.2rem' }}>
                  <div className="msg-item-date">
                    {new Date(m.createdAt).toLocaleDateString('en-US', { month:'short', day:'2-digit' })}
                  </div>
                  {m.purpose && (
                    <span style={{ fontSize:'0.66rem', background:'var(--brown-100)', color:'var(--brown-600)', borderRadius:99, padding:'0.1rem 0.4rem' }}>
                      {m.purpose}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          {totalPages > 1 && (
            <div className="pagination-mini">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>←</button>
              <span>{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>→</button>
            </div>
          )}
        </div>

        {/* ── Detail panel ── */}
        <div className="message-detail">
          {selected ? (
            <>
              <div className="detail-header">
                <div>
                  <h2 className="detail-name">{selected.firstName} {selected.lastName}</h2>
                  <a href={`mailto:${selected.email}`} className="detail-email">{selected.email}</a>
                </div>
                <div className="detail-actions">
                  {!selected.archived && (
                    <button className="detail-action-btn" onClick={() => handleArchive(selected.id)}>
                      📥 Archive
                    </button>
                  )}
                  <button className="detail-delete" onClick={() => handleDelete(selected.id)}>
                    ✕ Delete
                  </button>
                </div>
              </div>

              <div className="detail-meta">
                {selected.templeName && <span className="detail-tag">🏯 {selected.templeName}</span>}
                {selected.purpose    && <span className="detail-tag">{selected.purpose}</span>}
                {selected.read       && <span className="detail-tag" style={{ background:'#f0fdf4', color:'#15803d' }}>✓ Read</span>}
                {selected.archived   && <span className="detail-tag" style={{ background:'#f0f9ff', color:'#0369a1' }}>📥 Archived</span>}
                <span className="detail-date">
                  {new Date(selected.createdAt).toLocaleString('en-US', { dateStyle:'medium', timeStyle:'short' })}
                </span>
              </div>

              <div className="detail-body">{selected.message}</div>

              <a
                href={`mailto:${selected.email}?subject=Re: Your inquiry to Saddha.org`}
                className="detail-reply"
              >
                <i className="fas fa-envelope"></i> Reply via Email →
              </a>
            </>
          ) : (
            <div className="detail-empty">
              <i className="fas fa-envelope" style={{ fontSize:'3rem', marginBottom:'0.75rem', opacity:0.15 }}></i>
              <p>Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
