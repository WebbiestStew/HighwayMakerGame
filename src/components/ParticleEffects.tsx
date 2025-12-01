import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

interface ParticleSystemProps {
    position: [number, number, number]
    type: 'smoke' | 'exhaust' | 'construction' | 'rain' | 'snow'
    intensity?: number
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ position, type, intensity = 1 }) => {
    const particlesRef = useRef<THREE.Points>(null)

    const particleCount = useMemo(() => {
        switch (type) {
            case 'smoke': return 100
            case 'exhaust': return 50
            case 'construction': return 75
            case 'rain': return 500
            case 'snow': return 400
            default: return 100
        }
    }, [type])

    const { positions, velocities, colors } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3)
        const velocities = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3

            switch (type) {
                case 'smoke':
                    positions[i3] = position[0] + (Math.random() - 0.5) * 2
                    positions[i3 + 1] = position[1] + Math.random() * 5
                    positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 2
                    velocities[i3] = (Math.random() - 0.5) * 0.02
                    velocities[i3 + 1] = 0.05 + Math.random() * 0.05
                    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
                    colors[i3] = 0.4 + Math.random() * 0.2
                    colors[i3 + 1] = 0.4 + Math.random() * 0.2
                    colors[i3 + 2] = 0.4 + Math.random() * 0.2
                    break

                case 'exhaust':
                    positions[i3] = position[0] + (Math.random() - 0.5) * 0.5
                    positions[i3 + 1] = position[1] + Math.random() * 2
                    positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
                    velocities[i3] = (Math.random() - 0.5) * 0.03
                    velocities[i3 + 1] = 0.03 + Math.random() * 0.02
                    velocities[i3 + 2] = (Math.random() - 0.5) * 0.03
                    colors[i3] = 0.3
                    colors[i3 + 1] = 0.3
                    colors[i3 + 2] = 0.3
                    break

                case 'construction':
                    positions[i3] = position[0] + (Math.random() - 0.5) * 3
                    positions[i3 + 1] = position[1] + Math.random() * 3
                    positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 3
                    velocities[i3] = (Math.random() - 0.5) * 0.05
                    velocities[i3 + 1] = 0.02 + Math.random() * 0.03
                    velocities[i3 + 2] = (Math.random() - 0.5) * 0.05
                    colors[i3] = 0.6 + Math.random() * 0.2
                    colors[i3 + 1] = 0.5 + Math.random() * 0.2
                    colors[i3 + 2] = 0.4 + Math.random() * 0.1
                    break

                case 'rain':
                    positions[i3] = position[0] + (Math.random() - 0.5) * 50
                    positions[i3 + 1] = position[1] + Math.random() * 100
                    positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 50
                    velocities[i3] = 0
                    velocities[i3 + 1] = -0.5 - Math.random() * 0.3
                    velocities[i3 + 2] = 0
                    colors[i3] = 0.7
                    colors[i3 + 1] = 0.8
                    colors[i3 + 2] = 1
                    break

                case 'snow':
                    positions[i3] = position[0] + (Math.random() - 0.5) * 50
                    positions[i3 + 1] = position[1] + Math.random() * 100
                    positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 50
                    velocities[i3] = (Math.random() - 0.5) * 0.02
                    velocities[i3 + 1] = -0.05 - Math.random() * 0.05
                    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
                    colors[i3] = 1
                    colors[i3 + 1] = 1
                    colors[i3 + 2] = 1
                    break
            }
        }

        return { positions, velocities, colors }
    }, [particleCount, type, position])

    useFrame(() => {
        if (!particlesRef.current) return

        const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3

            // Update positions
            posArray[i3] += velocities[i3] * intensity
            posArray[i3 + 1] += velocities[i3 + 1] * intensity
            posArray[i3 + 2] += velocities[i3 + 2] * intensity

            // Reset particles that go out of bounds
            if (type === 'smoke' || type === 'exhaust') {
                if (posArray[i3 + 1] > position[1] + 10) {
                    posArray[i3] = position[0] + (Math.random() - 0.5) * 2
                    posArray[i3 + 1] = position[1]
                    posArray[i3 + 2] = position[2] + (Math.random() - 0.5) * 2
                }
            } else if (type === 'construction') {
                if (posArray[i3 + 1] > position[1] + 5 || posArray[i3 + 1] < position[1]) {
                    posArray[i3] = position[0] + (Math.random() - 0.5) * 3
                    posArray[i3 + 1] = position[1] + Math.random() * 3
                    posArray[i3 + 2] = position[2] + (Math.random() - 0.5) * 3
                }
            } else if (type === 'rain' || type === 'snow') {
                if (posArray[i3 + 1] < 0) {
                    posArray[i3 + 1] = 100
                }
            }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true
    })

    const particleSize = useMemo(() => {
        switch (type) {
            case 'smoke': return 0.3
            case 'exhaust': return 0.2
            case 'construction': return 0.15
            case 'rain': return 0.1
            case 'snow': return 0.2
            default: return 0.2
        }
    }, [type])

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={particleSize}
                vertexColors
                transparent
                opacity={type === 'rain' ? 0.6 : 0.4}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

// Weather system component
export const WeatherSystem: React.FC = () => {
    const { currentEvent } = useGameStore()
    const [weather, setWeather] = React.useState<'clear' | 'rain' | 'snow'>('clear')

    React.useEffect(() => {
        // Check for weather events
        if (currentEvent?.name.includes('Winter')) {
            setWeather('snow')
        } else if (currentEvent?.name.includes('Spring')) {
            setWeather('rain')
        } else {
            setWeather('clear')
        }
    }, [currentEvent])

    if (weather === 'clear') return null

    return (
        <ParticleSystem
            position={[0, 50, 0]}
            type={weather}
            intensity={1}
        />
    )
}
