import * as THREE from 'three'

interface Road {
    id: string
    start: [number, number, number]
    end: [number, number, number]
    controlPoint?: [number, number, number]
}

interface RoadNode {
    id: string
    position: THREE.Vector3
    connectedRoads: string[]
}

interface PathNode {
    roadId: string
    position: THREE.Vector3
    gCost: number
    hCost: number
    fCost: number
    parent: PathNode | null
}

export class RoadNetwork {
    private nodes: Map<string, RoadNode> = new Map()
    private roads: Map<string, Road> = new Map()

    buildFromRoads(roads: Road[]) {
        this.nodes.clear()
        this.roads.clear()

        roads.forEach(road => {
            this.roads.set(road.id, road)

            // Create nodes at road endpoints
            const startPos = new THREE.Vector3(...road.start)
            const endPos = new THREE.Vector3(...road.end)

            const startNodeId = this.getOrCreateNode(startPos)
            const endNodeId = this.getOrCreateNode(endPos)

            // Connect nodes bidirectionally
            const startNode = this.nodes.get(startNodeId)!
            const endNode = this.nodes.get(endNodeId)!

            if (!startNode.connectedRoads.includes(road.id)) {
                startNode.connectedRoads.push(road.id)
            }
            if (!endNode.connectedRoads.includes(road.id)) {
                endNode.connectedRoads.push(road.id)
            }
        })
    }

    private getOrCreateNode(position: THREE.Vector3): string {
        // Check if node exists at this position (with tolerance)
        const tolerance = 0.5
        for (const [id, node] of this.nodes.entries()) {
            if (node.position.distanceTo(position) < tolerance) {
                return id
            }
        }

        // Create new node
        const id = `node_${this.nodes.size}`
        this.nodes.set(id, {
            id,
            position: position.clone(),
            connectedRoads: []
        })
        return id
    }

    findPath(start: THREE.Vector3, end: THREE.Vector3): THREE.Vector3[] {
        // Find closest nodes to start and end positions
        const startNode = this.findClosestNode(start)
        const endNode = this.findClosestNode(end)

        if (!startNode || !endNode) return [start, end]

        // A* pathfinding
        const openSet: PathNode[] = []
        const closedSet: Set<string> = new Set()

        const startPathNode: PathNode = {
            roadId: startNode.id,
            position: startNode.position.clone(),
            gCost: 0,
            hCost: startNode.position.distanceTo(endNode.position),
            fCost: 0,
            parent: null
        }
        startPathNode.fCost = startPathNode.gCost + startPathNode.hCost
        openSet.push(startPathNode)

        while (openSet.length > 0) {
            // Find node with lowest fCost
            openSet.sort((a, b) => a.fCost - b.fCost)
            const current = openSet.shift()!

            if (current.roadId === endNode.id) {
                // Path found, reconstruct it
                return this.reconstructPath(current)
            }

            closedSet.add(current.roadId)

            // Get neighbors
            const currentNode = this.nodes.get(current.roadId)
            if (!currentNode) continue

            for (const roadId of currentNode.connectedRoads) {
                const road = this.roads.get(roadId)
                if (!road) continue

                // Find the other end of the road
                const roadStart = new THREE.Vector3(...road.start)
                const roadEnd = new THREE.Vector3(...road.end)
                const otherEnd = roadStart.distanceTo(currentNode.position) < 0.5 ? roadEnd : roadStart

                const neighborNodeId = this.findNodeIdAtPosition(otherEnd)
                if (!neighborNodeId || closedSet.has(neighborNodeId)) continue

                const neighborNode = this.nodes.get(neighborNodeId)
                if (!neighborNode) continue

                const tentativeGCost = current.gCost + current.position.distanceTo(neighborNode.position)

                const existingNode = openSet.find(n => n.roadId === neighborNodeId)
                if (!existingNode || tentativeGCost < existingNode.gCost) {
                    const pathNode: PathNode = {
                        roadId: neighborNodeId,
                        position: neighborNode.position.clone(),
                        gCost: tentativeGCost,
                        hCost: neighborNode.position.distanceTo(endNode.position),
                        fCost: 0,
                        parent: current
                    }
                    pathNode.fCost = pathNode.gCost + pathNode.hCost

                    if (existingNode) {
                        openSet.splice(openSet.indexOf(existingNode), 1)
                    }
                    openSet.push(pathNode)
                }
            }
        }

        // No path found, return direct line
        return [start, end]
    }

    private findClosestNode(position: THREE.Vector3): RoadNode | null {
        let closestNode: RoadNode | null = null
        let minDistance = Infinity

        for (const node of this.nodes.values()) {
            const distance = node.position.distanceTo(position)
            if (distance < minDistance) {
                minDistance = distance
                closestNode = node
            }
        }

        return closestNode
    }

    private findNodeIdAtPosition(position: THREE.Vector3): string | null {
        const tolerance = 0.5
        for (const [id, node] of this.nodes.entries()) {
            if (node.position.distanceTo(position) < tolerance) {
                return id
            }
        }
        return null
    }

    private reconstructPath(endNode: PathNode): THREE.Vector3[] {
        const path: THREE.Vector3[] = []
        let current: PathNode | null = endNode

        while (current) {
            path.unshift(current.position.clone())
            current = current.parent
        }

        return path
    }
}

export const roadNetwork = new RoadNetwork()
