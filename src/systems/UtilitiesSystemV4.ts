/**
 * Utilities Network System - Cities: Skylines Level
 * Manages water, electricity, and sewage systems with production and consumption
 */

export type UtilityType = 'power' | 'water' | 'sewage';

export interface PowerPlant {
    id: string;
    type: 'coal' | 'oil' | 'nuclear' | 'wind' | 'solar' | 'hydro';
    x: number;
    z: number;
    production: number; // MW
    capacity: number; // MW
    cost: number; // Monthly operational cost
    pollution: number; // 0-100
    efficiency: number; // 0-100
    fuelCost: number; // Monthly fuel cost
}

export interface WaterFacility {
    id: string;
    type: 'pump' | 'tower' | 'treatment';
    x: number;
    z: number;
    production: number; // Units per day
    capacity: number;
    cost: number;
}

export interface SewageFacility {
    id: string;
    type: 'outlet' | 'treatment';
    x: number;
    z: number;
    capacity: number; // Units per day
    cost: number;
    pollution: number; // 0-100 (outlets pollute, treatment doesn't)
}

export interface UtilityPipe {
    id: string;
    type: 'water' | 'sewage';
    points: Array<{ x: number; z: number }>;
    connected: Set<string>; // Connected building IDs
}

export interface PowerLine {
    id: string;
    points: Array<{ x: number; z: number }>;
    capacity: number; // MW
    connected: Set<string>; // Connected building IDs
}

export interface UtilityStats {
    power: {
        production: number;
        capacity: number;
        consumption: number;
        efficiency: number;
    };
    water: {
        production: number;
        capacity: number;
        consumption: number;
        storage: number;
    };
    sewage: {
        capacity: number;
        production: number;
        treatment: number;
    };
}

class UtilitiesSystemV4 {
    private static instance: UtilitiesSystemV4;
    
    private powerPlants: Map<string, PowerPlant> = new Map();
    private waterFacilities: Map<string, WaterFacility> = new Map();
    private sewageFacilities: Map<string, SewageFacility> = new Map();
    private powerLines: Map<string, PowerLine> = new Map();
    private waterPipes: Map<string, UtilityPipe> = new Map();
    private sewagePipes: Map<string, UtilityPipe> = new Map();
    
    private powerGrid: Set<string> = new Set(); // Building IDs with power
    private waterGrid: Set<string> = new Set(); // Building IDs with water
    private sewageGrid: Set<string> = new Set(); // Building IDs with sewage
    
    private stats: UtilityStats;

    private constructor() {
        this.stats = {
            power: { production: 0, capacity: 0, consumption: 0, efficiency: 100 },
            water: { production: 0, capacity: 0, consumption: 0, storage: 0 },
            sewage: { capacity: 0, production: 0, treatment: 0 }
        };
    }

    static getInstance(): UtilitiesSystemV4 {
        if (!UtilitiesSystemV4.instance) {
            UtilitiesSystemV4.instance = new UtilitiesSystemV4();
        }
        return UtilitiesSystemV4.instance;
    }

    // Power Plants
    buildPowerPlant(
        type: PowerPlant['type'],
        x: number,
        z: number
    ): PowerPlant {
        const plantSpecs = {
            coal: { capacity: 40, cost: 800, pollution: 80, fuelCost: 2000 },
            oil: { capacity: 60, cost: 1200, pollution: 60, fuelCost: 3000 },
            nuclear: { capacity: 160, cost: 4000, pollution: 5, fuelCost: 1000 },
            wind: { capacity: 8, cost: 200, pollution: 0, fuelCost: 0 },
            solar: { capacity: 4, cost: 300, pollution: 0, fuelCost: 0 },
            hydro: { capacity: 20, cost: 600, pollution: 0, fuelCost: 0 }
        };

        const specs = plantSpecs[type];
        const plant: PowerPlant = {
            id: `power_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            x,
            z,
            production: 0,
            capacity: specs.capacity,
            cost: specs.cost,
            pollution: specs.pollution,
            efficiency: 100,
            fuelCost: specs.fuelCost
        };

        this.powerPlants.set(plant.id, plant);
        this.updateStats();
        return plant;
    }

    // Water Facilities
    buildWaterFacility(
        type: WaterFacility['type'],
        x: number,
        z: number
    ): WaterFacility {
        const facilitySpecs = {
            pump: { capacity: 60000, cost: 400 },
            tower: { capacity: 30000, cost: 200 },
            treatment: { capacity: 80000, cost: 600 }
        };

        const specs = facilitySpecs[type];
        const facility: WaterFacility = {
            id: `water_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            x,
            z,
            production: 0,
            capacity: specs.capacity,
            cost: specs.cost
        };

        this.waterFacilities.set(facility.id, facility);
        this.updateStats();
        return facility;
    }

