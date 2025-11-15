"use client";
import { useEffect, useState } from 'react'
import { getDb, saveDbLocal } from '@/lib/db'
import { Category, createCategory, deleteCategory, getCategories } from '@/lib/repo'
import { Plus, Trash2 } from 'lucide-react'

export function CategoryPanel() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6D5EF3')

  const refresh = async () => {
    const db = await getDb()
    setCategories(getCategories(db))
  }

  useEffect(() => { refresh() }, [])

  async function onAdd(e: React.FormEvent) {
    e.preventDefault()
    const db = await getDb()
    createCategory(db, name.trim(), color)
    await saveDbLocal(db)
    setName('')
    refresh()
  }

  async function onDelete(id: number) {
    const db = await getDb()
    deleteCategory(db, id)
    await saveDbLocal(db)
    refresh()
  }

  return (
    <div className="card h-full">
      <div className="card-header">
        <span className="font-medium">Categories</span>
      </div>
      <div className="card-body space-y-4">
        <form onSubmit={onAdd} className="flex items-center gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="New category" className="input" required />
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-10 w-12 rounded" />
          <button className="btn btn-primary" aria-label="Add category"><Plus className="h-4 w-4"/></button>
        </form>
        <div className="space-y-2">
          {categories.map(c => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-sm flex-1">{c.name}</span>
              <button onClick={()=>onDelete(c.id)} className="btn btn-secondary" aria-label="Delete"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-gray-500">No categories yet.</p>}
        </div>
      </div>
    </div>
  )
}
