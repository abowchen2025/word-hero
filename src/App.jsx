import { useState } from 'react'
import BattlePage from './pages/BattlePage'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import WorldMapPage from './pages/WorldMapPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStage, setSelectedStage] = useState(null)
  const [result, setResult] = useState(null)

  function openBattle(stage) {
    setSelectedStage(stage)
    setResult(null)
    setCurrentPage('battle')
  }

  function completeBattle(battleResult) {
    setResult(battleResult)
    setCurrentPage('result')
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
        onComplete={completeBattle}
      />
    )
  }

  if (currentPage === 'result') {
    return (
      <ResultPage
        result={result}
        onPlayAgain={() => {
          setResult(null)
          setCurrentPage('battle')
        }}
        onWorldMap={() => setCurrentPage('worldMap')}
        onHome={() => setCurrentPage('home')}
      />
    )
  }

  return <HomePage onStart={() => setCurrentPage('worldMap')} />
}

export default App
