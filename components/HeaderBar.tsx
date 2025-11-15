"use client";
import { useState } from 'react'
import { getDb, exportDb, saveDbLocal, toBase64, fromBase64, replaceDb } from '@/lib/db'
import { Download, Upload, CloudUpload, CloudDownload } from 'lucide-react'

export function HeaderBar() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function saveLocal() {
    setBusy(true)
    const db = await getDb()
    await saveDbLocal(db)
    setMessage('Saved locally')
    setBusy(false)
  }

  async function syncPush() {
    setBusy(true)
    try {
      const db = await getDb()
      const bytes = await exportDb(db)
      const base64 = toBase64(bytes)
      const res = await fetch('/api/sync/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base64 }) })
      const data = await res.json()
      setMessage(data.ok ? 'Synced to cloud' : (data.error ?? 'Sync failed'))
    } catch (e:any) {
      setMessage(e?.message ?? 'Sync failed')
    } finally {
      setBusy(false)
    }
  }

  async function syncPull() {
    setBusy(true)
    try {
      const res = await fetch('/api/sync/pull')
      const data = await res.json()
      if (!data.exists) {
        setMessage('No cloud backup found')
      } else {
        await replaceDb(fromBase64(data.base64))
        setMessage('Loaded from cloud')
      }
    } catch (e:any) {
      setMessage(e?.message ?? 'Load failed')
    } finally {
      setBusy(false)
    }
  }

  async function exportFile() {
    const db = await getDb()
    const bytes = await exportDb(db)
    const blob = new Blob([bytes], { type: 'application/x-sqlite3' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'taskflow.sqlite'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0]
    if (!file) return
    const buffer = await file.arrayBuffer()
    await replaceDb(new Uint8Array(buffer))
    setMessage('Imported database')
  }

  return (
    <div className="flex items-center justify-between py-4 container-max">
      <div className="text-xl font-semibold">TaskFlow</div>
      <div className="flex items-center gap-2">
        <button className="btn btn-secondary" onClick={saveLocal} disabled={busy}><Download className="h-4 w-4 mr-1"/> Save</button>
        <button className="btn btn-secondary" onClick={syncPull} disabled={busy}><CloudDownload className="h-4 w-4 mr-1"/> Pull</button>
        <button className="btn btn-primary" onClick={syncPush} disabled={busy}><CloudUpload className="h-4 w-4 mr-1"/> Push</button>
        <input id="import" type="file" accept=".sqlite" className="hidden" onChange={importFile}/>
        <label htmlFor="import" className="btn btn-secondary cursor-pointer"><Upload className="h-4 w-4 mr-1"/> Import</label>
        <button className="btn btn-secondary" onClick={exportFile}><Download className="h-4 w-4 mr-1"/> Export</button>
      </div>
      {message && <div className="absolute left-1/2 -translate-x-1/2 top-2 text-xs bg-black/80 text-white px-2 py-1 rounded">{message}</div>}
    </div>
  )
}
