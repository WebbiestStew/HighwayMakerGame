/**
 * Cities: Skylines V4 - Master Integration System
 * Coordinates all city simulation systems and provides unified interface
 */

import ZoningSystemV4, { type ZoneStats } from './ZoningSystemV4';
import DistrictSystemV4 from './DistrictSystemV4';
import UtilitiesSystemV4, { type UtilityStats } from './UtilitiesSystemV4';
import ServicesSystemV4, { type ServiceStats } from './ServicesSystemV4';
import PublicTransportSystemV4, { type TransportStats } from './PublicTransportSystemV4';
import DemographicsSystemV4, { type DemographicStats } from './DemographicsSystemV4';
import { useFrame } from '@react-three/fiber';

export interface CityStats {
    population: number;
    area: number; // km²
    cityValue: number; // Total $
    income: number; // Monthly
    expenses: number; // Monthly
    balance: number; // Current funds
    zoning: ZoneStats;
    demographics: DemographicStats;
    utilities: UtilityStats;
    services: ServiceStats;
    transport: TransportStats;
    districts: number;
}

class CitiesSkylinesSystemV4 {
    private static instance: CitiesSkylinesSystemV4;
    
    private zoning: ZoningSystemV4;
    private districts: DistrictSystemV4;
    private utilities: UtilitiesSystemV4;
    private services: ServicesSystemV4;
    private transport: PublicTransportSystemV4;
    private demographics: DemographicsSystemV4;
    
    private balance: number = 100000; // Starting money
    private updateTimer: number = 0;
    private monthTimer: number = 0;
    
    private constructor() {
        this.zoning = ZoningSystemV4.getInstance();
        this.districts = DistrictSystemV4.getInstance();
        this.utilities = UtilitiesSystemV4.getInstance();
        this.services = ServicesSystemV4.getInstance();
        this.transport = PublicTransportSystemV4.getInstance();
        this.demographics = DemographicsSystemV4.getInstance();
    }

    static getInstance(): CitiesSkylinesSystemV4 {
        if (!CitiesSkylinesSystemV4.instance) {
            CitiesSkylinesSystemV4.instance = new CitiesSkylinesSystemV4();
        }
        return CitiesSkylinesSystemV4.instance;
    }

    // Main update loop
    update(deltaTime: number): void {
        this.updateTimer += deltaTime;
        this.monthTimer += deltaTime;

        // Update every second
        if (this.updateTimer >= 1) {
            this.updateTimer = 0;

            const population = this.zoning.getTotalPopulation();
            const jobs = this.zoning.getTotalJobs();
            const commercial = this.zoning.getStats().commercial.low.buildings +
                             this.zoning.getStats().commercial.medium.buildings +
                             this.zoning.getStats().commercial.high.buildings;

            // Update zoning demand
            this.zoning.updateDemand(population, jobs, commercial);
            this.zoning.update(deltaTime);

            // Calculate utility consumption
            const buildings = this.zoning.getAllBuildings();
            const utilityConsumption = {
                power: buildings.reduce((sum, b) => sum + b.power, 0),
                water: buildings.reduce((sum, b) => sum + b.water, 0),
                sewage: buildings.reduce((sum, b) => sum + b.sewage, 0)
            };
            this.utilities.update(utilityConsumption);

            // Update services
            const buildingLocations = buildings.map(b => {
                const zone = this.zoning.getAllZones().find(z => z.building?.id === b.id);
                return zone ? { x: zone.x, z: zone.z, population: b.occupied } : null;
            }).filter(Boolean) as Array<{ x: number; z: number; population: number }>;
            
            this.services.updateServiceLoads(buildingLocations);

            // Update transport
            this.transport.update(deltaTime, population);

            // Update demographics
            const servicesStats = this.services.getStats();
            
            this.demographics.update(deltaTime, {
                jobsAvailable: jobs,
                educationQuality: servicesStats.education.educationLevel,
                healthcareQuality: servicesStats.healthcare.healthLevel,
                pollution: this.calculatePollution(),
                crime: servicesStats.police.crimeRate
            });
        }

        // Monthly budget update
        if (this.monthTimer >= 2592000) { // 30 days
            this.monthTimer = 0;
            this.processMonthlyBudget();
        }
    }

