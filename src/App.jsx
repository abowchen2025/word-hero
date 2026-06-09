import { useState } from 'react'
import BattlePage from './pages/BattlePage'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import WorldMapPage from './pages/WorldMapPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStage, setSelectedStage] = useState(null)

  function openBattle(stage) {
    setSelectedStage(stage)
    setCurrentPage('battle')
  }

  if (currentPage === 'worldMap') {
    return (
      <WorldMapPage
        onSelectStage={openBattle}
        onHome={() => setCurrentPage('home')}
      />
    )
  }

  if (currentPage === 'battle') {
    return (
      <BattlePage
        stage={selectedStage}
        onBack={() => setCurrentPage('worldMap')}
        onComplete={() => setCurrentPage('result')}
      />
    )
  }

  if (currentPage === 'result') {
    return (
      <ResultPage
        onPlayAgain={() => setCurrentPage('worldMap')}
        onHome={() => setCurrentPage('home')}
      />
    )
  }

  return <HomePage onStart={() => setCurrentPage('worldMap')} />
}

export default App
