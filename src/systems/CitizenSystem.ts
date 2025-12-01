/**
 * CITIZEN SIMULATION SYSTEM
 * Advanced AI-driven citizens with needs, jobs, happiness, and emergent behavior
 */

export interface Citizen {
    id: string
    name: string
    age: number
    home: string // building ID
    job: string | null // building ID
    education: 'none' | 'basic' | 'high' | 'university'
    wealth: number
    
    // Core needs (0-100)
    needs: {
        food: number
        health: number
        entertainment: number
        safety: number
        employment: number
    }
    
    // Personality traits affect behavior
    personality: {
        patience: number // affects traffic behavior
        ambition: number // affects job seeking
        sociability: number // affects entertainment needs
        environmentalism: number // affects transportation choice
    }
    
    happiness: number // 0-100, calculated from needs
    currentActivity: 'sleeping' | 'working' | 'commuting' | 'shopping' | 'leisure'
    position: [number, number, number]
    destination: [number, number, number] | null
    
    // History
    dailyCommuteTime: number
    daysUnemployed: number
    daysUnhappy: number // if 30+ days, citizen may leave city
}

export interface CitizenStats {
    totalPopulation: number
    averageHappiness: number
    unemploymentRate: number
    averageCommuteTime: number
    migrationRate: number // positive = people moving in, negative = leaving
    crimeRate: number
    educationLevel: number
}

export class CitizenSimulation {
    private citizens: Map<string, Citizen> = new Map()
    private birthRate = 0.001 // per citizen per day
    private deathRate = 0.0005
    private migrationThreshold = 30 // happiness below this for 30 days = leave
    
    // Spawn citizens when buildings are created
    spawnCitizensInBuilding(buildingId: string, buildingType: string, count: number) {
        const isResidential = ['house', 'townhouse', 'apartment', 'condo', 'mansion', 'duplex', 'villa', 'cottage', 'bungalow', 'penthouse'].includes(buildingType)
        
        if (isResidential) {
            for (let i = 0; i < count; i++) {
                const citizen: Citizen = {
                    id: crypto.randomUUID(),
                    name: this.generateName(),
                    age: Math.floor(Math.random() * 60) + 18, // 18-78
                    home: buildingId,
                    job: null,
                    education: this.randomEducation(),
                    wealth: Math.random() * 50000 + 10000,
                    needs: {
                        food: 80 + Math.random() * 20,
                        health: 70 + Math.random() * 30,
                        entertainment: 50 + Math.random() * 30,
                        safety: 80 + Math.random() * 20,
                        employment: 50
                    },
                    personality: {
                        patience: Math.random() * 100,
                        ambition: Math.random() * 100,
                        sociability: Math.random() * 100,
                        environmentalism: Math.random() * 100
                    },
                    happiness: 75,
                    currentActivity: 'sleeping',
                    position: [0, 0, 0],
                    destination: null,
                    dailyCommuteTime: 0,
                    daysUnemployed: 0,
                    daysUnhappy: 0
                }
                this.citizens.set(citizen.id, citizen)
            }
        }
    }
    
    // Update all citizens (call once per game day)
    updateDaily(buildings: any[], time: number) {
        const stats = this.calculateStats()
        
        for (const [id, citizen] of this.citizens.entries()) {
            // Age and life cycle
            if (Math.random() < this.birthRate && citizen.age > 25 && citizen.age < 45) {
                // Chance to have baby (spawn new citizen in same building)
                this.spawnCitizensInBuilding(citizen.home, 'house', 1)
            }
            
            if (Math.random() < this.deathRate * (citizen.age / 50)) {
                this.citizens.delete(id)
                continue
            }
            
            // Job seeking for unemployed
            if (!citizen.job && citizen.age < 65) {
                this.seekEmployment(citizen, buildings)
            }
            
            // Decay needs over time
            citizen.needs.food -= 10 + Math.random() * 5
            citizen.needs.entertainment -= 5 + Math.random() * 5
            citizen.needs.health -= 2 + Math.random() * 3
            
            // Unemployment affects needs
            if (!citizen.job) {
                citizen.daysUnemployed++
                citizen.needs.employment = Math.max(0, 100 - citizen.daysUnemployed * 3)
            } else {
                citizen.daysUnemployed = 0
                citizen.needs.employment = 80 + Math.random() * 20
            }
            
            // Calculate happiness from needs
            const avgNeeds = Object.values(citizen.needs).reduce((a, b) => a + b, 0) / 5
            citizen.happiness = avgNeeds
            
            // Track unhappiness
            if (citizen.happiness < 40) {
                citizen.daysUnhappy++
            } else {
                citizen.daysUnhappy = 0
            }
            
            // Migration: leave city if unhappy too long
            if (citizen.daysUnhappy > this.migrationThreshold) {
                this.citizens.delete(id)
                continue
            }
            
            // Daily activities based on time
            this.updateActivity(citizen, time)
            
            // Clamp all values
            Object.keys(citizen.needs).forEach(key => {
                citizen.needs[key as keyof typeof citizen.needs] = Math.max(0, Math.min(100, citizen.needs[key as keyof typeof citizen.needs]))
            })
        }
        
        return stats
    }
    
