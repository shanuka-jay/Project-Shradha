import AdminLayout from './AdminLayout'
import './AdminLayout.css'

export default function Gallery() {
  return (
    <AdminLayout>
      <div className="dash-topbar">
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-site">Saddha.org</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-page">Gallery</span>
        </div>
      </div>
      <div className="dash-content">
        <div className="dash-header">
          <h1 className="dash-title">Gallery Management</h1>
          <p className="dash-subtitle">Manage temple photos and images</p>
        </div>
        <p>Gallery content coming soon...</p>
      </div>
    </AdminLayout>
  )
}
