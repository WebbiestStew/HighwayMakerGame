import * as THREE from 'three'

export interface RoadNode {
    id: string
    position: [number, number, number]
    connectedNodes: string[] // IDs of connected nodes
    isIntersection: boolean
}

export interface RoadConnection {
    id: string
    startNodeId: string
    endNodeId: string
    lanes: number
    isOneWay: boolean
    direction?: 'forward' | 'backward' // for one-way roads
}

export interface Intersection {
    id: string
    nodeId: string
    position: [number, number, number]
    connectedRoads: string[] // Road connection IDs
    trafficLights: {
        [roadId: string]: {
            state: 'red' | 'yellow' | 'green'
            direction: number // angle in radians
        }
    }
    cycleTimer: number
    cyclePhase: number // 0-3 for 4-way intersections
    lightAngles: number[] // Angles for each traffic light
}

export interface RoadVehicle {
    id: string
    connectionId: string
    position: [number, number, number]
    rotation: [number, number, number]
    speed: number
    targetSpeed: number
    progress: number // 0 to 1 along the connection
    type: 'car' | 'truck' | 'bus'
    color: string
    lane: number
    currentNodeId?: string
    nextNodeId?: string
    waitingAtIntersection: boolean
    pathQueue: string[] // Queue of node IDs to follow
}

// Utility functions for road network
export class RoadNetwork {
    static findNode(nodes: RoadNode[], nodeId: string): RoadNode | undefined {
        return nodes.find(n => n.id === nodeId)
    }

    static findConnection(connections: RoadConnection[], startId: string, endId: string): RoadConnection | undefined {
        return connections.find(c => 
            (c.startNodeId === startId && c.endNodeId === endId) ||
            (!c.isOneWay && c.startNodeId === endId && c.endNodeId === startId)
        )
    }

    static getIntersectionsAtNode(intersections: Intersection[], nodeId: string): Intersection | undefined {
        return intersections.find(i => i.nodeId === nodeId)
    }

    static calculateRoadAngle(node1: RoadNode, node2: RoadNode): number {
        const dx = node2.position[0] - node1.position[0]
        const dz = node2.position[2] - node1.position[2]
        return Math.atan2(dx, dz)
    }

    static getPositionAlongConnection(
        startNode: RoadNode,
        endNode: RoadNode,
        progress: number,
        lane: number,
        totalLanes: number
    ): THREE.Vector3 {
        const start = new THREE.Vector3(...startNode.position)
        const end = new THREE.Vector3(...endNode.position)
        
        // Main position along road
        const position = start.lerp(end, progress)
        
        // Calculate perpendicular offset for lanes
        const direction = new THREE.Vector3().subVectors(end, start).normalize()
        const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x)
        
        // Offset based on lane (-1 to 1, where 0 is center)
        const laneWidth = 2.5
        const offset = (lane - (totalLanes - 1) / 2) * laneWidth
        
        position.add(perpendicular.multiplyScalar(offset))
        
        return position
    }

    static canVehicleProceedThroughIntersection(
        intersection: Intersection,
        approachingFromRoadId: string
    ): boolean {
        const light = intersection.trafficLights[approachingFromRoadId]
        if (!light) return true // No light, proceed
        
        return light.state === 'green'
    }

    static findPath(
        nodes: RoadNode[],
        startNodeId: string,
        endNodeId: string
    ): string[] {
        // Simple breadth-first search for pathfinding
        const queue: { nodeId: string; path: string[] }[] = [{ nodeId: startNodeId, path: [startNodeId] }]
        const visited = new Set<string>()
        
        while (queue.length > 0) {
            const current = queue.shift()!
            
            if (current.nodeId === endNodeId) {
                return current.path
            }
            
            if (visited.has(current.nodeId)) continue
            visited.add(current.nodeId)
            
            const node = RoadNetwork.findNode(nodes, current.nodeId)
            if (!node) continue
            
            for (const connectedNodeId of node.connectedNodes) {
                if (!visited.has(connectedNodeId)) {
                    queue.push({
                        nodeId: connectedNodeId,
                        path: [...current.path, connectedNodeId]
                    })
                }
            }
        }
        
        return [] // No path found
    }
}
