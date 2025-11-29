import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
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

const SceneContent: React.FC = () => {
    const { roads, zones, buildings, signs } = useGameStore()

    // Initialize camera controller
    useCameraController()

    return (
        <>
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
    return (
        <Canvas shadows camera={{ position: [50, 50, 50], fov: 45 }}>
            <color attach="background" args={['#87CEEB']} />
            <fog attach="fog" args={['#87CEEB', 80, 300]} />

            {/* Sun/Sky */}
            <Sky
                sunPosition={[100, 50, 100]}
                turbidity={8}
                rayleigh={2}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
            />

            {/* Ambient Light - Soft fill */}
            <ambientLight intensity={0.4} color="#b8d4f0" />

            {/* Key Light - Main sun */}
            <directionalLight
                position={[100, 100, 50]}
                intensity={2.5}
                color="#fffacd"
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-bias={-0.0001}
            />

            {/* Fill Light - Soften shadows */}
            <directionalLight
                position={[-50, 30, -50]}
                intensity={0.8}
                color="#8bb4d9"
            />

            {/* Rim Light - Edge definition */}
            <directionalLight
                position={[0, 20, -100]}
                intensity={0.5}
                color="#ffd9a0"
            />

            <SceneContent />
        </Canvas>
    )
}
