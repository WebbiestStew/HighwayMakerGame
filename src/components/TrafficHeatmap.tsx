import React from 'react'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

interface TrafficHeatmapProps { }

export const TrafficHeatmap: React.FC<TrafficHeatmapProps> = () => {
    const { roads, trafficDensity, showHeatmap } = useGameStore()

    if (!showHeatmap) return null

    return (
        <>
            {roads.map((road) => {
                const density = trafficDensity.get(road.id) || 0
                // Normalize density: 0-3 vehicles -> 0.0-1.0
                const normalized = Math.min(density / 3, 1)

                // Color gradient: Green (low) -> Yellow (medium) -> Red (high)
                let color: string
                if (normalized < 0.33) {
                    color = '#22c55e' // Green
                } else if (normalized < 0.67) {
                    color = '#eab308' // Yellow  
                } else {
                    color = '#ef4444' // Red
                }

                const startVec = new THREE.Vector3(...road.start)
                const endVec = new THREE.Vector3(...road.end)
                const length = startVec.distanceTo(endVec)
                const position = startVec.clone().add(endVec).multiplyScalar(0.5)
                const direction = endVec.clone().sub(startVec).normalize()
                const angle = Math.atan2(direction.x, direction.z)

                return (
                    <group key={`heatmap-${road.id}`} position={position} rotation={[0, angle, 0]}>
                        <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[8, length]} />
                            <meshBasicMaterial color={color} transparent opacity={0.5} />
                        </mesh>
                    </group>
                )
            })}
        </>
    )
}
