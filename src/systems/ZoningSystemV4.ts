/**
 * Advanced Zoning System - Cities: Skylines Level
 * Handles residential, commercial, industrial, and office zoning with density levels
 */

export type ZoneType = 'residential' | 'commercial' | 'industrial' | 'office' | 'leisure' | 'none';
export type ZoneDensity = 'low' | 'medium' | 'high';
export type BuildingLevel = 1 | 2 | 3 | 4 | 5; // Level 1 = basic, Level 5 = skyscraper

export interface ZoneCell {
    id: string;
    x: number;
    z: number;
    type: ZoneType;
    density: ZoneDensity;
    district?: string;
    landValue: number; // 0-100
    building?: ZoneBuilding;
}

export interface ZoneBuilding {
    id: string;
    level: BuildingLevel;
    type: ZoneType;
    density: ZoneDensity;
    capacity: number; // households/workers/jobs
    occupied: number;
    happiness: number; // 0-100
    educationLevel: number; // 0-100
    health: number; // 0-100
    power: number; // MW required
    water: number; // units required
    sewage: number; // units produced
    garbage: number; // units produced
    noise: number; // 0-100
    pollution: number; // 0-100
    age: number; // days
    upgradable: boolean;
    abandonmentTimer: number; // days until abandoned
}

export interface ZoneStats {
    residential: {
        low: { zones: number; buildings: number; population: number; demand: number };
        medium: { zones: number; buildings: number; population: number; demand: number };
        high: { zones: number; buildings: number; population: number; demand: number };
    };
    commercial: {
        low: { zones: number; buildings: number; jobs: number; demand: number };
        medium: { zones: number; buildings: number; jobs: number; demand: number };
        high: { zones: number; buildings: number; jobs: number; demand: number };
    };
    industrial: {
        low: { zones: number; buildings: number; jobs: number; demand: number };
        medium: { zones: number; buildings: number; jobs: number; demand: number };
        high: { zones: number; buildings: number; jobs: number; demand: number };
    };
    office: {
        zones: number;
        buildings: number;
        jobs: number;
        demand: number;
    };
}

class ZoningSystemV4 {
    private static instance: ZoningSystemV4;
    private zones: Map<string, ZoneCell> = new Map();
    private buildings: Map<string, ZoneBuilding> = new Map();
    private stats: ZoneStats;
    private growthTimer: number = 0;
    private updateTimer: number = 0;

    private constructor() {
        this.stats = this.initializeStats();
    }

    static getInstance(): ZoningSystemV4 {
        if (!ZoningSystemV4.instance) {
            ZoningSystemV4.instance = new ZoningSystemV4();
        }
        return ZoningSystemV4.instance;
    }

    private initializeStats(): ZoneStats {
        return {
            residential: {
                low: { zones: 0, buildings: 0, population: 0, demand: 50 },
                medium: { zones: 0, buildings: 0, population: 0, demand: 30 },
                high: { zones: 0, buildings: 0, population: 0, demand: 20 }
            },
            commercial: {
                low: { zones: 0, buildings: 0, jobs: 0, demand: 40 },
                medium: { zones: 0, buildings: 0, jobs: 0, demand: 30 },
                high: { zones: 0, buildings: 0, jobs: 0, demand: 20 }
            },
            industrial: {
                low: { zones: 0, buildings: 0, jobs: 0, demand: 50 },
                medium: { zones: 0, buildings: 0, jobs: 0, demand: 30 },
                high: { zones: 0, buildings: 0, jobs: 0, demand: 15 }
            },
            office: { zones: 0, buildings: 0, jobs: 0, demand: 25 }
        };
    }

    // Create or update a zone
    createZone(x: number, z: number, type: ZoneType, density: ZoneDensity): void {
        const key = `${x},${z}`;
        const existingZone = this.zones.get(key);

        if (type === 'none') {
            if (existingZone?.building) {
                this.demolishBuilding(existingZone.building.id);
            }
            this.zones.delete(key);
            return;
        }

        const zone: ZoneCell = {
            id: key,
            x,
            z,
            type,
            density,
            landValue: existingZone?.landValue || 50,
            building: existingZone?.building,
            district: existingZone?.district
        };

        this.zones.set(key, zone);
        this.updateStats();
    }

