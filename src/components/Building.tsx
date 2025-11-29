import React, { useMemo } from 'react'

interface BuildingProps {
    type: 'house' | 'shop' | 'factory'
    position: [number, number, number]
    rotation: [number, number, number]
}

export const Building: React.FC<BuildingProps> = ({ type, position, rotation }) => {
    const buildingData = useMemo(() => {
        const variant = Math.floor(Math.random() * 3) // 3 variants per type

        if (type === 'house') {
            const styles = [
                { color: '#e8d4b8', roofColor: '#8b4513', scale: [2, 2, 2], windows: true },
                { color: '#f5f5dc', roofColor: '#654321', scale: [2.2, 2.5, 2], windows: true },
                { color: '#dcdcdc', roofColor: '#696969', scale: [1.8, 2.2, 2.2], windows: true }
            ]
            return { ...styles[variant], roofType: 'pitched' }
        }

        if (type === 'shop') {
            const styles = [
                { color: '#b0c4de', roofColor: '#708090', scale: [3, 2.5, 3], windows: true },
                { color: '#f0e68c', roofColor: '#daa520', scale: [3.5, 3, 2.5], windows: true },
                { color: '#87ceeb', roofColor: '#4682b4', scale: [3, 3.5, 3], windows: true }
            ]
            return { ...styles[variant], roofType: 'flat' }
        }

        // Factory
        const styles = [
            { color: '#a0a0a0', roofColor: '#606060', scale: [4, 3, 4], windows: false },
            { color: '#b8b8b8', roofColor: '#707070', scale: [5, 4, 3.5], windows: false },
            { color: '#909090', roofColor: '#505050', scale: [4.5, 3.5, 4.5], windows: false }
        ]
        return { ...styles[variant], roofType: 'flat' }
    }, [type])

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

            {/* Windows */}
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
                                color="#87CEEB"
                                emissive="#ffffff"
                                emissiveIntensity={0.2}
                                metalness={0.9}
                                roughness={0.1}
                            />
                        </mesh>
                    ))}
                </>
            )}

            {/* Roof */}
            {buildingData.roofType === 'pitched' && type === 'house' && (
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
