import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { SaveSystem } from '../../utils/SaveSystem'

interface PauseMenuProps {
    onClose: () => void
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onClose }) => {
    const { setGameState } = useGameStore()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-white/20 p-8 w-[500px] shadow-2xl">
                <h1 className="text-5xl font-bold text-white mb-8 text-center">⏸️ Paused</h1>

                <div className="space-y-4">
                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
                        onClick={onClose}
                    >
                        ▶️ Resume
                    </button>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
                        onClick={() => {
                            SaveSystem.save('manual_1')
                            alert('Game saved!')
                        }}
                    >
                        💾 Save Game
                    </button>

                    <button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
                        onClick={() => {
                            // Open settings would go here
                            alert('Settings coming soon!')
                        }}
                    >
                        ⚙️ Settings
                    </button>

                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
                        onClick={() => {
                            if (confirm('Return to main menu? Unsaved progress will be lost.')) {
                                setGameState('menu')
                            }
                        }}
                    >
                        🏠 Main Menu
                    </button>
                </div>

                <p className="text-gray-400 text-sm mt-6 text-center">Press ESC to resume</p>
            </div>
        </div>
    )
}
