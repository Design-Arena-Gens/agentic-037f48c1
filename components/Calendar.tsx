"use client";
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isSameMonth, startOfMonth } from 'date-fns'
import { useMemo } from 'react'

export function Calendar({ month, selectedDate, onSelect, onPrev, onNext }: {
  month: Date
  selectedDate: Date
  onSelect: (d: Date) => void
  onPrev: () => void
  onNext: () => void
}) {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const days = useMemo(() => eachDayOfInterval({ start, end }), [month.toISOString()])
  const blankCount = (getDay(start) + 6) % 7

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary" onClick={onPrev}>Prev</button>
          <div className="font-medium">{format(month, 'MMMM yyyy')}</div>
          <button className="btn btn-secondary" onClick={onNext}>Next</button>
        </div>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-7 text-xs text-gray-600 mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: blankCount }).map((_,i)=>(<div key={`b${i}`} />))}
          {days.map((d) => {
            const selected = isSameDay(d, selectedDate)
            const inMonth = isSameMonth(d, month)
            return (
              <button key={d.toISOString()}
                onClick={()=>onSelect(d)}
                className={`rounded-lg p-2 h-20 text-left border ${selected? 'border-brand bg-brand/5':'border-gray-200 bg-white hover:bg-gray-50'} ${inMonth? '':'opacity-50'}`}
              >
                <div className="text-xs font-medium">{format(d,'d')}</div>
                {/* Slots for inline summary badges could go here */}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
