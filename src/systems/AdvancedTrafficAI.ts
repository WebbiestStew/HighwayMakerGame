/**
 * ADVANCED TRAFFIC AI SYSTEM
 * Intelligent pathfinding, lane changing, accidents, rush hours, adaptive signals
 */

import * as THREE from 'three'

export interface IntelligentVehicle {
    id: string
    type: 'car' | 'truck' | 'bus' | 'emergency'
    position: THREE.Vector3
    velocity: THREE.Vector3
    destination: THREE.Vector3
    path: THREE.Vector3[]
    pathIndex: number
    
    // AI behavior
    speed: number
    maxSpeed: number
    acceleration: number
    patience: number // 0-100, decreases in traffic
    aggressiveness: number // affects lane changing
    
    // State
    currentLane: number
    desiredLane: number
    isChangingLane: boolean
    stoppedTime: number // seconds stopped
    accidentRisk: number // 0-1
    
    // Driver profile
    skill: number // 0-100, affects reaction time
    followingDistance: number
}

export interface TrafficLight {
    id: string
    position: [number, number, number]
    state: 'red' | 'yellow' | 'green'
    timer: number
    cycleTime: {
        red: number
        yellow: number
        green: number
    }
    // Adaptive: learns traffic patterns
    avgWaitingVehicles: number
    adaptiveCycle: boolean
}

export interface Accident {
    id: string
    position: [number, number, number]
    severity: 'minor' | 'moderate' | 'severe'
    vehiclesInvolved: string[]
    blockedLanes: number
    duration: number // seconds until cleared
    requiresEmergency: boolean
}

export interface RushHour {
    morningStart: number // hour (0-24)
    morningEnd: number
    eveningStart: number
    eveningEnd: number
    multiplier: number // traffic spawn rate multiplier
}

export class AdvancedTrafficAI {
    private vehicles: Map<string, IntelligentVehicle> = new Map()
    private trafficLights: Map<string, TrafficLight> = new Map()
    private accidents: Map<string, Accident> = new Map()
    private rushHour: RushHour = {
        morningStart: 7,
        morningEnd: 9,
        eveningStart: 17,
        eveningEnd: 19,
        multiplier: 3
    }
    
    // Traffic flow analytics
    private avgSpeed: number = 0
    private congestionLevel: number = 0
    private accidentRate: number = 0
    
    spawnVehicle(start: THREE.Vector3, destination: THREE.Vector3, type: IntelligentVehicle['type'] = 'car'): string {
        const id = crypto.randomUUID()
        
        const speedLimits = { car: 25, truck: 18, bus: 20, emergency: 35 }
        const aggressiveness = type === 'emergency' ? 90 : Math.random() * 50 + 25
        
        const vehicle: IntelligentVehicle = {
            id,
            type,
            position: start.clone(),
            velocity: new THREE.Vector3(),
            destination,
            path: [start, destination], // Will use A* pathfinding
            pathIndex: 0,
            speed: 0,
            maxSpeed: speedLimits[type] + (Math.random() * 5 - 2.5),
            acceleration: type === 'truck' ? 0.5 : 1.0,
            patience: Math.random() * 100,
            aggressiveness,
            currentLane: Math.floor(Math.random() * 2), // 0 or 1
            desiredLane: Math.floor(Math.random() * 2),
            isChangingLane: false,
            stoppedTime: 0,
            accidentRisk: 0,
            skill: 50 + Math.random() * 50,
            followingDistance: type === 'car' ? 5 : type === 'truck' ? 10 : 7
        }
        
        this.vehicles.set(id, vehicle)
        return id
    }
    
