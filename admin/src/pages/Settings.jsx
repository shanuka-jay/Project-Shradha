import { Fragment, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Settings.css'

export default function Settings() {
  const { admin, token } = useAuth()
  const canManageUsers = admin?.role === 'superadmin'

  /* ── Change Password ── */
  const [pwForm, setPwForm]       = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError]     = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  /* ── User list ── */
  const [users, setUsers]               = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  /* ── Add new user ── */
  const [newUser, setNewUser]                 = useState({ name: '', email: '', password: '', role: 'editor' })
  const [newUserLoading, setNewUserLoading]   = useState(false)
  const [newUserError, setNewUserError]       = useState('')
  const [newUserSuccess, setNewUserSuccess]   = useState('')

  /* ── Edit user ── */
  const [editingUser, setEditingUser] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError]     = useState('')

  /* ── Fetch users on mount ── */
  useEffect(() => {
    if (!canManageUsers) return
    setUsersLoading(true)
    fetch('/api/admin/settings/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setUsersLoading(false) })
      .catch(() => setUsersLoading(false))
  }, [token, canManageUsers])

  /* ── Handlers ── */
  function handlePwChange(e) {
    setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setPwError(''); setPwSuccess('')
  }

  async function handlePwSubmit(e) {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    if (pwForm.newPassword.length < 8)         { setPwError('Must be at least 8 characters.'); return }
    setPwLoading(true)
    try {
      const res  = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setPwSuccess('Password updated successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) { setPwError(err.message) }
    finally { setPwLoading(false) }
  }

  async function handleCreateUser(e) {
    e.preventDefault()
    setNewUserError(''); setNewUserSuccess('')
    setNewUserLoading(true)
    try {
      const res  = await fetch('/api/admin/settings/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setUsers(u => [...u, data])
      setNewUser({ name: '', email: '', password: '', role: 'editor' })
      setNewUserSuccess('User created successfully.')
      setTimeout(() => setNewUserSuccess(''), 3000)
    } catch (err) { setNewUserError(err.message) }
    finally { setNewUserLoading(false) }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    await fetch(`/api/admin/settings/users/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setUsers(u => u.filter(x => x.id !== id))
    if (editingUser?.id === id) setEditingUser(null)
  }

  async function handleRoleChange(id, role) {
    await fetch(`/api/admin/settings/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    })
    setUsers(u => u.map(x => x.id === id ? { ...x, role } : x))
  }

  function startEdit(u) {
    setEditingUser({ id: u.id, name: u.name, email: u.email, password: '' })
    setEditError('')
  }

  async function handleEditSave(e) {
    e.preventDefault()
    setEditError('')
    if (editingUser.password && editingUser.password.length < 8) {
      setEditError('Password must be at least 8 characters.')
      return
    }
    setEditLoading(true)
    try {
      const body = { name: editingUser.name, email: editingUser.email }
      if (editingUser.password) body.password = editingUser.password
      const res  = await fetch(`/api/admin/settings/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update user')
      setUsers(u => u.map(x => x.id === editingUser.id ? { ...x, name: data.name, email: data.email } : x))
      setEditingUser(null)
    } catch (err) { setEditError(err.message) }
    finally { setEditLoading(false) }
  }

  /* ── Shared styles ── */
  const inputS = {
    width: '100%', padding: '0.55rem 0.75rem',
    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
    background: 'var(--surface)', color: 'var(--text)', fontSize: '0.875rem',
    boxSizing: 'border-box',
  }
  const labelS = { display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.35rem' }
  const groupS = { marginBottom: '1rem' }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-desc">Manage admin accounts and user permissions.</p>
      </div>

      <div className="settings-grid">

        {/* ── Account Information ── */}
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
            <div className="settings-info-row">
              <span className="settings-info-label">Email</span>
              <span className="settings-info-value">{admin?.email}</span>
            </div>
            <div className="settings-info-row">
              <span className="settings-info-label">Role</span>
              <span className="settings-info-value">{admin?.role}</span>
            </div>
            <div className="settings-info-row">
              <span className="settings-info-label">Admin ID</span>
              <span className="settings-info-value settings-id">{admin?.id}</span>
            </div>
          </div>
        </div>

        {/* ── Change Password ── */}
        <div className="settings-card">
          <h2 className="settings-card-title">Change Password</h2>
          {pwError   && <div className="form-alert form-alert-error">⚠ {pwError}</div>}
          {pwSuccess && <div className="form-alert form-alert-success">✓ {pwSuccess}</div>}
          <form onSubmit={handlePwSubmit}>
            <div style={groupS}>
              <label style={labelS}>Current Password</label>
              <input style={inputS} type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required />
            </div>
            <div style={groupS}>
              <label style={labelS}>New Password</label>
              <input style={inputS} type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} placeholder="Min 8 characters" required />
            </div>
            <div style={groupS}>
              <label style={labelS}>Confirm New Password</label>
              <input style={inputS} type="password" name="confirm" value={pwForm.confirm} onChange={handlePwChange} required />
            </div>
            <button type="submit" className="btn-save" disabled={pwLoading}>
              {pwLoading ? 'Updating…' : '✓ Update Password'}
            </button>
          </form>
        </div>

        {/* ── Admin Users & Permissions ── */}
        {canManageUsers && (
        <div className="settings-card settings-card-wide">
          <h2 className="settings-card-title">Admin Users &amp; Permissions</h2>

          {usersLoading ? (
            <div style={{ color: 'var(--text-2)', fontSize: '0.875rem', padding: '1rem 0' }}>Loading users…</div>
          ) : (
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table className="temples-table" style={{ fontSize: '0.85rem', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th style={{ minWidth: '130px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ color: 'var(--text-3)', textAlign: 'center', padding: '1.5rem' }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                  {users.map(u => (
                    <Fragment key={u.id}>
                      <tr style={{ background: editingUser?.id === u.id ? 'var(--surface-2, #f0f4ff)' : undefined }}>
                        <td style={{ fontWeight: 500 }}>{u.name}</td>
                        <td style={{ color: 'var(--text-2)' }}>{u.email}</td>
                        <td>
                          {u.id === admin?.id ? (
                            <span className={`badge badge-${u.role === 'superadmin' ? 'published' : 'draft'}`}>{u.role}</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
                              style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', background: 'var(--surface)' }}
                            >
                              <option value="editor">editor</option>
                              <option value="superadmin">superadmin</option>
                            </select>
                          )}
                        </td>
                        <td style={{ color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}
                        </td>
                        <td>
                          {u.id === admin?.id ? (
                            <span style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>You</span>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                              <button
                                onClick={() => editingUser?.id === u.id ? setEditingUser(null) : startEdit(u)}
                                style={{ color: editingUser?.id === u.id ? 'var(--text-2)' : '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, padding: 0 }}
                              >
                                {editingUser?.id === u.id ? 'Cancel' : '✏ Edit'}
                              </button>
                              <span style={{ color: 'var(--border)' }}>|</span>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                style={{ color: '#b91c1c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, padding: 0 }}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Inline edit row */}
                      {editingUser?.id === u.id && (
                        <tr key={`edit-${u.id}`}>
                          <td colSpan={5} style={{ background: 'var(--surface-2, #f0f4ff)', padding: '1rem 1.25rem', borderTop: '2px solid #2563eb33' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
                              Editing — {u.name}
                            </div>
                            {editError && (
                              <div className="form-alert form-alert-error" style={{ marginBottom: '0.75rem' }}>⚠ {editError}</div>
                            )}
                            <form onSubmit={handleEditSave}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '0.75rem', alignItems: 'end' }}>
                                <div style={groupS}>
                                  <label style={labelS}>Full Name</label>
                                  <input
                                    style={inputS}
                                    value={editingUser.name}
                                    onChange={e => setEditingUser(ev => ({ ...ev, name: e.target.value }))}
                                    required
                                  />
                                </div>
                                <div style={groupS}>
                                  <label style={labelS}>Email</label>
                                  <input
                                    style={inputS}
                                    type="email"
                                    value={editingUser.email}
                                    onChange={e => setEditingUser(ev => ({ ...ev, email: e.target.value }))}
                                    required
                                  />
                                </div>
                                <div style={groupS}>
                                  <label style={labelS}>
                                    New Password&nbsp;
                                    <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(leave blank to keep)</span>
                                  </label>
                                  <input
                                    style={inputS}
                                    type="password"
                                    value={editingUser.password}
                                    onChange={e => setEditingUser(ev => ({ ...ev, password: e.target.value }))}
                                    placeholder="Min 8 chars"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="btn-save"
                                  style={{ marginBottom: '1rem', whiteSpace: 'nowrap' }}
                                  disabled={editLoading}
                                >
                                  {editLoading ? 'Saving…' : '✓ Save Changes'}
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add New User */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem', color: 'var(--text)' }}>
              Add New Admin User
            </h3>
            {newUserError   && <div className="form-alert form-alert-error"   style={{ marginBottom: '0.75rem' }}>⚠ {newUserError}</div>}
            {newUserSuccess && <div className="form-alert form-alert-success" style={{ marginBottom: '0.75rem' }}>✓ {newUserSuccess}</div>}
            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', alignItems: 'end' }}>
                <div style={groupS}>
                  <label style={labelS}>Full Name</label>
                  <input
                    style={inputS}
                    value={newUser.name}
                    onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div style={groupS}>
                  <label style={labelS}>Email</label>
                  <input
                    style={inputS}
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div style={groupS}>
                  <label style={labelS}>Password</label>
                  <input
                    style={inputS}
                    type="password"
                    value={newUser.password}
                    onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                    placeholder="Min 8 chars"
                    required
                  />
                </div>
                <div style={groupS}>
                  <label style={labelS}>Role</label>
                  <select
                    style={inputS}
                    value={newUser.role}
                    onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                  >
                    <option value="editor">editor</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-save" disabled={newUserLoading}>
                {newUserLoading ? 'Creating…' : '＋ Create User'}
              </button>
            </form>
          </div>
        </div>
        )}

      </div>
    </div>
  )
}
