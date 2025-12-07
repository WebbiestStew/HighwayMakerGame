import React from 'react'

interface RoadNodeMarkerProps {
    position: [number, number, number]
    isIntersection: boolean
    isSelected?: boolean
}

export const RoadNodeMarker: React.FC<RoadNodeMarkerProps> = ({ position, isIntersection, isSelected }) => {
    return (
        <group position={position}>
            {/* Node marker sphere */}
            <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[isIntersection ? 1.5 : 0.8, 16, 16]} />
                <meshStandardMaterial
                    color={isSelected ? '#ffff00' : isIntersection ? '#ff0000' : '#00ff00'}
                    emissive={isSelected ? '#ffff00' : isIntersection ? '#ff0000' : '#00ff00'}
                    emissiveIntensity={isSelected ? 1.0 : 0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
            
            {/* Base plate */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[isIntersection ? 2 : 1.2, 16]} />
                <meshStandardMaterial
                    color={isIntersection ? '#ff0000' : '#00ff00'}
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Vertical line indicator */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
                <meshStandardMaterial
                    color={isSelected ? '#ffff00' : isIntersection ? '#ff0000' : '#00ff00'}
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </group>
    )
}
