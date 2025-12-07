import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { RoadNode } from '../types/RoadNetwork'

interface RoadConnectionSegmentProps {
    startNode: RoadNode
    endNode: RoadNode
    lanes: number
}

export const RoadConnectionSegment: React.FC<RoadConnectionSegmentProps> = ({ startNode, endNode, lanes }) => {
    const roadGeometry = useMemo(() => {
        const start = new THREE.Vector3(...startNode.position)
        const end = new THREE.Vector3(...endNode.position)
        const distance = start.distanceTo(end)
        
        return {
            distance,
            midpoint: new THREE.Vector3().lerpVectors(start, end, 0.5),
            angle: Math.atan2(end.x - start.x, end.z - start.z)
        }
    }, [startNode, endNode])

    const roadWidth = lanes * 3.5

    return (
        <group position={[roadGeometry.midpoint.x, roadGeometry.midpoint.y, roadGeometry.midpoint.z]} rotation={[0, roadGeometry.angle, 0]}>
            {/* Main road surface */}
            <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
                <boxGeometry args={[roadWidth, 0.2, roadGeometry.distance]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.7}
                    metalness={0.3}
                    envMapIntensity={0.3}
                />
            </mesh>

            {/* Lane markings */}
            {lanes > 1 && Array.from({ length: lanes - 1 }).map((_, laneIndex) => {
                const offset = ((laneIndex + 1) - lanes / 2) * 3.5
                return (
                    <group key={laneIndex}>
                        {/* Dashed center lines */}
                        {Array.from({ length: Math.floor(roadGeometry.distance / 5) }).map((_, dashIndex) => {
                            const dashZ = -roadGeometry.distance / 2 + dashIndex * 5 + 2.5
                            return (
                                <mesh key={dashIndex} position={[offset, 0.11, dashZ]}>
                                    <boxGeometry args={[0.15, 0.02, 2]} />
                                    <meshStandardMaterial
                                        color="#ffffff"
                                        emissive="#ffffff"
                                        emissiveIntensity={0.3}
                                    />
                                </mesh>
                            )
                        })}
                    </group>
                )
            })}

            {/* Road edge lines */}
            <mesh position={[roadWidth / 2, 0.11, 0]}>
                <boxGeometry args={[0.2, 0.02, roadGeometry.distance]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#888888"
                    emissiveIntensity={0.2}
                />
            </mesh>
            <mesh position={[-roadWidth / 2, 0.11, 0]}>
                <boxGeometry args={[0.2, 0.02, roadGeometry.distance]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#888888"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Shoulders */}
            <mesh position={[roadWidth / 2 + 1, 0.05, 0]} receiveShadow>
                <boxGeometry args={[1.5, 0.1, roadGeometry.distance]} />
                <meshStandardMaterial color="#5a4a3a" roughness={1} />
            </mesh>
            <mesh position={[-roadWidth / 2 - 1, 0.05, 0]} receiveShadow>
                <boxGeometry args={[1.5, 0.1, roadGeometry.distance]} />
                <meshStandardMaterial color="#5a4a3a" roughness={1} />
            </mesh>
        </group>
    )
}