    update(deltaTime: number, gameHour: number) {
        // Update traffic lights
        for (const light of this.trafficLights.values()) {
            this.updateTrafficLight(light, deltaTime)
        }
        
        // Update accidents (clear after duration)
        for (const [id, accident] of this.accidents.entries()) {
            accident.duration -= deltaTime
            if (accident.duration <= 0) {
                this.accidents.delete(id)
            }
        }
        
        // Update each vehicle with AI (rush hour support for future)
        const speeds: number[] = []
        let stoppedCount = 0
        
        for (const vehicle of this.vehicles.values()) {
            this.updateVehicleAI(vehicle, deltaTime)
            speeds.push(vehicle.speed)
            if (vehicle.speed < 1) stoppedCount++
        }
        
        // Calculate metrics
        this.avgSpeed = speeds.reduce((a, b) => a + b, 0) / (speeds.length || 1)
        this.congestionLevel = (stoppedCount / (this.vehicles.size || 1)) * 100
        
        // Randomly trigger accidents based on conditions (scaled by rush hour)
        const rushMultiplier = this.getRushHourMultiplier(gameHour)
        if (Math.random() < 0.0001 * (this.congestionLevel / 100) * this.vehicles.size * rushMultiplier) {
            this.triggerAccident()
        }
    }
    
    private updateVehicleAI(vehicle: IntelligentVehicle, deltaTime: number) {
        // 1. Check for obstacles ahead
        const vehicleAhead = this.getVehicleAhead(vehicle)
        const lightAhead = this.getTrafficLightAhead(vehicle)
        const accidentAhead = this.getAccidentAhead(vehicle)
        
        // 2. Decide target speed
        let targetSpeed = vehicle.maxSpeed
        
        // Slow for vehicle ahead (car following model)
        if (vehicleAhead) {
            const distance = vehicle.position.distanceTo(vehicleAhead.position)
            const safeDistance = vehicle.followingDistance
            
            if (distance < safeDistance) {
                targetSpeed = Math.min(vehicleAhead.speed, targetSpeed)
                
                // Too close! Brake hard
                if (distance < safeDistance * 0.5) {
                    targetSpeed = vehicleAhead.speed * 0.5
                    vehicle.accidentRisk += 0.1
                }
            }
        }
        
        // Stop for red lights
        if (lightAhead && lightAhead.state === 'red') {
            const distance = vehicle.position.distanceTo(new THREE.Vector3(...lightAhead.position))
            if (distance < 10) {
                targetSpeed = 0
            }
        }
        
        // Slow for accidents
        if (accidentAhead) {
            const distance = vehicle.position.distanceTo(new THREE.Vector3(...accidentAhead.position))
            if (distance < 20) {
                targetSpeed = vehicle.maxSpeed * 0.3
            }
        }
        
        // 3. Adjust speed
        if (vehicle.speed < targetSpeed) {
            vehicle.speed += vehicle.acceleration * deltaTime
        } else {
            vehicle.speed -= vehicle.acceleration * 2 * deltaTime // Brake faster than accelerate
        }
        vehicle.speed = Math.max(0, Math.min(vehicle.maxSpeed, vehicle.speed))
        
        // 4. Lane changing decision
        if (!vehicle.isChangingLane && Math.random() < 0.01) {
            if (this.shouldChangeLane(vehicle, vehicleAhead)) {
                vehicle.desiredLane = vehicle.currentLane === 0 ? 1 : 0
                vehicle.isChangingLane = true
            }
        }
        
        // Execute lane change
        if (vehicle.isChangingLane) {
            // Smooth transition (simplified)
            if (Math.random() < 0.1) {
                vehicle.currentLane = vehicle.desiredLane
                vehicle.isChangingLane = false
            }
        }
        
        // 5. Patience decay when stopped
        if (vehicle.speed < 1) {
            vehicle.stoppedTime += deltaTime
            vehicle.patience -= deltaTime * 5
            vehicle.patience = Math.max(0, vehicle.patience)
            
            // Impatient drivers become more aggressive
            if (vehicle.patience < 20) {
                vehicle.aggressiveness += 1
            }
        } else {
            vehicle.stoppedTime = 0
            vehicle.patience = Math.min(100, vehicle.patience + deltaTime * 2)
        }
        
        // 6. Move vehicle
        if (vehicle.path.length > vehicle.pathIndex + 1) {
            const target = vehicle.path[vehicle.pathIndex + 1]
            const direction = target.clone().sub(vehicle.position).normalize()
            vehicle.velocity = direction.multiplyScalar(vehicle.speed * deltaTime)
            vehicle.position.add(vehicle.velocity)
            
            // Check if reached waypoint
            if (vehicle.position.distanceTo(target) < 2) {
                vehicle.pathIndex++
            }
        }
        
        // 7. Check if reached destination
        if (vehicle.pathIndex >= vehicle.path.length - 1) {
            this.vehicles.delete(vehicle.id)
        }
        
        // 8. Emergency vehicles: clear path
        if (vehicle.type === 'emergency') {
            this.clearPathForEmergency(vehicle)
        }
    }
    
