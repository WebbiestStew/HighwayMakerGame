/**
 * Disaster and Emergency System
 * Traffic accidents, fires, floods, emergency vehicles
 */

export type DisasterType = 
    | 'traffic_accident' 
    | 'fire' 
    | 'flood' 
    | 'earthquake'
    | 'road_maintenance'
    | 'protest'

export type EmergencyVehicleType = 'police' | 'ambulance' | 'fire_truck' | 'tow_truck'

export interface Disaster {
    id: string
    type: DisasterType
    position: [number, number, number]
    severity: 'minor' | 'moderate' | 'severe'
    startTime: number
    duration: number
    affectedRoads: string[]
    trafficImpact: number // 0-1 (0 = no impact, 1 = road closed)
    casualties?: number
    economicDamage: number
    resolved: boolean
}

export interface EmergencyVehicle {
    id: string
    type: EmergencyVehicleType
    position: [number, number, number]
    targetDisaster: string
    speed: number
    sirens: boolean
}

export const DISASTER_CONFIGS = {
    traffic_accident: {
        probability: 0.001, // Per road per minute
        baseDuration: 300, // 5 minutes
        trafficImpact: 0.7,
        economicDamage: 5000
    },
    fire: {
        probability: 0.0005,
        baseDuration: 900, // 15 minutes
        trafficImpact: 0.9,
        economicDamage: 50000
    },
    flood: {
        probability: 0.0002,
        baseDuration: 1800, // 30 minutes
        trafficImpact: 1.0, // Complete closure
        economicDamage: 100000
    },
    earthquake: {
        probability: 0.0001,
        baseDuration: 3600, // 1 hour
        trafficImpact: 0.95,
        economicDamage: 500000
    },
    road_maintenance: {
        probability: 0.002,
        baseDuration: 600, // 10 minutes
        trafficImpact: 0.5,
        economicDamage: 10000
    },
    protest: {
        probability: 0.0003,
        baseDuration: 1200, // 20 minutes
        trafficImpact: 0.8,
        economicDamage: 2000
    }
}

export class DisasterSystem {
    private activeDisasters: Map<string, Disaster> = new Map()
    private emergencyVehicles: EmergencyVehicle[] = []
    private disasterHistory: Disaster[] = []

    checkForDisasters(roads: any[], time: number): Disaster | null {
        // Random disaster generation
        for (const [type, config] of Object.entries(DISASTER_CONFIGS)) {
            if (Math.random() < config.probability * roads.length) {
                return this.createDisaster(
                    type as DisasterType,
                    roads[Math.floor(Math.random() * roads.length)],
                    time
                )
            }
        }
        return null
    }

    private createDisaster(
        type: DisasterType,
        road: any,
        time: number
    ): Disaster {
        const config = DISASTER_CONFIGS[type]
        const severity = this.determineSeverity()

        const disaster: Disaster = {
            id: crypto.randomUUID(),
            type,
            position: road.start, // Simplified
            severity,
            startTime: time,
            duration: config.baseDuration * (severity === 'severe' ? 2 : severity === 'moderate' ? 1.5 : 1),
            affectedRoads: [road.id],
            trafficImpact: config.trafficImpact,
            casualties: type === 'traffic_accident' ? Math.floor(Math.random() * 5) : 0,
            economicDamage: config.economicDamage * (severity === 'severe' ? 3 : severity === 'moderate' ? 2 : 1),
            resolved: false
        }

        this.activeDisasters.set(disaster.id, disaster)
        this.dispatchEmergencyVehicles(disaster)
        return disaster
    }

    private determineSeverity(): 'minor' | 'moderate' | 'severe' {
        const rand = Math.random()
        if (rand < 0.6) return 'minor'
        if (rand < 0.9) return 'moderate'
        return 'severe'
    }

    private dispatchEmergencyVehicles(disaster: Disaster) {
        const vehicleTypeMap: Record<DisasterType, EmergencyVehicleType[]> = {
            traffic_accident: ['police', 'ambulance', 'tow_truck'],
            fire: ['fire_truck', 'ambulance'],
            flood: ['police'],
            earthquake: ['police', 'ambulance', 'fire_truck'],
            road_maintenance: ['tow_truck'],
            protest: ['police']
        }
        const vehicleTypes = vehicleTypeMap[disaster.type]

        for (const type of vehicleTypes) {
            const vehicle: EmergencyVehicle = {
                id: crypto.randomUUID(),
                type,
                position: [Math.random() * 100, 0, Math.random() * 100], // Random spawn
                targetDisaster: disaster.id,
                speed: 0.25, // Faster than normal traffic
                sirens: true
            }
            this.emergencyVehicles.push(vehicle)
        }
    }

    updateDisasters(time: number) {
        for (const disaster of this.activeDisasters.values()) {
            const elapsed = time - disaster.startTime

            if (elapsed >= disaster.duration) {
                disaster.resolved = true
                this.resolveDisaster(disaster)
            }
        }
    }

    updateEmergencyVehicles(deltaTime: number) {
        this.emergencyVehicles = this.emergencyVehicles.filter(vehicle => {
            const disaster = this.activeDisasters.get(vehicle.targetDisaster)
            
            if (!disaster || disaster.resolved) {
                return false // Remove vehicle
            }

            // Move towards disaster
            const dx = disaster.position[0] - vehicle.position[0]
            const dz = disaster.position[2] - vehicle.position[2]
            const distance = Math.sqrt(dx * dx + dz * dz)

            if (distance < 2) {
                // Arrived at disaster - help resolve it
                disaster.duration *= 0.9 // Reduces duration by 10%
                return false
            }

            vehicle.position[0] += (dx / distance) * vehicle.speed * deltaTime
            vehicle.position[2] += (dz / distance) * vehicle.speed * deltaTime
            return true
        })
    }

    private resolveDisaster(disaster: Disaster) {
        this.activeDisasters.delete(disaster.id)
        this.disasterHistory.push(disaster)

        // Remove old history (keep last 50)
        if (this.disasterHistory.length > 50) {
            this.disasterHistory.shift()
        }
    }

    getTrafficImpact(roadId: string): number {
        for (const disaster of this.activeDisasters.values()) {
            if (disaster.affectedRoads.includes(roadId)) {
                return disaster.trafficImpact
            }
        }
        return 0
    }

    getDisasterStats() {
        return {
            activeDisasters: this.activeDisasters.size,
            totalHistoricalDisasters: this.disasterHistory.length,
            totalCasualties: this.disasterHistory.reduce((sum, d) => sum + (d.casualties || 0), 0),
            totalEconomicDamage: this.disasterHistory.reduce((sum, d) => sum + d.economicDamage, 0),
            emergencyVehiclesDeployed: this.emergencyVehicles.length
        }
    }

    getActiveDisasters(): Disaster[] {
        return Array.from(this.activeDisasters.values())
    }
}

export const disasterSystem = new DisasterSystem()
