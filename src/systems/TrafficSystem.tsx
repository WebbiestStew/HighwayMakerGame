import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'
import { Vehicle } from '../components/Vehicle'
import { roadNetwork } from '../utils/Pathfinding'

type VehicleType = 'car' | 'truck' | 'bus'

interface ActiveVehicle {
    id: string
    type: VehicleType
    path: THREE.Vector3[]
    pathIndex: number
    progress: number // 0 to 1 on current segment
    speed: number
    color: string
}

export const TrafficSystem: React.FC = () => {
    const { roads, setTrafficDensity, setActiveVehicles } = useGameStore()
    const [vehicles, setVehicles] = useState<ActiveVehicle[]>([])
    const lastSpawnTime = useRef<number>(0)

    // Rebuild road network when roads change
    useEffect(() => {
        if (roads.length > 0) {
            roadNetwork.buildFromRoads(roads)
        }
    }, [roads])

    // Update active vehicle count
    useEffect(() => {
        setActiveVehicles(vehicles.length)
    }, [vehicles, setActiveVehicles])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        // Spawn logic - more vehicles now
        if (time - lastSpawnTime.current > 1.5 && roads.length > 0) {
            // Pick random start and end roads
            const startRoad = roads[Math.floor(Math.random() * roads.length)]
            const endRoad = roads[Math.floor(Math.random() * roads.length)]

            if (startRoad && endRoad) {
                const startPos = new THREE.Vector3(...startRoad.start)
                const endPos = new THREE.Vector3(...endRoad.end)

                // Get path using pathfinding
                const path = roadNetwork.findPath(startPos, endPos)

                // Random vehicle type
                const rand = Math.random()
                const type: VehicleType = rand < 0.7 ? 'car' : rand < 0.9 ? 'truck' : 'bus'

                // Type-specific colors and speeds
                const colors = {
                    car: `hsl(${Math.random() * 360}, 70%, 50%)`,
                    truck: `hsl(${Math.random() * 60 + 30}, 60%, 40%)`, // Browns/oranges
                    bus: `hsl(${Math.random() * 60 + 180}, 60%, 50%)` // Blues/greens
                }

                const speeds = {
                    car: 0.12 + Math.random() * 0.08,
                    truck: 0.08 + Math.random() * 0.04,
                    bus: 0.09 + Math.random() * 0.05
                }

                const newVehicle: ActiveVehicle = {
                    id: crypto.randomUUID(),
                    type,
                    path,
                    pathIndex: 0,
                    progress: 0,
                    speed: speeds[type],
                    color: colors[type]
                }
                setVehicles((prev) => [...prev.slice(-30), newVehicle]) // Keep max 30 vehicles
                lastSpawnTime.current = time
            }
        }

        // Move vehicles along their paths
        setVehicles((prev) =>
            prev
                .map((v) => {
                    const newProgress = v.progress + v.speed * 0.1

                    if (newProgress >= 1) {
                        // Move to next segment
                        const newPathIndex = v.pathIndex + 1
                        if (newPathIndex >= v.path.length - 1) {
                            // Reached end of path
                            return null
                        }
                        return {
                            ...v,
                            pathIndex: newPathIndex,
                            progress: newProgress - 1
                        }
                    }

                    return {
                        ...v,
                        progress: newProgress
                    }
                })
                .filter((v): v is ActiveVehicle => v !== null)
        )

        // Update traffic density
        const densityMap = new Map<string, number>()
        vehicles.forEach((v) => {
            // Find which road the vehicle is on
            const roadId = roads.find(r => {
                const start = new THREE.Vector3(...r.start)
                const end = new THREE.Vector3(...r.end)
                const vehiclePos = v.path[v.pathIndex]
                return vehiclePos && (
                    start.distanceTo(vehiclePos) < 20 || end.distanceTo(vehiclePos) < 20
                )
            })?.id

            if (roadId) {
                densityMap.set(roadId, (densityMap.get(roadId) || 0) + 1)
            }
        })
        setTrafficDensity(densityMap)
    })

    return (
        <group>
            {vehicles.map((v) => {
                if (!v.path || v.pathIndex >= v.path.length - 1) return null

                const start = v.path[v.pathIndex]
                const end = v.path[v.pathIndex + 1]

                if (!start || !end) return null

                // Lerp position along current segment
                const position = new THREE.Vector3().lerpVectors(start, end, v.progress)

                // Calculate rotation (look at next point)
                const direction = new THREE.Vector3().subVectors(end, start).normalize()
                const angle = Math.atan2(direction.x, direction.z)
                const rotation = new THREE.Euler(0, angle, 0)

                return (
                    <Vehicle
                        key={v.id}
                        position={position}
                        rotation={rotation}
                        color={v.color}
                        type={v.type}
                    />
                )
            })}
        </group>
    )
}
