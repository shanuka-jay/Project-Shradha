import AdminLayout from './AdminLayout'
import './AdminLayout.css'

export default function Messages() {
  return (
    <AdminLayout>
      <div className="dash-topbar">
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-site">Saddha.org</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-page">Messages</span>
        </div>
      </div>
      <div className="dash-content">
        <div className="dash-header">
          <h1 className="dash-title">Messages</h1>
          <p className="dash-subtitle">View and manage messages</p>
        </div>
        <p>Messages content coming soon...</p>
      </div>
    </AdminLayout>
  )
}
