import React, { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { SaveSystem } from '../../utils/SaveSystem'
import { Settings } from './Settings'
import { StatsPanel } from './StatsPanel'
import { MissionsMenu } from './MissionsMenu'
import { AchievementsMenu } from './AchievementsMenu'
import { ResearchTree } from './ResearchTree'
import { ResourceDashboard } from './ResourceDashboard'
import { soundManager } from '../../utils/SoundManager'

export const HUD: React.FC = () => {
    const { funds, gameDate, currentEvent, checkCurrentEvent, timeOfDay, setTimeOfDay } = useGameStore()
    const [showSettings, setShowSettings] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [showMissions, setShowMissions] = useState(false)
    const [showAchievements, setShowAchievements] = useState(false)
    const [showResearch, setShowResearch] = useState(false)
    const [showResources, setShowResources] = useState(false)
    const [showQuickMenu, setShowQuickMenu] = useState(false)

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Check for seasonal events when date changes
    useEffect(() => {
        checkCurrentEvent()
    }, [gameDate.month, checkCurrentEvent])

    // Auto-save setup
    useEffect(() => {
        const intervalId = SaveSystem.startAutoSave(30000)
        return () => SaveSystem.stopAutoSave(intervalId)
    }, [])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const { setSelectedTool, setCurveMode, isCurveMode } = useGameStore.getState()

            if (e.key === 'Tab') {
                e.preventDefault()
                setShowStats(prev => !prev)
                soundManager.playUIClick()
                return
            }

            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                SaveSystem.save('manual_1')
                soundManager.playSave()
                return
            }

            if (e.key === 'q' || e.key === 'Q') {
                setSelectedTool('select')
                soundManager.playUIClick()
            }
            if (e.key === 'w' || e.key === 'W') {
                setSelectedTool('road')
                soundManager.playUIClick()
            }
            if (e.key === 'e' || e.key === 'E') {
                setSelectedTool('sign')
                soundManager.playUIClick()
            }
            if (e.key === 'r' || e.key === 'R') {
                setSelectedTool('zone')
                soundManager.playUIClick()
            }
            if (e.key === 'd' || e.key === 'D') {
                setSelectedTool('demolish')
                soundManager.playUIClick()
            }
            if (e.key === 'c' || e.key === 'C') {
                setCurveMode(!isCurveMode)
                soundManager.playUIClick()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    return (
        <>
        <div className="absolute inset-0 z-40 pointer-events-none">
            {/* Top Bar - Glassmorphism */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto">
                {/* Left side - Info cards */}
                <div className="flex gap-3 animate-slide-up">
                    {/* Funds card */}
                    <div className="glass-dark rounded-2xl px-6 py-3 border border-white/20 hover:border-white/30 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">💰</span>
                            <div>
                                <div className="text-xs text-gray-400 font-semibold">FUNDS</div>
                                <div className="text-2xl font-bold text-green-400">${funds.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Date card */}
                    <div className="glass-dark rounded-2xl px-6 py-3 border border-white/20 hover:border-white/30 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📅</span>
                            <div>
                                <div className="text-xs text-gray-400 font-semibold">DATE</div>
                                <div className="text-xl font-bold text-white">{monthNames[gameDate.month - 1]} {gameDate.year}</div>
                            </div>
                        </div>
                    </div>

                    {/* Seasonal Event */}
                    {currentEvent && (
                        <div className="glass-dark rounded-2xl px-6 py-3 border border-purple-400/50 hover:border-purple-400/70 transition-all animate-pulse-glow">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🎉</span>
                                <div>
                                    <div className="text-xs text-purple-300 font-semibold">EVENT</div>
                                    <div className="text-lg font-bold text-white">{currentEvent.name}</div>
                                    <div className="text-xs text-purple-200">+{Math.round((currentEvent.incomeBonus - 1) * 100)}% Income</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Day/Night toggle */}
                    <button
                        className="glass-dark rounded-2xl px-6 py-3 border border-white/20 hover:border-white/30 hover:scale-105 transition-all"
                        onClick={() => {
                            soundManager.playUIClick()
                            setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day')
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{timeOfDay === 'day' ? '☀️' : '🌙'}</span>
                            <div>
                                <div className="text-xs text-gray-400 font-semibold">TIME</div>
                                <div className="text-xl font-bold text-white">{timeOfDay === 'day' ? 'DAY' : 'NIGHT'}</div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Right side - Action buttons */}
                <div className="flex gap-2 animate-slide-up">
                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-orange-400/50 hover:bg-orange-500/10 transition-all group"
                        onClick={() => {
                            soundManager.playUIClick()
                            setShowMissions(true)
                        }}
                        title="Missions (M)"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🎯</span>
                    </button>
                    
                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all group"
                        onClick={() => {
                            soundManager.playUIClick()
                            setShowAchievements(true)
                        }}
                        title="Achievements"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🏆</span>
                    </button>

                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all group"
                        onClick={() => {
                            soundManager.playUIClick()
                            setShowResearch(true)
                        }}
                        title="Research Tech Tree"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🔬</span>
                    </button>

                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-yellow-400/50 hover:bg-yellow-500/10 transition-all group"
                        onClick={() => {
                            soundManager.playUIClick()
                            setShowResources(true)
                        }}
                        title="Resource Management"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">⚡</span>
                    </button>

                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all group"
                        onClick={() => {
                            SaveSystem.save('manual_1')
                            soundManager.playSave()
                        }}
                        title="Save (Ctrl+S)"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">💾</span>
                    </button>

                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-green-400/50 hover:bg-green-500/10 transition-all group"
                        onClick={() => {
                            if (SaveSystem.load('manual_1')) {
                                soundManager.playSuccess()
                                window.location.reload()
                            } else {
                                soundManager.playError()
                            }
                        }}
                        title="Load"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">📂</span>
                    </button>

                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all group"
                        onClick={() => {
                            soundManager.playUIClick()
                            setShowStats(prev => !prev)
                        }}
                        title="Stats (Tab)"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">📊</span>
                    </button>

                    <button
                        className="glass-dark rounded-xl p-3 border border-white/20 hover:border-gray-400/50 hover:bg-gray-500/10 transition-all group"
                        onClick={() => {
                            soundManager.playUIClick()
                            setShowSettings(true)
                        }}
                        title="Settings"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">⚙️</span>
                    </button>
                </div>
            </div>

            {/* Bottom - Radial Build Menu */}
            <BuildMenu />

            {/* Modals - Outside pointer-events-none container */}
            </div>
            
            {/* Modals with full pointer events */}
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
            {showStats && <StatsPanel onClose={() => setShowStats(false)} />}
            {showMissions && <MissionsMenu onClose={() => setShowMissions(false)} />}
            {showAchievements && <AchievementsMenu onClose={() => setShowAchievements(false)} />}
            {showResearch && <ResearchTree onClose={() => setShowResearch(false)} />}
            {showResources && <ResourceDashboard onClose={() => setShowResources(false)} />}
        </>
    )
}

const BuildMenu: React.FC = () => {
    const { selectedTool, setSelectedTool, isCurveMode, setCurveMode, selectedZoneType, setSelectedZoneType } = useGameStore()
    const [isExpanded, setIsExpanded] = useState(false)

    const tools = [
        { id: 'select', icon: '👆', label: 'Select', key: 'Q', color: 'blue' },
        { id: 'road', icon: '🛣️', label: 'Road', key: 'W', color: 'green' },
        { id: 'zone', icon: '🏘️', label: 'Zone', key: 'R', color: 'purple' },
        { id: 'sign', icon: '🚦', label: 'Sign', key: 'E', color: 'yellow' },
        { id: 'demolish', icon: '💥', label: 'Demolish', key: 'D', color: 'red' },
    ]

    const zoneTypes = [
        { id: 'residential', icon: '🏠', label: 'Residential', color: 'green' },
        { id: 'commercial', icon: '🏢', label: 'Commercial', color: 'blue' },
        { id: 'industrial', icon: '🏭', label: 'Industrial', color: 'yellow' },
    ]

    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <div className="flex flex-col items-center gap-4">
                {/* Zone selector (when zone tool active) */}
                {selectedTool === 'zone' && (
                    <div className="glass-dark rounded-2xl p-3 border border-white/20 flex gap-2 animate-slide-up">
                        {zoneTypes.map(zone => (
                            <button
                                key={zone.id}
                                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                                    selectedZoneType === zone.id
                                        ? `bg-${zone.color}-500/30 border-2 border-${zone.color}-400/50 text-white scale-105`
                                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                                }`}
                                onClick={() => setSelectedZoneType(zone.id as any)}
                            >
                                <span className="text-xl mr-2">{zone.icon}</span>
                                {zone.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Main tool menu */}
                <div className="glass-dark rounded-3xl p-3 border border-white/20 shadow-2xl">
                    <div className="flex gap-2">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                className={`group relative px-6 py-4 rounded-2xl font-bold transition-all ${
                                    selectedTool === tool.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105 shadow-lg'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105'
                                }`}
                                onClick={() => {
                                    setSelectedTool(tool.id as any)
                                    soundManager.playUIClick()
                                }}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-3xl">{tool.icon}</span>
                                    <span className="text-xs">{tool.label}</span>
                                    <span className="text-xs opacity-50">{tool.key}</span>
                                </div>
                                {selectedTool === tool.id && (
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </button>
                        ))}

                        {/* Curve mode toggle */}
                        <button
                            className={`px-6 py-4 rounded-2xl font-bold transition-all ${
                                isCurveMode
                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white scale-105'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105'
                            }`}
                            onClick={() => {
                                setCurveMode(!isCurveMode)
                                soundManager.playUIClick()
                            }}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl">⤴️</span>
                                <span className="text-xs">Curve</span>
                                <span className="text-xs opacity-50">C</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
