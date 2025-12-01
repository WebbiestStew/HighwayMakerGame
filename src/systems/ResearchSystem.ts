/**
 * RESEARCH & TECHNOLOGY TREE
 * Unlock advanced features through research investments
 */

export interface Technology {
    id: string
    name: string
    description: string
    category: 'transportation' | 'energy' | 'environment' | 'infrastructure' | 'smart_city'
    cost: number // research points
    time: number // days to complete
    prerequisites: string[] // tech IDs
    unlocks: TechUnlock[]
    researched: boolean
    researchProgress: number // 0-100
}

export interface TechUnlock {
    type: 'building' | 'feature' | 'upgrade' | 'bonus'
    id: string
    description: string
}

export const TECHNOLOGY_TREE: Technology[] = [
    // TRANSPORTATION TIER 1
    {
        id: 'basic_transit',
        name: 'Public Transportation',
        description: 'Unlock bus stops and bus routes',
        category: 'transportation',
        cost: 1000,
        time: 7,
        prerequisites: [],
        unlocks: [
            { type: 'building', id: 'bus_stop', description: 'Bus Stops' },
            { type: 'feature', id: 'bus_routes', description: 'Bus Route Planning' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'metro_system',
        name: 'Metro System',
        description: 'Unlock underground metro stations and lines',
        category: 'transportation',
        cost: 5000,
        time: 30,
        prerequisites: ['basic_transit'],
        unlocks: [
            { type: 'building', id: 'metro_station', description: 'Metro Stations' },
            { type: 'building', id: 'metro_tunnel', description: 'Metro Tunnels' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'high_speed_rail',
        name: 'High-Speed Rail',
        description: 'Unlock bullet trains and rail network',
        category: 'transportation',
        cost: 10000,
        time: 60,
        prerequisites: ['metro_system'],
        unlocks: [
            { type: 'building', id: 'train_station', description: 'Train Stations' },
            { type: 'upgrade', id: 'rail_speed_boost', description: '+50% rail speed' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'hyperloop',
        name: 'Hyperloop Technology',
        description: 'Ultra-fast vacuum tube transportation',
        category: 'transportation',
        cost: 50000,
        time: 180,
        prerequisites: ['high_speed_rail'],
        unlocks: [
            { type: 'building', id: 'hyperloop_station', description: 'Hyperloop Stations' },
            { type: 'feature', id: 'intercity_travel', description: 'Instant city connections' }
        ],
        researched: false,
        researchProgress: 0
    },
    
    // ENERGY TIER 1
    {
        id: 'solar_power',
        name: 'Solar Power',
        description: 'Unlock solar panels and solar farms',
        category: 'energy',
        cost: 2000,
        time: 14,
        prerequisites: [],
        unlocks: [
            { type: 'building', id: 'solar_farm', description: 'Solar Power Plants' },
            { type: 'bonus', id: 'solar_efficiency', description: '-20% pollution' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'wind_power',
        name: 'Wind Power',
        description: 'Unlock wind turbines',
        category: 'energy',
        cost: 2500,
        time: 14,
        prerequisites: [],
        unlocks: [
            { type: 'building', id: 'wind_turbine', description: 'Wind Turbines' },
            { type: 'bonus', id: 'wind_efficiency', description: '-25% pollution' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'fusion_power',
        name: 'Nuclear Fusion',
        description: 'Clean unlimited energy',
        category: 'energy',
        cost: 30000,
        time: 120,
        prerequisites: ['solar_power', 'wind_power'],
        unlocks: [
            { type: 'building', id: 'fusion_reactor', description: 'Fusion Power Plants' },
            { type: 'bonus', id: 'unlimited_power', description: '+1000MW, 0% pollution' }
        ],
        researched: false,
        researchProgress: 0
    },
    
    // SMART CITY TIER 1
    {
        id: 'smart_traffic',
        name: 'Smart Traffic Management',
        description: 'AI-controlled traffic lights and flow optimization',
        category: 'smart_city',
        cost: 3000,
        time: 21,
        prerequisites: [],
        unlocks: [
            { type: 'feature', id: 'adaptive_lights', description: 'Adaptive Traffic Lights' },
            { type: 'upgrade', id: 'traffic_efficiency', description: '+25% traffic flow' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'iot_sensors',
        name: 'IoT Sensor Network',
        description: 'City-wide data collection and analysis',
        category: 'smart_city',
        cost: 5000,
        time: 30,
        prerequisites: ['smart_traffic'],
        unlocks: [
            { type: 'feature', id: 'real_time_data', description: 'Real-time city analytics' },
            { type: 'feature', id: 'predictive_maintenance', description: 'Auto-detect issues' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'ai_governance',
        name: 'AI City Management',
        description: 'Automated city optimization',
        category: 'smart_city',
        cost: 20000,
        time: 90,
        prerequisites: ['iot_sensors'],
        unlocks: [
            { type: 'feature', id: 'auto_optimize', description: 'AI auto-manages resources' },
            { type: 'bonus', id: 'efficiency_boost', description: '+30% all efficiency' }
        ],
        researched: false,
        researchProgress: 0
    },
    
    // ENVIRONMENT TIER 1
    {
        id: 'recycling',
        name: 'Advanced Recycling',
        description: 'Reduce waste through recycling programs',
        category: 'environment',
        cost: 1500,
        time: 10,
        prerequisites: [],
        unlocks: [
            { type: 'building', id: 'recycling_center', description: 'Recycling Centers' },
            { type: 'bonus', id: 'waste_reduction', description: '-40% waste' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'green_buildings',
        name: 'Green Building Standards',
        description: 'Eco-friendly construction',
        category: 'environment',
        cost: 3000,
        time: 20,
        prerequisites: ['recycling'],
        unlocks: [
            { type: 'upgrade', id: 'eco_buildings', description: 'New buildings -30% pollution' },
            { type: 'bonus', id: 'citizen_happiness', description: '+10 happiness' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'carbon_neutral',
        name: 'Carbon Neutrality',
        description: 'Zero emissions city',
        category: 'environment',
        cost: 25000,
        time: 100,
        prerequisites: ['green_buildings', 'fusion_power'],
        unlocks: [
            { type: 'feature', id: 'zero_emissions', description: 'Pollution set to 0%' },
            { type: 'bonus', id: 'eco_tourism', description: '+50% tourist income' }
        ],
        researched: false,
        researchProgress: 0
    },
    
    // INFRASTRUCTURE TIER 1
    {
        id: 'elevated_roads',
        name: 'Elevated Highway System',
        description: 'Build roads above ground level',
        category: 'infrastructure',
        cost: 4000,
        time: 25,
        prerequisites: [],
        unlocks: [
            { type: 'building', id: 'elevated_highway', description: 'Elevated Roads' },
            { type: 'feature', id: 'multi_level', description: 'Multi-level construction' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'underground_expansion',
        name: 'Underground Infrastructure',
        description: 'Build beneath the surface',
        category: 'infrastructure',
        cost: 6000,
        time: 35,
        prerequisites: ['elevated_roads'],
        unlocks: [
            { type: 'building', id: 'tunnel', description: 'Tunnels & Underground Roads' },
            { type: 'feature', id: 'underground_layer', description: 'Underground building layer' }
        ],
        researched: false,
        researchProgress: 0
    },
    {
        id: 'megastructures',
        name: 'Megastructures',
        description: 'Massive landmark projects',
        category: 'infrastructure',
        cost: 40000,
        time: 150,
        prerequisites: ['underground_expansion'],
        unlocks: [
            { type: 'building', id: 'space_elevator', description: 'Space Elevator' },
            { type: 'building', id: 'arcology', description: 'Self-contained arcologies' },
            { type: 'bonus', id: 'prestige', description: '+100% tourism' }
        ],
        researched: false,
        researchProgress: 0
    }
]

export class ResearchManager {
    private technologies: Map<string, Technology> = new Map()
    private researchPoints: number = 0
    private activeResearch: Technology | null = null
    
    constructor() {
        // Initialize tech tree
        TECHNOLOGY_TREE.forEach(tech => {
            this.technologies.set(tech.id, { ...tech })
        })
    }
    
    // Earn research points from education, population, etc
    addResearchPoints(points: number) {
        this.researchPoints += points
    }
    
    // Start researching a technology
    startResearch(techId: string): { success: boolean, message: string } {
        const tech = this.technologies.get(techId)
        if (!tech) {
            return { success: false, message: 'Technology not found' }
        }
        
        if (tech.researched) {
            return { success: false, message: 'Already researched' }
        }
        
        // Check prerequisites
        for (const prereqId of tech.prerequisites) {
            const prereq = this.technologies.get(prereqId)
            if (!prereq || !prereq.researched) {
                return { success: false, message: `Requires: ${prereq?.name || prereqId}` }
            }
        }
        
        if (this.researchPoints < tech.cost) {
            return { success: false, message: `Need ${tech.cost} research points (have ${this.researchPoints})` }
        }
        
        if (this.activeResearch) {
            return { success: false, message: 'Already researching something' }
        }
        
        // Start research
        this.researchPoints -= tech.cost
        this.activeResearch = tech
        tech.researchProgress = 0
        
        return { success: true, message: `Started researching ${tech.name}` }
    }
    
    // Update research progress (call daily)
    updateDaily() {
        if (this.activeResearch) {
            const progressPerDay = 100 / this.activeResearch.time
            this.activeResearch.researchProgress += progressPerDay
            
            if (this.activeResearch.researchProgress >= 100) {
                this.completeResearch(this.activeResearch.id)
            }
        }
    }
    
    private completeResearch(techId: string) {
        const tech = this.technologies.get(techId)
        if (tech) {
            tech.researched = true
            tech.researchProgress = 100
            this.activeResearch = null
        }
    }
    
    isUnlocked(techId: string): boolean {
        const tech = this.technologies.get(techId)
        return tech ? tech.researched : false
    }
    
    canResearch(techId: string): boolean {
        const tech = this.technologies.get(techId)
        if (!tech || tech.researched) return false
        
        for (const prereqId of tech.prerequisites) {
            if (!this.isUnlocked(prereqId)) return false
        }
        
        return true
    }
    
    getAvailableTechnologies(): Technology[] {
        return Array.from(this.technologies.values()).filter(tech => 
            !tech.researched && this.canResearch(tech.id)
        )
    }
    
    getResearchedTechnologies(): Technology[] {
        return Array.from(this.technologies.values()).filter(tech => tech.researched)
    }
    
    getTechnologyTree(): Technology[] {
        return Array.from(this.technologies.values())
    }
    
    getActiveResearch(): Technology | null {
        return this.activeResearch
    }
    
    getResearchPoints(): number {
        return this.researchPoints
    }
}

export const researchManager = new ResearchManager()
