"use client";
import { useMemo, useState } from 'react'
import { addMonths } from 'date-fns'
import { Calendar } from '@/components/Calendar'
import { TaskList } from '@/components/TaskList'
import { CategoryPanel } from '@/components/CategoryPanel'
import { ProgressCards } from '@/components/ProgressCards'
import { HeaderBar } from '@/components/HeaderBar'

export default function Page() {
  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <main>
      <HeaderBar />
      <div className="container-max grid grid-cols-1 lg:grid-cols-4 gap-4 pb-8">
        <div className="lg:col-span-3 space-y-4">
          <ProgressCards month={month} />
          <Calendar
            month={month}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onPrev={() => setMonth(addMonths(month, -1))}
            onNext={() => setMonth(addMonths(month, 1))}
          />
          <TaskList date={selectedDate} />
        </div>
        <div className="lg:col-span-1">
          <CategoryPanel />
        </div>
      </div>
    </main>
  )
}
