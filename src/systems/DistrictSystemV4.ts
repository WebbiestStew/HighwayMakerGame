/**
 * District Management System - Cities: Skylines Level
 * Allows players to create districts with custom policies, specializations, and tax rates
 */

export type DistrictSpecialization = 
    | 'none'
    | 'it-cluster'
    | 'tourism'
    | 'farming'
    | 'forestry'
    | 'oil-industry'
    | 'ore-industry'
    | 'finance'
    | 'residential-high-tech'
    | 'wall-to-wall-buildings';

export interface DistrictPolicy {
    id: string;
    name: string;
    description: string;
    monthlyCost: number;
    effects: {
        happiness?: number;
        education?: number;
        health?: number;
        pollution?: number;
        noise?: number;
        crime?: number;
        traffic?: number;
    };
}

export interface District {
    id: string;
    name: string;
    color: string;
    cells: Set<string>; // Set of "x,z" coordinates
    specialization: DistrictSpecialization;
    policies: Set<string>; // Active policy IDs
    taxRates: {
        residential: number; // 0-29 (modifier from base rate)
        commercial: number;
        industrial: number;
        office: number;
    };
    stats: {
        population: number;
        buildings: number;
        area: number; // square units
        income: number;
        expenses: number;
        happiness: number;
        landValue: number;
    };
}

class DistrictSystemV4 {
    private static instance: DistrictSystemV4;
    private districts: Map<string, District> = new Map();
    private cellToDistrict: Map<string, string> = new Map(); // "x,z" -> districtId
    private availablePolicies: Map<string, DistrictPolicy> = new Map();
    
    private constructor() {
        this.initializePolicies();
    }

    static getInstance(): DistrictSystemV4 {
        if (!DistrictSystemV4.instance) {
            DistrictSystemV4.instance = new DistrictSystemV4();
        }
        return DistrictSystemV4.instance;
    }

    private initializePolicies(): void {
        const policies: DistrictPolicy[] = [
            {
                id: 'recycling',
                name: 'Recycling Program',
                description: 'Reduces garbage by 30% but costs extra',
                monthlyCost: 500,
                effects: { pollution: -10, happiness: 5 }
            },
            {
                id: 'smoke-detector',
                name: 'Smoke Detector Distribution',
                description: 'Reduces fire risk significantly',
                monthlyCost: 300,
                effects: { happiness: 3 }
            },
            {
                id: 'pet-ban',
                name: 'Pet Ban',
                description: 'No pets allowed, reduces noise and garbage',
                monthlyCost: 0,
                effects: { noise: -20, happiness: -15 }
            },
            {
                id: 'free-public-transport',
                name: 'Free Public Transport',
                description: 'Free buses and metro, reduces traffic',
                monthlyCost: 2000,
                effects: { traffic: -25, happiness: 10 }
            },
            {
                id: 'high-tech-housing',
                name: 'High Tech Housing',
                description: 'Attracts educated residents, increases land value',
                monthlyCost: 1000,
                effects: { education: 20, happiness: 5 }
            },
            {
                id: 'encourage-biking',
                name: 'Bike Lanes',
                description: 'Encourages cycling, reduces traffic and pollution',
                monthlyCost: 400,
                effects: { traffic: -15, pollution: -15, happiness: 5 }
            },
            {
                id: 'free-wifi',
                name: 'Free WiFi',
                description: 'Public WiFi increases happiness and education',
                monthlyCost: 800,
                effects: { happiness: 8, education: 5 }
            },
            {
                id: 'parks-and-rec',
                name: 'Parks & Recreation',
                description: 'Extra park maintenance, increases happiness',
                monthlyCost: 600,
                effects: { happiness: 12, health: 5 }
            },
            {
                id: 'industrial-space-planning',
                name: 'Industrial Space Planning',
                description: 'Optimizes industrial zones, reduces pollution',
                monthlyCost: 1200,
                effects: { pollution: -25 }
            },
            {
                id: 'tax-relief',
                name: 'Tax Relief',
                description: 'Reduced taxes attract more residents',
                monthlyCost: 0,
                effects: { happiness: 15 }
            },
            {
                id: 'heavy-traffic-ban',
                name: 'Heavy Traffic Ban',
                description: 'Bans trucks, reduces traffic and pollution',
                monthlyCost: 0,
                effects: { traffic: -30, pollution: -20, noise: -15 }
            },
            {
                id: 'schools-out',
                name: "Schools Out Policy",
                description: 'Reduces school budget but lowers education',
                monthlyCost: -500,
                effects: { education: -15, happiness: -10 }
            }
        ];

        policies.forEach(policy => this.availablePolicies.set(policy.id, policy));
    }

