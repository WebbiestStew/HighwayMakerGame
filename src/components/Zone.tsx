import React, { useMemo } from 'react'
import * as THREE from 'three'

interface ZoneProps {
    type: 'residential' | 'commercial' | 'industrial'
    position: [number, number, number]
    size: [number, number, number]
}

export const Zone: React.FC<ZoneProps> = ({ type, position, size }) => {
    const color = useMemo(() => {
        switch (type) {
            case 'residential': return '#4ade80' // Green
            case 'commercial': return '#60a5fa' // Blue
            case 'industrial': return '#facc15' // Yellow
        }
    }, [type])

    return (
        <mesh position={new THREE.Vector3(...position)} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[size[0], size[2]]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
    )
}
