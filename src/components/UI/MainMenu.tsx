import React, { useState } from 'react'
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

    const handleDifficultySelect = (difficulty: DifficultyLevel) => {
        DifficultyManager.applyDifficulty(difficulty, useGameStore.getState())
        setGameState('playing')
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
            {/* Animated background */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 text-center">
                {/* Title */}
                <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-pulse">
                    🛣️ Highway Architect
                </h1>
                <p className="text-2xl text-white/80 mb-12 drop-shadow-lg">Urban Arteries</p>

                {/* Menu Buttons */}
                <div className="space-y-4 w-96">
                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-2xl"
                        onClick={() => setShowDifficulty(true)}
                    >
                        🎮 New Game
                    </button>
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-xl"
                        onClick={() => setShowTutorial(true)}
                    >
                        📚 Tutorial
                    </button>
                    <button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-xl"
                        onClick={() => setShowSettings(true)}
                    >
                        ⚙️ Settings
                    </button>
                    <button
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-xl"
                        onClick={() => setShowCredits(true)}
                    >
                        ⭐ Credits
                    </button>
                </div>

                <p className="text-white/60 mt-8 text-sm">v1.0.0 - Steam Release</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-white/20 p-8 w-[500px] shadow-2xl text-center">
                <h1 className="text-4xl font-bold text-white mb-6">⭐ Credits</h1>

                <div className="space-y-4 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white">Game Design & Development</h3>
                        <p className="text-gray-400">Highway Architect Team</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white">Built With</h3>
                        <p className="text-gray-400">React • Three.js • TypeScript</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white">Special Thanks</h3>
                        <p className="text-gray-400">To all our players and supporters!</p>
                    </div>
                </div>

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
}
