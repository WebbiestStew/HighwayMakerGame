import React, { useState } from 'react'

interface Technology {
    id: string
    name: string
    description: string
    category: 'transportation' | 'energy' | 'smart-city' | 'environment' | 'infrastructure'
    cost: number
    researchTime: number
    prerequisites: string[]
    unlocked: boolean
    researching: boolean
    progress: number
    benefits: string[]
}

const TECH_TREE: Technology[] = [
    // Transportation
    { id: 'buses', name: '🚌 Bus Network', description: 'Public transportation for citizens', category: 'transportation', cost: 5000, researchTime: 30, prerequisites: [], unlocked: false, researching: false, progress: 0, benefits: ['+20% Traffic Reduction', 'Citizen Happiness +10%'] },
    { id: 'metro', name: '🚇 Metro System', description: 'Underground rapid transit', category: 'transportation', cost: 15000, researchTime: 60, prerequisites: ['buses'], unlocked: false, researching: false, progress: 0, benefits: ['+40% Traffic Reduction', 'Property Values +15%'] },
    { id: 'highspeed', name: '🚄 High-Speed Rail', description: 'Connect distant zones rapidly', category: 'transportation', cost: 35000, researchTime: 90, prerequisites: ['metro'], unlocked: false, researching: false, progress: 0, benefits: ['+60% Traffic Reduction', 'Commerce +25%'] },
    
    // Energy
    { id: 'solar', name: '☀️ Solar Power', description: 'Clean energy from the sun', category: 'energy', cost: 8000, researchTime: 40, prerequisites: [], unlocked: false, researching: false, progress: 0, benefits: ['Pollution -30%', 'Energy Cost -20%'] },
    { id: 'wind', name: '💨 Wind Turbines', description: 'Renewable wind energy', category: 'energy', cost: 12000, researchTime: 50, prerequisites: ['solar'], unlocked: false, researching: false, progress: 0, benefits: ['Pollution -50%', 'Energy Cost -35%'] },
    { id: 'fusion', name: '⚛️ Fusion Reactor', description: 'Unlimited clean energy', category: 'energy', cost: 50000, researchTime: 120, prerequisites: ['wind'], unlocked: false, researching: false, progress: 0, benefits: ['Pollution -90%', 'Energy Cost -70%'] },
    
    // Smart City
    { id: 'traffic-ai', name: '🚦 AI Traffic Lights', description: 'Intelligent traffic management', category: 'smart-city', cost: 10000, researchTime: 45, prerequisites: [], unlocked: false, researching: false, progress: 0, benefits: ['Traffic Flow +30%', 'Accidents -40%'] },
    { id: 'iot', name: '📡 IoT Network', description: 'Connected smart city sensors', category: 'smart-city', cost: 20000, researchTime: 70, prerequisites: ['traffic-ai'], unlocked: false, researching: false, progress: 0, benefits: ['Efficiency +25%', 'Resource Usage -20%'] },
    { id: 'ai-city', name: '🤖 AI City Manager', description: 'Automated city optimization', category: 'smart-city', cost: 45000, researchTime: 100, prerequisites: ['iot'], unlocked: false, researching: false, progress: 0, benefits: ['All Stats +20%', 'Auto-optimize resources'] },
    
    // Environment
    { id: 'recycling', name: '♻️ Recycling Program', description: 'Reduce waste, reuse materials', category: 'environment', cost: 6000, researchTime: 35, prerequisites: [], unlocked: false, researching: false, progress: 0, benefits: ['Waste -40%', 'Citizen Happiness +15%'] },
    { id: 'green-buildings', name: '🌿 Green Buildings', description: 'Eco-friendly construction', category: 'environment', cost: 15000, researchTime: 55, prerequisites: ['recycling'], unlocked: false, researching: false, progress: 0, benefits: ['Pollution -35%', 'Property Values +20%'] },
    { id: 'carbon-neutral', name: '🌍 Carbon Neutral', description: 'Zero carbon emissions city', category: 'environment', cost: 40000, researchTime: 110, prerequisites: ['green-buildings'], unlocked: false, researching: false, progress: 0, benefits: ['Pollution -80%', 'Tourism +50%'] },
]

