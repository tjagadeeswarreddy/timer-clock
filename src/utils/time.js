export function formatDuration(totalSeconds, includeHours = false) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  if (includeHours) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const totalMinutes = Math.floor(safeSeconds / 60)
  return `${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatStopwatchDuration(totalMilliseconds) {
  const safeMilliseconds = Math.max(0, Math.floor(totalMilliseconds))
  const hours = Math.floor(safeMilliseconds / 3600000)
  const minutes = Math.floor((safeMilliseconds % 3600000) / 60000)
  const seconds = Math.floor((safeMilliseconds % 60000) / 1000)
  const centiseconds = Math.floor((safeMilliseconds % 1000) / 10)

  const minutesPart = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes)
  const base = `${minutesPart}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${base}`
  }

  return base
}
