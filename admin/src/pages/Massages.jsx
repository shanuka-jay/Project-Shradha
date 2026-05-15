import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Massages.css'

/* ── Deterministic avatar colour from name ── */
const AVATAR_COLORS = [
  ['#5a7a52','#fff'], ['#4a6fa5','#fff'], ['#b07d3e','#fff'],
  ['#7a5a9e','#fff'], ['#3a8a7a','#fff'], ['#a05050','#fff'],
  ['#6b7a3e','#fff'], ['#4a7a8a','#fff'],
]
function avatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}
function initials(first = '', last = '') {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

/* ── Human-friendly date label ── */
function dateLabel(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0)
    return d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7)
    return d.toLocaleDateString('en-US', { month:'short', day:'2-digit' })
  return d.toLocaleDateString('en-US', { month:'short', day:'2-digit' })
}

function fullDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month:'long', day:'numeric', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  }).toUpperCase()
}

export default function Messages() {
  const { token } = useAuth()
  const [messages, setMessages]         = useState([])
  const [total, setTotal]               = useState(0)
  const [loading, setLoading]           = useState(true)
  const [selected, setSelected]         = useState(null)
  const [filterUnread, setFilterUnread] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [page, setPage]                 = useState(1)
  const limit = 20

  async function fetchMessages() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (filterUnread) params.set('unread', 'true')
    if (showArchived) params.set('archived', 'true')
    try {
      const res  = await fetch(`/api/admin/messages?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setMessages(data.messages || [])
      setTotal(data.total || 0)
    } catch {}
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

  const unreadCount = messages.filter(m => !m.read).length
  const totalPages  = Math.ceil(total / limit)

  return (
    <div className="messages-page">

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Messages</h1>
          <p className="page-desc">
            {total} message{total !== 1 ? 's' : ''} · {unreadCount} unread
          </p>
        </div>
        <div className="msg-filters">
          <label className="msg-filter-toggle">
            <input type="checkbox" checked={filterUnread}
              onChange={e => { setFilterUnread(e.target.checked); setShowArchived(false); setPage(1) }} />
            <span>Unread only</span>
          </label>
          <label className="msg-filter-toggle">
            <input type="checkbox" checked={showArchived}
              onChange={e => { setShowArchived(e.target.checked); setFilterUnread(false); setPage(1) }} />
            <span>Archived</span>
          </label>
        </div>
      </div>

      {/* ── Two-panel layout ── */}
      <div className="messages-layout">

        {/* ── Left: message list ── */}
        <div className="messages-list">
          {loading ? (
            <div className="msg-state">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="msg-state">
              <i className="fas fa-envelope" style={{ fontSize:'2.2rem', opacity:.2, marginBottom:'.5rem' }} />
              <p>No messages found.</p>
            </div>
          ) : (
            messages.map(m => {
              const name  = `${m.firstName} ${m.lastName}`
              const [bg, fg] = avatarColor(name)
              const init  = initials(m.firstName, m.lastName)
              const isActive = selected?.id === m.id

              return (
                <div
                  key={m.id}
                  className={`msg-row${isActive ? ' active' : ''}${!m.read ? ' unread' : ''}`}
                  onClick={() => openMessage(m)}
                >
                  {/* Avatar */}
                  <div className="msg-avatar" style={{ background: bg, color: fg }}>
                    {init}
                  </div>

                  {/* Content */}
                  <div className="msg-row-body">
                    <div className="msg-row-top">
                      <span className="msg-row-name">{name}</span>
                      <span className="msg-row-date">{dateLabel(m.createdAt)}</span>
                    </div>
                    {m.purpose && (
                      <div className="msg-row-purpose">{m.purpose}</div>
                    )}
                    <div className="msg-row-preview">
                      {m.message?.slice(0, 80)}{m.message?.length > 80 ? '…' : ''}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!m.read && <span className="msg-unread-dot" />}
                </div>
              )
            })
          )}

          {totalPages > 1 && (
            <div className="msg-pagination">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>←</button>
              <span>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>→</button>
            </div>
          )}
        </div>

        {/* ── Right: detail pane ── */}
        <div className="message-detail">
          {selected ? (() => {
            const name = `${selected.firstName} ${selected.lastName}`
            const [bg, fg] = avatarColor(name)
            const init = initials(selected.firstName, selected.lastName)

            return (
              <div className="detail-inner">
                {/* Sender strip */}
                <div className="detail-sender-row">
                  <div className="detail-avatar" style={{ background: bg, color: fg }}>{init}</div>
                  <div>
                    <div className="detail-sender-name">{name}</div>
                    <div className="detail-sender-email">{selected.email}</div>
                  </div>
                  <div className="detail-actions">
                    {!selected.archived && (
                      <button className="detail-btn detail-btn-archive" onClick={() => handleArchive(selected.id)}>
                        <i className="fas fa-archive" /> Archive
                      </button>
                    )}
                    <button className="detail-btn detail-btn-delete" onClick={() => handleDelete(selected.id)}>
                      <i className="fas fa-times" /> Delete
                    </button>
                  </div>
                </div>

                {/* Subject heading */}
                {selected.purpose && (
                  <h2 className="detail-subject">{selected.purpose}</h2>
                )}

                {/* Received timestamp */}
                <p className="detail-received">
                  RECEIVED {fullDate(selected.createdAt)}
                </p>

                <hr className="detail-divider" />

                {/* Message body */}
                <div className="detail-body">
                  {selected.message?.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {/* Reply link */}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.purpose || 'Your inquiry to Saddha.org'}`}
                  className="detail-reply"
                >
                  <i className="fas fa-reply" /> Reply via Email
                </a>
              </div>
            )
          })() : (
            <div className="detail-empty">
              <i className="fas fa-envelope-open" />
              <p>Select a message to read it</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
