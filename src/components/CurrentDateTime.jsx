import { useEffect, useState } from 'react'
import '../styles/CurrentDateTime.css'

function formatNow(date) {
  return {
    date: date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }
}

export default function CurrentDateTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const formatted = formatNow(now)

  return (
    <div className="current-date-time" aria-live="polite">
      <span className="current-date">{formatted.date}</span>
      <span className="current-time">{formatted.time}</span>
    </div>
  )
}
