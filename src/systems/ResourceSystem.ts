/**
 * RESOURCE MANAGEMENT SYSTEM
 * Electricity, Water, Waste - Production, Distribution, Consumption
 */

export interface PowerPlant {
    id: string
    type: 'coal' | 'gas' | 'nuclear' | 'solar' | 'wind' | 'hydro'
    position: [number, number, number]
    capacity: number // MW
    production: number // Current MW
    cost: number // per month
    pollution: number // 0-100
    efficiency: number // 0-100%
}

export interface WaterFacility {
    id: string
    type: 'pump' | 'treatment' | 'tower'
    position: [number, number, number]
    capacity: number // gallons per day
    coverage: number // radius in units
}

export interface WasteSystem {
    id: string
    type: 'landfill' | 'incinerator' | 'recycling'
    position: [number, number, number]
    capacity: number // tons per day
    pollution: number
}

export interface ResourceGrid {
    electricity: Map<string, number> // building ID -> consumption
    water: Map<string, number>
    waste: Map<string, number>
}

export interface ResourceStats {
    power: {
        capacity: number
        demand: number
        surplus: number
        coverage: number // % of buildings covered
        cost: number
    }
    water: {
        capacity: number
        demand: number
        surplus: number
        coverage: number
    }
    waste: {
        capacity: number
        production: number
        surplus: number
        recyclingRate: number
    }
    pollution: number // 0-100
}

export class ResourceManager {
    private powerPlants: Map<string, PowerPlant> = new Map()
    private waterFacilities: Map<string, WaterFacility> = new Map()
    private wasteSystems: Map<string, WasteSystem> = new Map()
    private grid: ResourceGrid = {
        electricity: new Map(),
        water: new Map(),
        waste: new Map()
    }
    
    // Power plant configs
    private powerPlantData = {
        coal: { capacity: 500, cost: 50000, pollution: 80, efficiency: 75, buildCost: 500000 },
        gas: { capacity: 300, cost: 30000, pollution: 40, efficiency: 85, buildCost: 300000 },
        nuclear: { capacity: 1000, cost: 100000, pollution: 10, efficiency: 95, buildCost: 2000000 },
        solar: { capacity: 100, cost: 5000, pollution: 0, efficiency: 60, buildCost: 200000 },
        wind: { capacity: 150, cost: 8000, pollution: 0, efficiency: 70, buildCost: 250000 },
        hydro: { capacity: 400, cost: 20000, pollution: 5, efficiency: 90, buildCost: 800000 }
    }
    
    buildPowerPlant(type: PowerPlant['type'], position: [number, number, number]): { success: boolean, cost: number } {
        const config = this.powerPlantData[type]
        const plant: PowerPlant = {
            id: crypto.randomUUID(),
            type,
            position,
            capacity: config.capacity,
            production: 0,
            cost: config.cost,
            pollution: config.pollution,
            efficiency: config.efficiency
        }
        this.powerPlants.set(plant.id, plant)
        return { success: true, cost: config.buildCost }
    }
    
    buildWaterFacility(type: WaterFacility['type'], position: [number, number, number]): { success: boolean, cost: number } {
        const costs = { pump: 100000, treatment: 200000, tower: 50000 }
        const capacities = { pump: 1000000, treatment: 800000, tower: 500000 }
        const coverage = { pump: 50, treatment: 40, tower: 60 }
        
        const facility: WaterFacility = {
            id: crypto.randomUUID(),
            type,
            position,
            capacity: capacities[type],
            coverage: coverage[type]
        }
        this.waterFacilities.set(facility.id, facility)
        return { success: true, cost: costs[type] }
    }
    
    buildWasteSystem(type: WasteSystem['type'], position: [number, number, number]): { success: boolean, cost: number } {
        const costs = { landfill: 150000, incinerator: 300000, recycling: 250000 }
        const capacities = { landfill: 1000, incinerator: 500, recycling: 300 }
        const pollution = { landfill: 60, incinerator: 40, recycling: 10 }
        
        const system: WasteSystem = {
            id: crypto.randomUUID(),
            type,
            position,
            capacity: capacities[type],
            pollution: pollution[type]
        }
        this.wasteSystems.set(system.id, system)
        return { success: true, cost: costs[type] }
    }
    
    // Register building resource consumption
    registerBuilding(buildingId: string, buildingType: string) {
        // Base consumption by building type (MW, gallons/day, tons/day)
        const consumption = this.getBuildingConsumption(buildingType)
        this.grid.electricity.set(buildingId, consumption.power)
        this.grid.water.set(buildingId, consumption.water)
        this.grid.waste.set(buildingId, consumption.waste)
    }
    
    unregisterBuilding(buildingId: string) {
        this.grid.electricity.delete(buildingId)
        this.grid.water.delete(buildingId)
        this.grid.waste.delete(buildingId)
    }
    
