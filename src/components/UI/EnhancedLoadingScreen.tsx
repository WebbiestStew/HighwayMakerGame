import React, { useState, useEffect } from 'react'

const gameplayTips = [
    "💡 Connect residential zones to commercial zones for maximum income!",
    "🚗 Use curved roads to create smoother traffic flow around corners.",
    "📊 Check the traffic heatmap regularly to identify bottlenecks.",
    "💰 Commercial zones generate more income but need good road access.",
    "🏗️ Buildings spawn faster when zones are near multiple road segments.",
    "⚠️ Warning signs can help players navigate complex highway systems.",
    "🎯 Complete missions to earn bonus funds and unlock achievements.",
    "📈 Your net income is shown in the stats panel - keep it positive!",
    "🔊 Noise pollution increases near busy highways - plan accordingly.",
    "💾 The game auto-saves every 30 seconds, but you can quick-save with Ctrl+S.",
    "🛣️ Longer roads cost more to build and maintain - plan efficiently!",
    "🏆 Try to unlock all achievements for the ultimate challenge!",
    "🚛 Trucks move slower but indicate healthy industrial activity.",
    "🚌 Buses appear when your city has good public infrastructure.",
    "⌨️ Press '?' to see all keyboard shortcuts anytime.",
]

export const EnhancedLoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0)
    const [currentTip, setCurrentTip] = useState(gameplayTips[0])
    const [loadingText, setLoadingText] = useState('Initializing...')

    useEffect(() => {
        // Simulate loading stages
        const stages = [
            { progress: 20, text: 'Loading 3D assets...', delay: 300 },
            { progress: 40, text: 'Building road network...', delay: 500 },
            { progress: 60, text: 'Spawning city zones...', delay: 400 },
            { progress: 80, text: 'Starting traffic simulation...', delay: 400 },
            { progress: 95, text: 'Finalizing...', delay: 300 },
            { progress: 100, text: 'Ready!', delay: 200 }
        ]

        let currentStage = 0
        const loadNext = () => {
            if (currentStage < stages.length) {
                const stage = stages[currentStage]
                setProgress(stage.progress)
                setLoadingText(stage.text)
                currentStage++
                setTimeout(loadNext, stage.delay)
            }
        }

        loadNext()

        // Rotate tips
        const tipInterval = setInterval(() => {
            setCurrentTip(gameplayTips[Math.floor(Math.random() * gameplayTips.length)])
        }, 3000)

        return () => clearInterval(tipInterval)
    }, [])

    return (
        <div className="absolute inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center max-w-2xl px-8">
                {/* Title */}
                <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
                    🛣️ Highway Architect
                </h1>
                <p className="text-2xl text-white/70 mb-12">Loading your city...</p>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="bg-white/20 rounded-full h-6 overflow-hidden border-2 border-white/30">
                        <div 
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out flex items-center justify-center"
                            style={{ width: `${progress}%` }}
                        >
                            {progress > 10 && (
                                <span className="text-white font-bold text-sm">{progress}%</span>
                            )}
                        </div>
                    </div>
                    <p className="text-white/60 mt-2 text-sm">{loadingText}</p>
                </div>

                {/* Loading Tip */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <p className="text-lg text-white/90 leading-relaxed animate-fade-in">
                        {currentTip}
                    </p>
                </div>

                {/* Spinner */}
                <div className="mt-8 flex justify-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    )
}