    // Attempt to grow a building on a vacant zone
    private growBuilding(zone: ZoneCell): void {
        if (zone.building) return;

        // Check if zone has required services
        const hasRequirements = this.checkBuildingRequirements(zone);
        if (!hasRequirements) return;

        // Check demand
        const demand = this.getDemand(zone.type, zone.density);
        if (demand < 20) return; // Need at least 20% demand

        // Determine building level based on land value
        let level: BuildingLevel = 1;
        if (zone.landValue > 80) level = 5;
        else if (zone.landValue > 60) level = 4;
        else if (zone.landValue > 40) level = 3;
        else if (zone.landValue > 20) level = 2;

        // Create building
        const building = this.createBuilding(zone, level);
        zone.building = building;
        this.buildings.set(building.id, building);
        this.updateStats();
    }

    private createBuilding(zone: ZoneCell, level: BuildingLevel): ZoneBuilding {
        const capacityMultipliers = {
            low: { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12 },
            medium: { 1: 8, 2: 12, 3: 16, 4: 20, 5: 24 },
            high: { 1: 16, 2: 24, 3: 32, 4: 48, 5: 64 }
        };

        const capacity = capacityMultipliers[zone.density][level];

        return {
            id: `building_${zone.id}_${Date.now()}`,
            level,
            type: zone.type,
            density: zone.density,
            capacity,
            occupied: 0,
            happiness: 50,
            educationLevel: 30,
            health: 70,
            power: this.calculatePowerUsage(zone.type, zone.density, level),
            water: this.calculateWaterUsage(zone.type, zone.density, level),
            sewage: this.calculateSewageProduction(zone.type, zone.density, level),
            garbage: this.calculateGarbageProduction(zone.type, zone.density, level),
            noise: this.calculateNoise(zone.type, zone.density),
            pollution: this.calculatePollution(zone.type, zone.density),
            age: 0,
            upgradable: level < 5,
            abandonmentTimer: 0
        };
    }

    private checkBuildingRequirements(zone: ZoneCell): boolean {
        // Would check for road access, power, water in full implementation
        // For now, return true if land value is decent
        return zone.landValue > 15;
    }

    private calculatePowerUsage(_type: ZoneType, density: ZoneDensity, level: BuildingLevel): number {
        const baseUsage = { low: 1, medium: 2, high: 4 };
        return baseUsage[density] * level;
    }

    private calculateWaterUsage(_type: ZoneType, density: ZoneDensity, level: BuildingLevel): number {
        const baseUsage = { low: 2, medium: 4, high: 8 };
        return baseUsage[density] * level;
    }

    private calculateSewageProduction(_type: ZoneType, density: ZoneDensity, level: BuildingLevel): number {
        return this.calculateWaterUsage(_type, density, level) * 0.8;
    }

    private calculateGarbageProduction(_type: ZoneType, density: ZoneDensity, level: BuildingLevel): number {
        const baseProduction = { low: 1, medium: 2, high: 4 };
        return baseProduction[density] * level;
    }

    private calculateNoise(type: ZoneType, density: ZoneDensity): number {
        const noiseValues = {
            residential: { low: 10, medium: 20, high: 30 },
            commercial: { low: 30, medium: 40, high: 50 },
            industrial: { low: 60, medium: 70, high: 80 },
            office: { low: 20, medium: 30, high: 40 },
            leisure: { low: 40, medium: 50, high: 60 },
            none: { low: 0, medium: 0, high: 0 }
        };
        return noiseValues[type][density];
    }

    private calculatePollution(type: ZoneType, density: ZoneDensity): number {
        const pollutionValues = {
            residential: { low: 5, medium: 10, high: 15 },
            commercial: { low: 10, medium: 15, high: 20 },
            industrial: { low: 50, medium: 70, high: 90 },
            office: { low: 5, medium: 10, high: 15 },
            leisure: { low: 10, medium: 15, high: 20 },
            none: { low: 0, medium: 0, high: 0 }
        };
        return pollutionValues[type][density];
    }

    // Update demand based on city conditions
    updateDemand(population: number, employment: number, commercial: number): void {
        // Residential demand based on jobs available
        const jobRatio = employment / Math.max(population, 1);
        this.stats.residential.low.demand = Math.min(100, 50 + (jobRatio * 30));
        this.stats.residential.medium.demand = Math.min(100, 30 + (population / 50));
        this.stats.residential.high.demand = Math.min(100, (population / 100));

        // Commercial demand based on population
        const popRatio = population / 100;
        this.stats.commercial.low.demand = Math.min(100, 40 + popRatio * 20);
        this.stats.commercial.medium.demand = Math.min(100, 30 + popRatio * 15);
        this.stats.commercial.high.demand = Math.min(100, 20 + popRatio * 10);

        // Industrial demand based on commercial need
        const commercialRatio = commercial / Math.max(population, 1);
        this.stats.industrial.low.demand = Math.min(100, 50 + (1 - commercialRatio) * 30);
        this.stats.industrial.medium.demand = Math.min(100, 30 + (1 - commercialRatio) * 20);
        this.stats.industrial.high.demand = Math.min(100, 15 + (1 - commercialRatio) * 10);

        // Office demand based on education
        this.stats.office.demand = Math.min(100, population / 20);
    }

