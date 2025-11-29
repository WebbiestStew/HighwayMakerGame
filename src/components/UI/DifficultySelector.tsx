import React, { useState } from 'react'
import type { DifficultyLevel } from '../../systems/DifficultySystem'
import { DIFFICULTY_CONFIGS } from '../../systems/DifficultySystem'

interface DifficultySelectorProps {
    onSelect: (difficulty: DifficultyLevel) => void
    onClose: () => void
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect, onClose }) => {
    const [selected, setSelected] = useState<DifficultyLevel>('medium')

    const difficultyColors = {
        sandbox: 'from-green-600 to-emerald-600',
        easy: 'from-blue-600 to-cyan-600',
        medium: 'from-yellow-600 to-orange-600',
        hard: 'from-red-600 to-rose-600'
    }

    const difficultyIcons = {
        sandbox: '🏖️',
        easy: '😊',
        medium: '💪',
        hard: '🔥'
    }

    const handleStart = () => {
        onSelect(selected)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-white/20 p-8 max-w-4xl w-full shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white mb-2">Choose Your Challenge</h2>
                    <p className="text-white/60">Select a difficulty level to begin</p>
                </div>

                {/* Difficulty Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[]).map((level) => {
                        const config = DIFFICULTY_CONFIGS[level]
                        const isSelected = selected === level
                        
                        return (
                            <button
                                key={level}
                                onClick={() => setSelected(level)}
                                className={`text-left p-6 rounded-xl border-4 transition-all transform hover:scale-105 ${
                                    isSelected 
                                        ? `border-white bg-gradient-to-br ${difficultyColors[level]} shadow-2xl` 
                                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-5xl">{difficultyIcons[level]}</span>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white capitalize">{level}</h3>
                                        {isSelected && <span className="text-sm text-white/80">✓ Selected</span>}
                                    </div>
                                </div>
                                
                                <p className="text-white/80 mb-4">{config.description}</p>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Starting Funds:</span>
                                        <span className="text-white font-bold">
                                            {level === 'sandbox' ? '∞' : `$${config.startingFunds.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Road Cost:</span>
                                        <span className="text-white font-bold">
                                            {level === 'sandbox' ? 'Free' : `$${config.roadCost.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Zone Cost:</span>
                                        <span className="text-white font-bold">
                                            {level === 'sandbox' ? 'Free' : `$${config.zoneCost.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Tax Income:</span>
                                        <span className="text-white font-bold">${config.incomeTaxRate}/citizen</span>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleStart}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
                    >
                        Start Building! 🚀
                    </button>
                </div>
            </div>
        </div>
    )
}
