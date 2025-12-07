export type CampaignLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface CampaignMission {
    id: string
    level: CampaignLevel
    title: string
    description: string
    story: string
    objectives: MissionObjective[]
    rewards: MissionReward
    unlocks: string[]
    difficulty: 'easy' | 'medium' | 'hard'
    startingMoney: number
    timeLimit?: number // seconds, optional
    completed: boolean
}

export interface MissionObjective {
    id: string
    description: string
    type: 'build' | 'reach' | 'maintain' | 'earn' | 'connect'
    target: number
    current: number
    completed: boolean
}

export interface MissionReward {
    money: number
    unlocks: string[]
    stars: number
}

export interface CareerProgress {
    currentLevel: CampaignLevel
    completedMissions: string[]
    totalStars: number
    unlockedFeatures: string[]
    achievements: string[]
}

export class CareerModeV3 {
    private static instance: CareerModeV3
    private progress: CareerProgress
    private missions: CampaignMission[]

    private constructor() {
        this.progress = {
            currentLevel: 1,
            completedMissions: [],
            totalStars: 0,
            unlockedFeatures: ['basic_road', 'residential_zone', 'traffic_light'],
            achievements: []
        }

        this.missions = this.generateCampaignMissions()
    }

    static getInstance(): CareerModeV3 {
        if (!this.instance) {
            this.instance = new CareerModeV3()
        }
        return this.instance
    }

