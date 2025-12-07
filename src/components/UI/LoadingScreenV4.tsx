import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenV4Props {
    progress: number;
    onComplete: () => void;
}

const LoadingScreenV4: React.FC<LoadingScreenV4Props> = ({ progress, onComplete }) => {
    const [loadingStage, setLoadingStage] = useState('');

    useEffect(() => {
        if (progress < 20) setLoadingStage('Initializing city engine...');
        else if (progress < 40) setLoadingStage('Loading zoning systems...');
        else if (progress < 60) setLoadingStage('Connecting utilities...');
        else if (progress < 80) setLoadingStage('Spawning citizens...');
        else if (progress < 95) setLoadingStage('Building infrastructure...');
        else setLoadingStage('Ready to build!');

        if (progress >= 100) {
            setTimeout(onComplete, 500);
        }
    }, [progress, onComplete]);

    // Animated building blocks
    const buildings = [
        { height: 60, delay: 0, color: 'from-blue-400 to-blue-600' },
        { height: 80, delay: 0.2, color: 'from-purple-400 to-purple-600' },
        { height: 100, delay: 0.4, color: 'from-pink-400 to-pink-600' },
        { height: 70, delay: 0.6, color: 'from-blue-400 to-blue-600' },
        { height: 90, delay: 0.8, color: 'from-purple-400 to-purple-600' }
    ];

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.4),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.4),transparent_50%)]" />
                </div>
            </div>

            {/* Grid pattern */}
            <div 
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-7xl font-black mb-2">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                            SKYLINE
                        </span>
                    </h1>
                    <p className="text-white text-3xl font-bold tracking-wider">ARCHITECT</p>
                    <p className="text-blue-300/60 text-sm mt-2 tracking-widest">V4.0 CITIES EDITION</p>
                </motion.div>

                {/* Animated city skyline */}
                <div className="relative w-full max-w-md h-32 mb-12">
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4">
                        {buildings.map((building, i) => (
                            <motion.div
                                key={i}
                                className={`w-16 bg-gradient-to-t ${building.color} rounded-t-lg shadow-2xl relative overflow-hidden`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ 
                                    height: `${Math.min(building.height * (progress / 100), building.height)}px`,
                                    opacity: 1 
                                }}
                                transition={{ 
                                    delay: building.delay,
                                    duration: 0.8,
                                    ease: "easeOut"
                                }}
                            >
                                {/* Window lights */}
                                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
                                    {Array.from({ length: 9 }).map((_, j) => (
                                        <motion.div
                                            key={j}
                                            className="bg-yellow-200/80 rounded-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{
                                                delay: building.delay + j * 0.1,
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md">
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 mb-4">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>

                    {/* Progress percentage */}
                    <div className="flex justify-between items-center mb-2">
                        <motion.p
                            key={loadingStage}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-blue-300 text-sm font-medium"
                        >
                            {loadingStage}
                        </motion.p>
                        <span className="text-white font-bold text-lg">{Math.floor(progress)}%</span>
                    </div>
                </div>

                {/* Loading tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="mt-12 max-w-md"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <p className="text-blue-200/60 text-xs mb-2 font-semibold tracking-wider">💡 PRO TIP</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Start with low-density residential zones near your power plant, then add commercial 
                            zones when population reaches 50. Watch the RCI demand bars to know what to zone next!
                        </p>
                    </div>
                </motion.div>

                {/* Feature highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="mt-8 flex flex-wrap justify-center gap-3"
                >
                    {['🏗️ Advanced Zoning', '⚡ Utilities', '🚌 Public Transport', '👥 Living Citizens', '🏛️ Districts'].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5 + i * 0.1, duration: 0.4 }}
                            className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white/70 text-xs font-medium"
                        >
                            {feature}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        </div>
    );
};

export default LoadingScreenV4;
