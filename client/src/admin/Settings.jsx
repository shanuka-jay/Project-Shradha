import AdminLayout from './AdminLayout'
import './AdminLayout.css'

export default function Settings() {
  return (
    <AdminLayout>
      <div className="dash-topbar">
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-site">Saddha.org</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-page">Settings</span>
        </div>
      </div>
      <div className="dash-content">
        <div className="dash-header">
          <h1 className="dash-title">Settings</h1>
          <p className="dash-subtitle">Configure application settings</p>
        </div>
        <p>Settings content coming soon...</p>
      </div>
    </AdminLayout>
  )
}
