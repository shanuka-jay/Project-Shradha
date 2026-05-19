import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from '../components/ConfirmDialog'

const FOLDERS = [
  { key: 'gallery',       label: 'Gallery Images',       icon: 'fas fa-images',      endpoint: '/api/admin/media',              uploadEndpoint: '/api/admin/media/upload', uploadField: 'images', readOnly: false, description: 'Shown on the public About page gallery' },
  { key: 'temple-monks',  label: 'Temple Chief Monks',   icon: 'fas fa-place-of-worship', endpoint: '/api/admin/media/temple-monks', uploadEndpoint: null, uploadField: null, readOnly: true, description: 'Uploaded automatically from the Temple form chief-monk photo field — manage photos from the Temples section' },
  { key: 'monks',         label: 'Monk Profile Photos',  icon: 'fas fa-user-circle', endpoint: '/api/admin/media/monks',         uploadEndpoint: null, uploadField: null, readOnly: true, description: 'Uploaded automatically when saving a monk profile — manage photos from the Monks section' },
]

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function MediaLibrary() {
  const { token } = useAuth()
  const [activeFolder, setActiveFolder] = useState('gallery')
  const [filesByFolder, setFilesByFolder] = useState({ gallery: [], 'temple-monks': [], monks: [] })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef()

  const folder = FOLDERS.find(f => f.key === activeFolder)
  const files = filesByFolder[activeFolder] || []

  async function fetchFolder(folderKey) {
    const f = FOLDERS.find(x => x.key === folderKey)
    if (!f) return
    setLoading(true)
    try {
      const res = await fetch(f.endpoint, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setFilesByFolder(prev => ({ ...prev, [folderKey]: data.files || [] }))
    } catch {
      toast.error('Failed to load images.')
    }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchFolder(activeFolder) }, [activeFolder])

  function switchFolder(key) {
    setActiveFolder(key)
    setSelected(null)
    setStatus('')
  }

  async function handleUpload(e) {
    const picked = Array.from(e.target.files || [])
    if (!picked.length) return
    if (!folder.uploadEndpoint) return
    setUploading(true)
    const toastId = toast.loading(`Uploading ${picked.length} image(s)…`)
    try {
      const fd = new FormData()
      picked.forEach(f => fd.append(folder.uploadField, f))
      const res = await fetch(folder.uploadEndpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      toast.update(toastId, { render: `Uploaded ${data.files.length} image(s).`, type: 'success', isLoading: false, autoClose: 2500 })
      fetchFolder(activeFolder)
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Upload failed.', type: 'error', isLoading: false, autoClose: 3500 })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleDelete(file) {
    setConfirm({
      title: 'Delete Image',
      message: 'This image will be permanently deleted. This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: () => doDelete(file),
    })
  }

  async function doDelete(file) {
    setConfirm(null)
    setDeleting(file.publicId)
    const toastId = toast.loading('Deleting image…')
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(file.publicId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      setFilesByFolder(prev => ({
        ...prev,
        [activeFolder]: prev[activeFolder].filter(f => f.publicId !== file.publicId),
      }))
      if (selected?.publicId === file.publicId) setSelected(null)
      toast.update(toastId, { render: 'Image deleted.', type: 'success', isLoading: false, autoClose: 2500 })
    } catch (err) {
      toast.update(toastId, { render: err.message || 'Delete failed.', type: 'error', isLoading: false, autoClose: 3500 })
    } finally {
      setDeleting(null)
    }
  }

  function copyURL(url) {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const S = {
    page:      { padding: '2rem', maxWidth: 1200 },
    header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
    title:     { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)' },
    desc:      { margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-3)' },

    // Folder tabs
    tabs:      { display: 'flex', gap: '0', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' },
    tab: (active) => ({
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.65rem 1.25rem', cursor: 'pointer', border: 'none',
      background: active ? 'var(--surface)' : 'transparent',
      borderBottom: active ? '2px solid var(--brown-500)' : '2px solid transparent',
      marginBottom: '-2px',
      color: active ? 'var(--brown-600, #7c4f2b)' : 'var(--text-3)',
      fontWeight: active ? 600 : 400,
      fontSize: '0.9rem', transition: 'color 0.15s',
      borderRadius: '6px 6px 0 0',
    }),
    tabCount:  { fontSize: '0.75rem', background: 'var(--surface-2)', borderRadius: 20, padding: '1px 7px', color: 'var(--text-3)' },

    // Folder info banner
    folderBanner: (readOnly) => ({
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.65rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.82rem',
      background: readOnly ? '#fef9ee' : '#f0fdf4',
      color: readOnly ? '#92400e' : '#166534',
      border: `1px solid ${readOnly ? '#fde68a' : '#bbf7d0'}`,
    }),

    // Status bar
    statusBar: (s) => ({
      padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem',
      background: s.startsWith('✓') ? '#f0fdf4' : s.startsWith('✗') ? '#fef2f2' : '#eff6ff',
      color: s.startsWith('✓') ? '#15803d' : s.startsWith('✗') ? '#b91c1c' : '#1d4ed8',
      border: '1px solid var(--border)',
    }),

    // Grid
    grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' },
    card: (active) => ({
      cursor: 'pointer', border: `2px solid ${active ? 'var(--brown-500)' : 'var(--border)'}`,
      borderRadius: 8, overflow: 'hidden', background: 'var(--surface)',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      boxShadow: active ? '0 0 0 3px rgba(124,79,43,0.15)' : 'none',
    }),
    thumb:     { aspectRatio: '1', overflow: 'hidden', background: 'var(--surface-2)' },
    thumbImg:  { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    cardMeta:  { padding: '0.4rem 0.5rem', fontSize: '0.72rem', color: 'var(--text-3)' },

    // Detail panel
    panel:     { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', alignSelf: 'start', position: 'sticky', top: '1rem' },
    panelHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    panelTitle:{ fontWeight: 600, fontSize: '0.875rem' },
    closeBtn:  { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '1.1rem', lineHeight: 1 },
    panelImg:  { width: '100%', borderRadius: 6, marginBottom: '0.75rem', border: '1px solid var(--border)' },
    panelSize: { fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '1rem' },
    copyBtn: (copied) => ({
      width: '100%', padding: '0.55rem', marginBottom: '0.5rem',
      background: copied ? '#f0fdf4' : 'var(--surface-2)',
      border: '1px solid var(--border)', borderRadius: 6,
      fontSize: '0.82rem', cursor: 'pointer',
      color: copied ? '#15803d' : 'var(--text-2)',
    }),
    deleteBtn: { width: '100%', padding: '0.55rem', background: 'none', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.82rem', cursor: 'pointer', color: '#b91c1c' },

    // Empty state
    empty:     { textAlign: 'center', padding: '4rem', background: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: 12 },
    emptyIcon: { fontSize: '3rem', color: 'var(--text-3)', marginBottom: '1rem' },
    emptyText: { color: 'var(--text-2)' },

    // Spinner
    spinner:   { textAlign: 'center', padding: '4rem', color: 'var(--text-2)' },
    spinIcon:  { fontSize: '2rem' },
  }

  return (
    <div style={S.page}>
      <ConfirmDialog config={confirm} onClose={() => setConfirm(null)} />
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Media Library</h1>
          <p style={S.desc}>Manage uploaded images by folder</p>
        </div>
        {!folder.readOnly && (
          <>
            <button className="btn-primary-action" onClick={() => fileRef.current.click()} disabled={uploading}>
              {uploading
                ? <span><i className="fas fa-spinner fa-spin" /> Uploading…</span>
                : <span><i className="fas fa-upload" /> Upload Images</span>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
          </>
        )}
      </div>

      {/* Folder tabs */}
      <div style={S.tabs}>
        {FOLDERS.map(f => (
          <button key={f.key} style={S.tab(activeFolder === f.key)} onClick={() => switchFolder(f.key)}>
            <i className={f.icon} />
            {f.label}
            <span style={S.tabCount}>{filesByFolder[f.key]?.length ?? '…'}</span>
          </button>
        ))}
      </div>

      {/* Folder info banner */}
      <div style={S.folderBanner(folder.readOnly)}>
        <i className={folder.readOnly ? 'fas fa-lock' : 'fas fa-info-circle'} />
        <span>{folder.description}</span>
        {folder.readOnly && (
          <a
            href={folder.key === 'temple-monks' ? '/temples' : '/monks'}
            style={{ marginLeft: 'auto', color: 'var(--brown-600, #7c4f2b)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}
          >
            {folder.key === 'temple-monks' ? 'Go to Temples →' : 'Go to Monks →'}
          </a>
        )}
      </div>

      {/* Status */}
      {status && <div style={S.statusBar(status)}>{status}</div>}

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 300px' : '1fr', gap: '1.5rem' }}>

        {/* Image grid */}
        <div>
          {loading ? (
            <div style={S.spinner}>
              <i className="fas fa-spinner fa-spin" style={S.spinIcon} />
              <p style={{ marginTop: '1rem' }}>Loading images…</p>
            </div>
          ) : files.length === 0 ? (
            <div style={S.empty}>
              <div><i className={folder.icon} style={S.emptyIcon} /></div>
              <p style={S.emptyText}>
                {folder.readOnly
                  ? folder.key === 'temple-monks'
                    ? 'No temple chief-monk photos yet. Upload a photo in the Temple form.'
                    : 'No monk profile photos yet. Upload a photo when saving a monk profile.'
                  : 'No images yet. Upload some!'}
              </p>
            </div>
          ) : (
            <div style={S.grid}>
              {files.map(f => (
                <div key={f.publicId} onClick={() => setSelected(f)} style={S.card(selected?.publicId === f.publicId)}>
                  <div style={S.thumb}>
                    <img src={f.url} alt="" style={S.thumbImg} onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <div style={S.cardMeta}>{formatSize(f.size)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={S.panel}>
            <div style={S.panelHead}>
              <span style={S.panelTitle}>Image Details</span>
              <button onClick={() => setSelected(null)} style={S.closeBtn}>✕</button>
            </div>

            <img src={selected.url} alt="" style={S.panelImg} />
            <div style={S.panelSize}>{formatSize(selected.size)}</div>

            <button onClick={() => copyURL(selected.url)} style={S.copyBtn(copied)}>
              {copied ? '✓ Copied!' : '📋 Copy URL'}
            </button>

            {!folder.readOnly && (
              <button
                onClick={() => handleDelete(selected)}
                disabled={deleting === selected.publicId}
                style={S.deleteBtn}
              >
                {deleting === selected.publicId ? 'Deleting…' : '🗑 Delete Image'}
              </button>
            )}

            {folder.readOnly && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center', marginTop: '0.5rem' }}>
                {folder.key === 'temple-monks'
                  ? 'To remove this photo, edit the temple.'
                  : 'To remove this photo, edit the monk profile.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
