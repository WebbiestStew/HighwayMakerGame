import React, { useMemo } from 'react'
import { Vector3, Euler } from 'three'

interface VehicleProps {
    position: Vector3
    rotation: Euler
    color?: string
    type?: 'car' | 'truck' | 'bus'
}

export const Vehicle: React.FC<VehicleProps> = ({ position, rotation, color = '#ff0000', type = 'car' }) => {
    const vehicleColor = useMemo(() => color, [color])

    if (type === 'truck') {
        return (
            <group position={position} rotation={rotation}>
                {/* Truck Cab */}
                <mesh position={[0, 0.6, 1.5]} castShadow>
                    <boxGeometry args={[2, 1, 2.5]} />
                    <meshStandardMaterial color={vehicleColor} />
                </mesh>

                {/* Truck Cargo */}
                <mesh position={[0, 0.8, -1.5]} castShadow>
                    <boxGeometry args={[2.2, 1.5, 4.5]} />
                    <meshStandardMaterial color={vehicleColor} roughness={0.7} />
                </mesh>

                {/* Wheels */}
                {[-1, 1].map(side =>
                    [-1.5, 0, 1.5].map((z, i) => (
                        <mesh key={`${side}_${i}`} position={[side * 1.1, 0.4, z]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
                            <meshStandardMaterial color="#111" />
                        </mesh>
                    ))
                )}
            </group>
        )
    }

    if (type === 'bus') {
        return (
            <group position={position} rotation={rotation}>
                {/* Bus Body */}
                <mesh position={[0, 1, 0]} castShadow>
                    <boxGeometry args={[2.2, 1.8, 6]} />
                    <meshStandardMaterial color={vehicleColor} />
                </mesh>

                {/* Windows */}
                <mesh position={[0, 1.5, 0.5]} castShadow>
                    <boxGeometry args={[2.3, 0.6, 4]} />
                    <meshStandardMaterial color="#333" />
                </mesh>

                {/* Wheels */}
                {[-1.1, 1.1].map(side =>
                    [-2, 2].map((z, i) => (
                        <mesh key={`${side}_${i}`} position={[side, 0.4, z]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
                            <meshStandardMaterial color="#111" />
                        </mesh>
                    ))
                )}
            </group>
        )
    }

    // Default: Car
    return (
        <group position={position} rotation={rotation}>
            {/* Car Body */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[1.8, 0.8, 4]} />
                <meshStandardMaterial color={vehicleColor} />
            </mesh>

            {/* Car Cabin */}
            <mesh position={[0, 1.0, -0.5]} castShadow>
                <boxGeometry args={[1.6, 0.6, 2]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Wheels */}
            <mesh position={[-0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0.9, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0.9, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        </group>
    )
}
