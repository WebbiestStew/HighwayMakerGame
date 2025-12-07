import React from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { useGameStore } from '../store/gameStore'

export const PostProcessing: React.FC = () => {
    const { timeOfDay } = useGameStore()
    const isDaytime = timeOfDay === 'day'

    return (
        <EffectComposer multisampling={0}>
            {/* Enhanced Bloom - Better glow for night lights */}
            <Bloom
                intensity={isDaytime ? 0.5 : 1.0}
                luminanceThreshold={isDaytime ? 0.9 : 0.65}
                luminanceSmoothing={0.8}
                kernelSize={KernelSize.MEDIUM}
                mipmapBlur
            />

            {/* Vignette for cinematic look */}
            <Vignette
                offset={0.3}
                darkness={isDaytime ? 0.4 : 0.65}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    )
}
