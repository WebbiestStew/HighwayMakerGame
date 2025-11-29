export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
    unlockedAt?: number
    secret?: boolean
    category: 'construction' | 'economy' | 'traffic' | 'special'
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete the tutorial mission',
        icon: '🎓',
        unlocked: false,
        category: 'construction'
    },
    {
        id: 'urban_planner',
        title: 'Urban Planner',
        description: 'Connect residential areas to highways',
        icon: '🏙️',
        unlocked: false,
        category: 'construction'
    },
    {
        id: 'traffic_wizard',
        title: 'Traffic Wizard',
        description: 'Master traffic flow optimization',
        icon: '🚗',
        unlocked: false,
        category: 'traffic'
    },
    {
        id: 'economic_genius',
        title: 'Economic Genius',
        description: 'Build a profitable commercial district',
        icon: '💰',
        unlocked: false,
        category: 'economy'
    },
    {
        id: 'highway_legend',
        title: 'Highway Legend',
        description: 'Build a massive highway network',
        icon: '🛣️',
        unlocked: false,
        category: 'construction'
    },
    {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Have 100 vehicles on roads simultaneously',
        icon: '⚡',
        unlocked: false,
        category: 'traffic',
        secret: true
    },
    {
        id: 'architect',
        title: 'Master Architect',
        description: 'Place 50 highway signs',
        icon: '🪧',
        unlocked: false,
        category: 'construction'
    },
    {
        id: 'millionaire',
        title: 'Millionaire',
        description: 'Accumulate $1,000,000 in funds',
        icon: '💎',
        unlocked: false,
        category: 'economy'
    },
    {
        id: 'metropolis',
        title: 'Metropolis',
        description: 'Reach 5,000 population',
        icon: '🌆',
        unlocked: false,
        category: 'construction'
    },
    {
        id: 'perfect_flow',
        title: 'Perfect Flow',
        description: 'Achieve 100% road efficiency',
        icon: '⭐',
        unlocked: false,
        category: 'traffic',
        secret: true
    }
]

export class AchievementManager {
    static checkAchievements(achievements: Achievement[], gameState: any): Achievement[] {
        return achievements.map(achievement => {
            if (achievement.unlocked) return achievement

            let shouldUnlock = false

            switch (achievement.id) {
                case 'speed_demon':
                    shouldUnlock = (gameState.activeVehicles || 0) >= 100
                    break
                case 'architect':
                    shouldUnlock = (gameState.signs?.length || 0) >= 50
                    break
                case 'millionaire':
                    shouldUnlock = (gameState.funds || 0) >= 1000000
                    break
                case 'metropolis':
                    shouldUnlock = ((gameState.buildings?.length || 0) * 50) >= 5000
                    break
                case 'perfect_flow':
                    shouldUnlock = (gameState.roadEfficiency || 0) >= 100
                    break
            }

            if (shouldUnlock) {
                return {
                    ...achievement,
                    unlocked: true,
                    unlockedAt: Date.now()
                }
            }

            return achievement
        })
    }

    static unlockAchievement(achievements: Achievement[], achievementId: string): Achievement[] {
        return achievements.map(achievement => {
            if (achievement.id === achievementId && !achievement.unlocked) {
                return {
                    ...achievement,
                    unlocked: true,
                    unlockedAt: Date.now()
                }
            }
            return achievement
        })
    }

    static getUnlockedCount(achievements: Achievement[]): number {
        return achievements.filter(a => a.unlocked).length
    }

    static getProgress(achievements: Achievement[]): number {
        const unlocked = this.getUnlockedCount(achievements)
        return Math.round((unlocked / achievements.length) * 100)
    }
}
