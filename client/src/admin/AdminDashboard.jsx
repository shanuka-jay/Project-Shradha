import AdminLayout from './AdminLayout'
import { useNavigate } from 'react-router-dom'
import './AdminLayout.css'
import './AdminDashboard.css'

const recentActivity = [
  { name: 'Washington Buddhist Vihara', state: 'DC', status: 'Published', date: 'Oct 12, 2023' },
  { name: 'Blue Lotus', state: 'Illinois', status: 'Draft', date: 'Oct 11, 2023' },
  { name: 'New Jersey Buddhist', state: 'New Jersey', status: 'Pending', date: 'Oct 09, 2023' },
  { name: 'Georgia Vihara', state: 'Georgia', status: 'Published', date: 'Oct 05, 2023' },
  { name: 'Texas Dharma Center', state: 'Texas', status: 'Published', date: 'Oct 02, 2023' },
]

const regionData = [
  { name: 'Northeast', count: 18, pct: 90 },
  { name: 'South', count: 15, pct: 75 },
  { name: 'West Coast', count: 14, pct: 70 },
  { name: 'Midwest', count: 12, pct: 60 },
  { name: 'Other', count: 14, pct: 70 },
]

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <AdminLayout>
      {/* Top bar */}
      <div className="dash-topbar">
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-site">Saddha.org</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-page">Dashboard</span>
        </div>
        <div className="topbar-right">
          <button className="topbar-bell">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          <div className="topbar-user">
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">System Administrator</span>
            </div>
            <div className="user-avatar">AU</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="dash-content">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Temple Repository Overview</h1>
            <p className="dash-subtitle">A centralized directory of Buddhist tradition. Maintain the integrity of our living archive through meticulous profile management and state-wide verification.</p>
          </div>
          <span className="dash-version">7A590C</span>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Temples</div>
            <div className="stat-value">73</div>
            <div className="stat-delta positive">+5 this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">States Covered</div>
            <div className="stat-value">28</div>
            <div className="stat-delta warning">22 pending verification</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Monk Profiles</div>
            <div className="stat-value">12</div>
            <div className="stat-delta neutral">2 added this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Reviews</div>
            <div className="stat-value">7</div>
            <div className="stat-delta"><span className="needs-attention">Needs Attention</span></div>
          </div>
        </div>

        {/* Activity + Region */}
        <div className="dash-panels">
          {/* Recent Activity */}
          <div className="panel panel-activity">
            <div className="panel-header">
              <h2 className="panel-title">Recent Activity</h2>
              <button className="view-all-btn">View All Entries</button>
            </div>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Temple Name</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.state}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>{row.date}</td>
                    <td>
                      <button className="edit-icon-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Temples by Region */}
          <div className="panel panel-region">
            <h2 className="panel-title">Temples by Region</h2>
            <div className="region-bars">
              {regionData.map((r, i) => (
                <div key={i} className="region-row">
                  <div className="region-name-row">
                    <span className="region-name">{r.name}</span>
                    <span className="region-count">{r.count}</span>
                  </div>
                  <div className="region-bar-track">
                    <div className="region-bar-fill" style={{ width: `${r.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="region-report-label">REGIONAL DISTRIBUTION REPORT V2.4</div>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="admin-controls">
          <div className="controls-divider"><span>Administrative Controls</span></div>
          <div className="controls-btns">
            <button className="ctrl-btn ctrl-btn-gold" onClick={() => navigate('/admin/temples/new')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add New Temple
            </button>
            <button className="ctrl-btn ctrl-btn-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Add Monk Profile
            </button>
            <button className="ctrl-btn ctrl-btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Upload Gallery Photos
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="dash-footer">
          <span>© 2023 Saddha.org Directory Management System</span>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">System Status</a>
            <a href="#">Documentation</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
