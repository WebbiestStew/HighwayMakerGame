import React, { useMemo } from 'react'
import * as THREE from 'three'

interface RoadSegmentProps {
    start: [number, number, number]
    end: [number, number, number]
    controlPoint?: [number, number, number]
}

export const RoadSegment: React.FC<RoadSegmentProps> = ({ start, end, controlPoint }) => {
    const roadGeometry = useMemo(() => {
        const startVec = new THREE.Vector3(...start)
        const endVec = new THREE.Vector3(...end)

        if (controlPoint) {
            // Curved Road using TubeGeometry
            const controlVec = new THREE.Vector3(...controlPoint)
            const curve = new THREE.QuadraticBezierCurve3(startVec, controlVec, endVec)

            // Create tube geometry for the road
            const tubeGeometry = new THREE.TubeGeometry(curve, 20, 5, 8, false)

            return { geometry: tubeGeometry, isCurved: true, curve }
        }

        return { geometry: null, isCurved: false, curve: null }
    }, [start, end, controlPoint])

    if (controlPoint && roadGeometry.isCurved && roadGeometry.geometry && roadGeometry.curve) {
        // Curved road rendering
        return (
            <group>
                {/* Main Road Surface */}
                <mesh geometry={roadGeometry.geometry} receiveShadow castShadow>
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                        metalness={0.1}
                    />
                </mesh>

                {/* Lane markings along curve */}
                {Array.from({ length: 10 }).map((_, i) => {
                    const t = i / 9
                    const point = roadGeometry.curve!.getPoint(t)
                    const tangent = roadGeometry.curve!.getTangent(t)
                    const angle = Math.atan2(tangent.x, tangent.z)

                    return (
                        <mesh
                            key={i}
                            position={[point.x, point.y + 0.15, point.z]}
                            rotation={[-Math.PI / 2, 0, angle]}
                        >
                            <planeGeometry args={[0.3, 1.5]} />
                            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
                        </mesh>
                    )
                })}
            </group>
        )
    }

    // Straight Road (optimized)
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    const length = startVec.distanceTo(endVec)
    const position = startVec.clone().add(endVec).multiplyScalar(0.5)
    const direction = endVec.clone().sub(startVec).normalize()
    const angle = Math.atan2(direction.x, direction.z)
    const rotation = new THREE.Euler(0, angle, 0)

    return (
        <group position={position} rotation={rotation}>
            {/* Road Surface - Dark Asphalt */}
            <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
                <boxGeometry args={[10, 0.2, length]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.85}
                    metalness={0.05}
                />
            </mesh>

            {/* Shoulders - Gravel */}
            <mesh position={[-5.5, 0.05, 0]} receiveShadow>
                <boxGeometry args={[1.5, 0.1, length]} />
                <meshStandardMaterial color="#5a4a3a" roughness={1} />
            </mesh>
            <mesh position={[5.5, 0.05, 0]} receiveShadow>
                <boxGeometry args={[1.5, 0.1, length]} />
                <meshStandardMaterial color="#5a4a3a" roughness={1} />
            </mesh>

            {/* Center Line - Dashed Yellow */}
            {Array.from({ length: Math.ceil(length / 4) }).map((_, i) => (
                <mesh key={`center-${i}`} position={[0, 0.21, -length / 2 + i * 4 + 2]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.3, 2]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
                </mesh>
            ))}

            {/* Side Lines - Solid White */}
            <mesh position={[-4.5, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.25, length]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[4.5, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.25, length]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
            </mesh>

            {/* Guardrails */}
            <mesh position={[-6.5, 0.5, 0]}>
                <boxGeometry args={[0.2, 0.8, length]} />
                <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[6.5, 0.5, 0]}>
                <boxGeometry args={[0.2, 0.8, length]} />
                <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
            </mesh>
        </group>
    )
}
