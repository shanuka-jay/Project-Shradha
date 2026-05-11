import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  published: { dot: '#16a34a', bg: '#dcfce7', label: 'Published' },
  draft:     { dot: '#ca8a04', bg: '#fef9c3', label: 'Draft' },
  pending:   { dot: '#ea580c', bg: '#ffedd5', label: 'Pending' },
}

const hasCoords = (temple) => Number.isFinite(Number(temple.lat)) && Number.isFinite(Number(temple.lng))

export default function MapManagement() {
  const { token } = useAuth()
  const [temples, setTemples] = useState([])
  const [missing, setMissing] = useState([])
  const [duplicates, setDuplicates] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [geocoding, setGeocoding] = useState({})
  const [toggling, setToggling] = useState(null)
  const [search, setSearch] = useState('')
  const [bulkResult, setBulkResult] = useState(null)

  async function fetchAll() {
    setLoading(true)
    try {
      const [ovRes, misRes, dupRes] = await Promise.all([
        fetch('/api/admin/map/overview', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/map/missing', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/map/duplicates', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const [ov, mis, dup] = await Promise.all([ovRes.json(), misRes.json(), dupRes.json()])
      setTemples(ov || [])
      setMissing(mis.temples || [])
      setDuplicates(dup.duplicates || [])
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  async function toggleVisibility(id, current) {
    setToggling(id)
    try {
      await fetch(`/api/admin/map/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mapVisible: !current }),
      })
      setTemples(ts => ts.map(t => t.id === id ? { ...t, mapVisible: !current } : t))
    } catch { }
    finally { setToggling(null) }
  }

  async function geocodeTemple(temple) {
    if (!temple.address) return
    setGeocoding(g => ({ ...g, [temple.id]: true }))
    try {
      const res = await fetch('/api/admin/map/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ address: `${temple.address}, ${temple.state}` }),
      })
      const data = await res.json()
      if (Number.isFinite(Number(data.lat)) && Number.isFinite(Number(data.lng))) {
        await fetch(`/api/admin/map/${temple.id}/coords`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ lat: data.lat, lng: data.lng }),
        })
        setMissing(ms => ms.filter(m => m.id !== temple.id))
        setTemples(ts => ts.map(t => t.id === temple.id ? { ...t, lat: data.lat, lng: data.lng } : t))
      }
    } catch { }
    finally { setGeocoding(g => ({ ...g, [temple.id]: false })) }
  }

  async function handleBulkGeocode() {
    try {
      const res = await fetch('/api/admin/map/bulk-geocode', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setBulkResult(data)
    } catch { }
  }

  const published = temples.filter(t => t.status === 'published').length
  const withCoords = temples.filter(hasCoords).length
  const visible = temples.filter(t => t.mapVisible).length

  const filteredTemples = temples.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.state.toLowerCase().includes(search.toLowerCase())
  )

  const tabStyle = (tab) => ({
    padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 500,
    background: activeTab === tab ? 'var(--brown-700)' : 'var(--surface)',
    color: activeTab === tab ? '#fff' : 'var(--text-2)',
    border: '1px solid ' + (activeTab === tab ? 'var(--brown-700)' : 'var(--border)'),
    cursor: 'pointer', transition: 'all 0.15s'
  })

  return (
    <div style={{ padding:'2rem', maxWidth:1300 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Map Management</h1>
          <p className="page-desc">Oversee GPS coordinates, pin visibility, and geocoding across all temples.</p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.75rem' }}>
        {[
          { label:'Total Temples', value: temples.length, icon:'fas fa-place-of-worship', color:'var(--brown-600)' },
          { label:'With Coordinates', value: withCoords, icon:'fas fa-map-marker-alt', color:'#16a34a' },
          { label:'Missing Coords', value: missing.length, icon:'fas fa-exclamation-triangle', color: missing.length > 0 ? '#dc2626' : '#16a34a' },
          { label:'Duplicate Pins', value: duplicates.length, icon:'fas fa-map-pin', color: duplicates.length > 0 ? '#ea580c' : '#16a34a' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.25rem', boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem' }}>
              <i className={s.icon} style={{ fontSize:'1.2rem' }}></i>
              <span style={{ fontSize:'0.78rem', color:'var(--text-2)', fontWeight:500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize:'2rem', fontWeight:700, fontFamily:'var(--font-display)', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Missing coords alert */}
      {missing.length > 0 && (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'var(--radius)', padding:'0.9rem 1.25rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
          <div style={{ color:'#b91c1c', fontSize:'0.875rem', fontWeight:500 }}>
            ⚠ {missing.length} temple{missing.length !== 1 ? 's' : ''} missing GPS coordinates — hidden from public map.
          </div>
          <button onClick={() => setActiveTab('missing')} style={{ padding:'0.35rem 0.9rem', background:'#b91c1c', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', fontSize:'0.82rem', cursor:'pointer' }}>
            Fix Now →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}><i className="fas fa-map"></i> Map Overview</button>
        <button style={tabStyle('missing')} onClick={() => setActiveTab('missing')}>
          <i className="fas fa-exclamation-triangle"></i> Missing Coords {missing.length > 0 && `(${missing.length})`}
        </button>
        <button style={tabStyle('duplicates')} onClick={() => setActiveTab('duplicates')}>
          <i className="fas fa-map-pin"></i> Duplicate Pins {duplicates.length > 0 && `(${duplicates.length})`}
        </button>
        <button style={tabStyle('geocode')} onClick={() => setActiveTab('geocode')}>🔍 Bulk Geocode</button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap' }}>
            <input type="search" placeholder="Search temples…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex:1, minWidth:200, padding:'0.45rem 0.75rem', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', fontSize:'0.875rem' }} />
            <div style={{ fontSize:'0.8rem', color:'var(--text-3)' }}>
              <span style={{ color:'#16a34a', fontWeight:600 }}>●</span> published &nbsp;
              <span style={{ color:'#ca8a04', fontWeight:600 }}>●</span> draft/pending &nbsp;
              <span style={{ color:'#dc2626', fontWeight:600 }}>●</span> missing coords
            </div>
          </div>
          {loading ? <div style={{ padding:'3rem', textAlign:'center', color:'var(--text-2)' }}>Loading…</div> : (
            <table className="temples-table">
              <thead>
                <tr>
                  <th>Temple</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Coordinates</th>
                  <th>Map Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemples.map(t => {
                  const templeHasCoords = hasCoords(t)
                  return (
                    <tr key={t.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background: templeHasCoords ? STATUS_COLORS[t.status]?.dot || '#888' : '#dc2626', flexShrink:0, display:'inline-block' }} />
                          <span className="td-temple-name">{t.name}</span>
                        </div>
                        {t.address && <div className="td-temple-addr" style={{ paddingLeft:'1rem' }}>{t.address}</div>}
                      </td>
                      <td>{t.state}</td>
                      <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                      <td style={{ fontFamily:'monospace', fontSize:'0.8rem', color:'var(--text-2)' }}>
                        {templeHasCoords ? `${Number(t.lat).toFixed(5)}, ${Number(t.lng).toFixed(5)}` : <span style={{ color:'#dc2626', fontSize:'0.8rem' }}>No coords</span>}
                      </td>
                      <td style={{ textAlign:'center' }}>
                        <button
                          onClick={() => toggleVisibility(t.id, t.mapVisible)}
                          disabled={toggling === t.id}
                          style={{ padding:'0.25rem 0.65rem', border:'1px solid var(--border)', borderRadius:99, fontSize:'0.75rem', cursor:'pointer',
                            background: t.mapVisible ? '#dcfce7' : '#fee2e2', color: t.mapVisible ? '#15803d' : '#b91c1c' }}>
                          {toggling === t.id ? '…' : t.mapVisible ? '✓ Visible' : '✗ Hidden'}
                        </button>
                      </td>
                      <td>
                        <Link to={`/temples/${t.id}/edit`} className="action-btn action-edit" title="Edit">✎</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Missing Coords Tab */}
      {activeTab === 'missing' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:600, fontSize:'0.9rem' }}>{missing.length} temples need coordinates</span>
            <button onClick={handleBulkGeocode} style={{ padding:'0.45rem 1rem', background:'var(--brown-700)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', fontSize:'0.82rem', cursor:'pointer' }}>
              🔍 Scan All for Geocoding
            </button>
          </div>
          {missing.length === 0 ? (
            <div style={{ padding:'3rem', textAlign:'center', color:'#15803d' }}>✓ All temples have GPS coordinates!</div>
          ) : (
            <table className="temples-table">
              <thead>
                <tr><th>Temple</th><th>State</th><th>Address</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {missing.map(t => (
                  <tr key={t.id}>
                    <td className="td-temple-name">{t.name}</td>
                    <td>{t.state}</td>
                    <td style={{ fontSize:'0.85rem', color:'var(--text-2)' }}>{t.address || <span style={{color:'var(--text-3)'}}>No address</span>}</td>
                    <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        {t.address && (
                          <button onClick={() => geocodeTemple(t)} disabled={geocoding[t.id]}
                            style={{ padding:'0.3rem 0.7rem', background:'var(--brown-100)', border:'1px solid var(--border-2)', borderRadius:'var(--radius-sm)', fontSize:'0.78rem', cursor:'pointer', color:'var(--brown-700)' }}>
                            {geocoding[t.id] ? '🔍…' : '🔍 Geocode'}
                          </button>
                        )}
                        <Link to={`/temples/${t.id}/edit`} className="action-btn action-edit" title="Edit">✎</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Duplicates Tab */}
      {activeTab === 'duplicates' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontWeight:600, fontSize:'0.9rem' }}>{duplicates.length} duplicate pin cluster{duplicates.length !== 1 ? 's' : ''} detected</span>
          </div>
          {duplicates.length === 0 ? (
            <div style={{ padding:'3rem', textAlign:'center', color:'#15803d' }}>✓ No duplicate pins detected!</div>
          ) : duplicates.map((d, i) => (
            <div key={i} style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', gap:'1rem', alignItems:'flex-start', flexWrap:'wrap' }}>
              <div style={{ background:'#fef9c3', border:'1px solid #fde047', borderRadius:'var(--radius-sm)', padding:'0.5rem 0.75rem', fontSize:'0.78rem', color:'#854d0e', whiteSpace:'nowrap' }}>
                ~{(d.distance * 111000).toFixed(0)}m apart
              </div>
              <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                {[d.a, d.b].map(t => (
                  <div key={t.id} style={{ padding:'0.75rem', background:'var(--surface-2)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
                    <div style={{ fontWeight:600, fontSize:'0.875rem', marginBottom:'0.25rem' }}>{t.name}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-2)' }}>{t.state}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-3)', fontFamily:'monospace', marginTop:'0.25rem' }}>{t.lat?.toFixed(5)}, {t.lng?.toFixed(5)}</div>
                    <Link to={`/temples/${t.id}/edit`} style={{ fontSize:'0.78rem', color:'var(--brown-600)', marginTop:'0.4rem', display:'inline-block' }}>Edit →</Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Geocode Tab */}
      {activeTab === 'geocode' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'2rem' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', marginBottom:'1rem', color:'var(--brown-700)' }}>Bulk Address Geocoding</h2>
          <p style={{ fontSize:'0.875rem', color:'var(--text-2)', marginBottom:'1.25rem', lineHeight:1.6 }}>
            Automatically convert temple addresses to GPS coordinates using the OpenCage Geocoding API.
            Set your <code style={{ background:'var(--surface-2)', padding:'0.1rem 0.3rem', borderRadius:3, fontSize:'0.85em' }}>OPENCAGE_KEY</code> in server <code style={{ background:'var(--surface-2)', padding:'0.1rem 0.3rem', borderRadius:3, fontSize:'0.85em' }}>.env</code> to enable automatic geocoding.
          </p>
          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
            <button onClick={handleBulkGeocode}
              style={{ padding:'0.6rem 1.5rem', background:'var(--brown-700)', color:'#fff', border:'none', borderRadius:'var(--radius)', fontWeight:600, cursor:'pointer' }}>
              🔍 Scan Temples for Geocoding
            </button>
            <Link to="/map" onClick={() => setActiveTab('missing')}
              style={{ padding:'0.6rem 1.25rem', border:'1px solid var(--border)', borderRadius:'var(--radius)', fontSize:'0.875rem', color:'var(--text-2)', background:'var(--surface)' }}>
              ← View Missing Coords
            </Link>
          </div>
          {bulkResult && (
            <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.25rem' }}>
              <div style={{ fontWeight:600, marginBottom:'0.75rem', fontSize:'0.9rem' }}>{bulkResult.message}</div>
              {bulkResult.results?.length > 0 && (
                <table className="temples-table" style={{ fontSize:'0.82rem' }}>
                  <thead><tr><th>Temple</th><th>Address</th><th>Status</th></tr></thead>
                  <tbody>
                    {bulkResult.results.map(r => (
                      <tr key={r.id}>
                        <td>{r.name}</td>
                        <td style={{ color:'var(--text-2)' }}>{r.address}</td>
                        <td><span style={{ padding:'0.2rem 0.6rem', background:'#fef9c3', color:'#854d0e', borderRadius:99, fontSize:'0.72rem' }}>Pending</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          <div style={{ marginTop:'1.5rem', padding:'1rem', background:'var(--brown-50)', border:'1px solid var(--brown-200)', borderRadius:'var(--radius)', fontSize:'0.82rem', color:'var(--text-2)', lineHeight:1.7 }}>
            <strong>How to set up:</strong><br/>
            1. Sign up at <a href="https://opencagedata.com" target="_blank" rel="noreferrer" style={{ color:'var(--brown-600)' }}>opencagedata.com</a> (free tier: 2,500 req/day)<br/>
            2. Add <code style={{ background:'var(--surface)', padding:'0.1rem 0.3rem', borderRadius:3 }}>OPENCAGE_KEY=your_key_here</code> to server/.env<br/>
            3. Restart the server and return here to geocode temples individually or in bulk.
          </div>
        </div>
      )}
    </div>
  )
}
