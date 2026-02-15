import { useEffect, useState } from 'react'
import { useStopwatch } from '../hooks/useStopwatch'
import { useTimer } from '../hooks/useTimer'
import '../styles/TimerPanel.css'

function playAlertSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext

  if (!AudioContextClass) {
    return
  }

  const context = new AudioContextClass()
  const beepOffsets = [0, 0.25, 0.5]

  beepOffsets.forEach((offset) => {
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 880

    gainNode.gain.setValueAtTime(0.0001, context.currentTime + offset)
    gainNode.gain.exponentialRampToValueAtTime(0.2, context.currentTime + offset + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + offset + 0.18)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.start(context.currentTime + offset)
    oscillator.stop(context.currentTime + offset + 0.2)
  })

  window.setTimeout(() => {
    context.close().catch(() => {})
  }, 1000)
}

export default function TimerPanel() {
  const [mode, setMode] = useState('countdown')
  const [includeHours, setIncludeHours] = useState(false)
  const [hoursInput, setHoursInput] = useState('0')
  const [minutesInput, setMinutesInput] = useState('1')
  const [secondsInput, setSecondsInput] = useState('0')
  const [showAlert, setShowAlert] = useState(false)

  const countdown = useTimer({ initialSeconds: 60, includeHours })
  const stopwatch = useStopwatch()

  useEffect(() => {
    if (mode !== 'countdown' || !countdown.didComplete) {
      return undefined
    }

    setShowAlert(true)
    playAlertSound()

    const timeoutId = window.setTimeout(() => {
      setShowAlert(false)
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [mode, countdown.didComplete])

  const handleModeChange = (nextMode) => {
    setShowAlert(false)
    countdown.pause()
    stopwatch.pause()
    setMode(nextMode)
  }

  const handleSetTimer = () => {
    const hours = Number.parseInt(hoursInput || '0', 10)
    const minutes = Number.parseInt(minutesInput || '0', 10)
    const seconds = Number.parseInt(secondsInput || '0', 10)

    const safeHours = Number.isFinite(hours) ? Math.max(0, hours) : 0
    const safeMinutesRaw = Number.isFinite(minutes) ? Math.max(0, minutes) : 0
    const safeMinutes = includeHours ? Math.min(59, safeMinutesRaw) : safeMinutesRaw
    const safeSeconds = Number.isFinite(seconds) ? Math.min(59, Math.max(0, seconds)) : 0

    setShowAlert(false)
    countdown.setTimer(safeHours * 3600 + safeMinutes * 60 + safeSeconds)
  }

  const handleCountdownStart = () => {
    setShowAlert(false)
    countdown.start()
  }

  const panelClassName = `timer-panel ${showAlert ? 'timer-panel-alert' : ''}`

  return (
    <section className={panelClassName}>
      <h1 className="timer-title">Timer Clock</h1>

      <div className="mode-switch" role="tablist" aria-label="Timer mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'countdown'}
          className={mode === 'countdown' ? 'mode-button active' : 'mode-button'}
          onClick={() => handleModeChange('countdown')}
        >
          Countdown
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'stopwatch'}
          className={mode === 'stopwatch' ? 'mode-button active' : 'mode-button'}
          onClick={() => handleModeChange('stopwatch')}
        >
          Stopwatch
        </button>
      </div>

      {mode === 'countdown' ? (
        <>
          <div className="timer-display" role="timer" aria-live="assertive" aria-atomic="true">
            {countdown.formattedTime}
          </div>

          {showAlert && <p className="timer-alert-text">Time&apos;s up!</p>}

          <label className="hours-toggle">
            <input
              type="checkbox"
              checked={includeHours}
              onChange={(event) => setIncludeHours(event.target.checked)}
            />
            Include hours
          </label>

          <div className={`timer-setter ${includeHours ? 'with-hours' : ''}`}>
            {includeHours && (
              <label>
                Hours
                <input
                  type="number"
                  min="0"
                  value={hoursInput}
                  onChange={(event) => setHoursInput(event.target.value)}
                />
              </label>
            )}

            <label>
              Minutes
              <input
                type="number"
                min="0"
                max={includeHours ? '59' : undefined}
                value={minutesInput}
                onChange={(event) => setMinutesInput(event.target.value)}
              />
            </label>

            <label>
              Seconds
              <input
                type="number"
                min="0"
                max="59"
                value={secondsInput}
                onChange={(event) => setSecondsInput(event.target.value)}
              />
            </label>

            <button type="button" className="set-button" onClick={handleSetTimer}>
              Set Timer
            </button>
          </div>

          <div className="timer-actions">
            <button
              type="button"
              onClick={handleCountdownStart}
              disabled={countdown.isRunning || countdown.remaining === 0}
            >
              Start
            </button>
            <button type="button" onClick={countdown.pause} disabled={!countdown.isRunning}>
              Pause
            </button>
            <button
              type="button"
              onClick={countdown.stop}
              disabled={countdown.remaining === 0 && !countdown.isRunning}
            >
              Stop
            </button>
            <button type="button" onClick={countdown.reset}>
              Reset
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="timer-display" role="timer" aria-live="assertive" aria-atomic="true">
            {stopwatch.formattedTime}
          </div>

          <div className="timer-actions">
            <button type="button" onClick={stopwatch.start} disabled={stopwatch.isRunning}>
              Start
            </button>
            <button type="button" onClick={stopwatch.pause} disabled={!stopwatch.isRunning}>
              Pause
            </button>
            <button type="button" onClick={stopwatch.stop} disabled={!stopwatch.isRunning}>
              Stop
            </button>
            <button
              type="button"
              onClick={stopwatch.reset}
              disabled={stopwatch.elapsedMs === 0 && !stopwatch.isRunning}
            >
              Reset
            </button>
          </div>
        </>
      )}
    </section>
  )
}
