import { useState } from 'react'
import BattlePage from './pages/BattlePage'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import WorldMapPage from './pages/WorldMapPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStage, setSelectedStage] = useState(null)
  const [result, setResult] = useState(null)
  const [battleMode, setBattleMode] = useState('normal')

  function openBattle(stage) {
    setSelectedStage(stage)
    setResult(null)
    setBattleMode('normal')
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
        battleMode={battleMode}
        onBack={() => setCurrentPage('worldMap')}
        onComplete={completeBattle}
      />
    )
  }

  if (currentPage === 'result') {
    return (
      <ResultPage
        result={result}
        battleMode={battleMode}
        onPlayAgain={() => {
          setResult(null)
          setCurrentPage('battle')
        }}
        onReviewMistakes={() => {
          setResult(null)
          setBattleMode('review')
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
