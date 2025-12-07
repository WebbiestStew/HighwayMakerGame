import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { RoadNode, RoadConnection } from '../types/RoadNetwork'

export const useNodeBasedRoadBuilder = () => {
    const { addRoadNode, addRoadConnection } = useGameStore()
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

    // Convert old roads to node-based system
    const convertOldRoadsToNodes = () => {
        const { roads } = useGameStore.getState()
        const nodeMap = new Map<string, RoadNode>()
        const newConnections: RoadConnection[] = []

        roads.forEach((road, index) => {
            // Create nodes for start and end points
            const startKey = `${road.start[0]},${road.start[2]}`
            const endKey = `${road.end[0]},${road.end[2]}`

            if (!nodeMap.has(startKey)) {
                const startNode: RoadNode = {
                    id: `node-start-${index}`,
                    position: road.start,
                    connectedNodes: [],
                    isIntersection: false
                }
                nodeMap.set(startKey, startNode)
            }

            if (!nodeMap.has(endKey)) {
                const endNode: RoadNode = {
                    id: `node-end-${index}`,
                    position: road.end,
                    connectedNodes: [],
                    isIntersection: false
                }
                nodeMap.set(endKey, endNode)
            }

            const startNode = nodeMap.get(startKey)!
            const endNode = nodeMap.get(endKey)!

            // Create connection
            const connection: RoadConnection = {
                id: `connection-${index}`,
                startNodeId: startNode.id,
                endNodeId: endNode.id,
                lanes: 2,
                isOneWay: false
            }

            newConnections.push(connection)
        })

        // Add all nodes and connections to store
        const allNodes = Array.from(nodeMap.values())
        allNodes.forEach(node => addRoadNode(node))
        newConnections.forEach(conn => addRoadConnection(conn))
    }

    // Helper to create a simple road network
    const createSimpleIntersection = (centerX: number, centerZ: number, spacing: number = 30) => {
        const centerNode: RoadNode = {
            id: `node-center-${Date.now()}`,
            position: [centerX, 0, centerZ],
            connectedNodes: [],
            isIntersection: true
        }

        // Create 4 nodes around center (N, S, E, W)
        const northNode: RoadNode = {
            id: `node-north-${Date.now()}`,
            position: [centerX, 0, centerZ + spacing],
            connectedNodes: [],
            isIntersection: false
        }

        const southNode: RoadNode = {
            id: `node-south-${Date.now()}`,
            position: [centerX, 0, centerZ - spacing],
            connectedNodes: [],
            isIntersection: false
        }

        const eastNode: RoadNode = {
            id: `node-east-${Date.now()}`,
            position: [centerX + spacing, 0, centerZ],
            connectedNodes: [],
            isIntersection: false
        }

        const westNode: RoadNode = {
            id: `node-west-${Date.now()}`,
            position: [centerX - spacing, 0, centerZ],
            connectedNodes: [],
            isIntersection: false
        }

        // Add nodes
        addRoadNode(centerNode)
        addRoadNode(northNode)
        addRoadNode(southNode)
        addRoadNode(eastNode)
        addRoadNode(westNode)

        // Create connections
        setTimeout(() => {
            addRoadConnection({
                id: `conn-north-${Date.now()}`,
                startNodeId: centerNode.id,
                endNodeId: northNode.id,
                lanes: 2,
                isOneWay: false
            })

            addRoadConnection({
                id: `conn-south-${Date.now()}`,
                startNodeId: centerNode.id,
                endNodeId: southNode.id,
                lanes: 2,
                isOneWay: false
            })

            addRoadConnection({
                id: `conn-east-${Date.now()}`,
                startNodeId: centerNode.id,
                endNodeId: eastNode.id,
                lanes: 2,
                isOneWay: false
            })

            addRoadConnection({
                id: `conn-west-${Date.now()}`,
                startNodeId: centerNode.id,
                endNodeId: westNode.id,
                lanes: 2,
                isOneWay: false
            })
        }, 100)
    }

    const createNode = (position: [number, number, number]): string => {
        const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const node: RoadNode = {
            id: nodeId,
            position,
            connectedNodes: [],
            isIntersection: false
        }
        addRoadNode(node)
        return nodeId
    }

    const connectNodes = (startNodeId: string, endNodeId: string, lanes: number = 2) => {
        const connectionId = `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const connection: RoadConnection = {
            id: connectionId,
            startNodeId,
            endNodeId,
            lanes,
            isOneWay: false
        }
        addRoadConnection(connection)
        return connectionId
    }

    return {
        selectedNodeId,
        setSelectedNodeId,
        createNode,
        connectNodes,
        convertOldRoadsToNodes,
        createSimpleIntersection
    }
}
