export type EmergencyType = 'fire' | 'accident' | 'crime' | 'medical'

export interface EmergencyVehicle {
    id: string
    type: 'police' | 'fire' | 'ambulance'
    position: [number, number, number]
    destination: [number, number, number]
    speed: number
    isActive: boolean
    sirenOn: boolean
}

export interface TrafficAccident {
    id: string
    position: [number, number, number]
    severity: 'minor' | 'major' | 'severe'
    vehiclesInvolved: number
    duration: number // seconds
    resolved: boolean
}

export interface TrafficJam {
    id: string
    roadId: string
    position: [number, number, number]
    length: number
    severity: number // 0-1
    cause: 'accident' | 'construction' | 'volume' | 'weather'
}

// Advanced AI behaviors
export class TrafficAIV3 {
    private static instance: TrafficAIV3
    private accidents: TrafficAccident[] = []
    private emergencyVehicles: EmergencyVehicle[] = []
    private trafficJams: TrafficJam[] = []
    // private reactionTimes = new Map<string, number>() // For future use

    static getInstance(): TrafficAIV3 {
        if (!this.instance) {
            this.instance = new TrafficAIV3()
        }
        return this.instance
    }

    update(deltaTime: number) {
        this.updateAccidents(deltaTime)
        this.updateEmergencyVehicles(deltaTime)
        this.detectTrafficJams()
    }

    private updateAccidents(deltaTime: number) {
        this.accidents = this.accidents.filter(accident => {
            accident.duration -= deltaTime
            if (accident.duration <= 0) {
                accident.resolved = true
                return false
            }
            return true
        })

        // Random accident generation (rare)
        if (Math.random() < 0.0001) { // 0.01% chance per frame
            this.createAccident()
        }
    }

    private createAccident() {
        const severities: ('minor' | 'major' | 'severe')[] = ['minor', 'major', 'severe']
        const weights = [0.7, 0.25, 0.05]
        const random = Math.random()
        let sum = 0
        let severity: 'minor' | 'major' | 'severe' = 'minor'

        for (let i = 0; i < severities.length; i++) {
            sum += weights[i]
            if (random <= sum) {
                severity = severities[i]
                break
            }
        }

        const accident: TrafficAccident = {
            id: `accident_${Date.now()}`,
            position: [
                Math.random() * 100 - 50,
                0,
                Math.random() * 100 - 50
            ],
            severity,
            vehiclesInvolved: severity === 'minor' ? 2 : severity === 'major' ? 3 : 4,
            duration: severity === 'minor' ? 30 : severity === 'major' ? 60 : 120,
            resolved: false
        }

        this.accidents.push(accident)
        
        // Dispatch emergency vehicles
        if (severity === 'major' || severity === 'severe') {
            this.dispatchEmergency('accident', accident.position)
        }
    }

    private dispatchEmergency(type: EmergencyType, location: [number, number, number]) {
        const vehicleTypes: ('police' | 'fire' | 'ambulance')[] = 
            type === 'fire' ? ['fire'] :
            type === 'medical' ? ['ambulance'] :
            type === 'accident' ? ['police', 'ambulance'] :
            ['police']

        vehicleTypes.forEach(vType => {
            const vehicle: EmergencyVehicle = {
                id: `emergency_${Date.now()}_${Math.random()}`,
                type: vType,
                position: [Math.random() * 100 - 50, 0, Math.random() * 100 - 50],
                destination: location,
                speed: 25, // Faster than regular traffic
                isActive: true,
                sirenOn: true
            }
            this.emergencyVehicles.push(vehicle)
        })
    }

    private updateEmergencyVehicles(deltaTime: number) {
        this.emergencyVehicles = this.emergencyVehicles.filter(vehicle => {
            if (!vehicle.isActive) return false

            // Move towards destination
            const dx = vehicle.destination[0] - vehicle.position[0]
            const dz = vehicle.destination[2] - vehicle.position[2]
            const distance = Math.sqrt(dx * dx + dz * dz)

            if (distance < 2) {
                vehicle.isActive = false
                return false
            }

            const moveAmount = vehicle.speed * deltaTime
            const ratio = moveAmount / distance
            vehicle.position[0] += dx * ratio
            vehicle.position[2] += dz * ratio

            return true
        })
    }

    private detectTrafficJams() {
        // Simplified jam detection - would integrate with actual traffic system
    }

    // Behavior: Lane changing with turn signals
    shouldChangeLane(_vehicleId: string, currentSpeed: number, targetSpeed: number): boolean {
        if (currentSpeed < targetSpeed * 0.7) {
            return Math.random() < 0.1 // 10% chance to attempt lane change when slow
        }
        return false
    }

    // Behavior: Brake lights activation
    isBraking(currentSpeed: number, previousSpeed: number): boolean {
        return currentSpeed < previousSpeed - 0.5
    }

    // Behavior: Emergency vehicle yielding
    shouldYieldToEmergency(vehiclePosition: [number, number, number]): boolean {
        return this.emergencyVehicles.some(ev => {
            const dx = ev.position[0] - vehiclePosition[0]
            const dz = ev.position[2] - vehiclePosition[2]
            const distance = Math.sqrt(dx * dx + dz * dz)
            return distance < 30 && ev.sirenOn
        })
    }

    // Behavior: Adaptive cruise control
    calculateSafeFollowingDistance(speed: number, weather: number): number {
        // 2-second rule, adjusted for weather
        const baseDistance = speed * 2
        return baseDistance * (2 - weather) // weather is 0-1, lower = worse
    }

    getAccidents() { return [...this.accidents] }
    getEmergencyVehicles() { return [...this.emergencyVehicles] }
    getTrafficJams() { return [...this.trafficJams] }
}
