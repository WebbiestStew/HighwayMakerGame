/**
 * Service Coverage System - Cities: Skylines Level
 * Manages police, fire, healthcare, education, deathcare, and parks
 */

export type ServiceType = 'police' | 'fire' | 'healthcare' | 'education' | 'deathcare' | 'parks';

export interface ServiceBuilding {
    id: string;
    type: ServiceType;
    subType: string; // e.g., 'police-station', 'hospital', 'elementary-school'
    x: number;
    z: number;
    range: number; // Coverage radius
    capacity: number; // Max citizens served
    currentLoad: number; // Currently serving
    efficiency: number; // 0-100
    cost: number; // Monthly cost
    vehicles?: number; // For police/fire/healthcare
    stats: {
        crimePrevention?: number;
        fireRisk?: number;
        healthBonus?: number;
        educationBonus?: number;
        happiness?: number;
    };
}

export interface ServiceStats {
    police: {
        buildings: number;
        coverage: number; // % of city covered
        crimeRate: number; // 0-100
        arrests: number;
        budget: number;
    };
    fire: {
        buildings: number;
        coverage: number;
        fireRisk: number; // 0-100
        incidents: number;
        budget: number;
    };
    healthcare: {
        buildings: number;
        coverage: number;
        healthLevel: number; // 0-100
        patients: number;
        budget: number;
    };
    education: {
        elementary: number;
        high: number;
        university: number;
        coverage: number;
        educationLevel: number; // 0-100
        students: number;
        budget: number;
    };
    deathcare: {
        buildings: number;
        coverage: number;
        capacity: number;
        deaths: number;
        budget: number;
    };
    parks: {
        buildings: number;
        coverage: number;
        happinessBonus: number; // 0-100
        visitors: number;
        budget: number;
    };
}

class ServicesSystemV4 {
    private static instance: ServicesSystemV4;
    private services: Map<string, ServiceBuilding> = new Map();
    private coverageMap: Map<string, Set<string>> = new Map(); // "x,z" -> Set of service IDs
    private stats: ServiceStats;

    private constructor() {
        this.stats = this.initializeStats();
    }

    static getInstance(): ServicesSystemV4 {
        if (!ServicesSystemV4.instance) {
            ServicesSystemV4.instance = new ServicesSystemV4();
        }
        return ServicesSystemV4.instance;
    }

    private initializeStats(): ServiceStats {
        return {
            police: { buildings: 0, coverage: 0, crimeRate: 50, arrests: 0, budget: 0 },
            fire: { buildings: 0, coverage: 0, fireRisk: 30, incidents: 0, budget: 0 },
            healthcare: { buildings: 0, coverage: 0, healthLevel: 50, patients: 0, budget: 0 },
            education: { elementary: 0, high: 0, university: 0, coverage: 0, educationLevel: 20, students: 0, budget: 0 },
            deathcare: { buildings: 0, coverage: 0, capacity: 0, deaths: 0, budget: 0 },
            parks: { buildings: 0, coverage: 0, happinessBonus: 0, visitors: 0, budget: 0 }
        };
    }

    // Build service building
    buildService(
        type: ServiceType,
        subType: string,
        x: number,
        z: number
    ): ServiceBuilding {
        const specs = this.getServiceSpecs(type, subType);
        
        const building: ServiceBuilding = {
            id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            subType,
            x,
            z,
            range: specs.range,
            capacity: specs.capacity,
            currentLoad: 0,
            efficiency: 100,
            cost: specs.cost,
            vehicles: specs.vehicles,
            stats: specs.stats
        };

        this.services.set(building.id, building);
        this.updateCoverage(building);
        this.updateStats();
        
        return building;
    }

