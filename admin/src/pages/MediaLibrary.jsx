import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function MediaLibrary() {
  const { token } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')       // feedback message
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef()

  async function fetchFiles() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setFiles(data.files || [])
    } catch { setStatus('Failed to load images') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchFiles() }, [])

  async function handleUpload(e) {
    const picked = Array.from(e.target.files || [])
    if (!picked.length) return
    setUploading(true)
    setStatus(`Uploading ${picked.length} image(s)…`)
    try {
      const fd = new FormData()
      picked.forEach(f => fd.append('images', f))
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setStatus(`✓ ${data.files.length} image(s) uploaded successfully`)
      fetchFiles()
    } catch (err) {
      setStatus(`✗ ${err.message}`)
    } finally {
      setUploading(false)
      e.target.value = ''
      setTimeout(() => setStatus(''), 3000)
    }
  }

  async function handleDelete(file) {
    if (!window.confirm(`Delete this image? This cannot be undone.`)) return
    setDeleting(file.publicId)
    try {
      await fetch(`/api/admin/media/${encodeURIComponent(file.publicId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setFiles(fs => fs.filter(f => f.publicId !== file.publicId))
      if (selected?.publicId === file.publicId) setSelected(null)
      setStatus('✓ Image deleted')
      setTimeout(() => setStatus(''), 2000)
    } catch {
      setStatus('✗ Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  function copyURL(url) {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1200 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-desc">{files.length} image{files.length !== 1 ? 's' : ''} on Cloudinary</p>
        </div>
        <button className="btn-primary-action" onClick={() => fileRef.current.click()} disabled={uploading}>
          {uploading
            ? <span><i className="fas fa-spinner fa-spin" /> Uploading…</span>
            : <span><i className="fas fa-upload" /> Upload Images</span>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      {status && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem',
          background: status.startsWith('✓') ? '#f0fdf4' : status.startsWith('✗') ? '#fef2f2' : '#eff6ff',
          color: status.startsWith('✓') ? '#15803d' : status.startsWith('✗') ? '#b91c1c' : '#1d4ed8',
          border: '1px solid var(--border)',
        }}>
          {status}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 300px' : '1fr', gap: '1.5rem' }}>

        {/* Grid */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-2)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
              <p style={{ marginTop: '1rem' }}>Loading images…</p>
            </div>
          ) : files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: 12 }}>
              <i className="fas fa-images" style={{ fontSize: '3rem', color: 'var(--text-3)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-2)' }}>No images yet. Upload some!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {files.map(f => (
                <div
                  key={f.publicId}
                  onClick={() => setSelected(f)}
                  style={{
                    cursor: 'pointer',
                    border: `2px solid ${selected?.publicId === f.publicId ? 'var(--brown-500)' : 'var(--border)'}`,
                    borderRadius: 8, overflow: 'hidden',
                    background: 'var(--surface)',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--surface-2)' }}>
                    <img
                      src={f.url} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <div style={{ padding: '0.4rem 0.5rem', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                    {formatSize(f.size)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '1.25rem', alignSelf: 'start',
            position: 'sticky', top: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Image Details</span>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '1.1rem' }}>
                ✕
              </button>
            </div>

            <img src={selected.url} alt=""
              style={{ width: '100%', borderRadius: 6, marginBottom: '0.75rem', border: '1px solid var(--border)' }} />

            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '1rem' }}>
              {formatSize(selected.size)}
            </div>

            <button
              onClick={() => copyURL(selected.url)}
              style={{
                width: '100%', padding: '0.55rem', marginBottom: '0.5rem',
                background: copied ? '#f0fdf4' : 'var(--surface-2)',
                border: '1px solid var(--border)', borderRadius: 6,
                fontSize: '0.82rem', cursor: 'pointer',
                color: copied ? '#15803d' : 'var(--text-2)',
              }}>
              {copied ? '✓ Copied!' : '📋 Copy URL'}
            </button>

            <button
              onClick={() => handleDelete(selected)}
              disabled={deleting === selected.publicId}
              style={{
                width: '100%', padding: '0.55rem',
                background: 'none', border: '1px solid #fecaca',
                borderRadius: 6, fontSize: '0.82rem', cursor: 'pointer', color: '#b91c1c',
              }}>
              {deleting === selected.publicId ? 'Deleting…' : '🗑 Delete Image'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
