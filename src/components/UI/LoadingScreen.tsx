import React, { useEffect, useState } from 'react'

export const LoadingScreen: React.FC<{ onLoaded: () => void }> = ({ onLoaded }) => {
    const [progress, setProgress] = useState(0)
    const [loadingText, setLoadingText] = useState('Initializing...')
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([])

    useEffect(() => {
        // Generate particles - reduced for performance
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100
        }))
        setParticles(newParticles)

        const stages = [
            { progress: 20, text: 'Loading AI Citizens...' },
            { progress: 40, text: 'Building Road Networks...' },
            { progress: 60, text: 'Initializing Traffic System...' },
            { progress: 80, text: 'Powering Up Resources...' },
            { progress: 100, text: 'Ready to Build!' }
        ]

        let currentStage = 0
        const interval = setInterval(() => {
            if (currentStage < stages.length) {
                setProgress(stages[currentStage].progress)
                setLoadingText(stages[currentStage].text)
                currentStage++
            } else {
                clearInterval(interval)
                setTimeout(onLoaded, 500)
            }
        }, 400)

        return () => clearInterval(interval)
    }, [onLoaded])

    return (
        <div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            {/* Animated grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    animation: 'gridMove 20s linear infinite'
                }}></div>
            </div>

            {/* Floating particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.id * 0.2}s`
                    }}
                ></div>
            ))}

            <div className="relative z-10 max-w-2xl w-full px-8">
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <h1 className="text-7xl font-black text-white mb-4 drop-shadow-2xl">
                        Highway <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Architect</span>
                    </h1>
                    <p className="text-xl text-gray-300">Next-Gen City Simulation</p>
                </div>

                {/* Progress bar */}
                <div className="glass-dark rounded-2xl p-8 border border-white/20">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-white font-semibold text-lg">{loadingText}</span>
                            <span className="text-purple-400 font-bold text-xl">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden border border-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className={`${progress >= 20 ? 'text-green-400' : 'text-gray-500'}`}>✓</span>
                            <span>1000+ AI Citizens</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className={`${progress >= 40 ? 'text-green-400' : 'text-gray-500'}`}>✓</span>
                            <span>Smart Traffic AI</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className={`${progress >= 60 ? 'text-green-400' : 'text-gray-500'}`}>✓</span>
                            <span>Resource Management</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className={`${progress >= 80 ? 'text-green-400' : 'text-gray-500'}`}>✓</span>
                            <span>Research Tech Tree</span>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        💡 Tip: Press TAB to view city stats and performance metrics
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes gridMove {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(50px);
                    }
                }
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    )
}