    private generateCampaignMissions(): CampaignMission[] {
        return [
            // Level 1: Tutorial City
            {
                id: 'mission_1_1',
                level: 1,
                title: 'First Roads',
                description: 'Build your first city road network',
                story: 'Welcome to your new job as City Planner! The mayor has given you a small budget to prove yourself. Start by building basic roads.',
                objectives: [
                    { id: 'obj_1', description: 'Build 5 road segments', type: 'build', target: 5, current: 0, completed: false },
                    { id: 'obj_2', description: 'Create 1 intersection', type: 'build', target: 1, current: 0, completed: false },
                    { id: 'obj_3', description: 'Add 2 traffic lights', type: 'build', target: 2, current: 0, completed: false }
                ],
                rewards: { money: 10000, unlocks: ['commercial_zone'], stars: 3 },
                unlocks: ['commercial_zone', 'highway_sign'],
                difficulty: 'easy',
                startingMoney: 50000,
                completed: false
            },
            
            // Level 2: Growing Town
            {
                id: 'mission_2_1',
                level: 2,
                title: 'Commercial District',
                description: 'Develop a commercial area for your growing town',
                story: 'Your road network is working! Now businesses want to move in. Zone commercial areas and connect them to residential zones.',
                objectives: [
                    { id: 'obj_1', description: 'Zone 3 commercial areas', type: 'build', target: 3, current: 0, completed: false },
                    { id: 'obj_2', description: 'Connect commercial to residential', type: 'connect', target: 1, current: 0, completed: false },
                    { id: 'obj_3', description: 'Reach 500 population', type: 'reach', target: 500, current: 0, completed: false }
                ],
                rewards: { money: 25000, unlocks: ['industrial_zone', 'bus_system'], stars: 3 },
                unlocks: ['industrial_zone', 'bus_route'],
                difficulty: 'easy',
                startingMoney: 75000,
                completed: false
            },

            // Level 3: Industrial Revolution
            {
                id: 'mission_3_1',
                level: 3,
                title: 'Industrial Hub',
                description: 'Create an industrial zone and manage traffic',
                story: 'Industry is the backbone of a strong economy. Build industrial zones, but watch out for increased traffic!',
                objectives: [
                    { id: 'obj_1', description: 'Zone 4 industrial areas', type: 'build', target: 4, current: 0, completed: false },
                    { id: 'obj_2', description: 'Build highway connections', type: 'build', target: 3, current: 0, completed: false },
                    { id: 'obj_3', description: 'Maintain traffic flow above 60%', type: 'maintain', target: 60, current: 0, completed: false }
                ],
                rewards: { money: 50000, unlocks: ['highway', 'cargo_station'], stars: 3 },
                unlocks: ['highway_upgrade', 'traffic_monitor'],
                difficulty: 'medium',
                startingMoney: 100000,
                completed: false
            },

            // Level 4: Public Transport
            {
                id: 'mission_4_1',
                level: 4,
                title: 'Mass Transit',
                description: 'Implement a public transportation system',
                story: 'Traffic congestion is becoming a problem. The citizens demand public transportation!',
                objectives: [
                    { id: 'obj_1', description: 'Create 3 bus routes', type: 'build', target: 3, current: 0, completed: false },
                    { id: 'obj_2', description: 'Reduce traffic by 20%', type: 'reach', target: 20, current: 0, completed: false },
                    { id: 'obj_3', description: 'Reach 1000 population', type: 'reach', target: 1000, current: 0, completed: false }
                ],
                rewards: { money: 75000, unlocks: ['metro_system', 'train_station'], stars: 3 },
                unlocks: ['metro', 'tram'],
                difficulty: 'medium',
                startingMoney: 150000,
                timeLimit: 600, // 10 minutes
                completed: false
            },

            // Level 5: Emergency Services
            {
                id: 'mission_5_1',
                level: 5,
                title: 'Safety First',
                description: 'Build emergency services infrastructure',
                story: 'Accidents happen. Your city needs police, fire, and medical services to keep citizens safe.',
                objectives: [
                    { id: 'obj_1', description: 'Build 2 police stations', type: 'build', target: 2, current: 0, completed: false },
                    { id: 'obj_2', description: 'Build 2 fire stations', type: 'build', target: 2, current: 0, completed: false },
                    { id: 'obj_3', description: 'Build 1 hospital', type: 'build', target: 1, current: 0, completed: false },
                    { id: 'obj_4', description: 'Cover 80% of city area', type: 'reach', target: 80, current: 0, completed: false }
                ],
                rewards: { money: 100000, unlocks: ['advanced_emergency'], stars: 3 },
                unlocks: ['police_helicopter', 'emergency_response'],
                difficulty: 'hard',
                startingMoney: 200000,
                completed: false
            },

            // Level 6: Tourism
            {
                id: 'mission_6_1',
                level: 6,
                title: 'Tourist Attraction',
                description: 'Develop tourism and landmarks',
                story: 'Your city is thriving! Now it\'s time to attract tourists. Build landmarks and entertainment venues.',
                objectives: [
                    { id: 'obj_1', description: 'Build 3 landmarks', type: 'build', target: 3, current: 0, completed: false },
                    { id: 'obj_2', description: 'Create tourist routes', type: 'build', target: 2, current: 0, completed: false },
                    { id: 'obj_3', description: 'Earn $50k from tourism', type: 'earn', target: 50000, current: 0, completed: false }
                ],
                rewards: { money: 150000, unlocks: ['stadium', 'convention_center'], stars: 3 },
                unlocks: ['casino', 'theme_park'],
                difficulty: 'medium',
                startingMoney: 250000,
                completed: false
            },

            // Level 7: Environmental Challenge
            {
                id: 'mission_7_1',
                level: 7,
                title: 'Green City',
                description: 'Balance growth with environmental protection',
                story: 'Pollution is rising. Citizens demand clean air and green spaces. Can you balance industry with ecology?',
                objectives: [
                    { id: 'obj_1', description: 'Build 5 parks', type: 'build', target: 5, current: 0, completed: false },
                    { id: 'obj_2', description: 'Reduce pollution by 30%', type: 'reach', target: 30, current: 0, completed: false },
                    { id: 'obj_3', description: 'Implement recycling program', type: 'build', target: 1, current: 0, completed: false },
                    { id: 'obj_4', description: 'Reach 2000 population', type: 'reach', target: 2000, current: 0, completed: false }
                ],
                rewards: { money: 200000, unlocks: ['solar_power', 'wind_farm'], stars: 3 },
                unlocks: ['eco_zone', 'green_tech'],
                difficulty: 'hard',
                startingMoney: 300000,
                timeLimit: 900, // 15 minutes
                completed: false
            },

            // Level 8: Mega City
            {
                id: 'mission_8_1',
                level: 8,
                title: 'Metropolitan Expansion',
                description: 'Create a sprawling metropolis',
                story: 'Your reputation has spread! Investors want to build skyscrapers. Can you handle explosive growth?',
                objectives: [
                    { id: 'obj_1', description: 'Reach 5000 population', type: 'reach', target: 5000, current: 0, completed: false },
                    { id: 'obj_2', description: 'Build 20 buildings', type: 'build', target: 20, current: 0, completed: false },
                    { id: 'obj_3', description: 'Create metro network', type: 'build', target: 5, current: 0, completed: false },
                    { id: 'obj_4', description: 'Maintain budget surplus', type: 'maintain', target: 100000, current: 0, completed: false }
                ],
                rewards: { money: 500000, unlocks: ['skyscraper', 'international_airport'], stars: 3 },
                unlocks: ['high_rise', 'corporate_tower'],
                difficulty: 'hard',
                startingMoney: 500000,
                completed: false
            },

            // Level 9: Disaster Response
            {
                id: 'mission_9_1',
                level: 9,
                title: 'Crisis Management',
                description: 'Handle natural disasters and emergencies',
                story: 'A major storm is coming! Prepare your city for disasters and evacuate citizens if needed.',
                objectives: [
                    { id: 'obj_1', description: 'Survive 3 disasters', type: 'reach', target: 3, current: 0, completed: false },
                    { id: 'obj_2', description: 'Keep population above 3000', type: 'maintain', target: 3000, current: 0, completed: false },
                    { id: 'obj_3', description: 'Build evacuation routes', type: 'build', target: 3, current: 0, completed: false }
                ],
                rewards: { money: 750000, unlocks: ['disaster_shelter', 'emergency_broadcast'], stars: 3 },
                unlocks: ['bunker', 'evacuation_system'],
                difficulty: 'hard',
                startingMoney: 750000,
                timeLimit: 1200, // 20 minutes
                completed: false
            },

            // Level 10: Ultimate City
            {
                id: 'mission_10_1',
                level: 10,
                title: 'City of the Future',
                description: 'Build the ultimate smart city',
                story: 'This is it - your masterpiece. Build a futuristic city with cutting-edge technology and perfect harmony.',
                objectives: [
                    { id: 'obj_1', description: 'Reach 10000 population', type: 'reach', target: 10000, current: 0, completed: false },
                    { id: 'obj_2', description: 'Achieve 100% service coverage', type: 'reach', target: 100, current: 0, completed: false },
                    { id: 'obj_3', description: 'Zero traffic congestion', type: 'maintain', target: 100, current: 0, completed: false },
                    { id: 'obj_4', description: 'Zero pollution', type: 'maintain', target: 0, current: 0, completed: false },
                    { id: 'obj_5', description: 'Budget surplus of $1M', type: 'reach', target: 1000000, current: 0, completed: false }
                ],
                rewards: { money: 2000000, unlocks: ['utopia_mode'], stars: 5 },
                unlocks: ['sandbox_ultimate', 'creative_mode'],
                difficulty: 'hard',
                startingMoney: 1000000,
                completed: false
            }
        ]
    }

