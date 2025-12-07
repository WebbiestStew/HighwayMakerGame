import { useState, useEffect } from 'react'
import { Scene } from './components/Scene'
import MainMenuV4 from './components/UI/MainMenuV4'
import LoadingScreenV4 from './components/UI/LoadingScreenV4'
import CityBuilderHUD from './components/UI/CityBuilderHUD'
import BuildTools from './components/UI/BuildTools'
import { PauseMenu } from './components/UI/PauseMenu'
import { PerformanceMonitor } from './utils/PerformanceMonitor'
import { useGameStore } from './store/gameStore'
import { initSoundOnInteraction } from './utils/SoundManager'
import { initMusicOnInteraction } from './utils/MusicManager'

function App() {
  const { gameState, setGameState } = useGameStore()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showPerformance, setShowPerformance] = useState(false)
  const [selectedTool, setSelectedTool] = useState<any>(null)

  // Initialize sound and music systems
  useEffect(() => {
    initSoundOnInteraction()
    initMusicOnInteraction()

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault()
        setShowPerformance(prev => !prev)
      }
      if (e.key === 'Escape' && gameState === 'playing') {
        setIsPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  // Handle game start
  const handleStartGame = (mode: 'career' | 'sandbox') => {
    console.log(`Starting ${mode} mode`)
    setGameState('loading')
    
    // Simulate loading
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setLoadingProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 300)
  }

  // Handle loading complete
  const handleLoadingComplete = () => {
    setGameState('playing')
  }

  // Handle tool selection from BuildTools
  const handleToolSelect = (tool: string, data: any) => {
    setSelectedTool({ tool, data })
    console.log('Tool selected:', tool, data)
    // TODO: Add visual feedback and connect to building placement
  }
        if (mission.completed && !missions[index].completed) {
          // Mission just completed!
          soundManager.playSuccess()
  // Handle tool selection from BuildTools
  const handleToolSelect = (tool: string, data: any) => {
    setSelectedTool({ tool, data })
    console.log('Tool selected:', tool, data)
    // TODO: Add visual feedback and connect to building placement
  }

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Main Menu */}
      {gameState === 'menu' && (
        <MainMenuV4
          onStartGame={handleStartGame}
          onSettings={() => console.log('Settings')}
          onQuit={() => window.close()}
        />
      )}

      {/* Loading Screen */}
      {gameState === 'loading' && (
        <LoadingScreenV4
          progress={loadingProgress}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* Game Playing State */}
      {gameState === 'playing' && (
        <>
          <Scene />
          <CityBuilderHUD
            onPause={() => setIsPaused(true)}
            onMenu={() => setGameState('menu')}
          />
          <BuildTools onToolSelect={handleToolSelect} />
          {isPaused && <PauseMenu onClose={() => setIsPaused(false)} />}
          {showPerformance && <PerformanceMonitor />}
        </>
      )}
    </div>
  )
}

export default App