    private shouldChangeLane(vehicle: IntelligentVehicle, vehicleAhead: IntelligentVehicle | null): boolean {
        // Don't change if no vehicle ahead
        if (!vehicleAhead) return false
        
        // More aggressive = more likely to change
        const threshold = 100 - vehicle.aggressiveness
        
        // Slow vehicle ahead = consider changing
        if (vehicleAhead.speed < vehicle.speed * 0.7) {
            return Math.random() * 100 > threshold
        }
        
        return false
    }
    
    private getVehicleAhead(vehicle: IntelligentVehicle): IntelligentVehicle | null {
        let closest: IntelligentVehicle | null = null
        let minDist = Infinity
        
        for (const other of this.vehicles.values()) {
            if (other.id === vehicle.id) continue
            if (other.currentLane !== vehicle.currentLane) continue
            
            // Check if ahead (simplified - should use path direction)
            const dist = vehicle.position.distanceTo(other.position)
            if (dist < minDist && dist < 20) {
                closest = other
                minDist = dist
            }
        }
        
        return closest
    }
    
    private getTrafficLightAhead(vehicle: IntelligentVehicle): TrafficLight | null {
        // Find nearest light in path direction
        let nearest: TrafficLight | null = null
        let minDist = Infinity
        
        for (const light of this.trafficLights.values()) {
            const dist = vehicle.position.distanceTo(new THREE.Vector3(...light.position))
            if (dist < minDist && dist < 30) {
                nearest = light
                minDist = dist
            }
        }
        
        return nearest
    }
    
    private getAccidentAhead(vehicle: IntelligentVehicle): Accident | null {
        for (const accident of this.accidents.values()) {
            const dist = vehicle.position.distanceTo(new THREE.Vector3(...accident.position))
            if (dist < 30) return accident
        }
        return null
    }
    
    private updateTrafficLight(light: TrafficLight, deltaTime: number) {
        light.timer += deltaTime
        
        const cycle = light.cycleTime
        const totalCycle = cycle.green + cycle.yellow + cycle.red
        
        const timeInCycle = light.timer % totalCycle
        
        if (timeInCycle < cycle.green) {
            light.state = 'green'
        } else if (timeInCycle < cycle.green + cycle.yellow) {
            light.state = 'yellow'
        } else {
            light.state = 'red'
        }
        
        // Adaptive: adjust cycle based on waiting vehicles
        if (light.adaptiveCycle && light.timer % 60 < deltaTime) {
            this.adaptTrafficLight(light)
        }
    }
    
    private adaptTrafficLight(light: TrafficLight) {
        // Count vehicles waiting at light
        let waiting = 0
        for (const vehicle of this.vehicles.values()) {
            const dist = vehicle.position.distanceTo(new THREE.Vector3(...light.position))
            if (dist < 15 && vehicle.speed < 1) {
                waiting++
            }
        }
        
        // Adjust green time based on traffic
        light.avgWaitingVehicles = light.avgWaitingVehicles * 0.9 + waiting * 0.1
        
        if (light.avgWaitingVehicles > 5) {
            light.cycleTime.green = Math.min(60, light.cycleTime.green + 2)
        } else if (light.avgWaitingVehicles < 2) {
            light.cycleTime.green = Math.max(20, light.cycleTime.green - 2)
        }
    }
    
