import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainMenuV4Props {
    onStartGame: (mode: 'career' | 'sandbox') => void;
    onSettings: () => void;
    onQuit: () => void;
}

const MainMenuV4: React.FC<MainMenuV4Props> = ({ onStartGame, onSettings, onQuit }) => {
    const [selectedMode, setSelectedMode] = useState<'career' | 'sandbox' | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    // Animated background particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10
    }));

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.3),transparent_50%)]" />
                </div>
            </div>

            {/* Animated particles */}
            {particles.map(particle => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-blue-400/20 backdrop-blur-sm"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Skyline silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/50 to-transparent">
                <svg className="absolute bottom-0 w-full h-full opacity-20" viewBox="0 0 1200 200" preserveAspectRatio="none">
                    <rect x="0" y="120" width="80" height="80" fill="currentColor" className="text-blue-400" />
                    <rect x="90" y="80" width="60" height="120" fill="currentColor" className="text-purple-400" />
                    <rect x="160" y="100" width="50" height="100" fill="currentColor" className="text-blue-300" />
                    <rect x="220" y="60" width="70" height="140" fill="currentColor" className="text-purple-300" />
                    <rect x="300" y="90" width="55" height="110" fill="currentColor" className="text-blue-400" />
                    <rect x="400" y="50" width="80" height="150" fill="currentColor" className="text-purple-400" />
                    <rect x="490" y="70" width="60" height="130" fill="currentColor" className="text-blue-300" />
                    <rect x="600" y="100" width="50" height="100" fill="currentColor" className="text-purple-300" />
                    <rect x="700" y="80" width="65" height="120" fill="currentColor" className="text-blue-400" />
                    <rect x="800" y="60" width="75" height="140" fill="currentColor" className="text-purple-400" />
                    <rect x="950" y="90" width="60" height="110" fill="currentColor" className="text-blue-300" />
                    <rect x="1050" y="110" width="50" height="90" fill="currentColor" className="text-purple-300" />
                </svg>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-6xl"
                >
                    {/* Title */}
                    <div className="text-center mb-12">
                        <motion.h1
                            className="text-7xl font-black mb-4 tracking-tight"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                SKYLINE
                            </span>
                            <br />
                            <span className="text-white text-6xl">ARCHITECT</span>
                        </motion.h1>
                        <motion.p
                            className="text-blue-200/80 text-xl font-light tracking-wide"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Build. Manage. Thrive.
                        </motion.p>
                    </div>

                    {/* Mode Selection */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Career Mode */}
                        <motion.button
                            onClick={() => setSelectedMode('career')}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl border-2 transition-all duration-300 ${
                                selectedMode === 'career'
                                    ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400 shadow-2xl shadow-blue-500/50'
                                    : 'bg-white/5 border-white/20 hover:border-blue-400/50'
                            }`}
                        >
                            <div className="relative z-10">
                                <div className="text-5xl mb-4">🏆</div>
                                <h2 className="text-3xl font-bold text-white mb-3">Career Mode</h2>
                                <p className="text-blue-200/70 text-sm leading-relaxed mb-4">
                                    Start from scratch and complete challenging missions. Build your empire through
                                    10 progressive levels with unique objectives and unlockable features.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-xs font-medium">
                                        📈 Progressive
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 text-xs font-medium">
                                        🎯 Missions
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-pink-400/20 text-pink-300 text-xs font-medium">
                                        🏅 Rewards
                                    </span>
                                </div>
                            </div>
                            {selectedMode === 'career' && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </motion.button>

                        {/* Sandbox Mode */}
                        <motion.button
                            onClick={() => setSelectedMode('sandbox')}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl border-2 transition-all duration-300 ${
                                selectedMode === 'sandbox'
                                    ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-2xl shadow-green-500/50'
                                    : 'bg-white/5 border-white/20 hover:border-green-400/50'
                            }`}
                        >
                            <div className="relative z-10">
                                <div className="text-5xl mb-4">🌍</div>
                                <h2 className="text-3xl font-bold text-white mb-3">Sandbox Mode</h2>
                                <p className="text-green-200/70 text-sm leading-relaxed mb-4">
                                    Unlimited freedom to create your dream city. No restrictions, infinite money,
                                    and all features unlocked from the start. Perfect for experimentation.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs font-medium">
                                        ♾️ Unlimited
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-medium">
                                        🎨 Creative
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-medium">
                                        🔓 Unlocked
                                    </span>
                                </div>
                            </div>
                            {selectedMode === 'sandbox' && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </motion.button>
                    </div>

                    {/* Action Buttons */}
                    <AnimatePresence>
                        {selectedMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col gap-4"
                            >
                                <motion.button
                                    onClick={() => onStartGame(selectedMode)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xl shadow-2xl shadow-purple-500/50 transition-all duration-300"
                                >
                                    🚀 Start Building
                                </motion.button>

                                <div className="grid grid-cols-3 gap-4">
                                    <motion.button
                                        onClick={() => setShowInfo(true)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-medium transition-all"
                                    >
                                        ℹ️ Info
                                    </motion.button>
                                    <motion.button
                                        onClick={onSettings}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-medium transition-all"
                                    >
                                        ⚙️ Settings
                                    </motion.button>
                                    <motion.button
                                        onClick={onQuit}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-medium transition-all"
                                    >
                                        🚪 Exit
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Version */}
                    <div className="text-center mt-8">
                        <p className="text-white/30 text-sm">Version 4.0 - Cities: Skylines Edition</p>
                    </div>
                </motion.div>
            </div>

            {/* Info Modal */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowInfo(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">🏙️ What's New in V4.0</h2>
                            
                            <div className="space-y-4 text-white/80 mb-8">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🏗️</span>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">Advanced Zoning</h3>
                                        <p className="text-sm">4 zone types × 3 density levels. Buildings auto-grow based on demand!</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🏛️</span>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">Districts & Policies</h3>
                                        <p className="text-sm">Create custom districts with 12 unique policies and tax control.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">⚡</span>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">Utilities Network</h3>
                                        <p className="text-sm">Manage power, water, and sewage systems for your growing city.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🚌</span>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">Public Transport</h3>
                                        <p className="text-sm">Build bus, metro, and train networks with real ridership simulation.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">👥</span>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">Living Citizens</h3>
                                        <p className="text-sm">Individual citizens with jobs, education, and life cycles.</p>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => setShowInfo(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all"
                            >
                                Got it! 🚀
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MainMenuV4;