    getMissions(): CampaignMission[] {
        return this.missions.filter(m => m.level <= this.progress.currentLevel)
    }

    getCurrentMission(): CampaignMission | null {
        const available = this.missions.find(m => 
            m.level === this.progress.currentLevel && 
            !this.progress.completedMissions.includes(m.id)
        )
        return available || null
    }

    updateObjective(missionId: string, objectiveId: string, value: number) {
        const mission = this.missions.find(m => m.id === missionId)
        if (!mission) return

        const objective = mission.objectives.find(o => o.id === objectiveId)
        if (!objective) return

        objective.current = value
        objective.completed = objective.current >= objective.target
    }

    completeMission(missionId: string): boolean {
        const mission = this.missions.find(m => m.id === missionId)
        if (!mission) return false

        const allCompleted = mission.objectives.every(o => o.completed)
        if (!allCompleted) return false

        mission.completed = true
        this.progress.completedMissions.push(missionId)
        this.progress.totalStars += mission.rewards.stars
        this.progress.unlockedFeatures.push(...mission.rewards.unlocks)

        // Level up if all missions in level are complete
        const levelMissions = this.missions.filter(m => m.level === this.progress.currentLevel)
        if (levelMissions.every(m => m.completed)) {
            this.progress.currentLevel = Math.min(10, this.progress.currentLevel + 1) as CampaignLevel
        }

        return true
    }

    getProgress(): CareerProgress {
        return { ...this.progress }
    }

    isFeatureUnlocked(feature: string): boolean {
        return this.progress.unlockedFeatures.includes(feature)
    }
}
