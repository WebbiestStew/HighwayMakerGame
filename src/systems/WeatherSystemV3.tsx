import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog' | 'storm' | 'overcast'

export interface WeatherState {
    type: WeatherType
    intensity: number // 0-1
    windSpeed: number
    windDirection: THREE.Vector2
    temperature: number // Celsius
    visibility: number // 0-1
    duration: number // seconds remaining
}

export class WeatherSystemV3 {
    private static instance: WeatherSystemV3
    private currentWeather: WeatherState
    private transitionTimer: number = 0
    // private weatherChangeInterval: number = 300 // For future use

    private constructor() {
        this.currentWeather = {
            type: 'clear',
            intensity: 0,
            windSpeed: 0,
            windDirection: new THREE.Vector2(1, 0),
            temperature: 20,
            visibility: 1,
            duration: 300
        }
    }

    static getInstance(): WeatherSystemV3 {
        if (!this.instance) {
            this.instance = new WeatherSystemV3()
        }
        return this.instance
    }

    update(deltaTime: number) {
        this.transitionTimer += deltaTime
        this.currentWeather.duration -= deltaTime

        // Auto-change weather
        if (this.currentWeather.duration <= 0) {
            this.changeWeather()
        }

        // Gradually adjust weather intensity
        this.updateWeatherTransition(deltaTime)
    }

    private changeWeather() {
        const weathers: WeatherType[] = ['clear', 'rain', 'snow', 'fog', 'storm', 'overcast']
        const weights = [0.4, 0.2, 0.1, 0.1, 0.05, 0.15] // Clear weather more common
        
        const random = Math.random()
        let sum = 0
        let newWeather: WeatherType = 'clear'
        
        for (let i = 0; i < weathers.length; i++) {
            sum += weights[i]
            if (random <= sum) {
                newWeather = weathers[i]
                break
            }
        }

        this.setWeather(newWeather)
    }

    setWeather(type: WeatherType, forceDuration?: number) {
        this.currentWeather.type = type
        this.currentWeather.duration = forceDuration || Math.random() * 300 + 180 // 3-8 minutes

        switch (type) {
            case 'clear':
                this.currentWeather.intensity = 0
                this.currentWeather.windSpeed = Math.random() * 2
                this.currentWeather.temperature = 20 + Math.random() * 10
                this.currentWeather.visibility = 1
                break
            case 'rain':
                this.currentWeather.intensity = 0.3 + Math.random() * 0.5
                this.currentWeather.windSpeed = 3 + Math.random() * 5
                this.currentWeather.temperature = 10 + Math.random() * 10
                this.currentWeather.visibility = 0.7
                break
            case 'snow':
                this.currentWeather.intensity = 0.2 + Math.random() * 0.6
                this.currentWeather.windSpeed = 1 + Math.random() * 3
                this.currentWeather.temperature = -5 + Math.random() * 5
                this.currentWeather.visibility = 0.6
                break
            case 'fog':
                this.currentWeather.intensity = 0.5 + Math.random() * 0.5
                this.currentWeather.windSpeed = 0.5 + Math.random()
                this.currentWeather.temperature = 5 + Math.random() * 10
                this.currentWeather.visibility = 0.3
                break
            case 'storm':
                this.currentWeather.intensity = 0.7 + Math.random() * 0.3
                this.currentWeather.windSpeed = 10 + Math.random() * 10
                this.currentWeather.temperature = 8 + Math.random() * 8
                this.currentWeather.visibility = 0.5
                break
            case 'overcast':
                this.currentWeather.intensity = 0.3
                this.currentWeather.windSpeed = 2 + Math.random() * 3
                this.currentWeather.temperature = 12 + Math.random() * 8
                this.currentWeather.visibility = 0.85
                break
        }

        // Random wind direction
        const angle = Math.random() * Math.PI * 2
        this.currentWeather.windDirection.set(Math.cos(angle), Math.sin(angle))
    }

    private updateWeatherTransition(deltaTime: number) {
        // Smooth transitions
        const targetIntensity = this.getTargetIntensity()
        const transitionSpeed = 0.1 * deltaTime

        if (Math.abs(this.currentWeather.intensity - targetIntensity) > 0.01) {
            this.currentWeather.intensity += (targetIntensity - this.currentWeather.intensity) * transitionSpeed
        }
    }

    private getTargetIntensity(): number {
        switch (this.currentWeather.type) {
            case 'clear': return 0
            case 'rain': return 0.4
            case 'snow': return 0.4
            case 'fog': return 0.7
            case 'storm': return 0.85
            case 'overcast': return 0.3
            default: return 0
        }
    }

    getWeather(): WeatherState {
        return { ...this.currentWeather }
    }

