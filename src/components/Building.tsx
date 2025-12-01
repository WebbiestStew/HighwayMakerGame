import React, { useMemo } from 'react'
import { BUILDING_STYLES, type BuildingType } from '../types/BuildingTypes'
import { useGameStore } from '../store/gameStore'

interface BuildingProps {
    type: BuildingType
    position: [number, number, number]
    rotation: [number, number, number]
}

export const Building: React.FC<BuildingProps> = ({ type, position, rotation }) => {
    const { timeOfDay } = useGameStore()
    const buildingData = useMemo(() => {
        const styles = BUILDING_STYLES[type] || BUILDING_STYLES.house
        const variant = Math.floor(Math.random() * styles.length)
        return styles[variant]
    }, [type])

    const isNight = timeOfDay === 'night'

    return (
        <group position={position} rotation={rotation}>
            {/* Main Body */}
            <mesh position={[0, buildingData.scale[1] / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={buildingData.scale as [number, number, number]} />
                <meshStandardMaterial
                    color={buildingData.color}
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Windows - Glow at night */}
            {buildingData.windows && (
                <>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <mesh
                            key={`window-${i}`}
                            position={[
                                buildingData.scale[0] / 2 + 0.01,
                                buildingData.scale[1] / 2,
                                -buildingData.scale[2] / 3 + (i * buildingData.scale[2] / 3)
                            ]}
                            castShadow
                        >
                            <boxGeometry args={[0.05, 0.8, 0.6]} />
                            <meshStandardMaterial
                                color={isNight ? "#ffdd66" : "#87CEEB"}
                                emissive={isNight ? "#ffaa00" : "#ffffff"}
                                emissiveIntensity={isNight ? 0.8 : 0.2}
                                metalness={0.9}
                                roughness={0.1}
                            />
                        </mesh>
                    ))}
                    
                    {/* Window lights disabled for performance */}
                </>
            )}

            {/* Roof */}
            {buildingData.roofType === 'pitched' && (
                <mesh
                    position={[0, buildingData.scale[1] + 0.5, 0]}
                    rotation={[0, Math.PI / 4, 0]}
                    castShadow
                >
                    <coneGeometry args={[buildingData.scale[0] * 0.8, 1, 4]} />
                    <meshStandardMaterial
                        color={buildingData.roofColor}
                        roughness={0.9}
                    />
                </mesh>
            )}

            {buildingData.roofType === 'flat' && (
                <mesh
                    position={[0, buildingData.scale[1] + 0.1, 0]}
                    castShadow
                >
                    <boxGeometry args={[buildingData.scale[0] + 0.2, 0.2, buildingData.scale[2] + 0.2]} />
                    <meshStandardMaterial
                        color={buildingData.roofColor}
                        roughness={0.7}
                        metalness={0.2}
                    />
                </mesh>
            )}

            {/* Factory chimney */}
            {type === 'factory' && (
                <mesh position={[buildingData.scale[0] / 3, buildingData.scale[1] + 1, 0]} castShadow>
                    <cylinderGeometry args={[0.4, 0.5, 2, 8]} />
                    <meshStandardMaterial color="#505050" roughness={0.9} />
                </mesh>
            )}
        </group>
    )
}