    private getServiceSpecs(_type: ServiceType, subType: string): any {
        const specs: Record<string, any> = {
            // Police
            'police-station': { range: 300, capacity: 50, cost: 500, vehicles: 4, stats: { crimePrevention: 30 } },
            'police-headquarters': { range: 600, capacity: 150, cost: 1500, vehicles: 12, stats: { crimePrevention: 50 } },
            
            // Fire
            'fire-station': { range: 350, capacity: 40, cost: 400, vehicles: 3, stats: { fireRisk: -30 } },
            'fire-headquarters': { range: 700, capacity: 120, cost: 1200, vehicles: 10, stats: { fireRisk: -50 } },
            
            // Healthcare
            'clinic': { range: 200, capacity: 30, cost: 300, vehicles: 1, stats: { healthBonus: 20 } },
            'hospital': { range: 500, capacity: 100, cost: 1000, vehicles: 5, stats: { healthBonus: 40 } },
            'medical-center': { range: 800, capacity: 200, cost: 2500, vehicles: 10, stats: { healthBonus: 60 } },
            
            // Education
            'elementary-school': { range: 250, capacity: 300, cost: 400, vehicles: 2, stats: { educationBonus: 15 } },
            'high-school': { range: 400, capacity: 500, cost: 800, vehicles: 3, stats: { educationBonus: 30 } },
            'university': { range: 600, capacity: 1000, cost: 2000, vehicles: 0, stats: { educationBonus: 50 } },
            
            // Deathcare
            'cemetery': { range: 400, capacity: 200, cost: 200, vehicles: 2, stats: {} },
            'crematorium': { range: 500, capacity: 150, cost: 400, vehicles: 3, stats: {} },
            
            // Parks
            'small-park': { range: 100, capacity: 50, cost: 50, vehicles: 0, stats: { happiness: 10 } },
            'large-park': { range: 200, capacity: 150, cost: 150, vehicles: 0, stats: { happiness: 20 } },
            'plaza': { range: 150, capacity: 200, cost: 200, vehicles: 0, stats: { happiness: 15 } },
            'zoo': { range: 400, capacity: 500, cost: 800, vehicles: 0, stats: { happiness: 40 } },
            'stadium': { range: 600, capacity: 1000, cost: 2000, vehicles: 0, stats: { happiness: 50 } }
        };

        return specs[subType] || { range: 200, capacity: 50, cost: 300, vehicles: 0, stats: {} };
    }

    // Update coverage map for a service building
    private updateCoverage(building: ServiceBuilding): void {
        // Clear old coverage for this building
        this.coverageMap.forEach((services, _cellKey) => {
            services.delete(building.id);
        });

        // Add new coverage
        const radiusSquared = building.range * building.range;
        
        // Calculate coverage area (simplified grid)
        for (let dx = -building.range; dx <= building.range; dx += 10) {
            for (let dz = -building.range; dz <= building.range; dz += 10) {
                const distSquared = dx * dx + dz * dz;
                if (distSquared <= radiusSquared) {
                    const cellX = Math.floor((building.x + dx) / 10);
                    const cellZ = Math.floor((building.z + dz) / 10);
                    const cellKey = `${cellX},${cellZ}`;
                    
                    if (!this.coverageMap.has(cellKey)) {
                        this.coverageMap.set(cellKey, new Set());
                    }
                    this.coverageMap.get(cellKey)!.add(building.id);
                }
            }
        }
    }

    // Check what services cover a location
    getCoverageAt(x: number, z: number): Set<string> {
        const cellX = Math.floor(x / 10);
        const cellZ = Math.floor(z / 10);
        const cellKey = `${cellX},${cellZ}`;
        return this.coverageMap.get(cellKey) || new Set();
    }

    // Check if location has specific service
    hasServiceCoverage(x: number, z: number, type: ServiceType): boolean {
        const coverage = this.getCoverageAt(x, z);
        for (const serviceId of coverage) {
            const service = this.services.get(serviceId);
            if (service?.type === type) {
                return true;
            }
        }
        return false;
    }