    private getDemand(type: ZoneType, density: ZoneDensity): number {
        if (type === 'residential') return this.stats.residential[density].demand;
        if (type === 'commercial') return this.stats.commercial[density].demand;
        if (type === 'industrial') return this.stats.industrial[density].demand;
        if (type === 'office') return this.stats.office.demand;
        return 0;
    }

    // Update all buildings (aging, upgrading, abandonment)
    update(deltaTime: number): void {
        this.updateTimer += deltaTime;
        this.growthTimer += deltaTime;

        // Update buildings every second
        if (this.updateTimer >= 1) {
            this.updateTimer = 0;
            
            this.buildings.forEach(building => {
                building.age += 1 / 86400; // Convert seconds to days
                
                // Check for abandonment
                if (building.happiness < 20) {
                    building.abandonmentTimer += 1 / 86400;
                    if (building.abandonmentTimer > 7) {
                        // Find and remove building
                        this.zones.forEach(zone => {
                            if (zone.building?.id === building.id) {
                                zone.building = undefined;
                            }
                        });
                        this.buildings.delete(building.id);
                    }
                } else {
                    building.abandonmentTimer = 0;
                }
            });
        }

        // Attempt growth every 5 seconds
        if (this.growthTimer >= 5) {
            this.growthTimer = 0;
            this.attemptGrowth();
        }
    }

    private attemptGrowth(): void {
        // Try to grow 1-3 random vacant zones
        const vacantZones = Array.from(this.zones.values()).filter(z => !z.building && z.type !== 'none');
        const attempts = Math.min(3, vacantZones.length);

        for (let i = 0; i < attempts; i++) {
            const randomZone = vacantZones[Math.floor(Math.random() * vacantZones.length)];
            if (randomZone) {
                this.growBuilding(randomZone);
            }
        }
    }

    private demolishBuilding(buildingId: string): void {
        this.buildings.delete(buildingId);
        this.zones.forEach(zone => {
            if (zone.building?.id === buildingId) {
                zone.building = undefined;
            }
        });
        this.updateStats();
    }

    private updateStats(): void {
        // Reset stats
        this.stats = this.initializeStats();

        // Count zones and buildings
        this.zones.forEach(zone => {
            if (zone.type === 'none') return;

            if (zone.type === 'residential') {
                this.stats.residential[zone.density].zones++;
                if (zone.building) {
                    this.stats.residential[zone.density].buildings++;
                    this.stats.residential[zone.density].population += zone.building.occupied;
                }
            } else if (zone.type === 'commercial') {
                this.stats.commercial[zone.density].zones++;
                if (zone.building) {
                    this.stats.commercial[zone.density].buildings++;
                    this.stats.commercial[zone.density].jobs += zone.building.capacity;
                }
            } else if (zone.type === 'industrial') {
                this.stats.industrial[zone.density].zones++;
                if (zone.building) {
                    this.stats.industrial[zone.density].buildings++;
                    this.stats.industrial[zone.density].jobs += zone.building.capacity;
                }
            } else if (zone.type === 'office') {
                this.stats.office.zones++;
                if (zone.building) {
                    this.stats.office.buildings++;
                    this.stats.office.jobs += zone.building.capacity;
                }
            }
        });
    }

    // Public getters
    getZone(x: number, z: number): ZoneCell | undefined {
        return this.zones.get(`${x},${z}`);
    }

    getAllZones(): ZoneCell[] {
        return Array.from(this.zones.values());
    }

    getBuilding(id: string): ZoneBuilding | undefined {
        return this.buildings.get(id);
    }

    getAllBuildings(): ZoneBuilding[] {
        return Array.from(this.buildings.values());
    }

    getStats(): ZoneStats {
        return this.stats;
    }

    getTotalPopulation(): number {
        return this.stats.residential.low.population +
               this.stats.residential.medium.population +
               this.stats.residential.high.population;
    }

    getTotalJobs(): number {
        return this.stats.commercial.low.jobs +
               this.stats.commercial.medium.jobs +
               this.stats.commercial.high.jobs +
               this.stats.industrial.low.jobs +
               this.stats.industrial.medium.jobs +
               this.stats.industrial.high.jobs +
               this.stats.office.jobs;
    }
}

export default ZoningSystemV4;