    // Create a new district
    createDistrict(name: string): District {
        const id = `district_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
            '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
        ];
        const color = colors[this.districts.size % colors.length];

        const district: District = {
            id,
            name,
            color,
            cells: new Set(),
            specialization: 'none',
            policies: new Set(),
            taxRates: {
                residential: 0,
                commercial: 0,
                industrial: 0,
                office: 0
            },
            stats: {
                population: 0,
                buildings: 0,
                area: 0,
                income: 0,
                expenses: 0,
                happiness: 50,
                landValue: 50
            }
        };

        this.districts.set(id, district);
        return district;
    }

    // Paint cells into a district
    paintDistrict(districtId: string, x: number, z: number): void {
        const district = this.districts.get(districtId);
        if (!district) return;

        const cellKey = `${x},${z}`;
        
        // Remove from previous district
        const prevDistrictId = this.cellToDistrict.get(cellKey);
        if (prevDistrictId) {
            const prevDistrict = this.districts.get(prevDistrictId);
            prevDistrict?.cells.delete(cellKey);
        }

        // Add to new district
        district.cells.add(cellKey);
        this.cellToDistrict.set(cellKey, districtId);
        district.stats.area = district.cells.size;
    }

    // Remove cell from district
    unpaintCell(x: number, z: number): void {
        const cellKey = `${x},${z}`;
        const districtId = this.cellToDistrict.get(cellKey);
        
        if (districtId) {
            const district = this.districts.get(districtId);
            if (district) {
                district.cells.delete(cellKey);
                district.stats.area = district.cells.size;
            }
            this.cellToDistrict.delete(cellKey);
        }
    }

    // Set district specialization
    setSpecialization(districtId: string, specialization: DistrictSpecialization): void {
        const district = this.districts.get(districtId);
        if (district) {
            district.specialization = specialization;
        }
    }

    // Toggle district policy
    togglePolicy(districtId: string, policyId: string): boolean {
        const district = this.districts.get(districtId);
        const policy = this.availablePolicies.get(policyId);
        
        if (!district || !policy) return false;

        if (district.policies.has(policyId)) {
            district.policies.delete(policyId);
            return false;
        } else {
            district.policies.add(policyId);
            return true;
        }
    }

    // Set tax rate for a zone type in a district
    setTaxRate(districtId: string, zoneType: keyof District['taxRates'], rate: number): void {
        const district = this.districts.get(districtId);
        if (!district) return;

        // Clamp rate between -29 and +29
        district.taxRates[zoneType] = Math.max(-29, Math.min(29, rate));
    }

    // Get district at coordinates
    getDistrictAt(x: number, z: number): District | undefined {
        const cellKey = `${x},${z}`;
        const districtId = this.cellToDistrict.get(cellKey);
        return districtId ? this.districts.get(districtId) : undefined;
    }

    // Get all effects for a district (combined from policies)
    getDistrictEffects(districtId: string): DistrictPolicy['effects'] {
        const district = this.districts.get(districtId);
        if (!district) return {};

        const combinedEffects: DistrictPolicy['effects'] = {};

        district.policies.forEach(policyId => {
            const policy = this.availablePolicies.get(policyId);
            if (policy?.effects) {
                Object.entries(policy.effects).forEach(([key, value]) => {
                    const effectKey = key as keyof DistrictPolicy['effects'];
                    combinedEffects[effectKey] = (combinedEffects[effectKey] || 0) + value;
                });
            }
        });

        return combinedEffects;
    }

    // Calculate total monthly cost of all policies in a district
    getDistrictPolicyCost(districtId: string): number {
        const district = this.districts.get(districtId);
        if (!district) return 0;

        let totalCost = 0;
        district.policies.forEach(policyId => {
            const policy = this.availablePolicies.get(policyId);
            if (policy) {
                totalCost += policy.monthlyCost;
            }
        });

        return totalCost;
    }

    // Update district statistics
    updateDistrictStats(districtId: string, stats: Partial<District['stats']>): void {
        const district = this.districts.get(districtId);
        if (!district) return;

        Object.assign(district.stats, stats);
    }

    // Delete a district
    deleteDistrict(districtId: string): void {
        const district = this.districts.get(districtId);
        if (!district) return;

        // Remove all cell mappings
        district.cells.forEach(cellKey => {
            this.cellToDistrict.delete(cellKey);
        });

        this.districts.delete(districtId);
    }

    // Rename district
    renameDistrict(districtId: string, newName: string): void {
        const district = this.districts.get(districtId);
        if (district) {
            district.name = newName;
        }
    }

    // Public getters
    getDistrict(id: string): District | undefined {
        return this.districts.get(id);
    }

    getAllDistricts(): District[] {
        return Array.from(this.districts.values());
    }

    getAvailablePolicies(): DistrictPolicy[] {
        return Array.from(this.availablePolicies.values());
    }

    getPolicy(id: string): DistrictPolicy | undefined {
        return this.availablePolicies.get(id);
    }

    // Calculate total city-wide policy costs
    getTotalPolicyCosts(): number {
        let total = 0;
        this.districts.forEach(district => {
            total += this.getDistrictPolicyCost(district.id);
        });
        return total;
    }
}

export default DistrictSystemV4;
