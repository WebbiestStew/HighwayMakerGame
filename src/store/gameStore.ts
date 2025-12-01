import { create } from 'zustand'
import { MISSIONS } from '../systems/MissionSystem'
import { ACHIEVEMENTS, AchievementManager } from '../systems/AchievementSystem'
import { SeasonalEventManager } from '../systems/SeasonalEvents'
import type { Mission } from '../systems/MissionSystem'
import type { Achievement } from '../systems/AchievementSystem'
import type { SeasonalEvent } from '../systems/SeasonalEvents'
import type { BuildingType } from '../types/BuildingTypes'

interface GameState {
    mode: 'build' | 'play'
    setMode: (mode: 'build' | 'play') => void
    funds: number
    addFunds: (amount: number) => void
    removeFunds: (amount: number) => void
    roads: Array<{ id: string, start: [number, number, number], end: [number, number, number], controlPoint?: [number, number, number], cost?: number }>
    addRoad: (road: { id: string, start: [number, number, number], end: [number, number, number], controlPoint?: [number, number, number] }) => void
    removeRoad: (id: string) => void
    isCurveMode: boolean
    setCurveMode: (isCurve: boolean) => void
    zones: Array<{ id: string, type: 'residential' | 'commercial' | 'industrial', position: [number, number, number], size: [number, number, number] }>
    addZone: (zone: { id: string, type: 'residential' | 'commercial' | 'industrial', position: [number, number, number], size: [number, number, number] }) => void
    removeZone: (id: string) => void
    buildings: Array<{ id: string, type: BuildingType, position: [number, number, number], rotation: [number, number, number] }>
    addBuilding: (building: { id: string, type: BuildingType, position: [number, number, number], rotation: [number, number, number] }) => void
    removeBuilding: (id: string) => void
    selectedZoneType: 'residential' | 'commercial' | 'industrial'
    setSelectedZoneType: (type: 'residential' | 'commercial' | 'industrial') => void
    selectedTool: 'select' | 'road' | 'demolish' | 'zone' | 'sign'
    setSelectedTool: (tool: 'select' | 'road' | 'demolish' | 'zone' | 'sign') => void
    showHeatmap: boolean
    setShowHeatmap: (show: boolean) => void
    showNoisePollution: boolean
    setShowNoisePollution: (show: boolean) => void
    trafficDensity: Map<string, number>
    setTrafficDensity: (density: Map<string, number>) => void
    signs: Array<{ id: string, position: [number, number, number], text: string, type: 'exit' | 'warning' | 'info' | 'speed' | 'distance' }>
    addSign: (sign: { id: string, position: [number, number, number], text: string, type: 'exit' | 'warning' | 'info' | 'speed' | 'distance' }) => void
    removeSign: (id: string) => void
    selectedSignType: 'exit' | 'warning' | 'info' | 'speed' | 'distance'
    setSelectedSignType: (type: 'exit' | 'warning' | 'info' | 'speed' | 'distance') => void
    gameState: 'menu' | 'playing'
    setGameState: (state: 'menu' | 'playing') => void
    // Missions & Achievements
    missions: Mission[]
    setMissions: (missions: Mission[]) => void
    completeMission: (missionId: string) => void
    achievements: Achievement[]
    setAchievements: (achievements: Achievement[]) => void
    unlockAchievement: (achievementId: string) => void
    // Economy
    monthlyIncome: number
    monthlyExpenses: number
    setEconomy: (income: number, expenses: number) => void
    // Stats
    activeVehicles: number
    setActiveVehicles: (count: number) => void
    roadEfficiency: number
    setRoadEfficiency: (efficiency: number) => void
    trafficFlow: number
    setTrafficFlow: (flow: number) => void
    netIncome: number
    setNetIncome: (income: number) => void
    // Seasonal Events
    currentEvent: SeasonalEvent | null
    checkCurrentEvent: () => void
    // Time of Day
    timeOfDay: 'day' | 'night'
    setTimeOfDay: (time: 'day' | 'night') => void
    // Time
    gameDate: { month: number, year: number }
    advanceMonth: () => void
}

