/**
 * Public Transportation System
 * Buses, trains, metro, trams, stations
 */

export type PublicTransportType = 'bus' | 'train' | 'metro' | 'tram'

export interface PublicTransportLine {
    id: string
    name: string
    type: PublicTransportType
    stations: TransportStation[]
    route: [number, number, number][]
    vehicles: TransportVehicle[]
    frequency: number // Minutes between departures
    capacity: number
    fare: number
}

export interface TransportStation {
    id: string
    name: string
    position: [number, number, number]
    type: PublicTransportType
    lines: string[] // Line IDs
    dailyPassengers: number
    connectionType: 'terminal' | 'stop' | 'interchange'
}

export interface TransportVehicle {
    id: string
    lineId: string
    type: PublicTransportType
    position: [number, number, number]
    passengers: number
    capacity: number
    nextStationId: string
}

export const TRANSPORT_CONFIGS = {
    bus: {
        capacity: 40,
        speed: 0.08,
        cost: 50000,
        operatingCost: 1000,
        fare: 2,
        stationCost: 10000
    },
    train: {
        capacity: 200,
        speed: 0.15,
        cost: 500000,
        operatingCost: 5000,
        fare: 5,
        stationCost: 100000
    },
    metro: {
        capacity: 150,
        speed: 0.20,
        cost: 1000000,
        operatingCost: 8000,
        fare: 3,
        stationCost: 200000
    },
    tram: {
        capacity: 80,
        speed: 0.10,
        cost: 200000,
        operatingCost: 2000,
        fare: 2.5,
        stationCost: 50000
    }
}

export class PublicTransportSystem {
    private lines: Map<string, PublicTransportLine> = new Map()
    private stations: Map<string, TransportStation> = new Map()
    private vehicles: TransportVehicle[] = []

    createStation(
        name: string, 
        position: [number, number, number], 
        type: PublicTransportType
    ): TransportStation {
        const station: TransportStation = {
            id: crypto.randomUUID(),
            name,
            position,
            type,
            lines: [],
            dailyPassengers: 0,
            connectionType: 'stop'
        }
        this.stations.set(station.id, station)
        return station
    }

    createLine(
        name: string,
        type: PublicTransportType,
        stationIds: string[],
        frequency: number = 10
    ): PublicTransportLine {
        const stations = stationIds
            .map(id => this.stations.get(id))
            .filter(s => s !== undefined) as TransportStation[]

        if (stations.length < 2) {
            throw new Error('Line must have at least 2 stations')
        }

        const route = stations.map(s => s.position)
        const config = TRANSPORT_CONFIGS[type]

        const line: PublicTransportLine = {
            id: crypto.randomUUID(),
            name,
            type,
            stations,
            route,
            vehicles: [],
            frequency,
            capacity: config.capacity,
            fare: config.fare
        }

        // Add line to stations
        stations.forEach(station => {
            station.lines.push(line.id)
        })

        this.lines.set(line.id, line)
        return line
    }

    spawnVehicle(lineId: string): TransportVehicle | null {
        const line = this.lines.get(lineId)
        if (!line || line.stations.length === 0) return null

        const config = TRANSPORT_CONFIGS[line.type]
        const vehicle: TransportVehicle = {
            id: crypto.randomUUID(),
            lineId,
            type: line.type,
            position: line.stations[0].position,
            passengers: 0,
            capacity: config.capacity,
            nextStationId: line.stations[1]?.id || line.stations[0].id
        }

        this.vehicles.push(vehicle)
        line.vehicles.push(vehicle)
        return vehicle
    }

    updateVehicles(deltaTime: number) {
        for (const vehicle of this.vehicles) {
            const line = this.lines.get(vehicle.lineId)
            if (!line) continue

            const config = TRANSPORT_CONFIGS[vehicle.type]
            const nextStation = this.stations.get(vehicle.nextStationId)
            
            if (nextStation) {
                // Move towards next station
                const dx = nextStation.position[0] - vehicle.position[0]
                const dz = nextStation.position[2] - vehicle.position[2]
                const distance = Math.sqrt(dx * dx + dz * dz)

                if (distance < 1) {
                    // Arrived at station
                    vehicle.position = nextStation.position
                    
                    // Board/alight passengers
                    const boarding = Math.floor(Math.random() * 20)
                    const alighting = Math.floor(Math.random() * vehicle.passengers)
                    vehicle.passengers = Math.min(
                        vehicle.capacity,
                        vehicle.passengers - alighting + boarding
                    )
                    nextStation.dailyPassengers += boarding + alighting

                    // Move to next station
                    const currentIndex = line.stations.findIndex(s => s.id === vehicle.nextStationId)
                    const nextIndex = (currentIndex + 1) % line.stations.length
                    vehicle.nextStationId = line.stations[nextIndex].id
                } else {
                    // Move towards station
                    const moveSpeed = config.speed * deltaTime
                    vehicle.position[0] += (dx / distance) * moveSpeed
                    vehicle.position[2] += (dz / distance) * moveSpeed
                }
            }
        }
    }

    calculateRevenue(): number {
        let totalRevenue = 0
        for (const station of this.stations.values()) {
            totalRevenue += station.dailyPassengers * 2.5 // Average fare
        }
        return totalRevenue
    }

    calculateOperatingCosts(): number {
        let totalCosts = 0
        for (const line of this.lines.values()) {
            const config = TRANSPORT_CONFIGS[line.type]
            totalCosts += config.operatingCost * line.vehicles.length
        }
        return totalCosts
    }

    getTransportStats() {
        return {
            totalLines: this.lines.size,
            totalStations: this.stations.size,
            totalVehicles: this.vehicles.length,
            dailyPassengers: Array.from(this.stations.values())
                .reduce((sum, s) => sum + s.dailyPassengers, 0),
            monthlyRevenue: this.calculateRevenue() * 30,
            monthlyOperatingCosts: this.calculateOperatingCosts() * 30
        }
    }
}

export const publicTransportSystem = new PublicTransportSystem()
