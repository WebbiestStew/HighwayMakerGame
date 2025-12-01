/**
 * City Policies and Laws System
 * Speed limits, tolls, zoning regulations, environmental policies
 */

export type PolicyType = 
    | 'speed_enforcement' 
    | 'toll_pricing' 
    | 'zoning_laws'
    | 'environmental_protection'
    | 'public_transport_subsidy'
    | 'parking_restrictions'
    | 'carpool_lanes'
    | 'emission_standards'

export interface CityPolicy {
    id: string
    type: PolicyType
    name: string
    description: string
    active: boolean
    implementationCost: number
    monthlyCost: number
    effects: PolicyEffects
    publicSupport: number // 0-100
}

export interface PolicyEffects {
    trafficSpeedModifier?: number
    tollRevenueModifier?: number
    constructionCostModifier?: number
    pollutionReduction?: number
    publicTransportUsage?: number
    trafficCongestion?: number
    citizenHappiness?: number
    monthlyRevenue?: number
}

export const AVAILABLE_POLICIES: Record<PolicyType, CityPolicy> = {
    speed_enforcement: {
        id: 'speed_enforcement',
        type: 'speed_enforcement',
        name: 'Traffic Speed Enforcement',
        description: 'Deploy speed cameras to enforce speed limits and improve safety.',
        active: false,
        implementationCost: 100000,
        monthlyCost: 5000,
        effects: {
            trafficSpeedModifier: 0.9,
            citizenHappiness: -5,
            monthlyRevenue: 15000 // Ticket revenue
        },
        publicSupport: 45
    },
    toll_pricing: {
        id: 'toll_pricing',
        type: 'toll_pricing',
        name: 'Dynamic Toll Pricing',
        description: 'Implement variable toll prices based on traffic congestion.',
        active: false,
        implementationCost: 200000,
        monthlyCost: 10000,
        effects: {
            tollRevenueModifier: 1.5,
            trafficCongestion: -0.2,
            citizenHappiness: -10
        },
        publicSupport: 35
    },
    zoning_laws: {
        id: 'zoning_laws',
        type: 'zoning_laws',
        name: 'Strict Zoning Laws',
        description: 'Enforce stricter building regulations for better urban planning.',
        active: false,
        implementationCost: 50000,
        monthlyCost: 2000,
        effects: {
            constructionCostModifier: 1.2,
            citizenHappiness: 10,
            pollutionReduction: 0.1
        },
        publicSupport: 60
    },
    environmental_protection: {
        id: 'environmental_protection',
        type: 'environmental_protection',
        name: 'Environmental Protection Act',
        description: 'Reduce pollution and protect green spaces.',
        active: false,
        implementationCost: 150000,
        monthlyCost: 20000,
        effects: {
            pollutionReduction: 0.3,
            citizenHappiness: 15,
            constructionCostModifier: 1.3
        },
        publicSupport: 75
    },
    public_transport_subsidy: {
        id: 'public_transport_subsidy',
        type: 'public_transport_subsidy',
        name: 'Public Transport Subsidy',
        description: 'Subsidize public transport to increase usage and reduce traffic.',
        active: false,
        implementationCost: 100000,
        monthlyCost: 30000,
        effects: {
            publicTransportUsage: 0.4,
            trafficCongestion: -0.3,
            citizenHappiness: 20
        },
        publicSupport: 80
    },
    parking_restrictions: {
        id: 'parking_restrictions',
        type: 'parking_restrictions',
        name: 'Downtown Parking Restrictions',
        description: 'Limit parking in commercial zones to reduce congestion.',
        active: false,
        implementationCost: 25000,
        monthlyCost: 5000,
        effects: {
            trafficCongestion: -0.15,
            citizenHappiness: -5,
            monthlyRevenue: 8000 // Parking fines
        },
        publicSupport: 40
    },
    carpool_lanes: {
        id: 'carpool_lanes',
        type: 'carpool_lanes',
        name: 'Carpool/HOV Lanes',
        description: 'Designate lanes for high-occupancy vehicles to reduce congestion.',
        active: false,
        implementationCost: 80000,
        monthlyCost: 3000,
        effects: {
            trafficCongestion: -0.25,
            citizenHappiness: 5,
            pollutionReduction: 0.15
        },
        publicSupport: 65
    },
    emission_standards: {
        id: 'emission_standards',
        type: 'emission_standards',
        name: 'Strict Emission Standards',
        description: 'Require vehicles to meet strict emission standards.',
        active: false,
        implementationCost: 120000,
        monthlyCost: 8000,
        effects: {
            pollutionReduction: 0.4,
            citizenHappiness: 12,
            trafficSpeedModifier: 0.95
        },
        publicSupport: 70
    }
}

