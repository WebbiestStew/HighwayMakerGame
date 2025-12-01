import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, Stars, Environment } from '@react-three/drei'
import { Terrain } from './Terrain'
import { InteractionManager } from './InteractionManager'
import { RoadSegment } from './RoadSegment'
import { useGameStore } from '../store/gameStore'
import { TrafficSystem } from '../systems/TrafficSystem'
import { CitySystem } from '../systems/CitySystem'
import { Zone } from './Zone'
import { Building } from './Building'
import { TrafficHeatmap } from './TrafficHeatmap'
import { NoisePollution } from './NoisePollution'
import { HighwaySign } from './HighwaySign'
import { useCameraController } from '../utils/CameraController'
import { PostProcessing } from './PostProcessing'
import * as THREE from 'three'

// Animated street lights - DISABLED FOR PERFORMANCE
const StreetLights: React.FC = () => {
    // Disabled to improve performance
    return null
}

const SceneContent: React.FC = () => {
    const { roads, zones, buildings, signs, timeOfDay } = useGameStore()

    // Initialize camera controller
    useCameraController()
    
    // Day/night colors with smooth transitions
    const isDaytime = timeOfDay === 'day'
    const skyColor = isDaytime ? '#87CEEB' : '#0a0a1a'
    const fogColor = isDaytime ? '#b0c4de' : '#0f0f2e'
    const ambientIntensity = isDaytime ? 0.6 : 0.15
    const sunIntensity = isDaytime ? 1.2 : 0.1
    
    // Night-time moon light
    const moonIntensity = isDaytime ? 0 : 0.3

    return (
        <>
            <color attach="background" args={[skyColor]} />
            <fog attach="fog" args={[fogColor, 80, 300]} />
            
            {/* Enhanced ambient light */}
            <ambientLight intensity={ambientIntensity} color={isDaytime ? '#ffffff' : '#4a5a8a'} />
            
            {/* Main sun/moon light */}
            <directionalLight
                position={isDaytime ? [100, 100, 50] : [-100, 50, -50]}
                intensity={isDaytime ? sunIntensity : moonIntensity}
                color={isDaytime ? '#ffffff' : '#b4c8ff'}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={500}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-bias={-0.0001}
            />
            
            {/* Fill light for better depth */}
            <directionalLight
                position={[-50, 30, -50]}
                intensity={isDaytime ? 0.3 : 0.1}
                color={isDaytime ? '#87CEEB' : '#2a3a6a'}
            />
            
            {/* Hemisphere light for natural sky/ground lighting */}
            <hemisphereLight
                color={isDaytime ? '#87CEEB' : '#2a3a6a'}
                groundColor={isDaytime ? '#8d7a5e' : '#1a1a2a'}
                intensity={isDaytime ? 0.4 : 0.2}
            />

            {/* Stars at night - OPTIMIZED */}
            {!isDaytime && (
                <Stars
                    radius={100}
                    depth={50}
                    count={1000}
                    factor={3}
                    saturation={0}
                    fade
                    speed={0.3}
                />
            )}

            {/* Street lights */}
            <StreetLights />

            <Terrain />
            <InteractionManager />
            <TrafficSystem />
            <CitySystem />
            <TrafficHeatmap />
            <NoisePollution />

            {roads.map((road) => (
                <RoadSegment
                    key={road.id}
                    start={road.start}
                    end={road.end}
                    controlPoint={road.controlPoint}
                />
            ))}

            {zones.map((zone) => (
                <Zone key={zone.id} type={zone.type} position={zone.position} size={zone.size} />
            ))}

            {buildings.map((building) => (
                <Building key={building.id} type={building.type} position={building.position} rotation={building.rotation} />
            ))}

            {signs.map((sign) => (
                <HighwaySign key={sign.id} position={sign.position} text={sign.text} type={sign.type} />
            ))}
        </>
    )
}

export const Scene: React.FC = () => {
    const { timeOfDay } = useGameStore()
    
    // Dynamic sky and lighting based on time of day
    const sunPosition: [number, number, number] = timeOfDay === 'day' ? [100, 50, 100] : [100, -20, 100]
    const isDaytime = timeOfDay === 'day'

    return (
        <Canvas 
            shadows 
            camera={{ position: [50, 50, 50], fov: 50 }}
            gl={{
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance',
                toneMapping: THREE.NoToneMapping,
                toneMappingExposure: 1.0
            }}
            dpr={1}
        >
            {/* Environment and Sky */}
            <Sky
                sunPosition={sunPosition}
                turbidity={isDaytime ? 10 : 2}
                rayleigh={isDaytime ? 3 : 0.5}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
                inclination={isDaytime ? 0.6 : 0.1}
                azimuth={0.25}
            />

            {/* HDR Environment for reflections */}
            <Environment preset={isDaytime ? 'sunset' : 'night'} />

            <SceneContent />
            
            {/* Advanced post-processing effects */}
            <PostProcessing />
        </Canvas>
    )
}
