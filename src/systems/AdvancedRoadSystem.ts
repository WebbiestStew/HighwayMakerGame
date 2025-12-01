/**
 * Advanced Road Types and Intersection System
 * Bridges, tunnels, roundabouts, toll booths, traffic lights
 */

export type RoadType = 
    | 'highway' 
    | 'elevated' 
    | 'bridge' 
    | 'tunnel' 
    | 'ramp'
    | 'roundabout'
    | 'intersection'
    | 'toll_booth'
    | 'rest_stop'

export interface RoadFeature {
    type: 'traffic_light' | 'stop_sign' | 'toll_gate' | 'camera' | 'streetlight'
    position: [number, number, number]
    active: boolean
}

export interface AdvancedRoad {
    id: string
    baseRoadId: string
    roadType: RoadType
    elevation: number // Height above ground
    features: RoadFeature[]
    lanes: number
    speedLimit: number
    trafficCapacity: number
}

export const ROAD_TYPE_CONFIGS = {
    highway: {
        lanes: 3,
        speedLimit: 65,
        cost: 50000,
        capacity: 100,
        elevation: 0
    },
    elevated: {
        lanes: 2,
        speedLimit: 55,
        cost: 150000,
        capacity: 80,
        elevation: 10
    },
    bridge: {
        lanes: 2,
        speedLimit: 45,
        cost: 200000,
        capacity: 70,
        elevation: 15
    },
    tunnel: {
        lanes: 2,
        speedLimit: 45,
        cost: 250000,
        capacity: 60,
        elevation: -5
    },
    ramp: {
        lanes: 1,
        speedLimit: 35,
        cost: 75000,
        capacity: 40,
        elevation: 5
    },
    roundabout: {
        lanes: 2,
        speedLimit: 25,
        cost: 100000,
        capacity: 120,
        elevation: 0
    },
    intersection: {
        lanes: 2,
        speedLimit: 35,
        cost: 30000,
        capacity: 90,
        elevation: 0
    },
    toll_booth: {
        lanes: 4,
        speedLimit: 15,
        cost: 75000,
        capacity: 50,
        elevation: 0
    },
    rest_stop: {
        lanes: 2,
        speedLimit: 25,
        cost: 50000,
        capacity: 30,
        elevation: 0
    }
}

export interface IntersectionNode {
    id: string
    position: [number, number, number]
    type: 'intersection' | 'roundabout' | 'cloverleaf'
    connectedRoads: string[]
    trafficLight?: TrafficLight
}

export interface TrafficLight {
    id: string
    state: 'red' | 'yellow' | 'green'
    timer: number
    cycleTime: { red: number; yellow: number; green: number }
}

export class AdvancedRoadSystem {
    private intersections: Map<string, IntersectionNode> = new Map()
    private trafficLights: Map<string, TrafficLight> = new Map()

    createIntersection(position: [number, number, number], type: IntersectionNode['type']): IntersectionNode {
        const intersection: IntersectionNode = {
            id: crypto.randomUUID(),
            position,
            type,
            connectedRoads: []
        }

        if (type === 'intersection') {
            // Add traffic light
            const light: TrafficLight = {
                id: crypto.randomUUID(),
                state: 'green',
                timer: 0,
                cycleTime: { red: 30, yellow: 3, green: 30 }
            }
            intersection.trafficLight = light
            this.trafficLights.set(light.id, light)
        }

        this.intersections.set(intersection.id, intersection)
        return intersection
    }

    updateTrafficLights(deltaTime: number) {
        for (const light of this.trafficLights.values()) {
            light.timer += deltaTime

            const cycleTime = light.cycleTime[light.state]
            if (light.timer >= cycleTime) {
                light.timer = 0
                // Cycle: green -> yellow -> red -> green
                if (light.state === 'green') light.state = 'yellow'
                else if (light.state === 'yellow') light.state = 'red'
                else light.state = 'green'
            }
        }
    }

    canVehiclePass(lightId: string): boolean {
        const light = this.trafficLights.get(lightId)
        return light ? light.state !== 'red' : true
    }

    getRoadTypeCost(roadType: RoadType): number {
        return ROAD_TYPE_CONFIGS[roadType].cost
    }

    getRoadCapacity(roadType: RoadType): number {
        return ROAD_TYPE_CONFIGS[roadType].capacity
    }
}

export const advancedRoadSystem = new AdvancedRoadSystem()
