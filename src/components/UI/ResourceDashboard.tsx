import React, { useState } from 'react'

interface Resource {
    name: string
    current: number
    capacity: number
    consumption: number
    production: number
    coverage: number
}

export const ResourceDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [resources] = useState<Resource[]>([
        { name: 'Power', current: 850, capacity: 1000, consumption: 650, production: 850, coverage: 95 },
        { name: 'Water', current: 720, capacity: 1000, consumption: 580, production: 720, coverage: 92 },
        { name: 'Waste', current: 420, capacity: 800, consumption: 420, production: 500, coverage: 88 },
    ])

    const getStatusColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-400'
        if (percentage >= 50) return 'text-yellow-400'
        return 'text-red-400'
    }

    const getBarColor = (percentage: number) => {
        if (percentage >= 80) return 'from-green-500 to-emerald-400'
        if (percentage >= 50) return 'from-yellow-500 to-orange-400'
        return 'from-red-500 to-pink-400'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-dark rounded-3xl border-2 border-blue-500/30 p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">Resource Management</h2>
                        <p className="text-gray-400">Monitor and manage city infrastructure</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white text-3xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all"
                    >
                        ×
                    </button>
                </div>

                {/* Resource cards */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    {resources.map((resource, idx) => {
                        const utilization = (resource.current / resource.capacity) * 100
                        const efficiency = (resource.production / resource.capacity) * 100

                        return (
                            <div key={idx} className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">
                                            {resource.name === 'Power' && '⚡'}
                                            {resource.name === 'Water' && '💧'}
                                            {resource.name === 'Waste' && '🗑️'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{resource.name}</h3>
                                            <p className="text-sm text-gray-400">
                                                {resource.current} / {resource.capacity} units
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-3xl font-black ${getStatusColor(resource.coverage)}`}>
                                        {resource.coverage}%
                                    </div>
                                </div>

                                {/* Capacity bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Utilization</span>
                                        <span>{utilization.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800/50 rounded-full h-6 overflow-hidden border border-white/10">
                                        <div
                                            className={`h-full bg-gradient-to-r ${getBarColor(utilization)} transition-all duration-500 flex items-center justify-center`}
                                            style={{ width: `${utilization}%` }}
                                        >
                                            <span className="text-xs font-bold text-white drop-shadow-lg">
                                                {resource.current} units
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="glass-dark rounded-lg p-3">
                                        <div className="text-xs text-gray-400 mb-1">Production</div>
                                        <div className="text-xl font-bold text-green-400">
                                            +{resource.production}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {efficiency.toFixed(0)}% efficient
                                        </div>
                                    </div>
                                    <div className="glass-dark rounded-lg p-3">
                                        <div className="text-xs text-gray-400 mb-1">Consumption</div>
                                        <div className="text-xl font-bold text-orange-400">
                                            -{resource.consumption}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {((resource.consumption / resource.capacity) * 100).toFixed(0)}% of capacity
                                        </div>
                                    </div>
                                    <div className="glass-dark rounded-lg p-3">
                                        <div className="text-xs text-gray-400 mb-1">Balance</div>
                                        <div className={`text-xl font-bold ${
                                            resource.production - resource.consumption > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {resource.production - resource.consumption > 0 ? '+' : ''}
                                            {resource.production - resource.consumption}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {resource.production - resource.consumption > 0 ? 'Surplus' : 'Deficit'}
                                        </div>
                                    </div>
                                </div>

                                {/* Coverage indicator */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">City Coverage</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${getBarColor(resource.coverage)} transition-all`}
                                                    style={{ width: `${resource.coverage}%` }}
                                                />
                                            </div>
                                            <span className={`text-sm font-bold ${getStatusColor(resource.coverage)}`}>
                                                {resource.coverage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Facilities section */}
                <div className="glass rounded-2xl p-6 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4">⚙️ Active Facilities</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-dark rounded-xl p-4 hover:scale-105 transition-all cursor-pointer">
                            <div className="text-3xl mb-2">🏭</div>
                            <div className="text-lg font-bold text-white">Power Plants</div>
                            <div className="text-sm text-gray-400">5 active</div>
                            <div className="mt-2 text-xs text-green-400">+850 units/h</div>
                        </div>
                        <div className="glass-dark rounded-xl p-4 hover:scale-105 transition-all cursor-pointer">
                            <div className="text-3xl mb-2">💧</div>
                            <div className="text-lg font-bold text-white">Water Treatment</div>
                            <div className="text-sm text-gray-400">3 active</div>
                            <div className="mt-2 text-xs text-green-400">+720 units/h</div>
                        </div>
                        <div className="glass-dark rounded-xl p-4 hover:scale-105 transition-all cursor-pointer">
                            <div className="text-3xl mb-2">♻️</div>
                            <div className="text-lg font-bold text-white">Waste Management</div>
                            <div className="text-sm text-gray-400">2 active</div>
                            <div className="mt-2 text-xs text-green-400">+500 units/h</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
