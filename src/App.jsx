import CurrentDateTime from './components/CurrentDateTime'
import TimerPanel from './components/TimerPanel'
import './styles/App.css'

function App() {
  return (
    <main className="app-shell">
      <CurrentDateTime />
      <TimerPanel />
    </main>
  )
}

export default App