    // Sewage Facilities
    buildSewageFacility(
        type: SewageFacility['type'],
        x: number,
        z: number
    ): SewageFacility {
        const facilitySpecs = {
            outlet: { capacity: 40000, cost: 200, pollution: 80 },
            treatment: { capacity: 80000, cost: 800, pollution: 0 }
        };

        const specs = facilitySpecs[type];
        const facility: SewageFacility = {
            id: `sewage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            x,
            z,
            capacity: specs.capacity,
            cost: specs.cost,
            pollution: specs.pollution
        };

        this.sewageFacilities.set(facility.id, facility);
        this.updateStats();
        return facility;
    }

    // Power Lines
    buildPowerLine(points: Array<{ x: number; z: number }>): PowerLine {
        const line: PowerLine = {
            id: `powerline_${Date.now()}`,
            points,
            capacity: 100, // MW
            connected: new Set()
        };

        this.powerLines.set(line.id, line);
        return line;
    }

    // Pipes
    buildPipe(
        type: 'water' | 'sewage',
        points: Array<{ x: number; z: number }>
    ): UtilityPipe {
        const pipe: UtilityPipe = {
            id: `${type}_pipe_${Date.now()}`,
            type,
            points,
            connected: new Set()
        };

        if (type === 'water') {
            this.waterPipes.set(pipe.id, pipe);
        } else {
            this.sewagePipes.set(pipe.id, pipe);
        }

        return pipe;
    }

    // Check if building has utilities
    hasPower(buildingId: string): boolean {
        return this.powerGrid.has(buildingId);
    }

    hasWater(buildingId: string): boolean {
        return this.waterGrid.has(buildingId);
    }

    hasSewage(buildingId: string): boolean {
        return this.sewageGrid.has(buildingId);
    }

    // Connect building to utility
    connectBuilding(buildingId: string, _x: number, _z: number, utilityType: UtilityType): void {
        // In full implementation, would check proximity to pipes/lines
        // For now, simple grid addition
        if (utilityType === 'power') {
            this.powerGrid.add(buildingId);
        } else if (utilityType === 'water') {
            this.waterGrid.add(buildingId);
        } else if (utilityType === 'sewage') {
            this.sewageGrid.add(buildingId);
        }
    }

    // Disconnect building
    disconnectBuilding(buildingId: string): void {
        this.powerGrid.delete(buildingId);
        this.waterGrid.delete(buildingId);
        this.sewageGrid.delete(buildingId);
    }

    // Update production based on consumption
    update(consumption: { power: number; water: number; sewage: number }): void {
        // Update power production
        this.stats.power.consumption = consumption.power;
        let remainingDemand = consumption.power;
        let totalProduction = 0;

        this.powerPlants.forEach(plant => {
            if (remainingDemand > 0) {
                const produce = Math.min(plant.capacity, remainingDemand);
                plant.production = produce;
                totalProduction += produce;
                remainingDemand -= produce;
            } else {
                plant.production = 0;
            }
        });

        this.stats.power.production = totalProduction;

        // Update water production
        this.stats.water.consumption = consumption.water;
        let waterProduced = 0;
        this.waterFacilities.forEach(facility => {
            if (facility.type !== 'treatment') {
                const produce = Math.min(facility.capacity, consumption.water);
                facility.production = produce;
                waterProduced += produce;
            }
        });
        this.stats.water.production = waterProduced;

        // Update sewage
        this.stats.sewage.production = consumption.sewage;
        let sewageTreated = 0;
        this.sewageFacilities.forEach(facility => {
            if (facility.type === 'treatment') {
                sewageTreated += facility.capacity;
            }
        });
        this.stats.sewage.treatment = Math.min(sewageTreated, consumption.sewage);

        this.updateStats();
    }

    private updateStats(): void {
        // Calculate capacities
        this.stats.power.capacity = 0;
        this.powerPlants.forEach(plant => {
            this.stats.power.capacity += plant.capacity;
        });

        this.stats.water.capacity = 0;
        this.waterFacilities.forEach(facility => {
            this.stats.water.capacity += facility.capacity;
        });

        this.stats.sewage.capacity = 0;
        this.sewageFacilities.forEach(facility => {
            this.stats.sewage.capacity += facility.capacity;
        });

        // Calculate efficiency
        if (this.stats.power.capacity > 0) {
            this.stats.power.efficiency = Math.min(100, 
                (this.stats.power.production / this.stats.power.consumption) * 100
            );
        }
    }

    // Calculate monthly costs
    getMonthlyPowerCost(): number {
        let total = 0;
        this.powerPlants.forEach(plant => {
            total += plant.cost + plant.fuelCost;
        });
        return total;
    }

    getMonthlyWaterCost(): number {
        let total = 0;
        this.waterFacilities.forEach(facility => {
            total += facility.cost;
        });
        return total;
    }

    getMonthlySewageCost(): number {
        let total = 0;
        this.sewageFacilities.forEach(facility => {
            total += facility.cost;
        });
        return total;
    }

    getTotalUtilityCost(): number {
        return this.getMonthlyPowerCost() + 
               this.getMonthlyWaterCost() + 
               this.getMonthlySewageCost();
    }

    // Demolish facilities
    demolishPowerPlant(id: string): void {
        this.powerPlants.delete(id);
        this.updateStats();
    }

    demolishWaterFacility(id: string): void {
        this.waterFacilities.delete(id);
        this.updateStats();
    }

    demolishSewageFacility(id: string): void {
        this.sewageFacilities.delete(id);
        this.updateStats();
    }

    // Getters
    getStats(): UtilityStats {
        return this.stats;
    }

    getAllPowerPlants(): PowerPlant[] {
        return Array.from(this.powerPlants.values());
    }

    getAllWaterFacilities(): WaterFacility[] {
        return Array.from(this.waterFacilities.values());
    }

    getAllSewageFacilities(): SewageFacility[] {
        return Array.from(this.sewageFacilities.values());
    }

    getPowerCoverage(): number {
        return this.powerGrid.size;
    }

    getWaterCoverage(): number {
        return this.waterGrid.size;
    }

    getSewageCoverage(): number {
        return this.sewageGrid.size;
    }

    // Check if city has power/water issues
    hasPowerShortage(): boolean {
        return this.stats.power.consumption > this.stats.power.production;
    }

    hasWaterShortage(): boolean {
        return this.stats.water.consumption > this.stats.water.production;
    }

    hasSewageIssue(): boolean {
        return this.stats.sewage.production > this.stats.sewage.capacity;
    }
}

export default UtilitiesSystemV4;
