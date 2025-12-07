import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, Stars, Environment } from '@react-three/drei'
import { Terrain } from './Terrain'
import { EnhancedTerrain } from './EnhancedTerrain'
import { InteractionManager } from './InteractionManager'
import { RoadSegment } from './RoadSegment'
import { useGameStore } from '../store/gameStore'
import { NodeBasedTrafficSystem } from '../systems/NodeBasedTrafficSystem'
import { CitySystem } from '../systems/CitySystem'
import { Zone } from './Zone'
import { Building } from './Building'
import { TrafficHeatmap } from './TrafficHeatmap'
import { NoisePollution } from './NoisePollution'
import { HighwaySign } from './HighwaySign'
import { useCameraController } from '../utils/CameraController'
import { PostProcessing } from './PostProcessing'
import { WeatherSystem } from '../systems/WeatherSystemV3'
import { GameSystemsManagerV3 } from '../systems/GameSystemsManagerV3'
import { AdvancedLighting, CloudSystem, VolumetricLighting } from './AdvancedEffects'
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

    return (
        <>
            {/* V3 Systems Manager - Coordinates all new features */}
            <GameSystemsManagerV3 />
            
            {/* Advanced Lighting System V3 */}
            <AdvancedLighting timeOfDay={timeOfDay} />
            
            {/* Weather System V3 */}
            <WeatherSystem />
            
            {/* Cloud System for atmosphere */}
            <CloudSystem />
            
            {/* Volumetric god rays during daytime */}
            {isDaytime && <VolumetricLighting />}

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

            {/* Enhanced Terrain with height variation */}
            <EnhancedTerrain />
            <InteractionManager />
            <NodeBasedTrafficSystem />
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
            camera={{ position: [50, 50, 50], fov: 50, near: 1, far: 500 }}
            gl={{
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: isDaytime ? 1.1 : 0.7
            }}
            dpr={Math.min(window.devicePixelRatio, 1.5)}
        >
            {/* Environment and Sky */}
            <Sky
                sunPosition={sunPosition}
                turbidity={isDaytime ? 8 : 2}
                rayleigh={isDaytime ? 2 : 0.5}
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
