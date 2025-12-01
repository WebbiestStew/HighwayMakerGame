import React from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { useGameStore } from '../store/gameStore'

export const PostProcessing: React.FC = () => {
    const { timeOfDay } = useGameStore()
    const isDaytime = timeOfDay === 'day'

    return (
        <EffectComposer multisampling={0}>
            {/* Bloom for glowing lights - OPTIMIZED */}
            <Bloom
                intensity={isDaytime ? 0.2 : 0.5}
                luminanceThreshold={isDaytime ? 0.95 : 0.7}
                luminanceSmoothing={0.7}
                kernelSize={KernelSize.SMALL}
            />

            {/* Vignette for cinematic look - lightweight */}
            <Vignette
                offset={0.4}
                darkness={isDaytime ? 0.4 : 0.6}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    )
}
