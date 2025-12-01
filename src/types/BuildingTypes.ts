/**
 * Extended Building Types for Long-term Content
 * 25+ building variations across all zone types
 */

export type BuildingType = 
    // Residential (10 types)
    | 'house' | 'townhouse' | 'apartment' | 'condo' | 'mansion'
    | 'duplex' | 'villa' | 'cottage' | 'bungalow' | 'penthouse'
    // Commercial (10 types)
    | 'shop' | 'mall' | 'restaurant' | 'hotel' | 'office'
    | 'bank' | 'theater' | 'gym' | 'supermarket' | 'boutique'
    // Industrial (5 types)
    | 'factory' | 'warehouse' | 'plant' | 'depot' | 'refinery'
    // Special (5 types)
    | 'park' | 'stadium' | 'airport' | 'hospital' | 'school'

export interface BuildingStyle {
    color: string
    roofColor: string
    scale: [number, number, number]
    windows: boolean
    roofType: 'flat' | 'pitched' | 'dome'
    floors?: number
    specialFeatures?: string[]
}

export const BUILDING_STYLES: Record<BuildingType, BuildingStyle[]> = {
    // RESIDENTIAL BUILDINGS
    house: [
        { color: '#e8d4b8', roofColor: '#8b4513', scale: [2, 2, 2], windows: true, roofType: 'pitched', floors: 1 },
        { color: '#f5f5dc', roofColor: '#654321', scale: [2.2, 2.5, 2], windows: true, roofType: 'pitched', floors: 1 },
        { color: '#dcdcdc', roofColor: '#696969', scale: [1.8, 2.2, 2.2], windows: true, roofType: 'pitched', floors: 1 }
    ],
    townhouse: [
        { color: '#c9a98b', roofColor: '#8b7355', scale: [2.5, 3, 2], windows: true, roofType: 'flat', floors: 2 },
        { color: '#d4c5b9', roofColor: '#8b7765', scale: [2.8, 3.2, 2.2], windows: true, roofType: 'flat', floors: 2 }
    ],
    apartment: [
        { color: '#b0c4de', roofColor: '#708090', scale: [4, 5, 4], windows: true, roofType: 'flat', floors: 4, specialFeatures: ['balconies'] },
        { color: '#dcdcdc', roofColor: '#a9a9a9', scale: [4.5, 6, 4.5], windows: true, roofType: 'flat', floors: 5, specialFeatures: ['balconies'] },
        { color: '#f0e68c', roofColor: '#daa520', scale: [3.8, 5.5, 3.8], windows: true, roofType: 'flat', floors: 4 }
    ],
    condo: [
        { color: '#87ceeb', roofColor: '#4682b4', scale: [3.5, 4.5, 3.5], windows: true, roofType: 'flat', floors: 3, specialFeatures: ['penthouse'] },
        { color: '#add8e6', roofColor: '#5f9ea0', scale: [4, 5, 4], windows: true, roofType: 'flat', floors: 4 }
    ],
    mansion: [
        { color: '#fff8dc', roofColor: '#8b4513', scale: [5, 3.5, 5], windows: true, roofType: 'pitched', floors: 2, specialFeatures: ['columns', 'fountain'] },
        { color: '#ffe4e1', roofColor: '#cd853f', scale: [5.5, 4, 5.5], windows: true, roofType: 'dome', floors: 3, specialFeatures: ['fountain', 'garden'] }
    ],
    duplex: [
        { color: '#f5deb3', roofColor: '#d2691e', scale: [3, 2.5, 2.5], windows: true, roofType: 'pitched', floors: 2 }
    ],
    villa: [
        { color: '#faebd7', roofColor: '#bc8f8f', scale: [4.5, 3, 4.5], windows: true, roofType: 'flat', floors: 2, specialFeatures: ['pool'] }
    ],
    cottage: [
        { color: '#f0e2d0', roofColor: '#8b6914', scale: [2, 1.8, 2], windows: true, roofType: 'pitched', floors: 1 }
    ],
    bungalow: [
        { color: '#e9d9c8', roofColor: '#a0826d', scale: [3, 1.5, 3], windows: true, roofType: 'flat', floors: 1 }
    ],
    penthouse: [
        { color: '#1c1c1c', roofColor: '#000000', scale: [3, 8, 3], windows: true, roofType: 'flat', floors: 1, specialFeatures: ['helipad'] }
    ],

    // COMMERCIAL BUILDINGS
    shop: [
        { color: '#b0c4de', roofColor: '#708090', scale: [3, 2.5, 3], windows: true, roofType: 'flat', floors: 1 },
        { color: '#f0e68c', roofColor: '#daa520', scale: [3.5, 3, 2.5], windows: true, roofType: 'flat', floors: 1 },
        { color: '#87ceeb', roofColor: '#4682b4', scale: [3, 3.5, 3], windows: true, roofType: 'flat', floors: 2 }
    ],
    mall: [
        { color: '#e0e0e0', roofColor: '#909090', scale: [8, 4, 8], windows: true, roofType: 'flat', floors: 3, specialFeatures: ['parking'] },
        { color: '#d3d3d3', roofColor: '#a9a9a9', scale: [10, 5, 10], windows: true, roofType: 'flat', floors: 4, specialFeatures: ['foodcourt', 'parking'] }
    ],
    restaurant: [
        { color: '#8b0000', roofColor: '#8b4513', scale: [3, 2, 3], windows: true, roofType: 'flat', floors: 1, specialFeatures: ['sign'] },
        { color: '#ffd700', roofColor: '#daa520', scale: [3.5, 2.5, 3.5], windows: true, roofType: 'dome', floors: 1 }
    ],
    hotel: [
        { color: '#4a4a4a', roofColor: '#2f2f2f', scale: [5, 8, 5], windows: true, roofType: 'flat', floors: 10, specialFeatures: ['sign', 'lobby'] },
        { color: '#5c5c5c', roofColor: '#3d3d3d', scale: [6, 10, 6], windows: true, roofType: 'flat', floors: 15, specialFeatures: ['pool', 'sign'] }
    ],
    office: [
        { color: '#4682b4', roofColor: '#36648b', scale: [5, 10, 5], windows: true, roofType: 'flat', floors: 12, specialFeatures: ['antenna'] },
        { color: '#708090', roofColor: '#2f4f4f', scale: [6, 12, 6], windows: true, roofType: 'flat', floors: 15, specialFeatures: ['antenna', 'helipad'] },
        { color: '#778899', roofColor: '#696969', scale: [5.5, 15, 5.5], windows: true, roofType: 'flat', floors: 20 }
    ],
    bank: [
        { color: '#b8860b', roofColor: '#8b6914', scale: [4, 4, 4], windows: true, roofType: 'dome', floors: 2, specialFeatures: ['columns', 'vault'] }
    ],
    theater: [
        { color: '#8b0000', roofColor: '#8b4513', scale: [5, 3, 4], windows: false, roofType: 'flat', floors: 1, specialFeatures: ['marquee'] }
    ],
    gym: [
        { color: '#ff8c00', roofColor: '#ff6347', scale: [4, 2.5, 4], windows: true, roofType: 'flat', floors: 1, specialFeatures: ['sign'] }
    ],
    supermarket: [
        { color: '#90ee90', roofColor: '#228b22', scale: [6, 3, 4], windows: true, roofType: 'flat', floors: 1, specialFeatures: ['parking'] }
    ],
    boutique: [
        { color: '#ff69b4', roofColor: '#ff1493', scale: [2.5, 2, 2.5], windows: true, roofType: 'flat', floors: 1, specialFeatures: ['awning'] }
    ],

    // INDUSTRIAL BUILDINGS
    factory: [
        { color: '#a0a0a0', roofColor: '#606060', scale: [4, 3, 4], windows: false, roofType: 'flat', floors: 1, specialFeatures: ['chimney'] },
        { color: '#b8b8b8', roofColor: '#707070', scale: [5, 4, 3.5], windows: false, roofType: 'flat', floors: 1, specialFeatures: ['chimney', 'smokestacks'] },
        { color: '#909090', roofColor: '#505050', scale: [4.5, 3.5, 4.5], windows: false, roofType: 'flat', floors: 1, specialFeatures: ['chimney'] }
    ],
    warehouse: [
        { color: '#696969', roofColor: '#2f2f2f', scale: [8, 3, 6], windows: false, roofType: 'flat', floors: 1, specialFeatures: ['loading_dock'] },
        { color: '#778899', roofColor: '#363636', scale: [10, 3.5, 7], windows: false, roofType: 'flat', floors: 1, specialFeatures: ['loading_dock', 'fence'] }
    ],
    plant: [
        { color: '#8b8b7a', roofColor: '#556b2f', scale: [7, 5, 7], windows: true, roofType: 'flat', floors: 2, specialFeatures: ['tanks', 'pipes'] }
    ],
    depot: [
        { color: '#8b7355', roofColor: '#654321', scale: [6, 2.5, 5], windows: false, roofType: 'flat', floors: 1, specialFeatures: ['yard'] }
    ],
    refinery: [
        { color: '#708090', roofColor: '#2f4f4f', scale: [10, 8, 10], windows: false, roofType: 'flat', floors: 4, specialFeatures: ['tanks', 'towers', 'pipes', 'flare'] }
    ],

    // SPECIAL BUILDINGS
    park: [
        { color: '#228b22', roofColor: '#006400', scale: [8, 0.5, 8], windows: false, roofType: 'flat', floors: 0, specialFeatures: ['trees', 'fountain', 'benches'] }
    ],
    stadium: [
        { color: '#ffffff', roofColor: '#d3d3d3', scale: [15, 6, 12], windows: false, roofType: 'dome', floors: 3, specialFeatures: ['lights', 'seats', 'scoreboard'] }
    ],
    airport: [
        { color: '#f5f5f5', roofColor: '#d3d3d3', scale: [20, 4, 15], windows: true, roofType: 'flat', floors: 2, specialFeatures: ['runway', 'tower', 'hangar'] }
    ],
    hospital: [
        { color: '#ffffff', roofColor: '#ff0000', scale: [7, 6, 7], windows: true, roofType: 'flat', floors: 5, specialFeatures: ['helipad', 'cross'] }
    ],
    school: [
        { color: '#fffacd', roofColor: '#daa520', scale: [6, 3, 5], windows: true, roofType: 'flat', floors: 2, specialFeatures: ['playground', 'flag'] }
    ]
}

