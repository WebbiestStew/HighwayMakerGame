import React, { useEffect, useState } from 'react'

const loadingTips = [
    '💡 Use curved roads for realistic highway exits!',
    '🪧 Press E to place highway signs with custom text',
    '⌨️ Press Ctrl+S to quick save your progress',
    '🏗️ Buildings spawn automatically near roads in zones',
    '📊 Toggle HEATMAP to see traffic density',
    '🎯 Connect your roads to major zones for best traffic flow',
    '💰 Plan your highway network carefully to maximize efficiency'
]

export const LoadingScreen: React.FC<{ onLoaded: () => void }> = ({ onLoaded }) => {
    const [progress, setProgress] = useState(0)
    const [tip, setTip] = useState(loadingTips[0])

    useEffect(() => {
        // Simulate loading with progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(onLoaded, 500)
                    return 100
                }
                return prev + 10
            })
        }, 200)

        // Random tip
        setTip(loadingTips[Math.floor(Math.random() * loadingTips.length)])

        return () => clearInterval(interval)
    }, [onLoaded])

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
            <div className="text-center max-w-2xl px-8">
                {/* Logo */}
                <div className="mb-8">
                    <h1 className="text-6xl font-bold text-white mb-2 animate-pulse">🛣️</h1>
                    <h2 className="text-4xl font-bold text-white">Highway Architect</h2>
                    <p className="text-xl text-white/60 mt-2">Urban Arteries</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/20">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-white/80 mt-2 text-sm">{progress}%</p>
                </div>

                {/* Loading Tip */}
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 text-lg">{tip}</p>
                </div>

                <p className="text-white/40 text-xs mt-8">v2.0.0</p>
            </div>
        </div>
    )
}
