import { useState } from 'react'
import AdminLayout from './AdminLayout'
import { useNavigate } from 'react-router-dom'
import './AdminLayout.css'
import './AddNewTemple.css'

export default function AddNewTemple() {
  const navigate = useNavigate()
  const [published, setPublished] = useState(false)
  const [tags, setTags] = useState(['ANCIENT', 'STUPA'])
  const [tagInput, setTagInput] = useState('')
  const [region, setRegion] = useState('Central Province')

  const removeTag = (t) => setTags(tags.filter(x => x !== t))
  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      const val = tagInput.trim().toUpperCase()
      if (val && !tags.includes(val)) setTags([...tags, val])
      setTagInput('')
    }
  }

  return (
    <AdminLayout>
      {/* Topbar */}
      <div className="form-topbar">
        <button className="back-btn" onClick={() => navigate('/admin/temples')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Temples
        </button>
        <h1 className="form-page-title">Add New Temple</h1>
        <div className="form-topbar-actions">
          <button className="save-draft-btn">Save as Draft</button>
          <button className="publish-btn">Publish</button>
        </div>
      </div>

      <div className="form-layout">
        {/* LEFT - Main Form */}
        <div className="form-main">

          {/* Section 01 */}
          <div className="form-section">
            <div className="section-label">Section 01 / Basic Information</div>
            <div className="form-card">
              <div className="form-group full">
                <label className="form-label">Temple Name</label>
                <input className="form-input" type="text" placeholder="Enter formal temple name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">State / City</label>
                  <input className="form-input" type="text" placeholder="e.g. Anuradhapura" />
                </div>
                <div className="form-group">
                  <label className="form-label">Temple Type</label>
                  <select className="form-select">
                    <option>Theravada</option>
                    <option>Mahayana</option>
                    <option>Zen</option>
                    <option>Tibetan</option>
                  </select>
                </div>
              </div>
              <div className="form-group full">
                <label className="form-label">Full Address</label>
                <input className="form-input" type="text" placeholder="Street, village, and postal code" />
              </div>
              <div className="form-group half">
                <label className="form-label">Year Established</label>
                <input className="form-input" type="text" placeholder="YYYY" />
              </div>
            </div>
          </div>

          {/* Section 02 */}
          <div className="form-section">
            <div className="section-label">Section 02 / Contact Details</div>
            <div className="form-card">
              <div className="form-group full">
                <label className="form-label">Chief Monk (Viharadhipathi)</label>
                <input className="form-input" type="text" placeholder="Venerable Name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="text" placeholder="+94 XX XXX XXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="contact@temple.org" />
                </div>
              </div>
              <div className="form-group full">
                <label className="form-label">Website URL</label>
                <input className="form-input" type="url" placeholder="https://www.temple.org" />
              </div>
            </div>
          </div>

          {/* Section 03 */}
          <div className="form-section">
            <div className="section-label">Section 03 / Narrative &amp; History</div>
            <div className="form-card">
              <div className="form-group full">
                <label className="form-label">Short Description</label>
                <input className="form-input" type="text" placeholder="Brief 1-2 sentence summary for lists" />
              </div>
              <div className="form-group full">
                <label className="form-label">Full History &amp; Description</label>
                <textarea className="form-textarea" placeholder="The comprehensive historical background and architectural details..." rows={6}></textarea>
              </div>
            </div>
          </div>

          {/* Section 04 */}
          <div className="form-section">
            <div className="section-label">Section 04 / Visual Media</div>
            <div className="form-card">
              <div className="upload-zone">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="upload-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                  <line x1="12" y1="3" x2="12" y2="1"/>
                </svg>
                <p className="upload-text">Drag and drop temple images or click to browse files</p>
                <button className="upload-btn">Upload Photos</button>
                <p className="upload-hint">MAX SIZE 10MB PER IMAGE. JPG, PNG FORMATS SUPPORTED.</p>
              </div>
              <div className="photo-grid">
                {[1,2,3].map(i => (
                  <div key={i} className="photo-placeholder">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT - Sidebar */}
        <div className="form-sidebar">

          {/* Publish Settings */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Publish Settings</h3>
            <div className="publish-status-row">
              <span className="publish-status-label">Status: <span className={published ? 'status-pub' : 'status-draft-label'}>
                {published ? 'Published' : 'Draft'}
              </span></span>
              <label className="toggle-switch">
                <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
                <span className="toggle-track"></span>
              </label>
            </div>
            <div className="sidebar-field">
              <label className="sidebar-label">Visibility</label>
              <select className="sidebar-select">
                <option>Public</option>
                <option>Private</option>
                <option>Unlisted</option>
              </select>
            </div>
            <button className="publish-now-btn">Publish Now</button>
          </div>

          {/* Region & Taxonomy */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Region &amp; Taxonomy</h3>
            <div className="sidebar-field">
              <label className="sidebar-label">Administrative Region</label>
              <select className="sidebar-select" value={region} onChange={e => setRegion(e.target.value)}>
                <option>Central Province</option>
                <option>Western Province</option>
                <option>Southern Province</option>
                <option>Northern Province</option>
                <option>Eastern Province</option>
              </select>
            </div>
            <div className="sidebar-field">
              <label className="sidebar-label">Tags / Keywords</label>
              <input
                className="sidebar-input"
                type="text"
                placeholder="Add tags separated by comma"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
              <div className="tags-row">
                {tags.map(t => (
                  <span key={t} className="tag-chip">
                    {t}
                    <button className="tag-remove" onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
              </div>
            </div>
            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Mark as Featured Temple</span>
            </label>
          </div>

          {/* Geographic Location */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Geographic Location</h3>
            <div className="coord-row">
              <div className="coord-field">
                <label className="sidebar-label">Latitude</label>
                <input className="sidebar-input" type="text" defaultValue="6.9271" />
              </div>
              <div className="coord-field">
                <label className="sidebar-label">Longitude</label>
                <input className="sidebar-input" type="text" defaultValue="79.8612" />
              </div>
            </div>
            <button className="auto-detect-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
              </svg>
              Auto-detect Coordinates
            </button>
            <div className="map-preview">
              <svg viewBox="0 0 200 120" width="100%" style={{ display: 'block', background: '#D4C9B0' }}>
                {/* Simple US map outline placeholder */}
                <rect width="200" height="120" fill="#C8B98A" rx="3"/>
                <path d="M20 60 Q60 30 100 50 Q140 65 170 45 Q180 42 185 50 L190 90 Q150 100 100 95 Q60 90 30 85 Z" fill="#A89060" opacity="0.5"/>
                <path d="M60 40 Q80 30 100 38 Q120 42 135 35" stroke="#F5F0E6" strokeWidth="1" fill="none" opacity="0.6"/>
                <circle cx="110" cy="60" r="5" fill="#8B1A1A" opacity="0.8"/>
                <line x1="110" y1="55" x2="110" y2="48" stroke="#8B1A1A" strokeWidth="1.5"/>
                <text x="60" y="80" fontSize="8" fill="#6B5A3E" fontFamily="sans-serif">UNITED STATES</text>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