export function getBuildingStyle(type: BuildingType, variant: number = 0): BuildingStyle {
    const styles = BUILDING_STYLES[type]
    return styles[variant % styles.length]
}

export function getRandomBuildingType(zoneType: 'residential' | 'commercial' | 'industrial'): BuildingType {
    const residential: BuildingType[] = ['house', 'townhouse', 'apartment', 'condo', 'mansion', 'duplex', 'villa', 'cottage', 'bungalow']
    const commercial: BuildingType[] = ['shop', 'mall', 'restaurant', 'hotel', 'office', 'bank', 'theater', 'gym', 'supermarket', 'boutique']
    const industrial: BuildingType[] = ['factory', 'warehouse', 'plant', 'depot', 'refinery']
    
    const options = {
        residential,
        commercial,
        industrial
    }[zoneType]
    
    return options[Math.floor(Math.random() * options.length)]
}

export function canPlaceSpecialBuilding(type: BuildingType, population: number, funds: number): boolean {
    const requirements = {
        park: { population: 500, cost: 50000 },
        stadium: { population: 2000, cost: 500000 },
        airport: { population: 5000, cost: 1000000 },
        hospital: { population: 1000, cost: 200000 },
        school: { population: 300, cost: 100000 }
    }
    
    if (['park', 'stadium', 'airport', 'hospital', 'school'].includes(type)) {
        const req = requirements[type as keyof typeof requirements]
        return population >= req.population && funds >= req.cost
    }
    
    return true
}
