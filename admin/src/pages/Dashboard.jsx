import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function StatCard({ label, value, sub, subColor, icon, to }) {
  const inner = (
    <div className="stat-card">
      <i className={`stat-icon ${icon}`}></i>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value ?? '—'}</div>
        {sub && <div className="stat-sub" style={{ color: subColor }}>{sub}</div>}
      </div>
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration:'none' }}>{inner}</Link> : inner
}

export default function Dashboard() {
  const { token, admin } = useAuth()
  const [stats, setStats] = useState(null)
  const [temples, setTemples] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/temples?limit=6', { headers: { Authorization: `Bearer ${token}` } }),
        ])
        const [s, t] = await Promise.all([sRes.json(), tRes.json()])
        setStats(s)
        setTemples(t.temples || [])
      } catch { }
      finally { setLoading(false) }
    }
    load()
  }, [token])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}, {admin?.name?.split(' ')[0] || 'Admin'}</h1>
          <p className="page-desc">
            Welcome to the Saddha Temple Directory. Here's an overview of the repository.
          </p>
        </div>
        <Link to="/temples/new" className="btn-primary-action">＋ Add Temple</Link>
      </div>

      {/* Missing coords warning */}
      {stats?.missingCoords > 0 && (
        <div className="dash-alert">
          <span>⚠</span>
          <span>{stats.missingCoords} temple{stats.missingCoords !== 1 ? 's are' : ' is'} missing GPS coordinates and won't appear on the public map.</span>
          <Link to="/map" className="dash-alert-link">Fix in Map Management →</Link>
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid">
        <StatCard label="Total Temples"    value={stats?.totalTemples} icon="fas fa-place-of-worship" to="/temples"
          sub={`${stats?.states ?? '—'} states covered`} subColor="var(--brown-500)" />
        <StatCard label="Monk Profiles"    value={stats?.totalMonks}   icon="fas fa-praying-hands" to="/monks"
          sub="in the directory" subColor="var(--text-3)" />
        <StatCard label="Events"           value={stats?.totalEvents}  icon="fas fa-calendar" to="/events"
          sub="scheduled programs" subColor="var(--text-3)" />
        <StatCard label="Unread Messages"  value={stats?.unreadContacts} icon="fas fa-envelope" to="/messages"
          sub={stats?.unreadContacts > 0 ? 'Needs attention' : 'All clear'}
          subColor={stats?.unreadContacts > 0 ? '#c0392b' : 'var(--status-published)'} />
      </div>

      <div className="dash-grid">
        {/* Recent temples table */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Recent Temples</h2>
            <Link to="/temples" className="dash-view-all">View All →</Link>
          </div>
          {loading ? (
            <div className="dash-loading">Loading…</div>
          ) : temples.length === 0 ? (
            <div className="dash-empty">No temples yet. <Link to="/temples/new">Add one →</Link></div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Temple Name</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Map</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {temples.map(t => (
                  <tr key={t.id}>
                    <td className="td-name">{t.name}</td>
                    <td style={{ color:'var(--text-2)', fontSize:'0.85rem' }}>{t.state}</td>
                    <td><span className={`badge badge-${t.status || 'published'}`}>{t.status || 'published'}</span></td>
                    <td style={{ textAlign:'center', fontSize:'0.85rem' }}>
                      {t.lat && t.lng
                        ? <i className="fas fa-map-marker-alt" title="Has coordinates" style={{ color:'#16a34a' }}></i>
                        : <i className="fas fa-exclamation-triangle" title="Missing coordinates" style={{ color:'#dc2626' }}></i>}
                    </td>
                    <td className="td-date">{new Date(t.createdAt).toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric' })}</td>
                    <td><Link to={`/temples/${t.id}/edit`} className="td-edit" title="Edit"><i className="fas fa-edit"></i></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/temples/new"  className="quick-btn quick-btn-primary"><i className="fas fa-place-of-worship"></i> Add New Temple</Link>
            <Link to="/monks/new"    className="quick-btn quick-btn-secondary"><i className="fas fa-praying-hands"></i> Add Monk Profile</Link>
            <Link to="/events/new"   className="quick-btn quick-btn-outline"><i className="fas fa-calendar"></i> Schedule Event</Link>
            <Link to="/messages"     className="quick-btn quick-btn-outline">
              <i className="fas fa-envelope"></i> View Messages
              {stats?.unreadContacts > 0 && <span className="q-badge">{stats.unreadContacts}</span>}
            </Link>
            <Link to="/map"          className="quick-btn quick-btn-outline"><i className="fas fa-map"></i> Map Management</Link>
            <Link to="/media"        className="quick-btn quick-btn-outline"><i className="fas fa-images"></i> Media Library</Link>
          </div>
        </div>
      </div>

      {/* Module grid */}
      <div className="dash-modules">
        {[
          { to:'/temples',  icon:'fas fa-place-of-worship', title:'Temples',        desc:'Add, edit, publish temple profiles with GPS pins and gallery photos.' },
          { to:'/monks',    icon:'fas fa-praying-hands', title:'Monks',           desc:'Manage monastic profiles — biography, ordination, linked temple.' },
          { to:'/events',   icon:'fas fa-calendar', title:'Events',          desc:'Schedule Vesak, Poson Poya, Dhamma services and recurring programs.' },
          { to:'/messages', icon:'fas fa-envelope', title:'Messages',         desc:'Inbox for contact form submissions with reply and archive tools.' },
          { to:'/media',    icon:'fas fa-images', title:'Media Library',   desc:'Upload and organize photos for temple galleries and monk portraits.' },
          { to:'/map',      icon:'fas fa-map', title:'Map Management',  desc:'Geocode addresses, fix missing coordinates, detect duplicate pins.' },
        ].map(m => (
          <Link key={m.to} to={m.to} className="dash-module-card">
            <i className={`dash-module-icon ${m.icon}`}></i>
            <div className="dash-module-title">{m.title}</div>
            <div className="dash-module-desc">{m.desc}</div>
          </Link>
        ))}
      </div>

      <footer className="dash-footer">
        © {new Date().getFullYear()} Saddha.org — Temple Directory Management System v2.0
      </footer>
    </div>
  )
}
