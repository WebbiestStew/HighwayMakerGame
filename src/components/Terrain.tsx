import React, { useMemo } from 'react'

export const Terrain: React.FC = () => {
    // Generate random trees
    const trees = useMemo(() => {
        const treePositions: Array<[number, number, number]> = []
        for (let i = 0; i < 200; i++) {
            const x = (Math.random() - 0.5) * 900
            const z = (Math.random() - 0.5) * 900
            // Avoid center area for roads
            if (Math.abs(x) > 50 || Math.abs(z) > 50) {
                treePositions.push([x, 0, z])
            }
        }
        return treePositions
    }, [])

    return (
        <group>
            {/* Ground Plane - Grass texture */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[1000, 1000, 20, 20]} />
                <meshStandardMaterial
                    color="#4a6741"
                    roughness={0.9}
                    metalness={0}
                />
            </mesh>

            {/* Subtle grid for visual reference */}
            <gridHelper args={[1000, 100, '#3a5531', '#4a6741']} position={[0, 0, 0]} />

            {/* Vegetation - Trees */}
            {trees.map((pos, i) => (
                <group key={i} position={pos}>
                    {/* Tree trunk */}
                    <mesh position={[0, 1.5, 0]} castShadow>
                        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
                        <meshStandardMaterial color="#4a3425" roughness={1} />
                    </mesh>
                    {/* Tree foliage */}
                    <mesh position={[0, 4, 0]} castShadow>
                        <coneGeometry args={[2, 4, 8]} />
                        <meshStandardMaterial color="#2d5a2d" roughness={0.8} />
                    </mesh>
                </group>
            ))}
        </group>
    )
}