export const useGameStore = create<GameState>((set) => ({
    mode: 'build',
    setMode: (mode) => set({ mode }),
    funds: 1000000,
    addFunds: (amount) => set((state) => ({ funds: state.funds + amount })),
    removeFunds: (amount) => set((state) => ({ funds: state.funds - amount })),
    roads: [],
    addRoad: (road) => set((state) => {
        const cost = 50000 // Base cost per road
        if (state.funds >= cost) {
            return { roads: [...state.roads, { ...road, cost }], funds: state.funds - cost }
        }
        return state
    }),
    removeRoad: (id) => set((state) => {
        const road = state.roads.find(r => r.id === id)
        const refund = road?.cost ? road.cost * 0.5 : 0
        return {
            roads: state.roads.filter(r => r.id !== id),
            funds: state.funds + refund
        }
    }),
    selectedTool: 'select',
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    isCurveMode: false,
    setCurveMode: (isCurve) => set({ isCurveMode: isCurve }),
    zones: [],
    addZone: (zone) => set((state) => {
        const cost = 25000
        if (state.funds >= cost) {
            return { zones: [...state.zones, zone], funds: state.funds - cost }
        }
        return state
    }),
    removeZone: (id) => set((state) => ({
        zones: state.zones.filter(z => z.id !== id),
        funds: state.funds + 12500
    })),
    buildings: [],
    addBuilding: (building) => set((state) => ({ buildings: [...state.buildings, building] })),
    removeBuilding: (id) => set((state) => ({
        buildings: state.buildings.filter(b => b.id !== id)
    })),
    selectedZoneType: 'residential',
    setSelectedZoneType: (type) => set({ selectedZoneType: type }),
    showHeatmap: false,
    setShowHeatmap: (show) => set({ showHeatmap: show }),
    showNoisePollution: false,
    setShowNoisePollution: (show) => set({ showNoisePollution: show }),
    trafficDensity: new Map(),
    setTrafficDensity: (density) => set({ trafficDensity: density }),
    signs: [],
    addSign: (sign) => set((state) => {
        const cost = 5000
        if (state.funds >= cost) {
            return { signs: [...state.signs, sign], funds: state.funds - cost }
        }
        return state
    }),
    removeSign: (id) => set((state) => ({
        signs: state.signs.filter(s => s.id !== id),
        funds: state.funds + 2500
    })),
    selectedSignType: 'exit',
    setSelectedSignType: (type) => set({ selectedSignType: type }),
    gameState: 'menu',
    setGameState: (state) => set({ gameState: state }),
    // Missions & Achievements
    missions: MISSIONS,
    setMissions: (missions) => set({ missions }),
    completeMission: (missionId) => set((state) => {
        const mission = state.missions.find(m => m.id === missionId)
        if (mission && !mission.completed) {
            const updatedMissions = state.missions.map(m =>
                m.id === missionId ? { ...m, completed: true } : m
            )
            
            // Award mission rewards
            const newFunds = state.funds + mission.rewards.funds
            
            // Unlock achievement if any
            let updatedAchievements = state.achievements
            if (mission.rewards.achievement) {
                updatedAchievements = AchievementManager.unlockAchievement(
                    state.achievements,
                    mission.rewards.achievement.toLowerCase().replace(/\s+/g, '_')
                )
            }
            
            return {
                missions: updatedMissions,
                funds: newFunds,
                achievements: updatedAchievements
            }
        }
        return state
    }),
    achievements: ACHIEVEMENTS,
    setAchievements: (achievements) => set({ achievements }),
    unlockAchievement: (achievementId) => set((state) => ({
        achievements: AchievementManager.unlockAchievement(state.achievements, achievementId)
    })),
    // Economy
    monthlyIncome: 0,
    monthlyExpenses: 0,
    setEconomy: (income, expenses) => set({ monthlyIncome: income, monthlyExpenses: expenses }),
    // Stats
    activeVehicles: 0,
    setActiveVehicles: (count) => set({ activeVehicles: count }),
    roadEfficiency: 0,
    setRoadEfficiency: (efficiency) => set({ roadEfficiency: efficiency }),
    trafficFlow: 0,
    setTrafficFlow: (flow) => set({ trafficFlow: flow }),
    netIncome: 0,
    setNetIncome: (income) => set({ netIncome: income }),
    // Seasonal Events
    currentEvent: null,
    checkCurrentEvent: () => set((state) => {
        const event = SeasonalEventManager.getCurrentEvent(state.gameDate.month, new Date().getDate())
        return { currentEvent: event }
    }),
    // Time of Day
    timeOfDay: 'day',
    setTimeOfDay: (time) => set({ timeOfDay: time }),
    // Time
    gameDate: { month: 1, year: 2024 },
    advanceMonth: () => set((state) => {
        const newMonth = state.gameDate.month + 1
        const newYear = newMonth > 12 ? state.gameDate.year + 1 : state.gameDate.year
        const actualMonth = newMonth > 12 ? 1 : newMonth
        
        // Apply monthly income/expenses
        const netChange = state.monthlyIncome - state.monthlyExpenses
        
        // Check for new seasonal event
        const event = SeasonalEventManager.getCurrentEvent(actualMonth, 1)
        
        return {
            gameDate: { month: actualMonth, year: newYear },
            funds: state.funds + netChange,
            currentEvent: event
        }
    }),
}))
