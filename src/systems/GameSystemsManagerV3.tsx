import React, { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { WeatherSystemV3 } from '../systems/WeatherSystemV3'
import { EconomySystemV3 } from '../systems/EconomySystemV3'
import { CareerModeV3 } from '../systems/CareerModeV3'
import { TrafficAIV3 } from '../systems/TrafficAIV3'
import { useGameStore } from '../store/gameStore'

/**
 * GameSystemsManagerV3
 * Central hub that coordinates all V3 systems and updates them each frame
 * This ensures all new features work together seamlessly
 */
export const GameSystemsManagerV3: React.FC = () => {
    const { 
        roadNodes, 
        roadConnections, 
        buildings, 
        zones,
        addFunds
    } = useGameStore()

    const weatherSystem = WeatherSystemV3.getInstance()
    const economySystem = EconomySystemV3.getInstance()
    const careerMode = CareerModeV3.getInstance()
    const trafficAI = TrafficAIV3.getInstance()

    // Initialize systems
    useEffect(() => {
        console.log('🎮 Highway Maker 3.0 Systems Initialized!')
        console.log('✨ New Features:')
        console.log('  - Dynamic Weather System')
        console.log('  - Advanced Traffic AI with Emergencies')
        console.log('  - Budget & Economy Management')
        console.log('  - Career Mode with 10 Campaign Levels')
        console.log('  - Enhanced Vehicle Graphics')
        console.log('  - Advanced Visual Effects')
    }, [])

    // Update all systems each frame
    useFrame((_, delta) => {
        // Update weather
        weatherSystem.update(delta)
        
        // Update economy (1x game speed)
        economySystem.update(delta, 1)
        
        // Calculate income based on city state
        economySystem.calculateIncome({
            residential: zones.filter(z => z.type === 'residential').length,
            commercial: zones.filter(z => z.type === 'commercial').length,
            industrial: zones.filter(z => z.type === 'industrial').length,
            population: buildings.length * 50, // Estimate population
            tourism: buildings.length * 10 // All buildings contribute to tourism
        })
        
        // Calculate expenses
        economySystem.calculateExpenses({
            roadLength: roadConnections.length * 10, // Simplified: 10 units per connection
            services: buildings.length, // All buildings are services
            publicTransport: 0, // TODO: Add when transit system implemented
            emergencyVehicles: trafficAI.getEmergencyVehicles().length
        })
        
        // Update traffic AI
        trafficAI.update(delta)
        
        // Sync budget with game store (every second) - for future integration
        // if (Math.floor(state.clock.elapsedTime) % 1 === 0) {
        //     const budget = economySystem.getBudget()
        //     // Budget syncing can be added here when store methods are available
        // }
    })

    // Check for mission completion
    useEffect(() => {
        const currentMission = careerMode.getCurrentMission()
        if (!currentMission) return

        // Update road building objectives
        const roadObjective = currentMission.objectives.find(obj => 
            obj.type === 'build' && obj.description.toLowerCase().includes('road')
        )
        if (roadObjective) {
            careerMode.updateObjective(currentMission.id, roadObjective.id, roadConnections.length)
        }

        // Update intersection objectives
        const intersectionObjective = currentMission.objectives.find(obj => 
            obj.description.toLowerCase().includes('intersection')
        )
        if (intersectionObjective) {
            const intersectionCount = roadNodes.filter(node => node.connectedNodes.length >= 3).length
            careerMode.updateObjective(currentMission.id, intersectionObjective.id, intersectionCount)
        }

        // Update zone objectives
        const zoneObjectives = currentMission.objectives.filter(obj => 
            obj.description.toLowerCase().includes('zone')
        )
        zoneObjectives.forEach(obj => {
            if (obj.description.toLowerCase().includes('residential')) {
                const count = zones.filter(z => z.type === 'residential').length
                careerMode.updateObjective(currentMission.id, obj.id, count)
            } else if (obj.description.toLowerCase().includes('commercial')) {
                const count = zones.filter(z => z.type === 'commercial').length
                careerMode.updateObjective(currentMission.id, obj.id, count)
            } else if (obj.description.toLowerCase().includes('industrial')) {
                const count = zones.filter(z => z.type === 'industrial').length
                careerMode.updateObjective(currentMission.id, obj.id, count)
            }
        })

        // Check if mission is complete
        const allCompleted = currentMission.objectives.every(obj => obj.completed)
        if (allCompleted && !currentMission.completed) {
            const success = careerMode.completeMission(currentMission.id)
            if (success) {
                console.log('🎉 Mission Complete!', currentMission.title)
                addFunds(currentMission.rewards.money)
                // TODO: Show completion UI
            }
        }
    }, [roadConnections.length, roadNodes.length, zones.length, buildings.length])

    // Render nothing - this is just a systems manager
    return null
}

/**
 * Weather Integration Hook
 * Use this in your components to get current weather state
 */
export const useWeather = () => {
    const weatherSystem = WeatherSystemV3.getInstance()
    const [weather, setWeather] = React.useState(weatherSystem.getWeather())
    
    useFrame(() => {
        setWeather(weatherSystem.getWeather())
    })
    
    return weather
}

/**
 * Economy Integration Hook
 * Use this to check if player can afford something
 */
export const useEconomy = () => {
    const economySystem = EconomySystemV3.getInstance()
    
    return {
        canAfford: (cost: number) => economySystem.canAfford(cost),
        spend: (cost: number, category: any) => economySystem.spend(cost, category),
        takeLoan: (amount: number, months: number) => economySystem.takeLoan(amount, months),
        getBalance: () => economySystem.getBalance(),
        getBudget: () => economySystem.getBudget()
    }
}

/**
 * Career Integration Hook
 * Use this to check unlocks and mission progress
 */
export const useCareer = () => {
    const careerMode = CareerModeV3.getInstance()
    
    return {
        isUnlocked: (feature: string) => careerMode.isFeatureUnlocked(feature),
        getCurrentMission: () => careerMode.getCurrentMission(),
        getProgress: () => careerMode.getProgress(),
        getMissions: () => careerMode.getMissions()
    }
}

/**
 * Traffic AI Integration Hook
 * Use this to get current traffic incidents
 */
export const useTrafficAI = () => {
    const trafficAI = TrafficAIV3.getInstance()
    const [state, setState] = React.useState({
        accidents: trafficAI.getAccidents(),
        emergencyVehicles: trafficAI.getEmergencyVehicles(),
        jams: trafficAI.getTrafficJams()
    })
    
    useFrame(() => {
        setState({
            accidents: trafficAI.getAccidents(),
            emergencyVehicles: trafficAI.getEmergencyVehicles(),
            jams: trafficAI.getTrafficJams()
        })
    })
    
    return state
}
