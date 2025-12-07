import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type VehicleTypeV3 = 'car' | 'truck' | 'bus' | 'emergency' | 'taxi' | 'delivery'

interface VehicleV3Props {
    position: [number, number, number]
    rotation: [number, number, number]
    type: VehicleTypeV3
    speed: number
    isBraking?: boolean
    isEmergency?: boolean
    turnSignal?: 'left' | 'right' | 'none'
}

export const VehicleV3: React.FC<VehicleV3Props> = ({ 
    position, 
    rotation, 
    type, 
    speed: _speed,
    isBraking = false,
    isEmergency = false,
    turnSignal = 'none'
}) => {
    const vehicleRef = useRef<THREE.Group>(null)
    const brakeLightsRef = useRef<THREE.PointLight[]>([])
    const emergencyLightRef = useRef<THREE.PointLight>(null)
    const turnSignalRef = useRef<THREE.PointLight>(null)
    
    // Vehicle dimensions based on type
    const dimensions = useMemo(() => {
        switch (type) {
            case 'car':
                return { width: 1.8, height: 1.4, length: 4.5, color: '#' + Math.floor(Math.random() * 16777215).toString(16) }
            case 'truck':
                return { width: 2.5, height: 3, length: 8, color: '#444444' }
            case 'bus':
                return { width: 2.5, height: 3.5, length: 12, color: '#FFD700' }
            case 'emergency':
                return { width: 2, height: 1.8, length: 5, color: isEmergency ? '#FF0000' : '#FFFFFF' }
            case 'taxi':
                return { width: 1.8, height: 1.4, length: 4.5, color: '#FFFF00' }
            case 'delivery':
                return { width: 2.2, height: 2.5, length: 5.5, color: '#8B4513' }
            default:
                return { width: 1.8, height: 1.4, length: 4.5, color: '#0088FF' }
        }
    }, [type, isEmergency])

    // Animate emergency lights
    useFrame((state) => {
        if (isEmergency && emergencyLightRef.current) {
            const flash = Math.sin(state.clock.elapsedTime * 10) > 0
            emergencyLightRef.current.intensity = flash ? 2 : 0.1
            emergencyLightRef.current.color.setHex(flash ? 0xFF0000 : 0x0000FF)
        }

        // Animate turn signals
        if (turnSignal !== 'none' && turnSignalRef.current) {
            const blink = Math.sin(state.clock.elapsedTime * 4) > 0
            turnSignalRef.current.intensity = blink ? 1.5 : 0
        }
    })

    return (
        <group ref={vehicleRef} position={position} rotation={rotation}>
            {/* Main vehicle body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[dimensions.width, dimensions.height, dimensions.length]} />
                <meshStandardMaterial 
                    color={dimensions.color}
                    metalness={0.7}
                    roughness={0.3}
                    envMapIntensity={1.2}
                />
            </mesh>

            {/* Windshield */}
            <mesh position={[0, dimensions.height * 0.3, dimensions.length * 0.25]} castShadow>
                <boxGeometry args={[dimensions.width * 0.9, dimensions.height * 0.4, dimensions.length * 0.2]} />
                <meshStandardMaterial 
                    color="#1a1a2e"
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Wheels */}
            {[
                [-dimensions.width * 0.4, -dimensions.height * 0.5, dimensions.length * 0.3],
                [dimensions.width * 0.4, -dimensions.height * 0.5, dimensions.length * 0.3],
                [-dimensions.width * 0.4, -dimensions.height * 0.5, -dimensions.length * 0.3],
                [dimensions.width * 0.4, -dimensions.height * 0.5, -dimensions.length * 0.3],
            ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                </mesh>
            ))}

            {/* Headlights (front) */}
            <pointLight 
                position={[dimensions.width * 0.3, 0, dimensions.length * 0.5]} 
                intensity={0.5} 
                distance={15}
                color="#FFFFDD"
                castShadow
            />
            <pointLight 
                position={[-dimensions.width * 0.3, 0, dimensions.length * 0.5]} 
                intensity={0.5} 
                distance={15}
                color="#FFFFDD"
                castShadow
            />

            {/* Brake lights (rear) */}
            <pointLight 
                ref={(el) => { if (el) brakeLightsRef.current[0] = el }}
                position={[dimensions.width * 0.3, 0, -dimensions.length * 0.5]} 
                intensity={isBraking ? 2 : 0.3} 
                distance={5}
                color="#FF0000"
            />
            <pointLight 
                ref={(el) => { if (el) brakeLightsRef.current[1] = el }}
                position={[-dimensions.width * 0.3, 0, -dimensions.length * 0.5]} 
                intensity={isBraking ? 2 : 0.3} 
                distance={5}
                color="#FF0000"
            />

            {/* Brake light geometry */}
            <mesh position={[dimensions.width * 0.35, 0, -dimensions.length * 0.48]}>
                <boxGeometry args={[0.3, 0.2, 0.1]} />
                <meshStandardMaterial 
                    color="#FF0000" 
                    emissive="#FF0000"
                    emissiveIntensity={isBraking ? 2 : 0.5}
                />
            </mesh>
            <mesh position={[-dimensions.width * 0.35, 0, -dimensions.length * 0.48]}>
                <boxGeometry args={[0.3, 0.2, 0.1]} />
                <meshStandardMaterial 
                    color="#FF0000" 
                    emissive="#FF0000"
                    emissiveIntensity={isBraking ? 2 : 0.5}
                />
            </mesh>

            {/* Emergency lights (if emergency vehicle) */}
            {isEmergency && (
                <>
                    <pointLight 
                        ref={emergencyLightRef}
                        position={[0, dimensions.height * 0.7, 0]} 
                        intensity={2} 
                        distance={30}
                        color="#FF0000"
                    />
                    <mesh position={[0, dimensions.height * 0.6, 0]}>
                        <boxGeometry args={[0.8, 0.3, 0.4]} />
                        <meshStandardMaterial 
                            color="#FF0000" 
                            emissive="#FF0000"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                </>
            )}

            {/* Turn signals */}
            {turnSignal !== 'none' && (
                <pointLight 
                    ref={turnSignalRef}
                    position={[
                        turnSignal === 'left' ? -dimensions.width * 0.45 : dimensions.width * 0.45,
                        0,
                        dimensions.length * 0.4
                    ]} 
                    intensity={1.5} 
                    distance={5}
                    color="#FFA500"
                />
            )}

            {/* Roof rack for delivery trucks */}
            {type === 'delivery' && (
                <mesh position={[0, dimensions.height * 0.6, -dimensions.length * 0.15]}>
                    <boxGeometry args={[dimensions.width, dimensions.height * 0.3, dimensions.length * 0.6]} />
                    <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.4} />
                </mesh>
            )}

            {/* Taxi sign */}
            {type === 'taxi' && (
                <mesh position={[0, dimensions.height * 0.8, 0]}>
                    <boxGeometry args={[0.8, 0.2, 0.3]} />
                    <meshStandardMaterial 
                        color="#FFFF00" 
                        emissive="#FFFF00"
                        emissiveIntensity={1}
                    />
                </mesh>
            )}
        </group>
    )
}
