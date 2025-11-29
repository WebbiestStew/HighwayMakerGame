export interface Mission {
    id: string
    title: string
    description: string
    objectives: Objective[]
    rewards: Reward
    unlocked: boolean
    completed: boolean
    difficulty: 'easy' | 'medium' | 'hard'
}

export interface Objective {
    id: string
    description: string
    type: 'build_roads' | 'build_zones' | 'reach_population' | 'traffic_flow' | 'revenue' | 'efficiency'
    target: number
    current: number
    completed: boolean
}

export interface Reward {
    funds: number
    unlocks?: string[]
    achievement?: string
}

export const MISSIONS: Mission[] = [
    {
        id: 'tutorial',
        title: '🎓 Highway Basics',
        description: 'Learn the fundamentals of highway construction',
        difficulty: 'easy',
        unlocked: true,
        completed: false,
        objectives: [
            {
                id: 'build_first_road',
                description: 'Build your first road segment',
                type: 'build_roads',
                target: 1,
                current: 0,
                completed: false
            },
            {
                id: 'place_sign',
                description: 'Place a highway sign',
                type: 'build_roads',
                target: 1,
                current: 0,
                completed: false
            }
        ],
        rewards: {
            funds: 50000,
            achievement: 'First Steps'
        }
    },
    {
        id: 'urban_connector',
        title: '🏙️ Urban Connector',
        description: 'Connect residential areas with highway access',
        difficulty: 'easy',
        unlocked: true,
        completed: false,
        objectives: [
            {
                id: 'build_roads_5',
                description: 'Build 5 road segments',
                type: 'build_roads',
                target: 5,
                current: 0,
                completed: false
            },
            {
                id: 'create_zone',
                description: 'Create 3 residential zones',
                type: 'build_zones',
                target: 3,
                current: 0,
                completed: false
            },
            {
                id: 'reach_pop_500',
                description: 'Reach a population of 500',
                type: 'reach_population',
                target: 500,
                current: 0,
                completed: false
            }
        ],
        rewards: {
            funds: 100000,
            unlocks: ['curved_roads'],
            achievement: 'Urban Planner'
        }
    },
    {
        id: 'traffic_master',
        title: '🚗 Traffic Master',
        description: 'Optimize traffic flow and reduce congestion',
        difficulty: 'medium',
        unlocked: true,
        completed: false,
        objectives: [
            {
                id: 'traffic_flow_100',
                description: 'Achieve 100 vehicles per minute traffic flow',
                type: 'traffic_flow',
                target: 100,
                current: 0,
                completed: false
            },
            {
                id: 'efficiency_75',
                description: 'Maintain 75% road efficiency',
                type: 'efficiency',
                target: 75,
                current: 0,
                completed: false
            }
        ],
        rewards: {
            funds: 150000,
            achievement: 'Traffic Wizard'
        }
    },
    {
        id: 'economic_powerhouse',
        title: '💰 Economic Powerhouse',
        description: 'Build a thriving commercial district',
        difficulty: 'medium',
        unlocked: true,
        completed: false,
        objectives: [
            {
                id: 'commercial_zones',
                description: 'Create 5 commercial zones',
                type: 'build_zones',
                target: 5,
                current: 0,
                completed: false
            },
            {
                id: 'monthly_income',
                description: 'Reach $50,000 monthly net income',
                type: 'revenue',
                target: 50000,
                current: 0,
                completed: false
            }
        ],
        rewards: {
            funds: 200000,
            unlocks: ['advanced_signs'],
            achievement: 'Economic Genius'
        }
    },
    {
        id: 'mega_highway',
        title: '🛣️ Mega Highway',
        description: 'Build a massive highway network',
        difficulty: 'hard',
        unlocked: true,
        completed: false,
        objectives: [
            {
                id: 'build_roads_20',
                description: 'Build 20 road segments',
                type: 'build_roads',
                target: 20,
                current: 0,
                completed: false
            },
            {
                id: 'all_zone_types',
                description: 'Create 3 of each zone type (Res/Com/Ind)',
                type: 'build_zones',
                target: 9,
                current: 0,
                completed: false
            },
            {
                id: 'reach_pop_2000',
                description: 'Reach a population of 2,000',
                type: 'reach_population',
                target: 2000,
                current: 0,
                completed: false
            }
        ],
        rewards: {
            funds: 500000,
            achievement: 'Highway Legend'
        }
    }
]

export class MissionManager {
    static checkMissionProgress(missions: Mission[], gameState: any): Mission[] {
        return missions.map(mission => {
            if (mission.completed) return mission

            const updatedObjectives = mission.objectives.map(obj => {
                let current = 0

                switch (obj.type) {
                    case 'build_roads':
                        current = gameState.roads?.length || 0
                        break
                    case 'build_zones':
                        current = gameState.zones?.length || 0
                        break
                    case 'reach_population':
                        current = (gameState.buildings?.length || 0) * 50
                        break
                    case 'traffic_flow':
                        current = gameState.trafficFlow || 0
                        break
                    case 'efficiency':
                        current = gameState.roadEfficiency || 0
                        break
                    case 'revenue':
                        current = gameState.netIncome || 0
                        break
                }

                return {
                    ...obj,
                    current,
                    completed: current >= obj.target
                }
            })

            const allCompleted = updatedObjectives.every(obj => obj.completed)

            return {
                ...mission,
                objectives: updatedObjectives,
                completed: allCompleted
            }
        })
    }

    static getActiveMissions(missions: Mission[]): Mission[] {
        return missions.filter(m => m.unlocked && !m.completed)
    }

    static getCompletedMissions(missions: Mission[]): Mission[] {
        return missions.filter(m => m.completed)
    }
}