    // Update service load based on population
    updateServiceLoads(buildings: Array<{ x: number; z: number; population: number }>): void {
        // Reset loads
        this.services.forEach(service => {
            service.currentLoad = 0;
        });

        // Calculate load for each service
        buildings.forEach(building => {
            const coverage = this.getCoverageAt(building.x, building.z);
            coverage.forEach(serviceId => {
                const service = this.services.get(serviceId);
                if (service) {
                    service.currentLoad += building.population;
                    service.efficiency = Math.max(0, 100 - (service.currentLoad / service.capacity) * 100);
                }
            });
        });

        this.updateStats();
    }

    // Demolish service
    demolishService(id: string): void {
        const service = this.services.get(id);
        if (!service) return;

        // Remove from coverage map
        this.coverageMap.forEach((services, _cellKey) => {
            services.delete(id);
        });

        this.services.delete(id);
        this.updateStats();
    }

    private updateStats(): void {
        // Reset stats
        this.stats = this.initializeStats();

        // Count buildings and calculate budgets
        this.services.forEach(service => {
            switch (service.type) {
                case 'police':
                    this.stats.police.buildings++;
                    this.stats.police.budget += service.cost;
                    break;
                case 'fire':
                    this.stats.fire.buildings++;
                    this.stats.fire.budget += service.cost;
                    break;
                case 'healthcare':
                    this.stats.healthcare.buildings++;
                    this.stats.healthcare.budget += service.cost;
                    break;
                case 'education':
                    if (service.subType === 'elementary-school') this.stats.education.elementary++;
                    else if (service.subType === 'high-school') this.stats.education.high++;
                    else if (service.subType === 'university') this.stats.education.university++;
                    this.stats.education.budget += service.cost;
                    break;
                case 'deathcare':
                    this.stats.deathcare.buildings++;
                    this.stats.deathcare.capacity += service.capacity;
                    this.stats.deathcare.budget += service.cost;
                    break;
                case 'parks':
                    this.stats.parks.buildings++;
                    this.stats.parks.budget += service.cost;
                    break;
            }
        });

        // Calculate coverage percentages (simplified)
        const totalCells = this.coverageMap.size;
        if (totalCells > 0) {
            ['police', 'fire', 'healthcare', 'education', 'deathcare', 'parks'].forEach(serviceType => {
                let coveredCells = 0;
                this.coverageMap.forEach(services => {
                    for (const serviceId of services) {
                        const service = this.services.get(serviceId);
                        if (service?.type === serviceType as ServiceType) {
                            coveredCells++;
                            break;
                        }
                    }
                });
                
                const coverage = (coveredCells / totalCells) * 100;
                switch (serviceType) {
                    case 'police': this.stats.police.coverage = coverage; break;
                    case 'fire': this.stats.fire.coverage = coverage; break;
                    case 'healthcare': this.stats.healthcare.coverage = coverage; break;
                    case 'education': this.stats.education.coverage = coverage; break;
                    case 'deathcare': this.stats.deathcare.coverage = coverage; break;
                    case 'parks': this.stats.parks.coverage = coverage; break;
                }
            });
        }
    }

    // Calculate total service budget
    getTotalServiceBudget(): number {
        return this.stats.police.budget +
               this.stats.fire.budget +
               this.stats.healthcare.budget +
               this.stats.education.budget +
               this.stats.deathcare.budget +
               this.stats.parks.budget;
    }

    // Getters
    getStats(): ServiceStats {
        return this.stats;
    }

    getService(id: string): ServiceBuilding | undefined {
        return this.services.get(id);
    }

    getAllServices(): ServiceBuilding[] {
        return Array.from(this.services.values());
    }

    getServicesByType(type: ServiceType): ServiceBuilding[] {
        return Array.from(this.services.values()).filter(s => s.type === type);
    }

    // Check for service issues
    hasPoliceShortage(): boolean {
        return this.stats.police.coverage < 70;
    }

    hasFireShortage(): boolean {
        return this.stats.fire.coverage < 70;
    }

    hasHealthcareShortage(): boolean {
        return this.stats.healthcare.coverage < 60;
    }

    hasEducationShortage(): boolean {
        return this.stats.education.coverage < 80;
    }
}

export default ServicesSystemV4;