    private clearPathForEmergency(emergency: IntelligentVehicle) {
        // Vehicles near emergency should pull over
        for (const vehicle of this.vehicles.values()) {
            if (vehicle.id === emergency.id) continue
            
            const dist = vehicle.position.distanceTo(emergency.position)
            if (dist < 30) {
                // Pull to side (change lane if possible)
                if (!vehicle.isChangingLane) {
                    vehicle.desiredLane = vehicle.currentLane === 0 ? 1 : 0
                    vehicle.isChangingLane = true
                }
                // Slow down
                vehicle.speed = vehicle.maxSpeed * 0.5
            }
        }
    }
    
    private triggerAccident() {
        // Pick random vehicle
        const vehicleArray = Array.from(this.vehicles.values())
        if (vehicleArray.length < 2) return
        
        const vehicle1 = vehicleArray[Math.floor(Math.random() * vehicleArray.length)]
        const vehicle2 = this.getVehicleAhead(vehicle1)
        
        if (!vehicle2) return
        
        const severity: Accident['severity'] = Math.random() < 0.6 ? 'minor' : Math.random() < 0.9 ? 'moderate' : 'severe'
        const durations = { minor: 120, moderate: 300, severe: 600 }
        
        const accident: Accident = {
            id: crypto.randomUUID(),
            position: vehicle1.position.toArray() as [number, number, number],
            severity,
            vehiclesInvolved: [vehicle1.id, vehicle2.id],
            blockedLanes: severity === 'minor' ? 0 : severity === 'moderate' ? 1 : 2,
            duration: durations[severity],
            requiresEmergency: severity !== 'minor'
        }
        
        this.accidents.set(accident.id, accident)
        
        // Remove vehicles from simulation
        this.vehicles.delete(vehicle1.id)
        this.vehicles.delete(vehicle2.id)
        
        // Spawn emergency vehicles if needed
        if (accident.requiresEmergency) {
            const emergencyPos = new THREE.Vector3(...accident.position).add(new THREE.Vector3(50, 0, 50))
            this.spawnVehicle(emergencyPos, new THREE.Vector3(...accident.position), 'emergency')
        }
        
        this.accidentRate++
    }
    
    addTrafficLight(position: [number, number, number], adaptive: boolean = false): string {
        const id = crypto.randomUUID()
        const light: TrafficLight = {
            id,
            position,
            state: 'red',
            timer: 0,
            cycleTime: { green: 30, yellow: 3, red: 30 },
            avgWaitingVehicles: 0,
            adaptiveCycle: adaptive
        }
        this.trafficLights.set(id, light)
        return id
    }
    
    private isRushHour(hour: number): boolean {
        return (hour >= this.rushHour.morningStart && hour < this.rushHour.morningEnd) ||
               (hour >= this.rushHour.eveningStart && hour < this.rushHour.eveningEnd)
    }
    
    getRushHourMultiplier(hour: number): number {
        return this.isRushHour(hour) ? this.rushHour.multiplier : 1
    }
    
    getStats() {
        return {
            totalVehicles: this.vehicles.size,
            avgSpeed: this.avgSpeed,
            congestionLevel: this.congestionLevel,
            activeAccidents: this.accidents.size,
            accidentRate: this.accidentRate,
            trafficLights: this.trafficLights.size
        }
    }
    
    getVehicles(): IntelligentVehicle[] {
        return Array.from(this.vehicles.values())
    }
    
    getAccidents(): Accident[] {
        return Array.from(this.accidents.values())
    }
    
    getTrafficLights(): TrafficLight[] {
        return Array.from(this.trafficLights.values())
    }
}

export const advancedTrafficAI = new AdvancedTrafficAI()