    private calculatePollution(): number {
        const buildings = this.zoning.getAllBuildings();
        if (buildings.length === 0) return 0;
        
        const totalPollution = buildings.reduce((sum, b) => sum + b.pollution, 0);
        return Math.min(100, totalPollution / buildings.length);
    }

    private processMonthlyBudget(): void {
        const income = this.calculateIncome();
        const expenses = this.calculateExpenses();
        
        this.balance += income - expenses;
        this.demographics.resetMonthlyCounters();
    }

    private calculateIncome(): number {
        const zoningStats = this.zoning.getStats();
        
        // Tax income from different zones
        let income = 0;
        
        // Residential tax (per household)
        income += zoningStats.residential.low.population * 50;
        income += zoningStats.residential.medium.population * 100;
        income += zoningStats.residential.high.population * 200;
        
        // Commercial tax (per business)
        income += zoningStats.commercial.low.buildings * 150;
        income += zoningStats.commercial.medium.buildings * 300;
        income += zoningStats.commercial.high.buildings * 600;
        
        // Industrial tax (per factory)
        income += zoningStats.industrial.low.buildings * 200;
        income += zoningStats.industrial.medium.buildings * 400;
        income += zoningStats.industrial.high.buildings * 800;
        
        // Office tax
        income += zoningStats.office.buildings * 500;
        
        // Transport revenue
        income += this.transport.getStats().total.revenue;
        
        return income;
    }

    private calculateExpenses(): number {
        let expenses = 0;
        
        // Utilities
        expenses += this.utilities.getTotalUtilityCost();
        
        // Services
        expenses += this.services.getTotalServiceBudget();
        
        // Transport
        expenses += this.transport.getStats().total.expenses;
        
        // District policies
        expenses += this.districts.getTotalPolicyCosts();
        
        // Road maintenance (simplified)
        const population = this.zoning.getTotalPopulation();
        expenses += population * 2; // $2 per citizen
        
        return expenses;
    }

    // Get comprehensive city statistics
    getCityStats(): CityStats {
        const population = this.demographics.getStats().totalPopulation;
        const zones = this.zoning.getAllZones();
        
        return {
            population,
            area: zones.length * 0.01, // 100 cells = 1 km²
            cityValue: this.calculateCityValue(),
            income: this.calculateIncome(),
            expenses: this.calculateExpenses(),
            balance: this.balance,
            zoning: this.zoning.getStats(),
            demographics: this.demographics.getStats(),
            utilities: this.utilities.getStats(),
            services: this.services.getStats(),
            transport: this.transport.getStats(),
            districts: this.districts.getAllDistricts().length
        };
    }

    private calculateCityValue(): number {
        const zones = this.zoning.getAllZones();
        return zones.reduce((sum, zone) => {
            const building = zone.building;
            if (!building) return sum;
            
            const baseValue = building.level * 10000;
            const landValueMultiplier = zone.landValue / 50;
            return sum + (baseValue * landValueMultiplier);
        }, 0);
    }

    // Public accessors for subsystems
    getZoning(): ZoningSystemV4 { return this.zoning; }
    getDistricts(): DistrictSystemV4 { return this.districts; }
    getUtilities(): UtilitiesSystemV4 { return this.utilities; }
    getServices(): ServicesSystemV4 { return this.services; }
    getTransport(): PublicTransportSystemV4 { return this.transport; }
    getDemographics(): DemographicsSystemV4 { return this.demographics; }
    
    getBalance(): number { return this.balance; }
    setBalance(amount: number): void { this.balance = amount; }
    addMoney(amount: number): void { this.balance += amount; }
    spendMoney(amount: number): boolean {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}

// React hook for easy integration
export function useCitiesSkylinesSystem() {
    const system = CitiesSkylinesSystemV4.getInstance();
    
    useFrame((_state, delta) => {
        system.update(delta);
    });
    
    return {
        system,
        stats: system.getCityStats(),
        zoning: system.getZoning(),
        districts: system.getDistricts(),
        utilities: system.getUtilities(),
        services: system.getServices(),
        transport: system.getTransport(),
        demographics: system.getDemographics(),
        balance: system.getBalance(),
        spendMoney: (amount: number) => system.spendMoney(amount),
        addMoney: (amount: number) => system.addMoney(amount)
    };
}

export default CitiesSkylinesSystemV4;
