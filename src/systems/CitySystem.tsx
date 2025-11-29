import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import * as THREE from 'three'

export const CitySystem: React.FC = () => {
    const { zones, roads, buildings, addBuilding } = useGameStore()
    const lastGrowTime = useRef<number>(0)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        // Attempt to grow a building every 1 second
        if (time - lastGrowTime.current > 1) {
            if (zones.length > 0 && roads.length > 0) {
                // Pick a random zone
                const zone = zones[Math.floor(Math.random() * zones.length)]

                // Check if zone is full (simple check: max 5 buildings per zone area for now?)
                // Actually, let's just spawn randomly within zone bounds if not colliding
                // For MVP: Just spawn one building per zone if empty

                const zoneBuildings = buildings.filter(b => {
                    // Check if building is roughly inside zone
                    // Zone pos is center. Size is [w, h, d]
                    const dx = Math.abs(b.position[0] - zone.position[0])
                    const dz = Math.abs(b.position[2] - zone.position[2])
                    return dx < zone.size[0] / 2 && dz < zone.size[2] / 2
                })

                if (zoneBuildings.length < (zone.size[0] * zone.size[2]) / 100) { // Density check
                    // Find a spot in the zone
                    const x = zone.position[0] + (Math.random() - 0.5) * (zone.size[0] - 4)
                    const z = zone.position[2] + (Math.random() - 0.5) * (zone.size[2] - 4)

                    // Check distance to nearest road
                    let nearRoad = false
                    const pos = new THREE.Vector3(x, 0, z)

                    for (const road of roads) {
                        // Simple distance to start/end points for now (better: distance to line segment)
                        const start = new THREE.Vector3(...road.start)
                        const end = new THREE.Vector3(...road.end)
                        if (pos.distanceTo(start) < 20 || pos.distanceTo(end) < 20) {
                            nearRoad = true
                            break
                        }
                        // Check midpoint too
                        const mid = start.clone().add(end).multiplyScalar(0.5)
                        if (pos.distanceTo(mid) < 20) {
                            nearRoad = true
                            break
                        }
                    }

                    if (nearRoad) {
                        let buildingType: 'house' | 'shop' | 'factory' = 'house'
                        if (zone.type === 'commercial') buildingType = 'shop'
                        if (zone.type === 'industrial') buildingType = 'factory'

                        addBuilding({
                            id: crypto.randomUUID(),
                            type: buildingType,
                            position: [x, 0, z],
                            rotation: [0, Math.random() * Math.PI * 2, 0]
                        })
                    }
                }
            }
            lastGrowTime.current = time
        }
    })

    return null
}
