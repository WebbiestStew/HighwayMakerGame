import * as THREE from 'three'

export const GRID_SIZE = 10

export const snapToGrid = (position: THREE.Vector3): THREE.Vector3 => {
    const x = Math.round(position.x / GRID_SIZE) * GRID_SIZE
    const z = Math.round(position.z / GRID_SIZE) * GRID_SIZE
    return new THREE.Vector3(x, 0, z) // Keep y at 0 for now
}
