import AdminLayout from './AdminLayout'
import './AdminLayout.css'

export default function Events() {
  return (
    <AdminLayout>
      <div className="dash-topbar">
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-site">Saddha.org</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-page">Events</span>
        </div>
      </div>
      <div className="dash-content">
        <div className="dash-header">
          <h1 className="dash-title">Events Management</h1>
          <p className="dash-subtitle">Manage temple events and activities</p>
        </div>
        <p>Events content coming soon...</p>
      </div>
    </AdminLayout>
  )
}
