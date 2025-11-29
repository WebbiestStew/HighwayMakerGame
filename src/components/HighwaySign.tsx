import React, { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'

interface HighwaySignProps {
    position: [number, number, number]
    text: string
    type: 'exit' | 'warning' | 'info' | 'speed' | 'distance'
}

export const HighwaySign: React.FC<HighwaySignProps> = ({ position, text, type }) => {
    const textureRef = useRef<THREE.CanvasTexture | null>(null)

    const signConfig = useMemo(() => {
        switch (type) {
            case 'exit':
                return {
                    bgColor: '#006747',
                    textColor: '#ffffff',
                    shape: 'rectangle',
                    size: [5, 2.5] as [number, number],
                    icon: '→',
                    border: true
                }
            case 'warning':
                return {
                    bgColor: '#ffc107',
                    textColor: '#000000',
                    shape: 'diamond',
                    size: [2.5, 2.5] as [number, number],
                    icon: '⚠',
                    border: true
                }
            case 'info':
                return {
                    bgColor: '#2196f3',
                    textColor: '#ffffff',
                    shape: 'rectangle',
                    size: [4, 2] as [number, number],
                    icon: 'ℹ',
                    border: false
                }
            case 'speed':
                return {
                    bgColor: '#ffffff',
                    textColor: '#000000',
                    shape: 'circle',
                    size: [2, 2] as [number, number],
                    icon: '',
                    border: true
                }
            case 'distance':
                return {
                    bgColor: '#006747',
                    textColor: '#ffffff',
                    shape: 'rectangle',
                    size: [3, 1] as [number, number],
                    icon: '',
                    border: false
                }
        }
    }, [type])

    useEffect(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = signConfig.shape === 'rectangle' ? 512 : 1024
        const ctx = canvas.getContext('2d')

        if (ctx) {
            // Background
            ctx.fillStyle = signConfig.bgColor

            if (signConfig.shape === 'diamond') {
                // Diamond shape
                ctx.beginPath()
                ctx.moveTo(canvas.width / 2, 20)
                ctx.lineTo(canvas.width - 20, canvas.height / 2)
                ctx.lineTo(canvas.width / 2, canvas.height - 20)
                ctx.lineTo(20, canvas.height / 2)
                ctx.closePath()
                ctx.fill()
            } else if (signConfig.shape === 'circle') {
                // Circle
                ctx.beginPath()
                ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 20, 0, Math.PI * 2)
                ctx.fill()
            } else {
                // Rectangle
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            // Border
            if (signConfig.border) {
                ctx.strokeStyle = '#ffffff'
                ctx.lineWidth = 20

                if (signConfig.shape === 'diamond') {
                    ctx.beginPath()
                    ctx.moveTo(canvas.width / 2, 20)
                    ctx.lineTo(canvas.width - 20, canvas.height / 2)
                    ctx.lineTo(canvas.width / 2, canvas.height - 20)
                    ctx.lineTo(20, canvas.height / 2)
                    ctx.closePath()
                    ctx.stroke()
                } else if (signConfig.shape === 'circle') {
                    ctx.beginPath()
                    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 20, 0, Math.PI * 2)
                    ctx.stroke()
                } else {
                    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
                }
            }

            // Icon (if any)
            if (signConfig.icon) {
                ctx.fillStyle = signConfig.textColor
                ctx.font = 'bold 120px Arial'
                ctx.textAlign = 'left'
                ctx.textBaseline = 'middle'
                ctx.fillText(signConfig.icon, 80, canvas.height / 2)
            }

            // Text
            ctx.fillStyle = signConfig.textColor
            ctx.font = type === 'speed' ? 'bold 200px Highway Gothic' : 'bold 80px Highway Gothic'
            ctx.textAlign = signConfig.icon ? 'left' : 'center'
            ctx.textBaseline = 'middle'

            const textX = signConfig.icon ? 240 : canvas.width / 2

            // Multi-line text support
            const lines = text.split('\n')
            const lineHeight = type === 'speed' ? 220 : 90
            const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2

            lines.forEach((line, i) => {
                ctx.fillText(line, textX, startY + i * lineHeight)
            })

            const texture = new THREE.CanvasTexture(canvas)
            texture.needsUpdate = true
            textureRef.current = texture
        }
    }, [text, type, signConfig])

    return (
        <group position={position}>
            {/* Sign post - taller, more realistic */}
            <mesh position={[0, 3, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 6, 16]} />
                <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Support arm for overhead signs */}
            {type === 'exit' && (
                <mesh position={[signConfig.size[0] / 2, 6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.1, 0.1, signConfig.size[0], 16]} />
                    <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
                </mesh>
            )}

            {/* Sign board */}
            <mesh
                position={type === 'exit' ? [0, 6, -0.3] : [0, 6.5, 0]}
                rotation={signConfig.shape === 'diamond' ? [0, 0, Math.PI / 4] : [0, 0, 0]}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[signConfig.size[0], signConfig.size[1], 0.1]} />
                <meshStandardMaterial
                    color={signConfig.bgColor}
                    map={textureRef.current}
                    emissive={signConfig.bgColor}
                    emissiveIntensity={0.3}
                    metalness={0.1}
                    roughness={0.4}
                />
            </mesh>

            {/* Reflective strip for night visibility */}
            {type === 'exit' && (
                <mesh position={[0, 6, -0.35]} castShadow>
                    <boxGeometry args={[signConfig.size[0] + 0.2, signConfig.size[1] + 0.2, 0.05]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={0.1}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            )}
        </group>
    )
}
