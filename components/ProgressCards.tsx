"use client";
import { useEffect, useState } from 'react'
import { getDb } from '@/lib/db'
import { getMonthProgress, getMonthScore, getCategoryBreakdown } from '@/lib/repo'

export function ProgressCards({ month }: { month: Date }) {
  const [progress, setProgress] = useState({ total: 0, completed: 0, percent: 0 })
  const [score, setScore] = useState(0)
  const [breakdown, setBreakdown] = useState<Array<{id:number;name:string;color:string;achieved:number;scheduled:number}>>([])

  useEffect(() => {
    (async () => {
      const db = await getDb()
      setProgress(getMonthProgress(db, month))
      setScore(getMonthScore(db, month))
      setBreakdown(getCategoryBreakdown(db, month))
    })()
  }, [month])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="card">
        <div className="card-header"><span className="font-medium">Overall Progress</span><span className="text-sm text-gray-500">{progress.percent}%</span></div>
        <div className="card-body">
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="mt-2 text-sm text-gray-600">{progress.completed} of {progress.total} tasks completed</p>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="font-medium">Monthly Score</span></div>
        <div className="card-body">
          <div className="text-3xl font-semibold">{score}</div>
          <p className="text-sm text-gray-600">Earn points by completing tasks</p>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="font-medium">By Category</span></div>
        <div className="card-body space-y-2">
          {breakdown.length === 0 ? (<p className="text-sm text-gray-500">No data yet.</p>) : breakdown.map(b => (
            <div key={b.id} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
              <span className="text-sm flex-1">{b.name ?? 'Uncategorized'}</span>
              <span className="text-xs text-gray-600">{b.achieved}/{b.scheduled}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
