import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Temples from './pages/Temples'
import TempleForm from './pages/TempleForm'
import Monks from './pages/Monks'
import MonkForm from './pages/MonkForm'
import Events from './pages/Events'
import EventForm from './pages/EventForm'
import Messages from './pages/Massages'
import MediaLibrary from './pages/MediaLibrary'
import MapManagement from './pages/MapManagement'
import Settings from './pages/Settings'

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: '1rem'
    }}>
      <i className="fas fa-dharmachakra fa-spin" style={{ fontSize: '2.5rem' }}></i>
      <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)', fontSize: '1rem' }}>
        Loading admin panel…
      </div>
    </div>
  )
}

// Redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (admin) return <Navigate to="/" replace />
  return children
}

// Redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!admin) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="temples" element={<Temples />} />
        <Route path="temples/new" element={<TempleForm />} />
        <Route path="temples/:id/edit" element={<TempleForm />} />
        <Route path="monks" element={<Monks />} />
        <Route path="monks/new" element={<MonkForm />} />
        <Route path="monks/:id/edit" element={<MonkForm />} />
        <Route path="events" element={<Events />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/:id/edit" element={<EventForm />} />
        <Route path="messages" element={<Messages />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="map" element={<MapManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all: redirect to dashboard (which redirects to login if needed) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

