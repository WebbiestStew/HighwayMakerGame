/**
 * Seasonal Events System
 * Handles holiday events, special missions, and themed content
 */

export interface SeasonalEvent {
    id: string
    name: string
    startDate: { month: number; day: number }
    endDate: { month: number; day: number }
    theme: 'christmas' | 'halloween' | 'summer' | 'newyear' | 'spring' | 'winter'
    bonuses: {
        incomeMultiplier?: number
        constructionDiscount?: number
        specialMission?: string
    }
    description: string
    icon: string
}

export const SEASONAL_EVENTS: SeasonalEvent[] = [
    {
        id: 'christmas',
        name: 'Winter Wonderland',
        startDate: { month: 12, day: 15 },
        endDate: { month: 12, day: 31 },
        theme: 'christmas',
        bonuses: {
            incomeMultiplier: 1.5,
            specialMission: 'santa_delivery'
        },
        description: 'Build holiday infrastructure! 50% bonus income from commercial zones.',
        icon: '🎄'
    },
    {
        id: 'newyear',
        name: 'New Year Celebration',
        startDate: { month: 1, day: 1 },
        endDate: { month: 1, day: 7 },
        theme: 'newyear',
        bonuses: {
            incomeMultiplier: 1.3,
            constructionDiscount: 0.25
        },
        description: 'New year, new roads! 25% off all construction costs.',
        icon: '🎉'
    },
    {
        id: 'valentine',
        name: "Valentine's Highway",
        startDate: { month: 2, day: 10 },
        endDate: { month: 2, day: 14 },
        theme: 'spring',
        bonuses: {
            incomeMultiplier: 1.2,
            specialMission: 'love_connection'
        },
        description: 'Connect residential zones for bonus romance! 20% income boost.',
        icon: '💝'
    },
    {
        id: 'easter',
        name: 'Spring Construction',
        startDate: { month: 3, day: 20 },
        endDate: { month: 4, day: 10 },
        theme: 'spring',
        bonuses: {
            constructionDiscount: 0.3,
            specialMission: 'spring_renewal'
        },
        description: 'Spring renewal! 30% off all construction.',
        icon: '🌷'
    },
    {
        id: 'summer',
        name: 'Summer Road Trip',
        startDate: { month: 6, day: 1 },
        endDate: { month: 8, day: 31 },
        theme: 'summer',
        bonuses: {
            incomeMultiplier: 1.4,
            specialMission: 'beach_highway'
        },
        description: 'Tourist season! 40% income boost from all zones.',
        icon: '🏖️'
    },
    {
        id: 'halloween',
        name: 'Spooky Streets',
        startDate: { month: 10, day: 25 },
        endDate: { month: 10, day: 31 },
        theme: 'halloween',
        bonuses: {
            incomeMultiplier: 1.3,
            specialMission: 'haunted_highway'
        },
        description: 'Haunted highways bring curious tourists! 30% income boost.',
        icon: '🎃'
    },
    {
        id: 'thanksgiving',
        name: 'Harvest Highway',
        startDate: { month: 11, day: 20 },
        endDate: { month: 11, day: 28 },
        theme: 'winter',
        bonuses: {
            incomeMultiplier: 1.25,
            specialMission: 'harvest_transport'
        },
        description: 'Transport the harvest! 25% income boost from industrial zones.',
        icon: '🦃'
    }
]

export const SPECIAL_MISSIONS = {
    santa_delivery: {
        id: 'santa_delivery',
        title: '🎅 Santa\'s Delivery Route',
        description: 'Build 10 roads and 5 residential zones to help Santa deliver presents!',
        objectives: [
            { type: 'roads', target: 10, reward: 100000 },
            { type: 'residential', target: 5, reward: 50000 }
        ],
        totalReward: 150000
    },
    love_connection: {
        id: 'love_connection',
        title: '💑 Love Connection',
        description: 'Connect 3 residential zones with efficient roads.',
        objectives: [
            { type: 'residential', target: 3, reward: 75000 }
        ],
        totalReward: 75000
    },
    spring_renewal: {
        id: 'spring_renewal',
        title: '🌸 Spring Renewal',
        description: 'Build 15 roads and beautify the city!',
        objectives: [
            { type: 'roads', target: 15, reward: 100000 }
        ],
        totalReward: 100000
    },
    beach_highway: {
        id: 'beach_highway',
        title: '🌊 Beach Highway',
        description: 'Build a coastal highway system with 20 roads!',
        objectives: [
            { type: 'roads', target: 20, reward: 200000 }
        ],
        totalReward: 200000
    },
    haunted_highway: {
        id: 'haunted_highway',
        title: '👻 Haunted Highway',
        description: 'Build spooky roads through the city - 13 roads for good luck!',
        objectives: [
            { type: 'roads', target: 13, reward: 130000 }
        ],
        totalReward: 130000
    },
    harvest_transport: {
        id: 'harvest_transport',
        title: '🌾 Harvest Transport',
        description: 'Build roads to transport harvest from 5 industrial zones.',
        objectives: [
            { type: 'industrial', target: 5, reward: 100000 }
        ],
        totalReward: 100000
    }
}

export class SeasonalEventManager {
    static getCurrentEvent(month: number, day: number): SeasonalEvent | null {
        return SEASONAL_EVENTS.find(event => {
            const startMonth = event.startDate.month
            const endMonth = event.endDate.month
            
            // Handle events spanning year boundary
            if (startMonth > endMonth) {
                return (month >= startMonth || month <= endMonth) &&
                       ((month === startMonth && day >= event.startDate.day) ||
                        (month === endMonth && day <= event.endDate.day) ||
                        (month > startMonth && month < 12) ||
                        (month < endMonth && month > 1))
            }
            
            // Normal date range
            return (month > startMonth || (month === startMonth && day >= event.startDate.day)) &&
                   (month < endMonth || (month === endMonth && day <= event.endDate.day))
        }) || null
    }

    static applyEventBonuses(event: SeasonalEvent, baseIncome: number, baseCost: number): { income: number; cost: number } {
        const income = event.bonuses.incomeMultiplier 
            ? baseIncome * event.bonuses.incomeMultiplier 
            : baseIncome
        
        const cost = event.bonuses.constructionDiscount
            ? baseCost * (1 - event.bonuses.constructionDiscount)
            : baseCost
        
        return { income, cost }
    }

    static getEventMission(event: SeasonalEvent): any {
        if (event.bonuses.specialMission) {
            return SPECIAL_MISSIONS[event.bonuses.specialMission as keyof typeof SPECIAL_MISSIONS]
        }
        return null
    }
}