    getTrafficSpeedMultiplier(): number {
        switch (this.currentWeather.type) {
            case 'clear': return 1.0
            case 'overcast': return 0.95
            case 'rain': return 0.75 - (this.currentWeather.intensity * 0.15)
            case 'snow': return 0.6 - (this.currentWeather.intensity * 0.2)
            case 'fog': return 0.7 - (this.currentWeather.intensity * 0.25)
            case 'storm': return 0.5
            default: return 1.0
        }
    }
}

// Rain Particle System
export const RainEffect: React.FC<{ intensity: number, windDirection: THREE.Vector2 }> = ({ intensity, windDirection }) => {
    const particlesRef = useRef<THREE.Points>(null)
    const particleCount = Math.floor(intensity * 5000)

    useEffect(() => {
        if (!particlesRef.current || particleCount === 0) return

        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const velocities = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            positions[i3] = (Math.random() - 0.5) * 200
            positions[i3 + 1] = Math.random() * 100
            positions[i3 + 2] = (Math.random() - 0.5) * 200
            
            velocities[i3] = windDirection.x * (5 + Math.random() * 3)
            velocities[i3 + 1] = -(20 + Math.random() * 10)
            velocities[i3 + 2] = windDirection.y * (5 + Math.random() * 3)
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
        particlesRef.current.geometry = geometry
    }, [particleCount, windDirection])

    useFrame((_, delta) => {
        if (!particlesRef.current) return
        
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
        const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            
            positions[i3] += velocities[i3] * delta
            positions[i3 + 1] += velocities[i3 + 1] * delta
            positions[i3 + 2] += velocities[i3 + 2] * delta

            // Reset particles that go below ground
            if (positions[i3 + 1] < 0) {
                positions[i3 + 1] = 100
                positions[i3] = (Math.random() - 0.5) * 200
                positions[i3 + 2] = (Math.random() - 0.5) * 200
            }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true
    })

    if (particleCount === 0) return null

    return (
        <points ref={particlesRef}>
            <pointsMaterial
                size={0.3}
                color="#a0c4ff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}

// Snow Particle System
export const SnowEffect: React.FC<{ intensity: number, windDirection: THREE.Vector2 }> = ({ intensity, windDirection }) => {
    const particlesRef = useRef<THREE.Points>(null)
    const particleCount = Math.floor(intensity * 3000)

    useEffect(() => {
        if (!particlesRef.current || particleCount === 0) return

        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const velocities = new Float32Array(particleCount * 3)
        const sizes = new Float32Array(particleCount)

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            positions[i3] = (Math.random() - 0.5) * 200
            positions[i3 + 1] = Math.random() * 100
            positions[i3 + 2] = (Math.random() - 0.5) * 200
            
            velocities[i3] = windDirection.x * (1 + Math.random() * 2)
            velocities[i3 + 1] = -(2 + Math.random() * 3)
            velocities[i3 + 2] = windDirection.y * (1 + Math.random() * 2)
            
            sizes[i] = 0.5 + Math.random() * 1.5
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        particlesRef.current.geometry = geometry
    }, [particleCount, windDirection])

    useFrame((state, delta) => {
        if (!particlesRef.current) return
        
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
        const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            
            // Add drift
            const drift = Math.sin(state.clock.elapsedTime * 2 + i) * 0.5
            
            positions[i3] += (velocities[i3] + drift) * delta
            positions[i3 + 1] += velocities[i3 + 1] * delta
            positions[i3 + 2] += velocities[i3 + 2] * delta

            // Reset particles
            if (positions[i3 + 1] < 0) {
                positions[i3 + 1] = 100
                positions[i3] = (Math.random() - 0.5) * 200
                positions[i3 + 2] = (Math.random() - 0.5) * 200
            }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true
    })

    if (particleCount === 0) return null

    return (
        <points ref={particlesRef}>
            <pointsMaterial
                size={1.5}
                color="#ffffff"
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    )
}

// Main Weather Component
export const WeatherSystem: React.FC = () => {
    const weatherSystem = WeatherSystemV3.getInstance()
    const [weather, setWeather] = React.useState<WeatherState>(weatherSystem.getWeather())

    useFrame((_, delta) => {
        weatherSystem.update(delta)
        setWeather(weatherSystem.getWeather())
    })

    return (
        <>
            {weather.type === 'rain' && <RainEffect intensity={weather.intensity} windDirection={weather.windDirection} />}
            {weather.type === 'snow' && <SnowEffect intensity={weather.intensity} windDirection={weather.windDirection} />}
            {weather.type === 'storm' && <RainEffect intensity={weather.intensity * 1.3} windDirection={weather.windDirection} />}
            
            {/* Fog effect */}
            {(weather.type === 'fog' || weather.intensity > 0.3) && (
                <fog 
                    attach="fog" 
                    args={[
                        weather.type === 'fog' ? '#b0b0b0' : '#808080',
                        20 / weather.visibility,
                        150 / weather.visibility
                    ]} 
                />
            )}
        </>
    )
}
