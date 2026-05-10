import AdminLayout from './AdminLayout'
import './AdminLayout.css'

export default function States() {
  return (
    <AdminLayout>
      <div className="dash-topbar">
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-site">Saddha.org</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-page">States</span>
        </div>
      </div>
      <div className="dash-content">
        <div className="dash-header">
          <h1 className="dash-title">States Management</h1>
          <p className="dash-subtitle">Manage state-wise temple information</p>
        </div>
        <p>States content coming soon...</p>
      </div>
    </AdminLayout>
  )
}