export class PolicySystem {
    private activePolicies: Map<string, CityPolicy> = new Map()
    private policyHistory: Array<{ policy: CityPolicy; timestamp: number; action: 'enacted' | 'repealed' }> = []

    enactPolicy(policyType: PolicyType, funds: number): { success: boolean; message: string } {
        const policy = { ...AVAILABLE_POLICIES[policyType] }
        
        if (this.activePolicies.has(policy.id)) {
            return { success: false, message: 'Policy already active' }
        }

        if (funds < policy.implementationCost) {
            return { success: false, message: 'Insufficient funds' }
        }

        if (policy.publicSupport < 30) {
            return { success: false, message: 'Public support too low' }
        }

        policy.active = true
        this.activePolicies.set(policy.id, policy)
        this.policyHistory.push({ 
            policy, 
            timestamp: Date.now(), 
            action: 'enacted' 
        })

        return { 
            success: true, 
            message: `${policy.name} has been enacted` 
        }
    }

    repealPolicy(policyId: string): { success: boolean; message: string } {
        const policy = this.activePolicies.get(policyId)
        
        if (!policy) {
            return { success: false, message: 'Policy not found' }
        }

        policy.active = false
        this.activePolicies.delete(policyId)
        this.policyHistory.push({ 
            policy, 
            timestamp: Date.now(), 
            action: 'repealed' 
        })

        return { 
            success: true, 
            message: `${policy.name} has been repealed` 
        }
    }

    getAggregatedEffects(): PolicyEffects {
        const effects: PolicyEffects = {
            trafficSpeedModifier: 1,
            tollRevenueModifier: 1,
            constructionCostModifier: 1,
            pollutionReduction: 0,
            publicTransportUsage: 0,
            trafficCongestion: 0,
            citizenHappiness: 0,
            monthlyRevenue: 0
        }

        for (const policy of this.activePolicies.values()) {
            if (policy.effects.trafficSpeedModifier) {
                effects.trafficSpeedModifier! *= policy.effects.trafficSpeedModifier
            }
            if (policy.effects.tollRevenueModifier) {
                effects.tollRevenueModifier! *= policy.effects.tollRevenueModifier
            }
            if (policy.effects.constructionCostModifier) {
                effects.constructionCostModifier! *= policy.effects.constructionCostModifier
            }
            if (policy.effects.pollutionReduction) {
                effects.pollutionReduction! += policy.effects.pollutionReduction
            }
            if (policy.effects.publicTransportUsage) {
                effects.publicTransportUsage! += policy.effects.publicTransportUsage
            }
            if (policy.effects.trafficCongestion) {
                effects.trafficCongestion! += policy.effects.trafficCongestion
            }
            if (policy.effects.citizenHappiness) {
                effects.citizenHappiness! += policy.effects.citizenHappiness
            }
            if (policy.effects.monthlyRevenue) {
                effects.monthlyRevenue! += policy.effects.monthlyRevenue
            }
        }

        return effects
    }

    getTotalMonthlyCost(): number {
        return Array.from(this.activePolicies.values())
            .reduce((sum, policy) => sum + policy.monthlyCost, 0)
    }

    getActivePolicies(): CityPolicy[] {
        return Array.from(this.activePolicies.values())
    }

    getAvailablePolicies(): CityPolicy[] {
        return Object.values(AVAILABLE_POLICIES)
            .filter(policy => !this.activePolicies.has(policy.id))
    }

    updatePublicSupport(policyId: string, change: number) {
        const policy = this.activePolicies.get(policyId)
        if (policy) {
            policy.publicSupport = Math.max(0, Math.min(100, policy.publicSupport + change))
            
            // Auto-repeal if support drops too low
            if (policy.publicSupport < 20) {
                this.repealPolicy(policyId)
            }
        }
    }

    getPolicyStats() {
        return {
            activePolicies: this.activePolicies.size,
            totalMonthlyCost: this.getTotalMonthlyCost(),
            averagePublicSupport: Array.from(this.activePolicies.values())
                .reduce((sum, p) => sum + p.publicSupport, 0) / this.activePolicies.size || 0,
            effects: this.getAggregatedEffects()
        }
    }
}

export const policySystem = new PolicySystem()
