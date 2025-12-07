import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type TrafficLightState = 'red' | 'yellow' | 'green'

interface TrafficLightProps {
    position: [number, number, number]
    rotation: [number, number, number]
    state: TrafficLightState
}

export const TrafficLight: React.FC<TrafficLightProps> = ({ position, rotation, state }) => {
    const redLightRef = useRef<THREE.Mesh>(null)
    const yellowLightRef = useRef<THREE.Mesh>(null)
    const greenLightRef = useRef<THREE.Mesh>(null)

    // Animate light intensity
    useFrame((frameState) => {
        const pulse = Math.sin(frameState.clock.elapsedTime * 3) * 0.2 + 0.8

        if (redLightRef.current) {
            const mat = redLightRef.current.material as THREE.MeshStandardMaterial
            mat.emissiveIntensity = state === 'red' ? pulse : 0.1
        }
        if (yellowLightRef.current) {
            const mat = yellowLightRef.current.material as THREE.MeshStandardMaterial
            mat.emissiveIntensity = state === 'yellow' ? pulse : 0.1
        }
        if (greenLightRef.current) {
            const mat = greenLightRef.current.material as THREE.MeshStandardMaterial
            mat.emissiveIntensity = state === 'green' ? pulse : 0.1
        }
    })

    return (
        <group position={position} rotation={rotation}>
            {/* Pole */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
                <meshStandardMaterial color="#333333" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Traffic Light Housing */}
            <mesh position={[0, 5.5, 0]} castShadow>
                <boxGeometry args={[0.6, 1.8, 0.3]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.3} />
            </mesh>

            {/* Red Light */}
            <mesh ref={redLightRef} position={[0, 6, 0.16]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color="#ff0000"
                    emissive="#ff0000"
                    emissiveIntensity={state === 'red' ? 1.0 : 0.1}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Yellow Light */}
            <mesh ref={yellowLightRef} position={[0, 5.5, 0.16]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color="#ffff00"
                    emissive="#ffff00"
                    emissiveIntensity={state === 'yellow' ? 1.0 : 0.1}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Green Light */}
            <mesh ref={greenLightRef} position={[0, 5, 0.16]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color="#00ff00"
                    emissive="#00ff00"
                    emissiveIntensity={state === 'green' ? 1.0 : 0.1}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Light glow effect */}
            {state !== 'red' && (
                <pointLight
                    position={[0, state === 'yellow' ? 5.5 : 5, 0.3]}
                    color={state === 'yellow' ? '#ffff00' : '#00ff00'}
                    intensity={1.5}
                    distance={8}
                />
            )}
            {state === 'red' && (
                <pointLight
                    position={[0, 6, 0.3]}
                    color="#ff0000"
                    intensity={1.5}
                    distance={8}
                />
            )}
        </group>
    )
}
