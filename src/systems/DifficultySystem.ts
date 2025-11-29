export type DifficultyLevel = 'sandbox' | 'easy' | 'medium' | 'hard'

export interface DifficultyConfig {
    startingFunds: number
    roadCost: number
    zoneCost: number
    signCost: number
    maintenanceCostMultiplier: number
    incomeTaxRate: number
    trafficSpawnRate: number
    description: string
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
    sandbox: {
        startingFunds: 999999999,
        roadCost: 0,
        zoneCost: 0,
        signCost: 0,
        maintenanceCostMultiplier: 0,
        incomeTaxRate: 20,
        trafficSpawnRate: 1.0,
        description: 'Unlimited money - Build without restrictions!'
    },
    easy: {
        startingFunds: 500000,
        roadCost: 30000,
        zoneCost: 15000,
        signCost: 3000,
        maintenanceCostMultiplier: 0.5,
        incomeTaxRate: 15,
        trafficSpawnRate: 1.2,
        description: 'Generous budget and low costs - Perfect for beginners'
    },
    medium: {
        startingFunds: 200000,
        roadCost: 50000,
        zoneCost: 25000,
        signCost: 5000,
        maintenanceCostMultiplier: 1.0,
        incomeTaxRate: 10,
        trafficSpawnRate: 1.0,
        description: 'Balanced economy - Requires strategic planning'
    },
    hard: {
        startingFunds: 100000,
        roadCost: 75000,
        zoneCost: 40000,
        signCost: 8000,
        maintenanceCostMultiplier: 1.5,
        incomeTaxRate: 8,
        trafficSpawnRate: 0.8,
        description: 'Limited budget and high costs - For experts only!'
    }
}

export class DifficultyManager {
    static getConfig(level: DifficultyLevel): DifficultyConfig {
        return DIFFICULTY_CONFIGS[level]
    }

    static applyDifficulty(level: DifficultyLevel, store: any) {
        const config = DIFFICULTY_CONFIGS[level]
        
        // Apply starting funds
        store.funds = config.startingFunds
        
        // Store difficulty config for cost calculations
        store.difficulty = level
        store.difficultyConfig = config
    }

    static getCostMultiplier(level: DifficultyLevel): number {
        const config = DIFFICULTY_CONFIGS[level]
        return config.roadCost / 50000 // Base cost ratio
    }
}
