import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import { TrafficLight } from '../components/TrafficLight'
import { Vehicle } from '../components/Vehicle'
import { RoadNodeMarker } from '../components/RoadNodeMarker'
import { RoadConnectionSegment } from '../components/RoadConnectionSegment'
import * as THREE from 'three'
import { RoadNetwork, type Intersection, type RoadVehicle } from '../types/RoadNetwork'

const LIGHT_CYCLE_DURATION = 10 // seconds
const YELLOW_DURATION = 2
const VEHICLE_SPAWN_INTERVAL = 2.5
const MAX_VEHICLES_PER_CONNECTION = 4

export const NodeBasedTrafficSystem: React.FC = () => {
    const {
        roadNodes,
        roadConnections,
        intersections,
        addIntersection,
        updateIntersection,
        roadVehicles,
        addRoadVehicle,
        updateRoadVehicle,
        removeRoadVehicle,
        setActiveVehicles
    } = useGameStore()

    const lastVehicleSpawnRef = useRef(0)
    const vehicleIdCounterRef = useRef(0)

    // Detect and create intersections at nodes with 3+ connections
    useEffect(() => {
        roadNodes.forEach(node => {
            if (node.connectedNodes.length >= 3 && !node.isIntersection) {
                // Mark as intersection
                const existingIntersection = intersections.find(i => i.nodeId === node.id)
                
                if (!existingIntersection) {
                    // Get all connected roads
                    const connectedRoadIds = roadConnections
                        .filter(c => c.startNodeId === node.id || c.endNodeId === node.id)
                        .map(c => c.id)

                    // Calculate angles for each connected road
                    const lightAngles = node.connectedNodes.map(connectedNodeId => {
                        const connectedNode = RoadNetwork.findNode(roadNodes, connectedNodeId)
                        if (!connectedNode) return 0
                        return RoadNetwork.calculateRoadAngle(node, connectedNode)
                    })

                    // Create traffic lights for each connected road
                    const trafficLights: Intersection['trafficLights'] = {}
                    connectedRoadIds.forEach((roadId, index) => {
                        trafficLights[roadId] = {
                            state: index < 2 ? 'green' : 'red', // First 2 directions green
                            direction: lightAngles[index] || 0
                        }
                    })

                    const newIntersection: Intersection = {
                        id: `intersection-${node.id}`,
                        nodeId: node.id,
                        position: node.position,
                        connectedRoads: connectedRoadIds,
                        trafficLights,
                        cycleTimer: 0,
                        cyclePhase: 0,
                        lightAngles
                    }

                    addIntersection(newIntersection)
                }
            }
        })
    }, [roadNodes, roadConnections, intersections, addIntersection])

    // Update traffic light cycles
    useFrame((state, delta) => {
        // Update traffic lights at intersections
        intersections.forEach(intersection => {
            const newTimer = intersection.cycleTimer + delta
            const numPhases = Math.ceil(intersection.connectedRoads.length / 2)

            if (newTimer >= LIGHT_CYCLE_DURATION) {
                // Move to next phase
                const nextPhase = (intersection.cyclePhase + 1) % numPhases
                
                // Update all lights based on new phase
                const updatedLights = { ...intersection.trafficLights }
                intersection.connectedRoads.forEach((roadId, index) => {
                    const phaseIndex = Math.floor(index / 2)
                    updatedLights[roadId] = {
                        ...updatedLights[roadId],
                        state: phaseIndex === nextPhase ? 'green' : 'red'
                    }
                })

                updateIntersection(intersection.id, {
                    cycleTimer: 0,
                    cyclePhase: nextPhase,
                    trafficLights: updatedLights
                })
            } else {
                // Check for yellow light transition
                const timeInCycle = newTimer % LIGHT_CYCLE_DURATION
                
                if (timeInCycle >= (LIGHT_CYCLE_DURATION - YELLOW_DURATION)) {
                    // Show yellow for lights that are currently green
                    const updatedLights = { ...intersection.trafficLights }
                    let hasChanges = false
                    
                    Object.keys(updatedLights).forEach(roadId => {
                        if (updatedLights[roadId].state === 'green') {
                            updatedLights[roadId] = { ...updatedLights[roadId], state: 'yellow' }
                            hasChanges = true
                        }
                    })

                    if (hasChanges) {
                        updateIntersection(intersection.id, {
                            trafficLights: updatedLights
                        })
                    }
                }

                updateIntersection(intersection.id, {
                    cycleTimer: newTimer
                })
            }
        })

        // Spawn vehicles
        if (roadConnections.length > 0 && state.clock.elapsedTime - lastVehicleSpawnRef.current > VEHICLE_SPAWN_INTERVAL) {
            lastVehicleSpawnRef.current = state.clock.elapsedTime

            // Find connections that aren't too crowded
            const availableConnections = roadConnections.filter(conn => {
                const vehiclesOnConnection = roadVehicles.filter(v => v.connectionId === conn.id).length
                return vehiclesOnConnection < MAX_VEHICLES_PER_CONNECTION
            })

            if (availableConnections.length > 0) {
                const randomConnection = availableConnections[Math.floor(Math.random() * availableConnections.length)]
                const startNode = RoadNetwork.findNode(roadNodes, randomConnection.startNodeId)
                const endNode = RoadNetwork.findNode(roadNodes, randomConnection.endNodeId)

                if (startNode && endNode) {
                    const vehicleTypes: Array<'car' | 'truck' | 'bus'> = ['car', 'car', 'car', 'truck', 'bus']
                    const randomType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]
                    const colors = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8800', '#8800ff', '#00ff88']
                    const randomColor = colors[Math.floor(Math.random() * colors.length)]

                    const angle = RoadNetwork.calculateRoadAngle(startNode, endNode)
                    const randomLane = Math.floor(Math.random() * randomConnection.lanes)

                    const newVehicle: RoadVehicle = {
                        id: `vehicle-${vehicleIdCounterRef.current++}`,
                        connectionId: randomConnection.id,
                        position: [...startNode.position],
                        rotation: [0, angle, 0],
                        speed: 0,
                        targetSpeed: randomType === 'car' ? 0.4 : randomType === 'truck' ? 0.25 : 0.3,
                        progress: 0,
                        type: randomType,
                        color: randomColor,
                        lane: randomLane,
                        currentNodeId: startNode.id,
                        nextNodeId: endNode.id,
                        waitingAtIntersection: false,
                        pathQueue: []
                    }

                    addRoadVehicle(newVehicle)
                }
            }
        }

        // Update vehicle positions
        roadVehicles.forEach(vehicle => {
            const connection = roadConnections.find(c => c.id === vehicle.connectionId)
            if (!connection) {
                removeRoadVehicle(vehicle.id)
                return
            }

            const startNode = RoadNetwork.findNode(roadNodes, connection.startNodeId)
            const endNode = RoadNetwork.findNode(roadNodes, connection.endNodeId)

            if (!startNode || !endNode) {
                removeRoadVehicle(vehicle.id)
                return
            }

            let newProgress = vehicle.progress
            let newSpeed = vehicle.speed
            let shouldStop = false

            // Check if approaching intersection
            if (vehicle.progress > 0.7) {
                const intersection = RoadNetwork.getIntersectionsAtNode(intersections, endNode.id)
                
                if (intersection && endNode.isIntersection) {
                    const canProceed = RoadNetwork.canVehicleProceedThroughIntersection(
                        intersection,
                        connection.id
                    )
                    
                    if (!canProceed) {
                        shouldStop = true
                    }
                }
            }

            // Check for vehicle ahead
            const vehiclesAhead = roadVehicles.filter(v => 
                v.connectionId === vehicle.connectionId &&
                v.id !== vehicle.id &&
                v.progress > vehicle.progress &&
                v.progress - vehicle.progress < 0.15 &&
                v.lane === vehicle.lane
            )

            if (vehiclesAhead.length > 0) {
                shouldStop = true
            }

            // Adjust speed
            if (shouldStop) {
                newSpeed = Math.max(0, newSpeed - delta * 0.6)
            } else {
                if (newSpeed < vehicle.targetSpeed) {
                    newSpeed = Math.min(vehicle.targetSpeed, newSpeed + delta * 0.4)
                }
            }

            newProgress += newSpeed * delta

            // Handle reaching end of connection
            if (newProgress >= 1) {
                // Try to find next connection
                const nextConnections = roadConnections.filter(c => 
                    c.startNodeId === endNode.id && c.id !== connection.id
                )

                if (nextConnections.length > 0) {
                    // Pick random next road
                    const nextConnection = nextConnections[Math.floor(Math.random() * nextConnections.length)]
                    const nextEndNode = RoadNetwork.findNode(roadNodes, nextConnection.endNodeId)

                    if (nextEndNode) {
                        const angle = RoadNetwork.calculateRoadAngle(endNode, nextEndNode)
                        
                        updateRoadVehicle(vehicle.id, {
                            connectionId: nextConnection.id,
                            currentNodeId: endNode.id,
                            nextNodeId: nextEndNode.id,
                            progress: 0,
                            rotation: [0, angle, 0],
                            speed: newSpeed * 0.5, // Slow down for turn
                            lane: Math.floor(Math.random() * nextConnection.lanes)
                        })
                        return
                    }
                }

                // No next connection, remove vehicle
                removeRoadVehicle(vehicle.id)
                return
            }

            // Calculate new position
            const newPosition = RoadNetwork.getPositionAlongConnection(
                startNode,
                endNode,
                newProgress,
                vehicle.lane,
                connection.lanes
            )

            // Calculate rotation
            const direction = new THREE.Vector3()
                .subVectors(new THREE.Vector3(...endNode.position), new THREE.Vector3(...startNode.position))
                .normalize()
            const angle = Math.atan2(direction.x, direction.z)

            updateRoadVehicle(vehicle.id, {
                position: [newPosition.x, newPosition.y + 0.3, newPosition.z],
                rotation: [0, angle, 0],
                speed: newSpeed,
                progress: newProgress,
                waitingAtIntersection: shouldStop
            })
        })

        setActiveVehicles(roadVehicles.length)
    })

    return (
        <>
            {/* Render road nodes */}
            {roadNodes.map(node => (
                <RoadNodeMarker
                    key={node.id}
                    position={node.position}
                    isIntersection={node.isIntersection || node.connectedNodes.length >= 3}
                />
            ))}

            {/* Render road connections */}
            {roadConnections.map(connection => {
                const startNode = RoadNetwork.findNode(roadNodes, connection.startNodeId)
                const endNode = RoadNetwork.findNode(roadNodes, connection.endNodeId)
                
                if (!startNode || !endNode) return null

                return (
                    <RoadConnectionSegment
                        key={connection.id}
                        startNode={startNode}
                        endNode={endNode}
                        lanes={connection.lanes}
                    />
                )
            })}

            {/* Render traffic lights at intersections */}
            {intersections.map(intersection => {
                const node = RoadNetwork.findNode(roadNodes, intersection.nodeId)
                if (!node) return null

                return (
                    <React.Fragment key={intersection.id}>
                        {intersection.lightAngles.map((angle, index) => {
                            const roadId = intersection.connectedRoads[index]
                            const light = intersection.trafficLights[roadId]
                            if (!light) return null

                            // Position lights around intersection
                            const distance = 10
                            const offsetX = Math.sin(angle) * distance
                            const offsetZ = Math.cos(angle) * distance

                            return (
                                <TrafficLight
                                    key={`${intersection.id}-${index}`}
                                    position={[
                                        intersection.position[0] + offsetX,
                                        intersection.position[1],
                                        intersection.position[2] + offsetZ
                                    ]}
                                    rotation={[0, angle + Math.PI, 0]}
                                    state={light.state}
                                />
                            )
                        })}
                    </React.Fragment>
                )
            })}

            {/* Render vehicles */}
            {roadVehicles.map(vehicle => (
                <Vehicle
                    key={vehicle.id}
                    position={new THREE.Vector3(...vehicle.position)}
                    rotation={new THREE.Euler(...vehicle.rotation)}
                    color={vehicle.color}
                    type={vehicle.type}
                />
            ))}
        </>
    )
}
