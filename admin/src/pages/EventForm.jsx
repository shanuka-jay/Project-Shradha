import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const EVENT_TYPES = ['Dhamma Service','Meditation','School','Celebration','Vesak','Poson Poya','Other']
const EMPTY = { title:'', dateTime:'', endDateTime:'', eventType:'Dhamma Service', description:'', linkedTempleId:'', recurring:false, recurringPattern:'', status:'published' }

export default function EventForm() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [temples, setTemples] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch('/api/admin/temples?limit=200', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setTemples(d.temples || []))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    async function load() {
      try {
        const res = await fetch(`/api/admin/events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error('Event not found')
        const data = await res.json()
        setForm({
          title: data.title || '', eventType: data.eventType || 'Dhamma Service',
          dateTime: data.dateTime ? data.dateTime.slice(0, 16) : '',
          endDateTime: data.endDateTime ? data.endDateTime.slice(0, 16) : '',
          description: data.description || '', linkedTempleId: data.linkedTempleId || '',
          recurring: data.recurring || false, recurringPattern: data.recurringPattern || '',
          status: data.status || 'published',
        })
      } catch (err) { setError(err.message) }
      finally { setFetchLoading(false) }
    }
    load()
  }, [id])

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
    setError(''); setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.dateTime) { setError('Title and date/time are required.'); return }
    setLoading(true)
    try {
      const payload = { ...form, linkedTempleId: form.linkedTempleId || null }
      const url = isEdit ? `/api/admin/events/${id}` : '/api/admin/events'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSuccess(isEdit ? 'Event updated.' : 'Event created.')
      if (!isEdit) setTimeout(() => navigate('/events'), 1200)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (fetchLoading) return <div style={{ padding:'3rem', textAlign:'center', color:'var(--text-2)' }}>Loading…</div>

  const inputStyle = { width:'100%', padding:'0.55rem 0.75rem', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', background:'var(--surface)', color:'var(--text)', fontSize:'0.875rem' }
  const labelStyle = { display:'block', fontSize:'0.8rem', fontWeight:500, color:'var(--text-2)', marginBottom:'0.35rem' }
  const groupStyle = { marginBottom:'1rem' }

  return (
    <div style={{ padding:'2rem', maxWidth:800 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Event' : 'Add New Event'}</h1>
          <p className="page-desc">Manage Dhamma programs, celebrations, and recurring services.</p>
        </div>
        <Link to="/events" className="btn-back">← Back to Events</Link>
      </div>

      {error && <div className="form-alert form-alert-error">⚠ {error}</div>}
      {success && <div className="form-alert form-alert-success">✓ {success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'2rem', boxShadow:'var(--shadow-sm)' }}>
          <div style={groupStyle}><label style={labelStyle}>Event Title <span style={{color:'#c0392b'}}>*</span></label><input style={inputStyle} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Vesak Day Celebration" required /></div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div style={groupStyle}>
              <label style={labelStyle}>Event Type</label>
              <select style={inputStyle} name="eventType" value={form.eventType} onChange={handleChange}>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>Linked Temple</label>
              <select style={inputStyle} name="linkedTempleId" value={form.linkedTempleId} onChange={handleChange}>
                <option value="">— None —</option>
                {temples.map(t => <option key={t.id} value={t.id}>{t.name} ({t.state})</option>)}
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div style={groupStyle}><label style={labelStyle}>Start Date & Time <span style={{color:'#c0392b'}}>*</span></label><input style={inputStyle} type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} required /></div>
            <div style={groupStyle}><label style={labelStyle}>End Date & Time</label><input style={inputStyle} type="datetime-local" name="endDateTime" value={form.endDateTime} onChange={handleChange} /></div>
          </div>

          <div style={groupStyle}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize:'vertical' }} name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Event details…" /></div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div style={groupStyle}>
              <label style={{ ...labelStyle, display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
                <input type="checkbox" name="recurring" checked={form.recurring} onChange={handleChange} />
                <span>Recurring Event</span>
              </label>
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {form.recurring && (
            <div style={groupStyle}><label style={labelStyle}>Recurring Pattern</label><input style={inputStyle} name="recurringPattern" value={form.recurringPattern} onChange={handleChange} placeholder="e.g. Every full moon, Weekly Sunday" /></div>
          )}
        </div>

        <div className="form-actions" style={{ marginTop:'1.5rem', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.25rem 1.75rem' }}>
          <Link to="/events" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Saving…' : isEdit ? '✓ Save Changes' : '＋ Create Event'}</button>
        </div>
      </form>
    </div>
  )
}