    private getBuildingConsumption(type: string): { power: number, water: number, waste: number } {
        const residential = ['house', 'townhouse', 'apartment', 'condo', 'mansion', 'duplex', 'villa', 'cottage', 'bungalow', 'penthouse']
        const commercial = ['shop', 'mall', 'restaurant', 'hotel', 'office', 'bank', 'theater', 'gym', 'supermarket', 'boutique']
        const industrial = ['factory', 'warehouse', 'plant', 'depot', 'refinery']
        
        if (residential.includes(type)) {
            const sizes = { house: 1, townhouse: 1.2, apartment: 2, condo: 1.5, mansion: 3, duplex: 1.8, villa: 2.5, cottage: 0.8, bungalow: 1, penthouse: 2.2 }
            const mult = sizes[type as keyof typeof sizes] || 1
            return { power: 2 * mult, water: 100 * mult, waste: 5 * mult }
        }
        
        if (commercial.includes(type)) {
            const sizes = { shop: 1, mall: 8, restaurant: 2, hotel: 5, office: 4, bank: 3, theater: 4, gym: 3, supermarket: 6, boutique: 1.5 }
            const mult = sizes[type as keyof typeof sizes] || 1
            return { power: 5 * mult, water: 200 * mult, waste: 10 * mult }
        }
        
        if (industrial.includes(type)) {
            const sizes = { factory: 1, warehouse: 0.8, plant: 1.5, depot: 0.7, refinery: 2 }
            const mult = sizes[type as keyof typeof sizes] || 1
            return { power: 20 * mult, water: 500 * mult, waste: 30 * mult }
        }
        
        return { power: 1, water: 50, waste: 2 }
    }
    
    // Calculate coverage (% of buildings within range of facilities)
    calculateCoverage(buildings: any[]): { power: number, water: number, waste: number } {
        let powerCovered = 0
        let waterCovered = 0
        let wasteCovered = 0
        
        for (const building of buildings) {
            // Power is grid-based (no distance limit if capacity available)
            powerCovered++
            
            // Water needs to be within range of facility
            for (const facility of this.waterFacilities.values()) {
                const dist = Math.sqrt(
                    Math.pow(building.position[0] - facility.position[0], 2) +
                    Math.pow(building.position[2] - facility.position[2], 2)
                )
                if (dist <= facility.coverage) {
                    waterCovered++
                    break
                }
            }
            
            // Waste collection needs facility nearby
            for (const system of this.wasteSystems.values()) {
                const dist = Math.sqrt(
                    Math.pow(building.position[0] - system.position[0], 2) +
                    Math.pow(building.position[2] - system.position[2], 2)
                )
                if (dist <= 50) { // 50 unit collection radius
                    wasteCovered++
                    break
                }
            }
        }
        
        const total = buildings.length || 1
        return {
            power: (powerCovered / total) * 100,
            water: (waterCovered / total) * 100,
            waste: (wasteCovered / total) * 100
        }
    }
    
    update(buildings: any[]): ResourceStats {
        // Calculate demand
        const powerDemand = Array.from(this.grid.electricity.values()).reduce((a, b) => a + b, 0)
        const waterDemand = Array.from(this.grid.water.values()).reduce((a, b) => a + b, 0)
        const wasteProduction = Array.from(this.grid.waste.values()).reduce((a, b) => a + b, 0)
        
        // Calculate capacity
        const powerCapacity = Array.from(this.powerPlants.values()).reduce((sum, p) => sum + p.capacity, 0)
        const waterCapacity = Array.from(this.waterFacilities.values()).reduce((sum, f) => sum + f.capacity, 0)
        const wasteCapacity = Array.from(this.wasteSystems.values()).reduce((sum, s) => sum + s.capacity, 0)
        
        // Update power plant production based on demand
        let remainingDemand = powerDemand
        for (const plant of this.powerPlants.values()) {
            plant.production = Math.min(plant.capacity, remainingDemand) * (plant.efficiency / 100)
            remainingDemand -= plant.production
        }
        
        // Calculate pollution
        const totalPollution = Array.from(this.powerPlants.values()).reduce((sum, p) => {
            return sum + (p.pollution * (p.production / p.capacity))
        }, 0) + Array.from(this.wasteSystems.values()).reduce((sum, s) => sum + s.pollution, 0)
        
        const avgPollution = totalPollution / (this.powerPlants.size + this.wasteSystems.size || 1)
        
        // Calculate coverage
        const coverage = this.calculateCoverage(buildings)
        
        // Calculate recycling rate
        const recyclingCapacity = Array.from(this.wasteSystems.values())
            .filter(s => s.type === 'recycling')
            .reduce((sum, s) => sum + s.capacity, 0)
        const recyclingRate = wasteCapacity > 0 ? (recyclingCapacity / wasteCapacity) * 100 : 0
        
        // Monthly costs
        const powerCost = Array.from(this.powerPlants.values()).reduce((sum, p) => sum + p.cost, 0)
        
        return {
            power: {
                capacity: powerCapacity,
                demand: powerDemand,
                surplus: powerCapacity - powerDemand,
                coverage: coverage.power,
                cost: powerCost
            },
            water: {
                capacity: waterCapacity,
                demand: waterDemand,
                surplus: waterCapacity - waterDemand,
                coverage: coverage.water
            },
            waste: {
                capacity: wasteCapacity,
                production: wasteProduction,
                surplus: wasteCapacity - wasteProduction,
                recyclingRate
            },
            pollution: avgPollution
        }
    }
    
    // Get shortage effects
    getShortages(stats: ResourceStats): { power: boolean, water: boolean, waste: boolean } {
        return {
            power: stats.power.surplus < 0,
            water: stats.water.surplus < 0,
            waste: stats.waste.surplus < 0
        }
    }
    
    getPowerPlants(): PowerPlant[] {
        return Array.from(this.powerPlants.values())
    }
    
    getWaterFacilities(): WaterFacility[] {
        return Array.from(this.waterFacilities.values())
    }
    
    getWasteSystems(): WasteSystem[] {
        return Array.from(this.wasteSystems.values())
    }
}

export const resourceManager = new ResourceManager()
