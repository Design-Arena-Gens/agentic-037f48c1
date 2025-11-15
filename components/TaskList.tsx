"use client";
import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { getDb, saveDbLocal } from '@/lib/db'
import { createTask, getCategories, getTasksForDate, removeInstance, scheduleTask, toggleCompletion, type Category } from '@/lib/repo'
import { CheckCircle2, CirclePlus, Trash2 } from 'lucide-react'

export function TaskList({ date }: { date: Date }) {
  const iso = format(date, 'yyyy-MM-dd')
  const [rows, setRows] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [priority, setPriority] = useState(1)
  const [score, setScore] = useState(1)

  const refresh = async () => {
    const db = await getDb()
    setRows(getTasksForDate(db, iso))
    setCategories(getCategories(db))
  }

  useEffect(() => { refresh() }, [iso])

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    const db = await getDb()
    const task = createTask(db, title.trim(), categoryId === '' ? null : Number(categoryId), priority)
    scheduleTask(db, task.id, iso, score)
    await saveDbLocal(db)
    setTitle('')
    setCategoryId('')
    refresh()
  }

  async function toggle(id: number, next: boolean) {
    const db = await getDb()
    toggleCompletion(db, id, next)
    await saveDbLocal(db)
    refresh()
  }

  async function remove(id: number) {
    const db = await getDb()
    removeInstance(db, id)
    await saveDbLocal(db)
    refresh()
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="font-medium">Tasks for {iso}</span>
      </div>
      <div className="card-body space-y-4">
        <form onSubmit={addTask} className="grid grid-cols-1 sm:grid-cols-6 gap-2">
          <input className="input sm:col-span-2" placeholder="Add task title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <select className="input" value={categoryId} onChange={e=>setCategoryId(e.target.value as any)}>
            <option value="">Uncategorized</option>
            {categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
          </select>
          <select className="input" value={priority} onChange={e=>setPriority(Number(e.target.value))}>
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
          </select>
          <input className="input" type="number" min={0} max={100} value={score} onChange={e=>setScore(Number(e.target.value))} placeholder="Score" />
          <button className="btn btn-primary flex items-center gap-1"><CirclePlus className="h-4 w-4"/> Add</button>
        </form>

        <div className="divide-y divide-gray-100">
          {rows.length === 0 && <p className="text-sm text-gray-500">No tasks scheduled for this day.</p>}
          {rows.map(r => (
            <div key={r.instance_id} className="py-3 flex items-center gap-3">
              <button onClick={()=>toggle(r.instance_id, !r.completed)} className={`h-6 w-6 rounded-full border flex items-center justify-center ${r.completed ? 'bg-brand text-white border-brand' : 'border-gray-300 text-gray-400'}`}>
                <CheckCircle2 className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="badge" style={{ backgroundColor: r.category_color ?? '#eee' }}>{r.category_name ?? 'Uncategorized'}</span>
                  <span>Priority: {['Low','Med','High'][r.priority]}</span>
                  <span>Score: {r.score}</span>
                </div>
              </div>
              <button onClick={()=>remove(r.instance_id)} className="btn btn-secondary" aria-label="Delete"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
