import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const EMPTY = {
  legalName:'', displayName:'', ordinationDate:'', nationality:'', residence:'',
  languages:'', biography:'', role:'', profilePhoto:'', contactInfo:'',
  linkedTempleId:'', status:'published',
  socialLinks: { website:'', facebook:'', youtube:'' }
}

export default function MonkForm() {
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
        const res = await fetch(`/api/admin/monks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error('Profile not found')
        const data = await res.json()
        setForm({
          legalName: data.legalName || '', displayName: data.displayName || '',
          ordinationDate: data.ordinationDate || '', nationality: data.nationality || '',
          residence: data.residence || '', languages: (data.languages || []).join(', '),
          biography: data.biography || '', role: data.role || '',
          profilePhoto: data.profilePhoto || '', contactInfo: data.contactInfo || '',
          linkedTempleId: data.linkedTempleId || '', status: data.status || 'published',
          socialLinks: data.socialLinks || { website:'', facebook:'', youtube:'' },
        })
      } catch (err) { setError(err.message) }
      finally { setFetchLoading(false) }
    }
    load()
  }, [id])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(''); setSuccess('')
  }
  function handleSocial(e) {
    setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [e.target.name]: e.target.value } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.legalName.trim()) { setError('Legal name is required.'); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
        linkedTempleId: form.linkedTempleId || null,
      }
      const url = isEdit ? `/api/admin/monks/${id}` : '/api/admin/monks'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSuccess(isEdit ? 'Profile updated.' : 'Profile created.')
      if (!isEdit) setTimeout(() => navigate('/monks'), 1200)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (fetchLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-2)' }}>Loading…</div>

  const inputStyle = { width:'100%', padding:'0.55rem 0.75rem', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', background:'var(--surface)', color:'var(--text)', fontSize:'0.875rem' }
  const labelStyle = { display:'block', fontSize:'0.8rem', fontWeight:500, color:'var(--text-2)', marginBottom:'0.35rem' }
  const groupStyle = { marginBottom:'1rem' }

  return (
    <div style={{ padding:'2rem', maxWidth:1100 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Monk Profile' : 'Add Monk Profile'}</h1>
          <p className="page-desc">Maintain accurate, respectful profiles for monastics in the directory.</p>
        </div>
        <Link to="/monks" className="btn-back">← Back to Profiles</Link>
      </div>

      {error && <div className="form-alert form-alert-error">⚠ {error}</div>}
      {success && <div className="form-alert form-alert-success">✓ {success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>

          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.75rem', boxShadow:'var(--shadow-sm)' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:600, color:'var(--brown-700)', marginBottom:'1.25rem', paddingBottom:'0.5rem', borderBottom:'1px solid var(--border)' }}>Personal Information</h2>

            <div style={groupStyle}><label style={labelStyle}>Legal Name <span style={{color:'#c0392b'}}>*</span></label><input style={inputStyle} name="legalName" value={form.legalName} onChange={handleChange} placeholder="Full legal name" required /></div>
            <div style={groupStyle}><label style={labelStyle}>Display / Dharma Name</label><input style={inputStyle} name="displayName" value={form.displayName} onChange={handleChange} placeholder="Ven. Dhammika" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <div style={groupStyle}><label style={labelStyle}>Nationality</label><input style={inputStyle} name="nationality" value={form.nationality} onChange={handleChange} placeholder="e.g. Sri Lankan" /></div>
              <div style={groupStyle}><label style={labelStyle}>Ordination Date</label><input style={inputStyle} name="ordinationDate" value={form.ordinationDate} onChange={handleChange} placeholder="e.g. 1995-06-15" /></div>
            </div>
            <div style={groupStyle}><label style={labelStyle}>Residence</label><input style={inputStyle} name="residence" value={form.residence} onChange={handleChange} placeholder="City, State" /></div>
            <div style={groupStyle}><label style={labelStyle}>Languages <span style={{fontSize:'0.75rem', color:'var(--text-3)', fontWeight:400}}>(comma-separated)</span></label><input style={inputStyle} name="languages" value={form.languages} onChange={handleChange} placeholder="Sinhala, English, Pali" /></div>
            <div style={groupStyle}><label style={labelStyle}>Role / Title</label><input style={inputStyle} name="role" value={form.role} onChange={handleChange} placeholder="e.g. Chief Monk, Teacher" /></div>
            <div style={groupStyle}>
              <label style={labelStyle}>Linked Temple</label>
              <select style={inputStyle} name="linkedTempleId" value={form.linkedTempleId} onChange={handleChange}>
                <option value="">— None —</option>
                {temples.map(t => <option key={t.id} value={t.id}>{t.name} ({t.state})</option>)}
              </select>
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.75rem', boxShadow:'var(--shadow-sm)' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:600, color:'var(--brown-700)', marginBottom:'1.25rem', paddingBottom:'0.5rem', borderBottom:'1px solid var(--border)' }}>Biography & Contact</h2>
              <div style={groupStyle}>
                <label style={labelStyle}>Biography</label>
                <textarea style={{ ...inputStyle, resize:'vertical' }} name="biography" value={form.biography} onChange={handleChange} rows={5} placeholder="Brief biography…" />
              </div>
              <div style={groupStyle}><label style={labelStyle}>Contact Info</label><input style={inputStyle} name="contactInfo" value={form.contactInfo} onChange={handleChange} placeholder="Phone or email" /></div>
            </div>

            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.75rem', boxShadow:'var(--shadow-sm)' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:600, color:'var(--brown-700)', marginBottom:'1.25rem', paddingBottom:'0.5rem', borderBottom:'1px solid var(--border)' }}>Photo & Social Links</h2>
              <div style={groupStyle}>
                <label style={labelStyle}>Profile Photo URL</label>
                <input style={inputStyle} name="profilePhoto" value={form.profilePhoto} onChange={handleChange} placeholder="https://…" />
                {form.profilePhoto && <img src={form.profilePhoto} alt="" style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', marginTop:'0.5rem', border:'2px solid var(--border)' }} onError={e => { e.target.style.display='none' }} />}
              </div>
              <div style={groupStyle}><label style={labelStyle}>Website</label><input style={inputStyle} name="website" value={form.socialLinks.website} onChange={handleSocial} placeholder="https://…" /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div style={groupStyle}><label style={labelStyle}>Facebook</label><input style={inputStyle} name="facebook" value={form.socialLinks.facebook} onChange={handleSocial} placeholder="Profile URL" /></div>
                <div style={groupStyle}><label style={labelStyle}>YouTube</label><input style={inputStyle} name="youtube" value={form.socialLinks.youtube} onChange={handleSocial} placeholder="Channel URL" /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop:'1.5rem', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.25rem 1.75rem' }}>
          <Link to="/monks" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Saving…' : isEdit ? '✓ Save Changes' : '＋ Create Profile'}</button>
        </div>
      </form>
    </div>
  )
}
