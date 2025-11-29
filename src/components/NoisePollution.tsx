import React from 'react'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export const NoisePollution: React.FC = () => {
    const { roads, trafficDensity, showNoisePollution } = useGameStore()

    if (!showNoisePollution) return null

    return (
        <>
            {roads.map((road) => {
                const density = trafficDensity.get(road.id) || 0
                const noiseIntensity = Math.min(density / 3, 1)

                // Only show noise if there's traffic
                if (density === 0) return null

                const startVec = new THREE.Vector3(...road.start)
                const endVec = new THREE.Vector3(...road.end)
                const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5)

                // Noise radius based on traffic
                const radius = 15 + noiseIntensity * 10

                return (
                    <mesh
                        key={`noise-${road.id}`}
                        position={midpoint}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <circleGeometry args={[radius, 32]} />
                        <meshBasicMaterial
                            color="#ef4444"
                            transparent
                            opacity={0.15 + noiseIntensity * 0.15}
                        />
                    </mesh>
                )
            })}
        </>
    )
}