    private seekEmployment(citizen: Citizen, buildings: any[]) {
        // Find available jobs based on education
        const commercialBuildings = buildings.filter(b => 
            ['shop', 'mall', 'restaurant', 'hotel', 'office', 'bank', 'theater', 'gym', 'supermarket', 'boutique'].includes(b.type)
        )
        const industrialBuildings = buildings.filter(b => 
            ['factory', 'warehouse', 'plant', 'depot', 'refinery'].includes(b.type)
        )
        
        let jobBuildings = [...commercialBuildings, ...industrialBuildings]
        
        // Higher education = prefer commercial
        if (citizen.education === 'university' || citizen.education === 'high') {
            jobBuildings = [...commercialBuildings, ...industrialBuildings.slice(0, 2)]
        }
        
        if (jobBuildings.length > 0) {
            const job = jobBuildings[Math.floor(Math.random() * jobBuildings.length)]
            citizen.job = job.id
            
            // Calculate commute time based on distance
            // (Simplified - in full version, use pathfinding)
            const distance = Math.sqrt(
                Math.pow(job.position[0] - citizen.position[0], 2) +
                Math.pow(job.position[2] - citizen.position[2], 2)
            )
            citizen.dailyCommuteTime = distance * 0.5 // minutes
        }
    }
    
    private updateActivity(citizen: Citizen, time: number) {
        const hour = (time * 24) % 24
        
        if (hour >= 0 && hour < 7) {
            citizen.currentActivity = 'sleeping'
        } else if (hour >= 7 && hour < 9) {
            citizen.currentActivity = 'commuting'
        } else if (hour >= 9 && hour < 17 && citizen.job) {
            citizen.currentActivity = 'working'
        } else if (hour >= 17 && hour < 18) {
            citizen.currentActivity = 'commuting'
        } else if (hour >= 18 && hour < 20) {
            if (citizen.needs.food < 50) citizen.currentActivity = 'shopping'
            else citizen.currentActivity = 'leisure'
        } else {
            citizen.currentActivity = 'sleeping'
        }
    }
    
    calculateStats(): CitizenStats {
        const citizenArray = Array.from(this.citizens.values())
        const total = citizenArray.length
        
        if (total === 0) {
            return {
                totalPopulation: 0,
                averageHappiness: 0,
                unemploymentRate: 0,
                averageCommuteTime: 0,
                migrationRate: 0,
                crimeRate: 0,
                educationLevel: 0
            }
        }
        
        const unemployed = citizenArray.filter(c => !c.job && c.age >= 18 && c.age < 65).length
        const workingAge = citizenArray.filter(c => c.age >= 18 && c.age < 65).length
        
        return {
            totalPopulation: total,
            averageHappiness: citizenArray.reduce((sum, c) => sum + c.happiness, 0) / total,
            unemploymentRate: workingAge > 0 ? (unemployed / workingAge) * 100 : 0,
            averageCommuteTime: citizenArray.reduce((sum, c) => sum + c.dailyCommuteTime, 0) / total,
            migrationRate: 0, // Calculate based on change over time
            crimeRate: Math.max(0, 100 - citizenArray.reduce((sum, c) => sum + c.needs.safety, 0) / total),
            educationLevel: this.calculateEducationScore(citizenArray)
        }
    }
    
    private calculateEducationScore(citizens: Citizen[]): number {
        const scores = { none: 0, basic: 25, high: 50, university: 100 }
        return citizens.reduce((sum, c) => sum + scores[c.education], 0) / citizens.length
    }
    
    private randomEducation(): Citizen['education'] {
        const rand = Math.random()
        if (rand < 0.1) return 'none'
        if (rand < 0.4) return 'basic'
        if (rand < 0.7) return 'high'
        return 'university'
    }
    
    private generateName(): string {
        const first = ['Alex', 'Sam', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Taylor', 'Jamie', 'Avery']
        const last = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson']
        return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`
    }
    
    getCitizens(): Citizen[] {
        return Array.from(this.citizens.values())
    }
    
    getCitizen(id: string): Citizen | undefined {
        return this.citizens.get(id)
    }
}

export const citizenSimulation = new CitizenSimulation()
