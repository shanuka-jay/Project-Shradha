import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import './TempleForm.css'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','DC']

const SERVICE_ICONS = [
  { id: 'sun',        label: 'Dhamma Service',  path: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 100 10 5 5 0 000-10z' },
  { id: 'moon',       label: 'Poya Day',         path: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' },
  { id: 'book-open',  label: 'Dhamma School',    path: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
  { id: 'heart',      label: 'Community',        path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  { id: 'music',      label: 'Chanting',         path: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
  { id: 'users',      label: 'Meditation',       path: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z' },
  { id: 'star',       label: 'Special Event',    path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'calendar',   label: 'Weekly Program',   path: 'M3 4h18M8 4V2m8 2V2M3 10h18M5 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5z' },
  { id: 'gift',       label: 'Dana',             path: 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' },
  { id: 'globe',      label: 'Cultural Program', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
]

const TABS = ['Basic Info','Overview','History','Main Image','Chief Monk','Gallery','Services','Location','Settings']
const EMPTY_SERVICE = { name: '', icon: 'sun', time: '' }
const hasCoordValues = (lat, lng) => Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))

const EMPTY = {
  name:'', state:'', address:'', chiefMonk:'', phone:'', email:'',
  overview:'', history:'',
  mainImage:'', chiefMonkImage:'',
  galleryImages:[],
  services:[],
  images:[],
  lat:'', lng:'', status:'published', regionTag:'', mapVisible: true
}

function IconSVG({ path, size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

export default function TempleForm() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sectionLoading, setSectionLoading] = useState('')
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [geocoding, setGeocoding] = useState(false)
  const [mapPreview, setMapPreview] = useState(null)
  const [uploading, setUploading] = useState('')

  // Upload a single image. chiefMonkImage goes to its own folder so it never
  // leaks into the About page gallery; all other single images go to gallery/.
  async function uploadFile(file, field) {
    setUploading(field)
    try {
      const fd = new FormData()
      const isMonkPhoto = field === 'chiefMonkImage'
      if (isMonkPhoto) {
        fd.append('image', file)
      } else {
        fd.append('images', file)
      }
      const endpoint = isMonkPhoto
        ? '/api/admin/temples/upload-monk-photo'
        : '/api/admin/media/upload'
      const res = await fetch(endpoint, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      // /upload returns { files: [{url}] }; /upload-monk-photo returns { url }
      const url = data.url || data.files?.[0]?.url || ''
      return url
    } finally { setUploading('') }
  }

  async function handleSingleImageUpload(e, field) {
    const file = e.target.files?.[0]
    if (!file) return
    const toastId = toast.loading('Uploading image…')
    try {
      const url = await uploadFile(file, field)
      setForm(f => ({ ...f, [field]: url }))
      toast.update(toastId, { render: 'Image uploaded!', type: 'success', isLoading: false, autoClose: 2500 })
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Upload failed.', type: 'error', isLoading: false, autoClose: 3500 })
    }
  }

  async function handleGalleryUpload(files) {
    if (!files || files.length === 0) return
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!imageFiles.length) { toast.warning('Please select image files only.'); return }
    const toastId = toast.loading(`Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}…`)
    setUploading('gallery')
    try {
      const fd = new FormData()
      imageFiles.forEach(f => fd.append('images', f))
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      const newUrls = (data.files || []).map(f => f.url)
      setForm(f => ({ ...f, galleryImages: [...(f.galleryImages || []), ...newUrls] }))
      toast.update(toastId, { render: `${newUrls.length} image${newUrls.length > 1 ? 's' : ''} added to gallery.`, type: 'success', isLoading: false, autoClose: 2500 })
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Gallery upload failed.', type: 'error', isLoading: false, autoClose: 3500 })
    }
    finally { setUploading('') }
  }

  useEffect(() => {
    if (!isEdit) return
    async function load() {
      try {
        const res = await fetch(`/api/admin/temples/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error('Temple not found')
        const data = await res.json()
        const services = (data.services || []).map(s => {
          try { return JSON.parse(s) } catch { return { name: s, icon: 'sun', time: '' } }
        })
        setForm({
          name: data.name || '',
          state: data.state || '',
          address: data.address || '',
          chiefMonk: data.chiefMonk || '',
          phone: data.phone || '',
          email: data.email || '',
          overview: data.overview || '',
          history: data.history || '',
          mainImage: data.mainImage || '',
          chiefMonkImage: data.chiefMonkImage || '',
          galleryImages: data.galleryImages || [],
          images: data.images || [],
          services,
          lat: data.lat ?? '',
          lng: data.lng ?? '',
          status: data.status || 'published',
          regionTag: data.regionTag || '',
          mapVisible: data.mapVisible !== false,
        })
        if (hasCoordValues(data.lat, data.lng)) setMapPreview({ lat: data.lat, lng: data.lng })
      } catch (err) {
        toast.error(err.message || 'Failed to load temple.')
      }
      finally { setFetchLoading(false) }
    }
    load()
  }, [id])

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  async function saveSection(section, payload) {
    if (!isEdit) return
    setSectionLoading(section)
    const toastId = toast.loading('Saving…')
    try {
      const res = await fetch(`/api/admin/temples/${id}/${section}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.update(toastId, { render: 'Section saved!', type: 'success', isLoading: false, autoClose: 2000 })
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Save failed.', type: 'error', isLoading: false, autoClose: 3500 })
    }
    finally { setSectionLoading('') }
  }

  async function handleGeocode() {
    if (!form.address) { toast.warning('Enter an address first.'); return }
    setGeocoding(true)
    const toastId = toast.loading('Geocoding address…')
    try {
      const res = await fetch('/api/admin/map/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ address: `${form.address}, ${form.state}` }),
      })
      const data = await res.json()
      if (hasCoordValues(data.lat, data.lng)) {
        setForm(f => ({ ...f, lat: String(data.lat), lng: String(data.lng) }))
        setMapPreview({ lat: data.lat, lng: data.lng })
        toast.update(toastId, { render: `Geocoded: ${data.formatted}`, type: 'success', isLoading: false, autoClose: 3000 })
      } else {
        throw new Error(data.error || 'Could not geocode address.')
      }
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Geocoding failed.', type: 'error', isLoading: false, autoClose: 3500 })
    }
    finally { setGeocoding(false) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.state.trim()) {
      toast.error('Temple name and state are required.')
      return
    }
    setLoading(true)
    const toastId = toast.loading(isEdit ? 'Saving changes…' : 'Creating temple…')
    try {
      const payload = {
        ...form,
        services: form.services.map(s => JSON.stringify(s)),
        lat: form.lat !== '' ? parseFloat(form.lat) : null,
        lng: form.lng !== '' ? parseFloat(form.lng) : null,
      }
      const url = isEdit ? `/api/admin/temples/${id}` : '/api/admin/temples'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.update(toastId, {
        render: isEdit ? 'Temple updated successfully!' : 'Temple created successfully!',
        type: 'success', isLoading: false, autoClose: 2500,
      })
      if (!isEdit) setTimeout(() => navigate('/temples'), 1200)
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Save failed.', type: 'error', isLoading: false, autoClose: 3500 })
    }
    finally { setLoading(false) }
  }

  function addService() {
    setForm(f => ({ ...f, services: [...f.services, { ...EMPTY_SERVICE }] }))
  }
  function updateService(i, field, val) {
    setForm(f => {
      const svcs = [...f.services]
      svcs[i] = { ...svcs[i], [field]: val }
      return { ...f, services: svcs }
    })
  }
  function removeService(i) {
    setForm(f => ({ ...f, services: f.services.filter((_, idx) => idx !== i) }))
  }

  if (fetchLoading) return <div className="form-loading">Loading temple…</div>

  return (
    <div className="temple-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Temple' : 'Add New Temple'}</h1>
          <p className="page-desc">{isEdit ? 'Update temple information section by section.' : 'Add a new Buddhist temple to the Saddha directory.'}</p>
        </div>
        <Link to="/temples" className="btn-back">
          <IconSVG path="M19 12H5M12 19l-7-7 7-7" size={14} /> Back to Temples
        </Link>
      </div>

      <div className="tf-tabs">
        {TABS.map((tab, i) => (
          <button key={tab} className={`tf-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="temple-form">

        {/* TAB 0: Basic Info */}
        {activeTab === 0 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" size={18} color="#c19b6c" />
              <h2>Basic Information</h2>
            </div>
            <div className="tf-grid-2">
              <div className="form-group tf-span-2">
                <label>Temple Name <span className="required">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Washington Buddhist Vihara" required />
              </div>
              <div className="form-group">
                <label>State <span className="required">*</span></label>
                <select name="state" value={form.state} onChange={handleChange} required>
                  <option value="">Select state…</option>
                  {US_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Region Tag</label>
                <select name="regionTag" value={form.regionTag} onChange={handleChange}>
                  <option value="">Select region…</option>
                  <option value="Northeast">Northeast</option>
                  <option value="South">South</option>
                  <option value="Midwest">Midwest</option>
                  <option value="West">West</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group tf-span-2">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Full street address" />
              </div>
              <div className="form-group tf-span-2">
                <label>Chief Monk Name</label>
                <input name="chiefMonk" value={form.chiefMonk} onChange={handleChange} placeholder="Ven. Name Thero" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="temple@example.com" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Overview */}
        {activeTab === 1 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" size={18} color="#c19b6c" />
              <h2>Temple Overview</h2>
              <span className="tf-hint">Shown in the About / Overview section of the temple detail page</span>
            </div>
            <div className="form-group">
              <label>Overview Text</label>
              <textarea name="overview" value={form.overview} onChange={handleChange} rows={10}
                placeholder="Write a general overview of the temple — its mission, tradition, community it serves…" />
            </div>
            {isEdit && (
              <div className="tf-section-actions">
                <button type="button" className="btn-section-save"
                  disabled={sectionLoading === 'overview'}
                  onClick={() => saveSection('overview', { overview: form.overview })}>
                  <IconSVG path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" size={14} />
                  {sectionLoading === 'overview' ? 'Saving…' : 'Save Overview'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: History */}
        {activeTab === 2 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3" size={18} color="#c19b6c" />
              <h2>Temple History</h2>
              <span className="tf-hint">Displayed in the History section with a decorative blockquote</span>
            </div>
            <div className="form-group">
              <label>History & Background</label>
              <textarea name="history" value={form.history} onChange={handleChange} rows={12}
                placeholder="History, founding details, lineage, notable events…" />
            </div>
            {isEdit && (
              <div className="tf-section-actions">
                <button type="button" className="btn-section-save"
                  disabled={sectionLoading === 'history'}
                  onClick={() => saveSection('history', { history: form.history })}>
                  <IconSVG path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" size={14} />
                  {sectionLoading === 'history' ? 'Saving…' : 'Save History'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Main Image */}
        {activeTab === 3 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" size={18} color="#c19b6c" />
              <h2>Main Temple Image</h2>
              <span className="tf-hint">The hero image shown at the top of the temple detail page</span>
            </div>
            <div className="tf-single-image-uploader">
              {form.mainImage ? (
                <div className="tf-image-preview-large">
                  <img src={form.mainImage} alt="Main temple" />
                  <div className="tf-image-actions">
                    <button type="button" className="btn-image-replace" onClick={() => document.getElementById('mainImageInput').click()}>
                      <IconSVG path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={14} /> Replace Image
                    </button>
                    <button type="button" className="btn-image-remove" onClick={() => setForm(f => ({ ...f, mainImage: '' }))}>
                      <IconSVG path="M18 6L6 18M6 6l12 12" size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="tf-upload-zone" onClick={() => document.getElementById('mainImageInput').click()}>
                  <IconSVG path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={40} color="#c19b6c" />
                  <p>{uploading === 'mainImage' ? 'Uploading…' : 'Click to upload main image'}</p>
                  <small>JPG, PNG, WEBP — up to 10MB</small>
                </div>
              )}
              <input id="mainImageInput" type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => handleSingleImageUpload(e, 'mainImage')} />
            </div>
            {isEdit && form.mainImage && (
              <div className="tf-section-actions">
                <button type="button" className="btn-section-save"
                  disabled={sectionLoading === 'main-image'}
                  onClick={() => saveSection('main-image', { mainImage: form.mainImage })}>
                  <IconSVG path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" size={14} />
                  {sectionLoading === 'main-image' ? 'Saving…' : 'Save Main Image'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Chief Monk Image */}
        {activeTab === 4 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={18} color="#c19b6c" />
              <h2>Chief Monk Photo</h2>
              <span className="tf-hint">Portrait shown in the sidebar monk card on the temple page</span>
            </div>
            <div className="tf-single-image-uploader">
              {form.chiefMonkImage ? (
                <div className="tf-image-preview-large tf-portrait">
                  <img src={form.chiefMonkImage} alt="Chief monk" />
                  <div className="tf-image-actions">
                    <button type="button" className="btn-image-replace" onClick={() => document.getElementById('monkImageInput').click()}>
                      <IconSVG path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={14} /> Replace Photo
                    </button>
                    <button type="button" className="btn-image-remove" onClick={() => setForm(f => ({ ...f, chiefMonkImage: '' }))}>
                      <IconSVG path="M18 6L6 18M6 6l12 12" size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="tf-upload-zone tf-upload-portrait" onClick={() => document.getElementById('monkImageInput').click()}>
                  <IconSVG path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={40} color="#c19b6c" />
                  <p>{uploading === 'chiefMonkImage' ? 'Uploading…' : 'Click to upload monk photo'}</p>
                  <small>Best as a square or portrait crop</small>
                </div>
              )}
              <input id="monkImageInput" type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => handleSingleImageUpload(e, 'chiefMonkImage')} />
            </div>
            {isEdit && form.chiefMonkImage && (
              <div className="tf-section-actions">
                <button type="button" className="btn-section-save"
                  disabled={sectionLoading === 'chief-monk-image'}
                  onClick={() => saveSection('chief-monk-image', { chiefMonkImage: form.chiefMonkImage })}>
                  <IconSVG path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" size={14} />
                  {sectionLoading === 'chief-monk-image' ? 'Saving…' : 'Save Monk Photo'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Gallery */}
        {activeTab === 5 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21" size={18} color="#c19b6c" />
              <h2>Gallery Images</h2>
              <span className="tf-hint">Photo gallery shown in the Gallery section of the temple page</span>
            </div>
            <div
              className="tf-gallery-dropzone"
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragging') }}
              onDragLeave={e => e.currentTarget.classList.remove('dragging')}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('dragging'); handleGalleryUpload(e.dataTransfer.files) }}
              onClick={() => document.getElementById('galleryInput').click()}
            >
              <IconSVG path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={28} color="#c19b6c" />
              <p>{uploading === 'gallery' ? 'Uploading…' : 'Click or drag & drop images'}</p>
              <small>Multiple files supported — JPG, PNG, WEBP</small>
              <input id="galleryInput" type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => handleGalleryUpload(e.target.files)} />
            </div>
            {form.galleryImages.length > 0 && (
              <div className="tf-gallery-grid">
                {form.galleryImages.map((url, i) => (
                  <div key={i} className="tf-gallery-thumb">
                    <img src={url} alt={`Gallery ${i+1}`} />
                    <button type="button" className="tf-gallery-remove"
                      onClick={() => setForm(f => ({ ...f, galleryImages: f.galleryImages.filter((_, idx) => idx !== i) }))}>
                      <IconSVG path="M18 6L6 18M6 6l12 12" size={12} color="#fff" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {isEdit && (
              <div className="tf-section-actions">
                <button type="button" className="btn-section-save"
                  disabled={sectionLoading === 'gallery'}
                  onClick={() => saveSection('gallery', { galleryImages: form.galleryImages })}>
                  <IconSVG path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" size={14} />
                  {sectionLoading === 'gallery' ? 'Saving…' : 'Save Gallery'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Services */}
        {activeTab === 6 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={18} color="#c19b6c" />
              <h2>Dhamma Programs & Services</h2>
              <span className="tf-hint">Each program gets an icon and optional time shown on the temple page</span>
            </div>
            <div className="tf-services-list">
              {form.services.map((svc, i) => (
                <div key={i} className="tf-service-row">
                  <div className="tf-service-icon-preview">
                    <IconSVG path={SERVICE_ICONS.find(x => x.id === svc.icon)?.path || SERVICE_ICONS[0].path} size={20} color="#c19b6c" />
                  </div>
                  <div className="form-group tf-svc-name">
                    <label>Program Name</label>
                    <input value={svc.name} onChange={e => updateService(i, 'name', e.target.value)} placeholder="Sunday Dhamma Service" />
                  </div>
                  <div className="form-group tf-svc-icon">
                    <label>Icon</label>
                    <select value={svc.icon} onChange={e => updateService(i, 'icon', e.target.value)}>
                      {SERVICE_ICONS.map(ic => <option key={ic.id} value={ic.id}>{ic.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group tf-svc-time">
                    <label>Time</label>
                    <input value={svc.time} onChange={e => updateService(i, 'time', e.target.value)} placeholder="9:00 AM" />
                  </div>
                  <button type="button" className="tf-svc-remove" onClick={() => removeService(i)}>
                    <IconSVG path="M18 6L6 18M6 6l12 12" size={14} color="#dc2626" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-add-service" onClick={addService}>
              <IconSVG path="M12 5v14M5 12h14" size={16} /> Add Program
            </button>
            {isEdit && (
              <div className="tf-section-actions">
                <button type="button" className="btn-section-save"
                  disabled={sectionLoading === 'services'}
                  onClick={() => saveSection('services', { services: form.services.map(s => JSON.stringify(s)) })}>
                  <IconSVG path="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" size={14} />
                  {sectionLoading === 'services' ? 'Saving…' : 'Save Programs'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: Location */}
        {activeTab === 7 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={18} color="#c19b6c" />
              <h2>Location & Map</h2>
            </div>
            <div className="tf-grid-2">
              <div className="form-group">
                <label>Latitude</label>
                <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} placeholder="38.9072" />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} placeholder="-77.0369" />
              </div>
            </div>
            <div className="coords-actions">
              <button type="button" className="btn-geocode" onClick={handleGeocode} disabled={geocoding}>
                <IconSVG path="M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5zM16 16l4.5 4.5" size={14} />
                {geocoding ? 'Geocoding…' : 'Auto-geocode from Address'}
              </button>
              <button type="button" className="btn-preview-map"
                onClick={() => { if (hasCoordValues(form.lat, form.lng)) setMapPreview({ lat: parseFloat(form.lat), lng: parseFloat(form.lng) }) }}
                disabled={!hasCoordValues(form.lat, form.lng)}>
                <IconSVG path="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={14} />
                Preview Pin
              </button>
            </div>
            {mapPreview ? (
              <div className="map-embed-wrap">
                <div className="map-embed-label">Pin Preview</div>
                <iframe title="map-preview" width="100%" height="260" frameBorder="0"
                  style={{ borderRadius: 8, border: '2px solid var(--border)' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapPreview.lng-0.05},${mapPreview.lat-0.05},${mapPreview.lng+0.05},${mapPreview.lat+0.05}&layer=mapnik&marker=${mapPreview.lat},${mapPreview.lng}`}
                />
                <div className="map-coords-display">{mapPreview.lat.toFixed(6)}, {mapPreview.lng.toFixed(6)}</div>
              </div>
            ) : (
              <div className="map-placeholder">
                <IconSVG path="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" size={36} color="var(--muted)" />
                <p>Enter coordinates or auto-geocode to preview pin</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: Settings */}
        {activeTab === 8 && (
          <div className="tf-panel">
            <div className="tf-panel-header">
              <IconSVG path="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={18} color="#c19b6c" />
              <h2>Publication Settings</h2>
            </div>
            <div className="tf-grid-2">
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
              <div className="form-group">
                <label>Map Visibility</label>
                <label className="checkbox-label" style={{ marginTop: '0.5rem' }}>
                  <input type="checkbox" name="mapVisible" checked={form.mapVisible} onChange={handleChange} />
                  <span>Visible on public map</span>
                </label>
                <div className="form-tip">Uncheck to hide from map without deleting</div>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <Link to="/temples" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={loading}>
            <IconSVG path={loading ? 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' : 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8'} size={14} />
            {loading ? 'Saving…' : isEdit ? 'Save All Changes' : 'Create Temple'}
          </button>
        </div>
      </form>
    </div>
  )
}
