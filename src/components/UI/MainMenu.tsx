import React, { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Settings } from './Settings'
import { Tutorial } from './Tutorial'
import { DifficultySelector } from './DifficultySelector'
import { DifficultyManager, type DifficultyLevel } from '../../systems/DifficultySystem'

export const MainMenu: React.FC = () => {
    const { setGameState } = useGameStore()
    const [showSettings, setShowSettings] = useState(false)
    const [showTutorial, setShowTutorial] = useState(false)
    const [showCredits, setShowCredits] = useState(false)
    const [showDifficulty, setShowDifficulty] = useState(false)
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([])

    useEffect(() => {
        // Generate floating particles - reduced for performance
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }))
        setParticles(newParticles)
    }, [])

    const handleDifficultySelect = (difficulty: DifficultyLevel) => {
        DifficultyManager.applyDifficulty(difficulty, useGameStore.getState())
        setGameState('playing')
    }

    return (
        <div className="absolute inset-0 z-50 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-shift"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Floating particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-white rounded-full animate-float"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`,
                        opacity: 0.3
                    }}
                ></div>
            ))}

            <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
                <div className="max-w-6xl w-full">
                    {/* Main content container */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left side - Title and tagline */}
                        <div className="flex-1 text-left">
                            <div className="mb-6">
                                <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full mb-4">
                                    <span className="text-purple-300 text-sm font-semibold">✨ NEXT-GEN CITY BUILDER</span>
                                </div>
                            </div>
                            <h1 className="text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                                Highway<br/>
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                    Architect
                                </span>
                            </h1>
                            <p className="text-2xl text-gray-300 mb-8 max-w-md">
                                Build. Manage. Optimize. Create the ultimate urban network with AI-driven citizens and dynamic systems.
                            </p>
                            
                            {/* Feature tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm">🧠 AI Citizens</span>
                                <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm">⚡ Resource Management</span>
                                <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm">🚗 Smart Traffic</span>
                                <span className="px-3 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-300 text-sm">🔬 Tech Tree</span>
                            </div>
                        </div>

                        {/* Right side - Menu card */}
                        <div className="flex-1 max-w-md w-full">
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                {/* Menu Buttons */}
                                <div className="space-y-3">
                                    <button
                                        className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-5 px-6 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                        onClick={() => setShowDifficulty(true)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                        <div className="relative flex items-center justify-between">
                                            <span className="text-xl">🎮 New Game</span>
                                            <span className="text-2xl">→</span>
                                        </div>
                                    </button>

                                    <button
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02]"
                                        onClick={() => setShowTutorial(true)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>📚 Tutorial</span>
                                            <span className="text-gray-400">→</span>
                                        </div>
                                    </button>

                                    <button
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02]"
                                        onClick={() => setShowSettings(true)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>⚙️ Settings</span>
                                            <span className="text-gray-400">→</span>
                                        </div>
                                    </button>

                                    <button
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02]"
                                        onClick={() => setShowCredits(true)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>⭐ Credits</span>
                                            <span className="text-gray-400">→</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Version and stats */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Version 2.0</span>
                                        <span className="text-gray-400">🎮 Ultra Edition</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
            {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
            {showCredits && <Credits onClose={() => setShowCredits(false)} />}
            {showDifficulty && <DifficultySelector onSelect={handleDifficultySelect} onClose={() => setShowDifficulty(false)} />}
        </div>
    )
}

const Credits: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/20 rounded-3xl p-10 w-[600px] shadow-2xl">
                <h1 className="text-5xl font-bold text-white mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                    ⭐ Credits
                </h1>

                <div className="space-y-6 mb-10">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-2">🎮 Game Design & Development</h3>
                        <p className="text-gray-300">Highway Architect Team</p>
                        <p className="text-gray-400 text-sm mt-1">Next-gen city simulation</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-2">🛠️ Built With</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm">React 19</span>
                            <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm">Three.js</span>
                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm">TypeScript</span>
                            <span className="px-3 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-300 text-sm">Vite</span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-2">💖 Special Thanks</h3>
                        <p className="text-gray-300">To all our players and supporters!</p>
                        <p className="text-gray-400 text-sm mt-1">Your feedback makes this game amazing</p>
                    </div>
                </div>

                <button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
}
