import { useEffect, useMemo, useState } from 'react'
import { formatDuration } from '../utils/time'

export function useTimer({ initialSeconds = 60, includeHours = false } = {}) {
  const [duration, setDuration] = useState(initialSeconds)
  const [remaining, setRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [didComplete, setDidComplete] = useState(false)

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setRemaining((prevRemaining) => {
        if (prevRemaining <= 1) {
          setIsRunning(false)
          setDidComplete(true)
          return 0
        }

        return prevRemaining - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  const setTimer = (seconds) => {
    const nextDuration = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
    setDuration(nextDuration)
    setRemaining(nextDuration)
    setIsRunning(false)
    setDidComplete(false)
  }

  const start = () => {
    if (remaining > 0) {
      setDidComplete(false)
      setIsRunning(true)
    }
  }

  const pause = () => {
    setIsRunning(false)
  }

  const stop = () => {
    setIsRunning(false)
    setRemaining(0)
    setDidComplete(false)
  }

  const reset = () => {
    setIsRunning(false)
    setRemaining(duration)
    setDidComplete(false)
  }

  const formattedTime = useMemo(
    () => formatDuration(remaining, includeHours),
    [remaining, includeHours],
  )

  return {
    duration,
    remaining,
    formattedTime,
    isRunning,
    didComplete,
    setTimer,
    start,
    pause,
    stop,
    reset,
  }
}