export const ResearchTree: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [technologies, setTechnologies] = useState<Technology[]>(TECH_TREE)
    const [researchPoints, setResearchPoints] = useState(10000)

    const categories = [
        { id: 'all', name: 'All', icon: '🔬' },
        { id: 'transportation', name: 'Transport', icon: '🚗' },
        { id: 'energy', name: 'Energy', icon: '⚡' },
        { id: 'smart-city', name: 'Smart City', icon: '🏙️' },
        { id: 'environment', name: 'Environment', icon: '🌱' },
    ]

    const filteredTechs = selectedCategory === 'all' 
        ? technologies 
        : technologies.filter(t => t.category === selectedCategory)

    const startResearch = (techId: string) => {
        setTechnologies(prev => prev.map(t => 
            t.id === techId ? { ...t, researching: true } : t
        ))
        setResearchPoints(prev => prev - technologies.find(t => t.id === techId)!.cost)
    }

    const canResearch = (tech: Technology) => {
        if (tech.unlocked || tech.researching) return false
        if (researchPoints < tech.cost) return false
        return tech.prerequisites.every(prereq => 
            technologies.find(t => t.id === prereq)?.unlocked
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-dark rounded-3xl border-2 border-purple-500/30 p-8 w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">Research & Development</h2>
                        <p className="text-gray-400">Unlock new technologies to advance your city</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="glass rounded-xl px-6 py-3 border border-purple-500/30">
                            <div className="text-sm text-gray-400">Research Points</div>
                            <div className="text-2xl font-bold text-purple-400">{researchPoints.toLocaleString()}</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white text-3xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Category filters */}
                <div className="flex gap-2 mb-6">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                selectedCategory === cat.id
                                    ? 'bg-purple-600 text-white scale-105 shadow-lg'
                                    : 'glass-dark text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>

                {/* Tech grid */}
                <div className="overflow-y-auto max-h-[calc(90vh-300px)] pr-4 custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4">
                        {filteredTechs.map(tech => {
                            const isAvailable = canResearch(tech)

                            return (
                                <div
                                    key={tech.id}
                                    className={`glass-dark rounded-2xl p-6 border-2 transition-all ${
                                        tech.unlocked
                                            ? 'border-green-500/50 bg-green-500/10'
                                            : tech.researching
                                            ? 'border-purple-500/50 bg-purple-500/10 animate-pulse'
                                            : isAvailable
                                            ? 'border-blue-500/50 hover:border-blue-400 hover:scale-105 cursor-pointer'
                                            : 'border-gray-700/50 opacity-50'
                                    }`}
                                    onClick={() => isAvailable && startResearch(tech.id)}
                                >
                                    {/* Status badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            tech.unlocked
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : tech.researching
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                            {tech.unlocked ? '✓ UNLOCKED' : tech.researching ? '⚡ RESEARCHING' : '🔒 LOCKED'}
                                        </span>
                                        <div className="text-2xl">{tech.name.split(' ')[0]}</div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {tech.name.split(' ').slice(1).join(' ')}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-4">{tech.description}</p>

                                    {/* Benefits */}
                                    <div className="space-y-1 mb-4">
                                        {tech.benefits.map((benefit, idx) => (
                                            <div key={idx} className="text-xs text-green-400 flex items-center gap-2">
                                                <span className="text-green-500">+</span>
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Cost and time */}
                                    <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                                        <div className="text-purple-400 font-semibold">
                                            💎 {tech.cost.toLocaleString()}
                                        </div>
                                        <div className="text-gray-400">
                                            ⏱️ {tech.researchTime}s
                                        </div>
                                    </div>

                                    {/* Research progress */}
                                    {tech.researching && (
                                        <div className="mt-3">
                                            <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${tech.progress}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-purple-400 text-center mt-1">
                                                {tech.progress}%
                                            </div>
                                        </div>
                                    )}

                                    {/* Prerequisites */}
                                    {tech.prerequisites.length > 0 && !tech.unlocked && (
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <div className="text-xs text-gray-500">Requires:</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {tech.prerequisites.map(prereq => {
                                                    const prereqTech = technologies.find(t => t.id === prereq)
                                                    return (
                                                        <span
                                                            key={prereq}
                                                            className={`text-xs px-2 py-1 rounded ${
                                                                prereqTech?.unlocked
                                                                    ? 'bg-green-500/20 text-green-400'
                                                                    : 'bg-red-500/20 text-red-400'
                                                            }`}
                                                        >
                                                            {prereqTech?.name.split(' ').slice(1).join(' ')}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.7);
                }
            `}</style>
        </div>
    )
}
