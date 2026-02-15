import { useEffect, useMemo, useRef, useState } from 'react'
import { formatStopwatchDuration } from '../utils/time'

export function useStopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startedAtRef = useRef(0)
  const elapsedBeforeStartRef = useRef(0)

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const nextElapsed = elapsedBeforeStartRef.current + (Date.now() - startedAtRef.current)
      setElapsedMs(nextElapsed)
    }, 10)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  const start = () => {
    startedAtRef.current = Date.now()
    setIsRunning(true)
  }

  const pause = () => {
    elapsedBeforeStartRef.current = elapsedMs
    setIsRunning(false)
  }

  const stop = () => {
    elapsedBeforeStartRef.current = elapsedMs
    setIsRunning(false)
  }

  const reset = () => {
    elapsedBeforeStartRef.current = 0
    startedAtRef.current = 0
    setIsRunning(false)
    setElapsedMs(0)
  }

  const formattedTime = useMemo(() => formatStopwatchDuration(elapsedMs), [elapsedMs])

  return {
    elapsedMs,
    isRunning,
    formattedTime,
    start,
    pause,
    stop,
    reset,
  }
}
