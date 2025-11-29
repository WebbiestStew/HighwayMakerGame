import React from 'react'
import { useGameStore } from '../../store/gameStore'

interface MissionsMenuProps {
    onClose: () => void
}

export const MissionsMenu: React.FC<MissionsMenuProps> = ({ onClose }) => {
    const { missions } = useGameStore()
    const activeMissions = missions.filter(m => m.unlocked && !m.completed)
    const completedMissions = missions.filter(m => m.completed)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl border-2 border-white/20 p-8 w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white">🎯 Missions</h1>
                        <p className="text-white/60 mt-1">
                            Complete missions to earn rewards and unlock achievements
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-3xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress */}
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-sm text-white/80 mb-2">
                        <span>Overall Progress</span>
                        <span>{completedMissions.length} / {missions.length}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(completedMissions.length / missions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Active Missions */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Active Missions</h2>
                    {activeMissions.length === 0 ? (
                        <p className="text-white/60 text-center py-8">
                            All missions completed! More coming soon...
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {activeMissions.map(mission => (
                                <MissionCard key={mission.id} mission={mission} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed Missions */}
                {completedMissions.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Completed</h2>
                        <div className="space-y-3">
                            {completedMissions.map(mission => (
                                <div
                                    key={mission.id}
                                    className="bg-green-900/30 border border-green-500/30 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">✅</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{mission.title}</h3>
                                                <p className="text-green-400 text-sm">Mission Complete!</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-green-400 font-bold">+${mission.rewards.funds.toLocaleString()}</div>
                                            {mission.rewards.achievement && (
                                                <div className="text-xs text-white/60">🏆 {mission.rewards.achievement}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const MissionCard: React.FC<{ mission: any }> = ({ mission }) => {
    const difficultyColors: Record<string, string> = {
        easy: 'text-green-400',
        medium: 'text-yellow-400',
        hard: 'text-red-400'
    }

    const completionPercent = (mission.objectives.filter((o: any) => o.completed).length / mission.objectives.length) * 100

    return (
        <div className="bg-white/10 rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{mission.title}</h3>
                    <p className="text-white/70 text-sm mb-2">{mission.description}</p>
                    <span className={`text-xs font-bold uppercase ${difficultyColors[mission.difficulty]}`}>
                        {mission.difficulty}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-yellow-400 font-bold text-lg">💰 ${mission.rewards.funds.toLocaleString()}</div>
                    {mission.rewards.achievement && (
                        <div className="text-xs text-white/60 mt-1">🏆 {mission.rewards.achievement}</div>
                    )}
                </div>
            </div>

            {/* Objectives */}
            <div className="space-y-3 mb-4">
                {mission.objectives.map((obj: any) => (
                    <div key={obj.id}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-xl ${obj.completed ? '' : 'opacity-30'}`}>
                                    {obj.completed ? '✅' : '⭕'}
                                </span>
                                <span className={`text-sm ${obj.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                                    {obj.description}
                                </span>
                            </div>
                            <span className={`text-sm font-mono ${obj.completed ? 'text-green-400' : 'text-white/60'}`}>
                                {obj.current} / {obj.target}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 ml-8">
                            <div
                                className={`h-2 rounded-full transition-all ${obj.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min((obj.current / obj.target) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Progress */}
            <div className="bg-white/5 rounded p-3">
                <div className="flex justify-between text-xs text-white/70 mb-2">
                    <span>Mission Progress</span>
                    <span>{Math.round(completionPercent)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
