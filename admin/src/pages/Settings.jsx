import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Settings.css'

export default function Settings() {
  const { admin, token } = useAuth()
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirm:'' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const [siteForm, setSiteForm] = useState({ siteName:'Saddha.org', siteEmail:'', sitePhone:'', footerText:'', seoTitle:'', seoDescription:'' })
  const [siteLoading, setSiteLoading] = useState(false)
  const [siteSaved, setSiteSaved] = useState(false)

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [newUser, setNewUser] = useState({ name:'', email:'', password:'', role:'editor' })
  const [newUserLoading, setNewUserLoading] = useState(false)
  const [newUserError, setNewUserError] = useState('')
  const [newUserSuccess, setNewUserSuccess] = useState('')

  const isSuperAdmin = admin?.role === 'superadmin'

  useEffect(() => {
    // Load site settings
    fetch('/api/admin/settings/site', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        setSiteForm(f => ({ ...f, ...d }))
      }).catch(() => {})

    // Load users if superadmin
    if (isSuperAdmin) {
      setUsersLoading(true)
      fetch('/api/admin/settings/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => { setUsers(Array.isArray(d) ? d : []); setUsersLoading(false) })
        .catch(() => setUsersLoading(false))
    }
  }, [isSuperAdmin])

  function handlePwChange(e) { setPwForm(f => ({ ...f, [e.target.name]: e.target.value })); setPwError(''); setPwSuccess('') }
  async function handlePwSubmit(e) {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    if (pwForm.newPassword.length < 8) { setPwError('Must be at least 8 characters.'); return }
    setPwLoading(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setPwSuccess('Password updated successfully.')
      setPwForm({ currentPassword:'', newPassword:'', confirm:'' })
    } catch (err) { setPwError(err.message) }
    finally { setPwLoading(false) }
  }

  async function handleSiteSave(e) {
    e.preventDefault()
    setSiteLoading(true)
    try {
      await fetch('/api/admin/settings/site', {
        method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(siteForm),
      })
      setSiteSaved(true)
      setTimeout(() => setSiteSaved(false), 2000)
    } catch { }
    finally { setSiteLoading(false) }
  }

  async function handleCreateUser(e) {
    e.preventDefault()
    setNewUserError(''); setNewUserSuccess('')
    setNewUserLoading(true)
    try {
      const res = await fetch('/api/admin/settings/users', {
        method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(newUser),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setUsers(u => [...u, data])
      setNewUser({ name:'', email:'', password:'', role:'editor' })
      setNewUserSuccess('User created.')
      setTimeout(() => setNewUserSuccess(''), 2000)
    } catch (err) { setNewUserError(err.message) }
    finally { setNewUserLoading(false) }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Delete this user?')) return
    await fetch(`/api/admin/settings/users/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } })
    setUsers(u => u.filter(x => x.id !== id))
  }

  async function handleRoleChange(id, role) {
    await fetch(`/api/admin/settings/users/${id}/role`, {
      method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ role }),
    })
    setUsers(u => u.map(x => x.id === id ? { ...x, role } : x))
  }

  const inputS = { width:'100%', padding:'0.55rem 0.75rem', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', background:'var(--surface)', color:'var(--text)', fontSize:'0.875rem' }
  const labelS = { display:'block', fontSize:'0.8rem', fontWeight:500, color:'var(--text-2)', marginBottom:'0.35rem' }
  const groupS = { marginBottom:'1rem' }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-desc">Manage admin account, site configuration, and user permissions.</p>
      </div>

      <div className="settings-grid">
        {/* Account Info */}
        <div className="settings-card">
          <h2 className="settings-card-title">Account Information</h2>
          <div className="settings-profile">
            <div className="settings-avatar">{(admin?.name || 'A').charAt(0).toUpperCase()}</div>
            <div className="settings-profile-info">
              <div className="settings-profile-name">{admin?.name}</div>
              <div className="settings-profile-email">{admin?.email}</div>
              <span className={`badge badge-${admin?.role === 'superadmin' ? 'published' : 'draft'}`}>
                {admin?.role === 'superadmin' ? '★ Super Admin' : 'Editor'}
              </span>
            </div>
          </div>
          <div className="settings-info-grid">
            <div className="settings-info-row"><span className="settings-info-label">Email</span><span className="settings-info-value">{admin?.email}</span></div>
            <div className="settings-info-row"><span className="settings-info-label">Role</span><span className="settings-info-value">{admin?.role}</span></div>
            <div className="settings-info-row"><span className="settings-info-label">Admin ID</span><span className="settings-info-value settings-id">{admin?.id}</span></div>
          </div>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <h2 className="settings-card-title">Change Password</h2>
          {pwError && <div className="form-alert form-alert-error">⚠ {pwError}</div>}
          {pwSuccess && <div className="form-alert form-alert-success">✓ {pwSuccess}</div>}
          <form onSubmit={handlePwSubmit}>
            <div style={groupS}><label style={labelS}>Current Password</label><input style={inputS} type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required /></div>
            <div style={groupS}><label style={labelS}>New Password</label><input style={inputS} type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} placeholder="Min 8 characters" required /></div>
            <div style={groupS}><label style={labelS}>Confirm New Password</label><input style={inputS} type="password" name="confirm" value={pwForm.confirm} onChange={handlePwChange} required /></div>
            <button type="submit" className="btn-save" disabled={pwLoading}>{pwLoading ? 'Updating…' : '✓ Update Password'}</button>
          </form>
        </div>

        {/* Site Settings */}
        <div className="settings-card settings-card-wide">
          <h2 className="settings-card-title">Site Settings</h2>
          <form onSubmit={handleSiteSave}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <div style={groupS}><label style={labelS}>Site Name</label><input style={inputS} value={siteForm.siteName} onChange={e => setSiteForm(f => ({ ...f, siteName: e.target.value }))} /></div>
              <div style={groupS}><label style={labelS}>Contact Email</label><input style={inputS} type="email" value={siteForm.siteEmail} onChange={e => setSiteForm(f => ({ ...f, siteEmail: e.target.value }))} /></div>
              <div style={groupS}><label style={labelS}>Phone</label><input style={inputS} value={siteForm.sitePhone} onChange={e => setSiteForm(f => ({ ...f, sitePhone: e.target.value }))} /></div>
              <div style={groupS}><label style={labelS}>Footer Text</label><input style={inputS} value={siteForm.footerText} onChange={e => setSiteForm(f => ({ ...f, footerText: e.target.value }))} /></div>
              <div style={groupS}><label style={labelS}>SEO Title</label><input style={inputS} value={siteForm.seoTitle} onChange={e => setSiteForm(f => ({ ...f, seoTitle: e.target.value }))} /></div>
              <div style={groupS}><label style={labelS}>SEO Description</label><input style={inputS} value={siteForm.seoDescription} onChange={e => setSiteForm(f => ({ ...f, seoDescription: e.target.value }))} /></div>
            </div>
            <button type="submit" className="btn-save" disabled={siteLoading}>{siteSaved ? '✓ Saved!' : siteLoading ? 'Saving…' : '✓ Save Site Settings'}</button>
          </form>
        </div>

        {/* User Management — superadmin only */}
        {isSuperAdmin && (
          <div className="settings-card settings-card-wide">
            <h2 className="settings-card-title">Admin Users & Permissions</h2>
            {usersLoading ? <div style={{ color:'var(--text-2)', fontSize:'0.875rem' }}>Loading users…</div> : (
              <table className="temples-table" style={{ marginBottom:'1.5rem', fontSize:'0.85rem' }}>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight:500 }}>{u.name}</td>
                      <td style={{ color:'var(--text-2)' }}>{u.email}</td>
                      <td>
                        {u.id === admin?.id ? (
                          <span className={`badge badge-${u.role === 'superadmin' ? 'published' : 'draft'}`}>{u.role}</span>
                        ) : (
                          <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                            style={{ padding:'0.25rem 0.5rem', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', fontSize:'0.82rem', background:'var(--surface)' }}>
                            <option value="editor">editor</option>
                            <option value="superadmin">superadmin</option>
                          </select>
                        )}
                      </td>
                      <td style={{ color:'var(--text-3)' }}>{new Date(u.createdAt).toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric' })}</td>
                      <td>
                        {u.id !== admin?.id && (
                          <button onClick={() => handleDeleteUser(u.id)} style={{ color:'#b91c1c', background:'none', border:'none', cursor:'pointer', fontSize:'0.82rem' }}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', marginBottom:'0.75rem', color:'var(--text)' }}>Add New Admin User</h3>
            {newUserError && <div className="form-alert form-alert-error" style={{ marginBottom:'0.75rem' }}>⚠ {newUserError}</div>}
            {newUserSuccess && <div className="form-alert form-alert-success" style={{ marginBottom:'0.75rem' }}>✓ {newUserSuccess}</div>}
            <form onSubmit={handleCreateUser}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', alignItems:'end' }}>
                <div style={groupS}><label style={labelS}>Full Name</label><input style={inputS} value={newUser.name} onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))} required /></div>
                <div style={groupS}><label style={labelS}>Email</label><input style={inputS} type="email" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} required /></div>
                <div style={groupS}><label style={labelS}>Password</label><input style={inputS} type="password" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} placeholder="Min 8 chars" required /></div>
                <div style={groupS}>
                  <label style={labelS}>Role</label>
                  <select style={inputS} value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}>
                    <option value="editor">editor</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-save" disabled={newUserLoading}>{newUserLoading ? 'Creating…' : '＋ Create User'}</button>
            </form>
          </div>
        )}

        {/* System Info */}
        <div className="settings-card settings-card-wide">
          <h2 className="settings-card-title">System Information</h2>
          <div className="settings-info-grid">
            {[
              ['Application','Saddha.org Admin Panel v2.0'],
              ['Database','MongoDB via Prisma ORM'],
              ['Frontend','React 18 + Vite'],
              ['Backend','Node.js + Express'],
              ['Auth','JWT (8h expiry)'],
              ['Map','OpenStreetMap / Leaflet'],
              ['Geocoding','OpenCage API'],
            ].map(([label, value]) => (
              <div key={label} className="settings-info-row">
                <span className="settings-info-label">{label}</span>
                <span className="settings-info-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
