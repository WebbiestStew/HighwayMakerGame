import { useState, useEffect } from 'react'
import { Scene } from './components/Scene'
import { HUD } from './components/UI/HUD'
import { MainMenu } from './components/UI/MainMenu'
import { EnhancedLoadingScreen } from './components/UI/EnhancedLoadingScreen'
import { PauseMenu } from './components/UI/PauseMenu'
import { KeyboardShortcuts } from './components/UI/KeyboardShortcuts'
import { AchievementNotification } from './components/UI/AchievementsMenu'
import { PerformanceMonitor } from './utils/PerformanceMonitor'
import { useGameStore } from './store/gameStore'
import { initSoundOnInteraction, soundManager } from './utils/SoundManager'
import { initMusicOnInteraction } from './utils/MusicManager'
import { MissionManager } from './systems/MissionSystem'
import { AchievementManager } from './systems/AchievementSystem'
import { undoRedoManager } from './systems/UndoRedoSystem'

function App() {
  const { gameState, missions, setMissions, achievements, setAchievements } = useGameStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [recentAchievement, setRecentAchievement] = useState<any>(null)
  const [showPerformance, setShowPerformance] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  // Initialize sound and music systems
  useEffect(() => {
    initSoundOnInteraction()
    initMusicOnInteraction()

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (undoRedoManager.undo()) {
          soundManager.playUIClick()
        }
      }
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault()
        if (undoRedoManager.redo()) {
          soundManager.playUIClick()
        }
      }
      // Keyboard shortcuts help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        setShowKeyboardShortcuts(true)
      }
      // Performance monitor toggle
      if (e.key === 'F3') {
        e.preventDefault()
        setShowPerformance(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Check missions and achievements periodically
  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      const state = useGameStore.getState()
      
      // Check and update missions
      const updatedMissions = MissionManager.checkMissionProgress(missions, state)
      
      // Check for newly completed missions
      updatedMissions.forEach((mission, index) => {
        if (mission.completed && !missions[index].completed) {
          // Mission just completed!
          soundManager.playSuccess()
          state.completeMission(mission.id)
        }
      })
      
      if (JSON.stringify(updatedMissions) !== JSON.stringify(missions)) {
        setMissions(updatedMissions)
      }
      
      // Check and update achievements
      const updatedAchievements = AchievementManager.checkAchievements(achievements, state)
      
      // Check for newly unlocked achievements
      updatedAchievements.forEach((achievement, index) => {
        if (achievement.unlocked && !achievements[index].unlocked) {
          // Achievement just unlocked!
          soundManager.playSuccess()
          setRecentAchievement(achievement)
          setTimeout(() => setRecentAchievement(null), 5000)
        }
      })
      
      if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
        setAchievements(updatedAchievements)
      }
    }, 2000) // Check every 2 seconds

    return () => clearInterval(interval)
  }, [gameState, missions, achievements, setMissions, setAchievements])

  // Loading simulation
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000) // Extended for enhanced loading screen
  }, [])

  // ESC key for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        setIsPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  if (isLoading) {
    return <EnhancedLoadingScreen />
  }

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* UI Overlay */}
      {gameState === 'menu' && <MainMenu />}
      {gameState === 'playing' && (
        <>
          <Scene />
          <HUD />
          {isPaused && <PauseMenu onClose={() => setIsPaused(false)} />}
          {recentAchievement && (
            <AchievementNotification
              achievement={recentAchievement}
              onClose={() => setRecentAchievement(null)}
            />
          )}
          {showPerformance && <PerformanceMonitor />}
          {showKeyboardShortcuts && <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />}
        </>
      )}
    </div>
  )
}

export default App
