import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCitiesSkylinesSystem } from '../../systems/CitiesSkylinesSystemV4';

interface CityBuilderHUDProps {
    onPause: () => void;
}

const CityBuilderHUD: React.FC<CityBuilderHUDProps> = ({ onPause }) => {
    const { stats, balance } = useCitiesSkylinesSystem();
    const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

    const monthlyProfit = stats.income - stats.expenses;
    const isProfitable = monthlyProfit >= 0;

    // RCI Demand colors
    const getDemandColor = (demand: number) => {
        if (demand > 70) return 'from-green-500 to-emerald-500';
        if (demand > 40) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-40">
            {/* Top Bar - Budget & Stats */}
            <div className="pointer-events-auto absolute top-0 left-0 right-0 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Left - Money & Income */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        {/* Balance */}
                        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💰</span>
                                <div>
                                    <p className="text-xs text-white/60 mb-0.5">Balance</p>
                                    <p className={`text-2xl font-bold ${balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        ${Math.abs(balance).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Budget */}
                        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-xs text-green-400 mb-1">↑ ${stats.income.toLocaleString()}/mo</p>
                                    <p className="text-xs text-red-400">↓ ${stats.expenses.toLocaleString()}/mo</p>
                                </div>
                                <div className="h-12 w-px bg-white/20" />
                                <div>
                                    <p className="text-xs text-white/60 mb-0.5">Profit</p>
                                    <p className={`text-lg font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                                        {isProfitable ? '+' : ''
                                        }${monthlyProfit.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Center - City Info */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl"
                    >
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-white/60 mb-1">Population</p>
                                <p className="text-xl font-bold text-white">{stats.population.toLocaleString()}</p>
                            </div>
                            <div className="h-10 w-px bg-white/20" />
                            <div className="text-center">
                                <p className="text-xs text-white/60 mb-1">Area</p>
                                <p className="text-xl font-bold text-white">{stats.area.toFixed(1)} km²</p>
                            </div>
                            <div className="h-10 w-px bg-white/20" />
                            <div className="text-center">
                                <p className="text-xs text-white/60 mb-1">Happiness</p>
                                <p className="text-xl font-bold text-yellow-400">
                                    {stats.demographics.wellbeing.averageHappiness.toFixed(0)}%
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2"
                    >
                        <button
                            onClick={onPause}
                            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-all shadow-xl"
                        >
                            ⏸️
                        </button>
                        <button
                            onClick={() => setExpandedPanel(expandedPanel === 'settings' ? null : 'settings')}
                            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-all shadow-xl"
                        >
                            ⚙️
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Left Panel - RCI Demand */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="pointer-events-auto absolute left-4 top-1/3 transform -translate-y-1/2"
            >
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl w-64">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        Zone Demand (RCI)
                    </h3>

                    {/* Residential */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/80">🟩 Residential</span>
                            <span className="text-xs text-white/60">
                                {stats.zoning.residential.low.demand.toFixed(0)}%
                            </span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${getDemandColor(stats.zoning.residential.low.demand)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.zoning.residential.low.demand}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Commercial */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/80">🟦 Commercial</span>
                            <span className="text-xs text-white/60">
                                {stats.zoning.commercial.low.demand.toFixed(0)}%
                            </span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${getDemandColor(stats.zoning.commercial.low.demand)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.zoning.commercial.low.demand}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Industrial */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/80">🟨 Industrial</span>
                            <span className="text-xs text-white/60">
                                {stats.zoning.industrial.low.demand.toFixed(0)}%
                            </span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${getDemandColor(stats.zoning.industrial.low.demand)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.zoning.industrial.low.demand}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-3 gap-2 text-xs text-center">
                            <div>
                                <p className="text-white/60 mb-1">Buildings</p>
                                <p className="text-white font-bold">
                                    {stats.zoning.residential.low.buildings + 
                                     stats.zoning.commercial.low.buildings + 
                                     stats.zoning.industrial.low.buildings}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/60 mb-1">Jobs</p>
                                <p className="text-white font-bold">
                                    {stats.zoning.commercial.low.jobs + 
                                     stats.zoning.industrial.low.jobs}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/60 mb-1">Jobless</p>
                                <p className="text-yellow-400 font-bold">
                                    {stats.demographics.employment.unemploymentRate.toFixed(0)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel - Utilities & Services */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="pointer-events-auto absolute right-4 top-1/3 transform -translate-y-1/2"
            >
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl w-72">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        City Services
                    </h3>

                    {/* Power */}
                    <div className="mb-3 pb-3 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/80">⚡ Power</span>
                            <span className="text-xs text-white/60">
                                {stats.utilities.power.production}/{stats.utilities.power.capacity} MW
                            </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                initial={{ width: 0 }}
                                animate={{ 
                                    width: `${Math.min(100, (stats.utilities.power.production / stats.utilities.power.capacity) * 100)}%` 
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Water */}
                    <div className="mb-3 pb-3 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/80">💧 Water</span>
                            <span className="text-xs text-white/60">
                                {stats.utilities.water.production}/{stats.utilities.water.capacity}
                            </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                                initial={{ width: 0 }}
                                animate={{ 
                                    width: `${Math.min(100, (stats.utilities.water.production / stats.utilities.water.capacity) * 100)}%` 
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Service Coverage */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">🚓 Police</span>
                            <span className="text-white font-medium">{stats.services.police.coverage.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">🚒 Fire</span>
                            <span className="text-white font-medium">{stats.services.fire.coverage.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">🏥 Healthcare</span>
                            <span className="text-white font-medium">{stats.services.healthcare.coverage.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">🎓 Education</span>
                            <span className="text-white font-medium">{stats.services.education.coverage.toFixed(0)}%</span>
                        </div>
                    </div>

                    {/* Transport Stats */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-white/70">🚌 Public Transport</span>
                            <span className="text-white font-medium">{stats.transport.total.routes} routes</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">Monthly Ridership</span>
                            <span className="text-green-400 font-medium">{stats.transport.total.ridership.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Notification Area */}
            <div className="pointer-events-auto absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <AnimatePresence>
                    {balance < 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-red-500/90 backdrop-blur-xl border border-red-400 rounded-2xl px-6 py-3 shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <p className="text-white font-bold">Budget Crisis!</p>
                                    <p className="text-white/90 text-sm">You're in debt. Reduce expenses or increase taxes!</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CityBuilderHUD;
