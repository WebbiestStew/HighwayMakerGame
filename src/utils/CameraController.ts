import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface CameraControls {
    position: THREE.Vector3
    target: THREE.Vector3
    zoom: number
    rotation: number
}

export const useCameraController = () => {
    const { camera } = useThree()
    const controlsRef = useRef<CameraControls>({
        position: new THREE.Vector3(0, 50, 50),
        target: new THREE.Vector3(0, 0, 0),
        zoom: 50,
        rotation: 0
    })

    const keysPressed = useRef<Set<string>>(new Set())
    const targetZoom = useRef(50)
    const targetRotation = useRef(0)

    // Camera bounds
    const BOUNDS = {
        minX: -100,
        maxX: 100,
        minZ: -100,
        maxZ: 100,
        minY: 10,
        maxY: 150,
        minZoom: 20,
        maxZoom: 150
    }

    const PAN_SPEED = 0.5
    const SMOOTH_FACTOR = 0.1

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement) return

            keysPressed.current.add(e.key.toLowerCase())

            // Home key to reset camera
            if (e.key === 'Home') {
                controlsRef.current.position.set(0, 50, 50)
                controlsRef.current.target.set(0, 0, 0)
                targetZoom.current = 50
                targetRotation.current = 0
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key.toLowerCase())
        }

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            // Smooth zoom
            const delta = e.deltaY * 0.01
            targetZoom.current = THREE.MathUtils.clamp(
                targetZoom.current + delta,
                BOUNDS.minZoom,
                BOUNDS.maxZoom
            )
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('wheel', handleWheel)
        }
    }, [])

    useFrame(() => {
        const controls = controlsRef.current
        const speedMultiplier = keysPressed.current.has('shift') ? 2 : 1

        // WASD Pan
        const forward = new THREE.Vector3(0, 0, -1)
        const right = new THREE.Vector3(1, 0, 0)

        // Rotate vectors based on camera rotation
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation.current)
        right.applyAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation.current)

        if (keysPressed.current.has('w')) {
            controls.target.add(forward.multiplyScalar(PAN_SPEED * speedMultiplier))
        }
        if (keysPressed.current.has('s')) {
            controls.target.add(forward.multiplyScalar(-PAN_SPEED * speedMultiplier))
        }
        if (keysPressed.current.has('a')) {
            controls.target.add(right.multiplyScalar(-PAN_SPEED * speedMultiplier))
        }
        if (keysPressed.current.has('d')) {
            controls.target.add(right.multiplyScalar(PAN_SPEED * speedMultiplier))
        }

        // Q/E Rotation (but not if they're tool shortcuts - check if game is playing)
        // Since Q/W/E/R are tool shortcuts, we'll skip Q/E rotation for now
        // Users can use mouse drag in future iteration

        // Clamp target position
        controls.target.x = THREE.MathUtils.clamp(controls.target.x, BOUNDS.minX, BOUNDS.maxX)
        controls.target.z = THREE.MathUtils.clamp(controls.target.z, BOUNDS.minZ, BOUNDS.maxZ)

        // Smooth zoom interpolation
        controls.zoom += (targetZoom.current - controls.zoom) * SMOOTH_FACTOR

        // Update camera position based on zoom and rotation
        const angle = targetRotation.current
        const radius = controls.zoom
        const height = controls.zoom * 0.7

        controls.position.x = controls.target.x + Math.sin(angle) * radius
        controls.position.y = controls.target.y + height
        controls.position.z = controls.target.z + Math.cos(angle) * radius

        // Clamp camera position
        controls.position.y = THREE.MathUtils.clamp(controls.position.y, BOUNDS.minY, BOUNDS.maxY)

        // Apply to camera
        camera.position.lerp(controls.position, SMOOTH_FACTOR)
        camera.lookAt(controls.target)
    })

    return controlsRef
}
