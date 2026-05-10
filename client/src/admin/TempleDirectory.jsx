import { useState } from 'react'
import AdminLayout from './AdminLayout'
import { useNavigate } from 'react-router-dom'
import './AdminLayout.css'
import './TempleDirectory.css'

const temples = [
  { id: '01', name: 'Washington Buddhist Vihara', state: 'Washington, DC', monk: 'Ven. Maharagama Dhammasiri', phone: '(202) 723-0773', status: 'PUBLISHED' },
  { id: '02', name: 'Dharma Vijaya Buddhist Vihara', state: 'California', monk: 'Ven. Walpola Piyananda', phone: '(323) 737-5084', status: 'PUBLISHED' },
  { id: '03', name: 'Blue Lotus Buddhist Temple', state: 'Illinois', monk: 'Ven. Bhante Sujatha', phone: '(815) 337-7378', status: 'PENDING' },
  { id: '04', name: 'New York Buddhist Vihara', state: 'New York', monk: 'Ven. Kurunegala Piyatissa', phone: '(718) 271-2646', status: 'PUBLISHED' },
  { id: '05', name: 'Houston Buddhist Vihara', state: 'Texas', monk: 'Ven. Dr. Basnagoda Rahula', phone: '(713) 466-9681', status: 'PUBLISHED' },
  { id: '06', name: 'Georgia Buddhist Vihara', state: 'Georgia', monk: 'Ven. Wajirabuddhi', phone: '(770) 987-8442', status: 'DRAFT' },
  { id: '07', name: 'New Jersey Buddhist Vihara', state: 'New Jersey', monk: 'Ven. Hungampola Sirirathana', phone: '(609) 333-1070', status: 'PUBLISHED' },
  { id: '08', name: 'Maryland Buddhist Vihara', state: 'Maryland', monk: 'Ven. Katugastota Uparatana', phone: '(301) 946-9537', status: 'PUBLISHED' },
]

function StatusBadge({ status }) {
  return <span className={`dir-status dir-status-${status.toLowerCase()}`}>{status}</span>
}

export default function TempleDirectory() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('Published')
  const [search, setSearch] = useState('')

  const filtered = temples.filter(t => {
    const matchFilter = activeFilter === 'All' || t.status === activeFilter.toUpperCase()
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.state.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <AdminLayout>
      {/* Topbar */}
      <div className="dir-topbar">
        <span className="dir-topbar-logo">Saddha.org</span>
        <div className="topbar-right">
          <button className="topbar-bell">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          <div className="user-avatar">AU</div>
        </div>
      </div>

      <div className="dir-content">
        {/* Header */}
        <div className="dir-header">
          <div>
            <h1 className="dir-title">Temple Directory</h1>
            <p className="dir-subtitle">Manage all 73 Sri Lankan Buddhist temples</p>
          </div>
          <button className="add-temple-btn" onClick={() => navigate('/admin/temples/new')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Temple
          </button>
        </div>

        {/* Filters */}
        <div className="dir-filters">
          <div className="search-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search temples..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="dir-select">
            <option>All States</option>
            <option>California</option>
            <option>Texas</option>
            <option>New York</option>
          </select>
          <select className="dir-select">
            <option>All Regions</option>
            <option>Northeast</option>
            <option>South</option>
            <option>West Coast</option>
            <option>Midwest</option>
          </select>
          <div className="filter-tabs">
            {['Published', 'Draft', 'Pending'].map(f => (
              <button
                key={f}
                className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="dir-table-wrap">
          <table className="dir-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Temple Name</th>
                <th>State</th>
                <th>Chief Monk</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="row-num">{t.id}</td>
                  <td><span className="temple-name-link">{t.name}</span></td>
                  <td>{t.state}</td>
                  <td>{t.monk}</td>
                  <td>{t.phone}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="action-more">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span className="showing-label">Showing {filtered.length} of 73 temples</span>
            <div className="pagination">
              <button className="page-btn" disabled>Previous</button>
              {[1,2,3,4,5].map(p => (
                <button key={p} className={`page-btn ${p === 1 ? 'active' : ''}`}>{p}</button>
              ))}
              <button className="page-btn">Next</button>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="dir-stats-row">
          <div className="dir-stat-card">
            <div className="dir-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <div className="dir-stat-sub">Active Locations</div>
              <div className="dir-stat-val">68 States</div>
            </div>
          </div>
          <div className="dir-stat-card">
            <div className="dir-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <div className="dir-stat-sub">Registered Monks</div>
              <div className="dir-stat-val">142 Sangha</div>
            </div>
          </div>
          <div className="dir-stat-card">
            <div className="dir-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div className="dir-stat-sub">Verification Rate</div>
              <div className="dir-stat-val">94.2%</div>
            </div>
          </div>
        </div>

        {/* Network Coverage */}
        <div className="network-card">
          <div className="network-text">
            <div className="network-label">Spatial Distribution</div>
            <h2 className="network-title">Temple Network Coverage</h2>
            <p className="network-desc">Our network spans 42 states with concentrated communities in the Northeast and West Coast regions. All temples are indexed by monastic lineage and traditional architecture.</p>
            <button className="network-map-btn">View Interactive Map</button>
          </div>
          <div className="network-globe">
            <div className="globe-placeholder">
              <svg width="180" height="180" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="#E8DFD0" opacity="0.5"/>
                <ellipse cx="100" cy="100" rx="90" ry="40" fill="none" stroke="#C4A97A" strokeWidth="1" opacity="0.4"/>
                <line x1="10" y1="100" x2="190" y2="100" stroke="#C4A97A" strokeWidth="1" opacity="0.4"/>
                <circle cx="100" cy="100" r="90" fill="none" stroke="#C4A97A" strokeWidth="1.5" opacity="0.6"/>
                <ellipse cx="100" cy="100" rx="50" ry="90" fill="none" stroke="#C4A97A" strokeWidth="1" opacity="0.4"/>
                <text x="80" y="106" fontSize="9" fill="#8B6A1E" opacity="0.8">United States</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
