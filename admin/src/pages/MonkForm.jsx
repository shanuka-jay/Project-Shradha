import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

// ─── Empty state ─────────────────────────────────────────────────────────────
const EMPTY = {
  legalName:      '',
  displayName:    '',
  titles:         '',       // "Senior Dhamma Teacher · Pali Scholar"
  role:           '',
  dateOfBirth:    '',
  ordinationDate: '',
  nationality:    '',
  residence:      '',
  languages:      '',       // comma-separated → split before POST
  biography:      '',
  quote:          '',       // pull-quote for golden block
  email:          '',
  templePhone:    '',
  address:        '',
  appointment:    'By prior arrangement only',
  profilePhoto:   '',
  linkedTempleId: '',
  status:         'published',
  socialLinks: { website: '', facebook: '', youtube: '', wikipedia: '', pinterest: '' },
}

// ─── Tiny reusable section card ───────────────────────────────────────────────
function Section({ title, children, style }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '1.75rem',
      boxShadow: 'var(--shadow-sm)', ...style,
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600,
        color: 'var(--brown-700)', marginBottom: '1.25rem',
        paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)',
      }}>{title}</h2>
      {children}
    </div>
  )
}

// ─── Sub-label (matches TempleForm style) ─────────────────────────────────────
function SubLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: 'var(--brown-500)', margin: '0.75rem 0 0.6rem',
    }}>
      <span style={{ display: 'block', width: 16, height: 2, background: 'var(--gold-400)', borderRadius: 2 }} />
      {children}
    </div>
  )
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
  const [uploading, setUploading] = useState(false)

  // ── Fetch temples list ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/temples?limit=200', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setTemples(d.temples || []))
  }, [])

  // ── Load existing monk ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return
    async function load() {
      try {
        const res = await fetch(`/api/admin/monks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error('Profile not found')
        const d = await res.json()
        setForm({
          legalName:      d.legalName      || '',
          displayName:    d.displayName    || '',
          titles:         d.titles         || '',
          role:           d.role           || '',
          dateOfBirth:    d.dateOfBirth    || '',
          ordinationDate: d.ordinationDate || '',
          nationality:    d.nationality    || '',
          residence:      d.residence      || '',
          languages:      (d.languages || []).join(', '),
          biography:      d.biography      || '',
          quote:          d.quote          || '',
          email:          d.email || d.contactInfo || '',
          templePhone:    d.templePhone    || '',
          address:        d.address        || '',
          appointment:    d.appointment    || 'By prior arrangement only',
          profilePhoto:   d.profilePhoto   || '',
          linkedTempleId: d.linkedTempleId || '',
          status:         d.status         || 'published',
          socialLinks: {
            website:   d.socialLinks?.website   || '',
            facebook:  d.socialLinks?.facebook  || '',
            youtube:   d.socialLinks?.youtube   || '',
            wikipedia: d.socialLinks?.wikipedia || '',
            pinterest: d.socialLinks?.pinterest || '',
          },
        })
      } catch (err) { setError(err.message) }
      finally { setFetchLoading(false) }
    }
    load()
  }, [id])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }
  function handleSocial(e) {
    setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [e.target.name]: e.target.value } }))
  }

  // ── Photo upload — same pattern as TempleForm ─────────────────────────
  async function uploadPhotoFile(file) {
    setUploading(true)
    const toastId = toast.loading('Uploading profile photo…')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/admin/monks/upload-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      const url = data.url || ''
      setForm(f => ({ ...f, profilePhoto: url }))
      toast.update(toastId, { render: 'Photo uploaded!', type: 'success', isLoading: false, autoClose: 2500 })
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Upload failed.', type: 'error', isLoading: false, autoClose: 3500 })
    }
    finally { setUploading(false) }
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (file) uploadPhotoFile(file)
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.legalName.trim()) {
      toast.error('Legal name is required.')
      return
    }
    setLoading(true)
    const toastId = toast.loading(isEdit ? 'Saving changes…' : 'Creating profile…')
    try {
      const payload = {
        ...form,
        languages:     form.languages.split(',').map(s => s.trim()).filter(Boolean),
        linkedTempleId: form.linkedTempleId || null,
        contactInfo:   form.email,
      }
      const url    = isEdit ? `/api/admin/monks/${id}` : '/api/admin/monks'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.update(toastId, {
        render: isEdit ? 'Profile updated successfully!' : 'Profile created successfully!',
        type: 'success', isLoading: false, autoClose: 2500,
      })
      if (!isEdit) setTimeout(() => navigate('/monks'), 1200)
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Save failed.', type: 'error', isLoading: false, autoClose: 3500 })
    }
    finally { setLoading(false) }
  }

  if (fetchLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-2)' }}>Loading…</div>

  // ── Shared style tokens ────────────────────────────────────────────────────
  const inp = {
    width: '100%', padding: '0.55rem 0.75rem',
    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
    background: 'var(--surface)', color: 'var(--text)', fontSize: '0.875rem',
  }
  const lbl = {
    display: 'block', fontSize: '0.78rem', fontWeight: 600,
    color: 'var(--text-3)', marginBottom: '0.3rem',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  }
  const grp = { marginBottom: '1rem' }
  const two = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }

  return (
    <div style={{ padding: '2rem', maxWidth: 1180 }}>
      <style>{`
        .mf-upload-zone {
          border: 2px dashed var(--border-2);
          border-radius: var(--radius);
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: border-color .18s, background .18s;
          background: var(--brown-50);
        }
        .mf-upload-zone:hover { border-color: var(--brown-400); background: var(--brown-100); }
        .mf-upload-zone.uploading { opacity: .7; cursor: wait; }
        .mf-photo-circle {
          width: 100px; height: 100px;
          border-radius: 50%; object-fit: cover; object-position: top;
          border: 3px solid var(--border-2);
          display: block; margin: 0 auto .75rem;
        }
        .mf-photo-ph {
          width: 100px; height: 100px;
          border-radius: 50%; background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; color: var(--muted);
          margin: 0 auto .75rem;
        }
        .mf-upload-hint { font-size:.78rem; color:var(--text-3); margin-top:.4rem; }
        .mf-social-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
        @media(max-width:820px){.mf-social-grid{grid-template-columns:1fr 1fr;}}
        .mf-contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
        @media(max-width:640px){.mf-contact-grid{grid-template-columns:1fr;}}
        .mf-banner-note {
          background:var(--brown-50); border:1px solid var(--border);
          border-radius:var(--radius-sm); padding:.6rem .9rem;
          font-size:.8rem; color:var(--text-3);
          display:flex; align-items:center; gap:.5rem; margin-bottom:1.5rem;
        }
        .mf-url-row { display:flex; gap:.5rem; margin-top:.5rem; }
        .mf-url-btn {
          padding:.4rem .75rem; font-size:.75rem;
          border:1px solid var(--border); border-radius:var(--radius-sm);
          background:var(--surface); color:var(--text-2);
          cursor:pointer; font-family:var(--font-body); white-space:nowrap;
          transition:background .14s;
        }
        .mf-url-btn:hover { background:var(--surface-2); }
      `}</style>

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Monk Profile' : 'Add Monk Profile'}</h1>
          <p className="page-desc">Maintain accurate, respectful profiles for monastics in the directory.</p>
        </div>
        <Link to="/monks" className="btn-back">← Back to Profiles</Link>
      </div>

      <div className="mf-banner-note">
        <i className="fas fa-image" />
        The hero banner image on the public profile page is shared across all monk profiles — manage it in Media settings.
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── ROW 1: Photo  +  Profile Details ────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>

            {/* Photo card */}
            <Section title="Profile Photo">
              {/* Upload zone — same UX as TempleForm */}
              <label htmlFor="photoFileInput">
                <div className={`mf-upload-zone${uploading ? ' uploading' : ''}`}>
                  {form.profilePhoto
                    ? <img className="mf-photo-circle" src={form.profilePhoto} alt="preview"
                        onError={e => { e.target.style.display = 'none' }} />
                    : <div className="mf-photo-ph"><i className="fas fa-praying-hands" /></div>
                  }
                  <div style={{ fontSize: '.82rem', color: 'var(--text-2)', fontWeight: 500 }}>
                    {uploading ? 'Uploading to Cloudinary…' : 'Click to upload photo'}
                  </div>
                  <div className="mf-upload-hint">JPG, PNG, WEBP · max 10 MB</div>
                </div>
              </label>
              <input id="photoFileInput" type="file" accept="image/*"
                style={{ display: 'none' }} onChange={handlePhotoChange} disabled={uploading} />

              {/* Or paste URL */}
              <div style={{ marginTop: '1rem' }}>
                <label style={lbl}>Or paste Local Storage URL From Media Library</label>
                <div className="mf-url-row">
                  <input style={{ ...inp, flex: 1 }} name="profilePhoto"
                    value={form.profilePhoto} onChange={handleChange} placeholder="/uploads/…" />
                  {form.profilePhoto && (
                    <button type="button" className="mf-url-btn"
                      onClick={() => setForm(f => ({ ...f, profilePhoto: '' }))}>✕</button>
                  )}
                </div>
              </div>
            </Section>

            {/* Profile details */}
            <Section title="Profile Details">
              <SubLabel>Identity</SubLabel>
              <div style={two}>
                <div style={grp}>
                  <label style={lbl}>Legal Name <span style={{ color: '#c0392b' }}>*</span></label>
                  <input style={inp} name="legalName" value={form.legalName} onChange={handleChange}
                    placeholder="Full legal name" required />
                </div>
                <div style={grp}>
                  <label style={lbl}>Display / Dharma Name</label>
                  <input style={inp} name="displayName" value={form.displayName} onChange={handleChange}
                    placeholder="Ven. Dhammika Thero" />
                </div>
              </div>
              <div style={grp}>
                <label style={lbl}>Titles / Specialisations</label>
                <input style={inp} name="titles" value={form.titles} onChange={handleChange}
                  placeholder="Senior Dhamma Teacher · Pali Scholar" />
                <div style={{ fontSize: '.73rem', color: 'var(--text-3)', marginTop: '.25rem' }}>
                  Shown under the name on the public profile. Separate with ·
                </div>
              </div>

              <SubLabel>Details</SubLabel>
              <div style={two}>
                <div style={grp}>
                  <label style={lbl}>Date of Birth</label>
                  <input style={inp} name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                    placeholder="e.g. 5 January 1920" />
                </div>
                <div style={grp}>
                  <label style={lbl}>Ordination Date</label>
                  <input style={inp} name="ordinationDate" value={form.ordinationDate} onChange={handleChange}
                    placeholder="e.g. 24 June 1954 · Received Upasampada" />
                </div>
              </div>
              <div style={two}>
                <div style={grp}>
                  <label style={lbl}>Nationality</label>
                  <input style={inp} name="nationality" value={form.nationality} onChange={handleChange}
                    placeholder="e.g. British · Sri Lankan Resident" />
                </div>
                <div style={grp}>
                  <label style={lbl}>Residence</label>
                  <input style={inp} name="residence" value={form.residence} onChange={handleChange}
                    placeholder="Kandy, Sri Lanka" />
                </div>
              </div>
              <div style={two}>
                <div style={grp}>
                  <label style={lbl}>Languages <span style={{ fontSize: '.72rem', fontWeight: 400, textTransform: 'none' }}>(comma-separated)</span></label>
                  <input style={inp} name="languages" value={form.languages} onChange={handleChange}
                    placeholder="English, Pali, Sinhala, French" />
                </div>
                <div style={grp}>
                  <label style={lbl}>Role / Title</label>
                  <input style={inp} name="role" value={form.role} onChange={handleChange}
                    placeholder="Abbot, Chief Incumbent, President…" />
                </div>
              </div>
            </Section>
          </div>

          {/* ── ROW 2: Biography + Pull Quote ────────────────────────────────── */}
          <Section title="Biography — About the Venerable">
            <div style={two}>
              <div style={grp}>
                <label style={lbl}>Full Biography</label>
                <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }}
                  name="biography" value={form.biography} onChange={handleChange} rows={9}
                  placeholder="Write a detailed biography. Paragraphs are preserved on the public profile page." />
              </div>
              <div>
                <div style={grp}>
                  <label style={lbl}>Pull Quote</label>
                  <textarea style={{ ...inp, resize: 'vertical', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: '.95rem', lineHeight: 1.6 }}
                    name="quote" value={form.quote} onChange={handleChange} rows={5}
                    placeholder={`"The purpose of the Dhamma is not to give a beautiful philosophy but to end suffering…"`} />
                  <div style={{ fontSize: '.73rem', color: 'var(--text-3)', marginTop: '.3rem' }}>
                    Displayed in the golden block on the public profile. Include surrounding quotation marks.
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── ROW 3: Contact & Enquiries ───────────────────────────────────── */}
          <Section title="Contact & Enquiries">
            <p style={{ fontSize: '.82rem', color: 'var(--text-3)', marginBottom: '1rem' }}>
              Displayed in the "Get In Touch" section of the public profile page.
            </p>
            <div className="mf-contact-grid">
              <div style={grp}>
                <label style={lbl}><i className="fas fa-envelope" style={{ marginRight: 6 }} />Email</label>
                <input style={inp} name="email" value={form.email} onChange={handleChange}
                  placeholder="contact@saddha.org" type="email" />
              </div>
              <div style={grp}>
                <label style={lbl}><i className="fas fa-phone" style={{ marginRight: 6 }} />Temple Phone</label>
                <input style={inp} name="templePhone" value={form.templePhone} onChange={handleChange}
                  placeholder="+94 81 234 5678" />
              </div>
              <div style={grp}>
                <label style={lbl}><i className="fas fa-map-marker-alt" style={{ marginRight: 6 }} />Address</label>
                <input style={inp} name="address" value={form.address} onChange={handleChange}
                  placeholder="Bundala Forest Hermitage, Southern Province" />
              </div>
              <div style={grp}>
                <label style={lbl}><i className="fas fa-calendar-check" style={{ marginRight: 6 }} />Appointment</label>
                <input style={inp} name="appointment" value={form.appointment} onChange={handleChange}
                  placeholder="By prior arrangement only" />
              </div>
            </div>
          </Section>

          {/* ── ROW 4: Social Links  +  Directory Settings ───────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>

            <Section title="Connect — Social Links">
              <div className="mf-social-grid">
                {[
                  { name: 'youtube',   icon: 'fab fa-youtube',    label: 'YouTube',    ph: 'Channel URL' },
                  { name: 'facebook',  icon: 'fab fa-facebook',   label: 'Facebook',   ph: 'Profile URL' },
                  { name: 'website',   icon: 'fas fa-globe',      label: 'Website',    ph: 'https://…' },
                  { name: 'wikipedia', icon: 'fab fa-wikipedia-w', label: 'Wikipedia', ph: 'Article URL' },
                  { name: 'pinterest', icon: 'fab fa-pinterest',  label: 'Pinterest',  ph: 'Profile URL' },
                ].map(({ name, icon, label, ph }) => (
                  <div key={name} style={grp}>
                    <label style={lbl}><i className={icon} style={{ marginRight: 5 }} />{label}</label>
                    <input style={inp} name={name} value={form.socialLinks[name]} onChange={handleSocial} placeholder={ph} />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Directory Settings">
              <div style={grp}>
                <label style={lbl}>Linked Temple</label>
                <select style={inp} name="linkedTempleId" value={form.linkedTempleId} onChange={handleChange}>
                  <option value="">— None —</option>
                  {temples.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.state})</option>
                  ))}
                </select>
              </div>
              <div style={grp}>
                <label style={lbl}>Publication Status</label>
                <select style={inp} name="status" value={form.status} onChange={handleChange}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div style={{
                marginTop: '.5rem', padding: '.7rem', background: 'var(--brown-50)',
                borderRadius: 'var(--radius-sm)', fontSize: '.76rem', color: 'var(--text-3)', lineHeight: 1.55,
              }}>
                <strong style={{ color: 'var(--text-2)' }}>Draft</strong> — visible only in admin.<br />
                <strong style={{ color: 'var(--text-2)' }}>Published</strong> — live on public directory.
              </div>
            </Section>
          </div>

        </div>{/* end column stack */}

        {/* ── Save bar ─────────────────────────────────────────────────────── */}
        <div className="form-actions" style={{
          marginTop: '1.5rem', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem 1.75rem',
        }}>
          <Link to="/monks" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={loading || uploading}>
            {loading ? 'Saving…' : isEdit ? '✓ Save Changes' : '＋ Create Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
