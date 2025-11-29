import React, { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { AchievementManager } from '../../systems/AchievementSystem'

interface AchievementsMenuProps {
    onClose: () => void
}

export const AchievementsMenu: React.FC<AchievementsMenuProps> = ({ onClose }) => {
    const { achievements } = useGameStore()
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const categories = ['all', 'construction', 'economy', 'traffic', 'special']
    const unlockedCount = AchievementManager.getUnlockedCount(achievements)
    const progress = AchievementManager.getProgress(achievements)

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl border-2 border-white/20 p-8 w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white">🏆 Achievements</h1>
                        <p className="text-white/60 mt-1">
                            Unlock achievements by completing challenges
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
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <div className="text-3xl font-bold text-white">{unlockedCount} / {achievements.length}</div>
                            <div className="text-white/70 text-sm">Achievements Unlocked</div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-yellow-400">{progress}%</div>
                            <div className="text-white/70 text-sm">Completion</div>
                        </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-yellow-500 to-orange-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                                selectedCategory === cat
                                    ? 'bg-white text-purple-900'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {filteredAchievements.map(achievement => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const AchievementCard: React.FC<{ achievement: any }> = ({ achievement }) => {
    const isLocked = !achievement.unlocked && achievement.secret

    return (
        <div
            className={`rounded-lg p-5 border-2 transition-all ${
                achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/50'
                    : 'bg-white/5 border-white/10'
            }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`text-5xl ${achievement.unlocked ? 'filter-none' : 'grayscale opacity-30'}`}
                >
                    {isLocked ? '🔒' : achievement.icon}
                </div>
                <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${achievement.unlocked ? 'text-yellow-400' : 'text-white/70'}`}>
                        {isLocked ? '???' : achievement.title}
                    </h3>
                    <p className={`text-sm mb-2 ${achievement.unlocked ? 'text-white/90' : 'text-white/50'}`}>
                        {isLocked ? 'Secret Achievement - Keep playing to unlock!' : achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                            achievement.category === 'construction' ? 'bg-blue-500/30 text-blue-300' :
                            achievement.category === 'economy' ? 'bg-green-500/30 text-green-300' :
                            achievement.category === 'traffic' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-purple-500/30 text-purple-300'
                        }`}>
                            {achievement.category}
                        </span>
                        {achievement.unlocked && achievement.unlockedAt && (
                            <span className="text-xs text-white/50">
                                {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Achievement Notification Toast
export const AchievementNotification: React.FC<{ achievement: any, onClose: () => void }> = ({ achievement, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 5000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 shadow-2xl border-2 border-yellow-400 min-w-[300px]">
                <div className="flex items-center gap-3">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                        <div className="text-yellow-100 text-xs font-bold uppercase">Achievement Unlocked!</div>
                        <div className="text-white font-bold">{achievement.title}</div>
                        <div className="text-yellow-100 text-sm">{achievement.description}</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    )
}
