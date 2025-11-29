import React, { useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'
import { snapToGrid } from '../utils/grid'
import { soundManager } from '../utils/SoundManager'
import { RoadSegment } from './RoadSegment'

export const InteractionManager: React.FC = () => {
    const { selectedTool, addRoad, isCurveMode, removeRoad, removeZone, removeSign, removeBuilding } = useGameStore()
    useThree()
    const [startPoint, setStartPoint] = useState<THREE.Vector3 | null>(null)
    const [endPoint, setEndPoint] = useState<THREE.Vector3 | null>(null)
    const [currentPoint, setCurrentPoint] = useState<THREE.Vector3 | null>(null)

    const handlePointerMove = (e: any) => {
        if (selectedTool !== 'road' && selectedTool !== 'zone' && selectedTool !== 'sign' && selectedTool !== 'demolish') return

        // Raycast to the ground plane
        const intersections = e.intersections
        if (intersections.length > 0) {
            const point = intersections[0].point
            const snapped = snapToGrid(point)
            setCurrentPoint(snapped)
        }
    }

    const handleClick = (e: any) => {
        if (!currentPoint) return
        e.stopPropagation()

        // Demolish mode - detect and remove nearby objects
        if (selectedTool === 'demolish') {
            const { roads, zones, signs, buildings } = useGameStore.getState()
            const clickPos = currentPoint
            const DEMOLISH_RADIUS = 5

            // Check roads
            for (const road of roads) {
                const start = new THREE.Vector3(...road.start)
                const end = new THREE.Vector3(...road.end)
                const midpoint = start.clone().add(end).multiplyScalar(0.5)
                
                if (clickPos.distanceTo(midpoint) < DEMOLISH_RADIUS) {
                    removeRoad(road.id)
                    soundManager.playSuccess()
                    return
                }
            }

            // Check zones
            for (const zone of zones) {
                const zonePos = new THREE.Vector3(...zone.position)
                if (clickPos.distanceTo(zonePos) < DEMOLISH_RADIUS) {
                    removeZone(zone.id)
                    soundManager.playSuccess()
                    return
                }
            }

            // Check signs
            for (const sign of signs) {
                const signPos = new THREE.Vector3(...sign.position)
                if (clickPos.distanceTo(signPos) < DEMOLISH_RADIUS) {
                    removeSign(sign.id)
                    soundManager.playSuccess()
                    return
                }
            }

            // Check buildings
            for (const building of buildings) {
                const buildingPos = new THREE.Vector3(...building.position)
                if (clickPos.distanceTo(buildingPos) < DEMOLISH_RADIUS) {
                    removeBuilding(building.id)
                    soundManager.playSuccess()
                    return
                }
            }

            soundManager.playError()
            return
        }

        if (selectedTool === 'sign') {
            const { selectedSignType } = useGameStore.getState()
            let defaultText = ''
            let promptText = ''

            switch (selectedSignType) {
                case 'exit':
                    defaultText = 'EXIT 42\nNext Right'
                    promptText = 'Enter exit sign text (use \\n for new line):'
                    break
                case 'warning':
                    defaultText = '⚠ CONSTRUCTION'
                    promptText = 'Enter warning text:'
                    break
                case 'info':
                    defaultText = 'REST AREA\n2 MILES'
                    promptText = 'Enter info text:'
                    break
                case 'speed':
                    defaultText = '65'
                    promptText = 'Enter speed limit:'
                    break
                case 'distance':
                    defaultText = 'MILE 100'
                    promptText = 'Enter distance marker:'
                    break
            }

            const text = prompt(promptText, defaultText)
            if (text) {
                const { addSign } = useGameStore.getState()
                addSign({
                    id: crypto.randomUUID(),
                    position: [currentPoint.x, currentPoint.y, currentPoint.z],
                    text: text.replace(/\\n/g, '\n'),
                    type: selectedSignType
                })
                soundManager.playSignPlaced()
            }
            return
        }

        if (selectedTool === 'zone') {
            const { addZone, selectedZoneType } = useGameStore.getState()
            addZone({
                id: crypto.randomUUID(),
                type: selectedZoneType,
                position: [currentPoint.x, currentPoint.y, currentPoint.z],
                size: [10, 10, 10]
            })
            soundManager.playZonePlaced()
            return
        }

        if (selectedTool !== 'road') return

        if (!startPoint) {
            // Step 1: Set Start
            setStartPoint(currentPoint)
            soundManager.playUIClick()
        } else if (!endPoint) {
            // Step 2: Set End
            if (!currentPoint.equals(startPoint)) {
                if (isCurveMode) {
                    setEndPoint(currentPoint)
                    soundManager.playUIClick()
                } else {
                    // Straight road - finish immediately
                    addRoad({
                        id: crypto.randomUUID(),
                        start: [startPoint.x, startPoint.y, startPoint.z],
                        end: [currentPoint.x, currentPoint.y, currentPoint.z]
                    })
                    soundManager.playConstruction()
                    setTimeout(() => soundManager.playRoadPlaced(), 300)
                    setStartPoint(null)
                }
            }
        } else {
            // Step 3: Set Control Point (Curve Mode only)
            addRoad({
                id: crypto.randomUUID(),
                start: [startPoint.x, startPoint.y, startPoint.z],
                end: [endPoint.x, endPoint.y, endPoint.z],
                controlPoint: [currentPoint.x, currentPoint.y, currentPoint.z]
            })
            soundManager.playConstruction()
            setTimeout(() => soundManager.playRoadPlaced(), 300)
            setStartPoint(null)
            setEndPoint(null)
        }
    }

    return (
        <group>
            {/* Invisible Plane for Raycasting */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.01, 0]}
                visible={false}
                onPointerMove={handlePointerMove}
                onClick={handleClick}
            >
                <planeGeometry args={[1000, 1000]} />
                <meshBasicMaterial color="red" wireframe />
            </mesh>

            {/* Zone Preview */}
            {selectedTool === 'zone' && currentPoint && (
                <mesh position={currentPoint} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[10, 10]} />
                    <meshBasicMaterial color="white" transparent opacity={0.2} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(10, 10)]} />
                        <lineBasicMaterial color="white" />
                    </lineSegments>
                </mesh>
            )}

            {/* Phantom Road (Preview) */}
            {selectedTool === 'road' && startPoint && currentPoint && !endPoint && (
                <RoadSegment
                    start={[startPoint.x, startPoint.y, startPoint.z]}
                    end={[currentPoint.x, currentPoint.y, currentPoint.z]}
                />
            )}

            {/* Curve Preview */}
            {selectedTool === 'road' && startPoint && endPoint && currentPoint && (
                <RoadSegment
                    start={[startPoint.x, startPoint.y, startPoint.z]}
                    end={[endPoint.x, endPoint.y, endPoint.z]}
                    controlPoint={[currentPoint.x, currentPoint.y, currentPoint.z]}
                />
            )}

            {/* Cursor Highlight */}
            {selectedTool === 'road' && currentPoint && (
                <mesh position={currentPoint} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[2, 3, 32]} />
                    <meshBasicMaterial color="yellow" />
                </mesh>
            )}

            {/* Demolish Cursor */}
            {selectedTool === 'demolish' && currentPoint && (
                <mesh position={currentPoint} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[4, 5, 32]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            )}

            {/* Start/End Point Highlights */}
            {selectedTool === 'road' && startPoint && (
                <mesh position={startPoint} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[2, 32]} />
                    <meshBasicMaterial color="cyan" />
                </mesh>
            )}
            {selectedTool === 'road' && endPoint && (
                <mesh position={endPoint} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[2, 32]} />
                    <meshBasicMaterial color="magenta" />
                </mesh>
            )}
        </group>
    )
}
