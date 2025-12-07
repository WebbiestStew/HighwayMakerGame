import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BUILDING_STYLES, type BuildingType } from '../types/BuildingTypes'
import { useGameStore } from '../store/gameStore'
import * as THREE from 'three'

interface BuildingProps {
    type: BuildingType
    position: [number, number, number]
    rotation: [number, number, number]
}

export const Building: React.FC<BuildingProps> = ({ type, position, rotation }) => {
    const { timeOfDay } = useGameStore()
    const groupRef = useRef<THREE.Group>(null)
    const buildingData = useMemo(() => {
        const styles = BUILDING_STYLES[type] || BUILDING_STYLES.house
        const variant = Math.floor(Math.random() * styles.length)
        return styles[variant]
    }, [type])

    const isNight = timeOfDay === 'night'

    // Subtle building animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
        }
    })

    // Enhanced color with gradients
    const baseColor = useMemo(() => new THREE.Color(buildingData.color), [buildingData.color])
    const topColor = useMemo(() => {
        const color = new THREE.Color(buildingData.color)
        color.multiplyScalar(1.2) // Brighter at top
        return color
    }, [buildingData.color])

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            {/* Main Body with enhanced material */}
            <mesh position={[0, buildingData.scale[1] / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={buildingData.scale as [number, number, number]} />
                <meshStandardMaterial
                    color={baseColor}
                    roughness={0.7}
                    metalness={0.2}
                    envMapIntensity={0.5}
                />
            </mesh>

            {/* Ambient occlusion base shadow */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[buildingData.scale[0] + 0.2, buildingData.scale[2] + 0.2]} />
                <meshBasicMaterial color="#000000" opacity={0.3} transparent />
            </mesh>

            {/* Windows - Enhanced glow at night */}
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
                        >
                            <boxGeometry args={[0.05, 0.8, 0.6]} />
                            <meshStandardMaterial
                                color={isNight ? "#ffee88" : "#b0d4ff"}
                                emissive={isNight ? "#ffaa00" : "#ffffff"}
                                emissiveIntensity={isNight ? 1.2 : 0.1}
                                metalness={0.95}
                                roughness={0.05}
                                transparent
                                opacity={0.95}
                            />
                        </mesh>
                    ))}
                    
                    {/* Window lights disabled for performance */}
                </>
            )}

            {/* Roof - Enhanced */}
            {buildingData.roofType === 'pitched' && (
                <mesh
                    position={[0, buildingData.scale[1] + 0.5, 0]}
                    rotation={[0, Math.PI / 4, 0]}
                    castShadow
                >
                    <coneGeometry args={[buildingData.scale[0] * 0.8, 1, 4]} />
                    <meshStandardMaterial
                        color={buildingData.roofColor}
                        roughness={0.8}
                        metalness={0.1}
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
                        roughness={0.6}
                        metalness={0.3}
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
