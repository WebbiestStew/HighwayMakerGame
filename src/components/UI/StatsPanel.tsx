import React from 'react'
import { useGameStore } from '../../store/gameStore'

interface StatsPanelProps {
    onClose: () => void
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ onClose }) => {
    const {
        roads,
        buildings,
        zones,
        funds,
        trafficDensity,
        signs,
        setEconomy,
        setRoadEfficiency,
        setTrafficFlow,
        setNetIncome
    } = useGameStore()

    // Calculate stats
    const totalRoads = roads.length
    const totalBuildings = buildings.length
    const totalZones = zones.length
    const totalSigns = signs.length
    const cityPopulation = buildings.length * 50 // Estimate 50 people per building

    // Calculate traffic flow (vehicles per minute)
    const totalTrafficDensity = Array.from(trafficDensity.values()).reduce((a, b) => a + b, 0)
    const avgTrafficDensity = totalTrafficDensity / (roads.length || 1)
    const trafficFlow = Math.round(avgTrafficDensity * 60)

    // Calculate road efficiency
    const roadEfficiency = Math.min(100, Math.round((trafficFlow / (totalRoads * 10 || 1)) * 100))

    // Calculate income (enhanced economy)
    const commercialCount = zones.filter(z => z.type === 'commercial').length
    const industrialCount = zones.filter(z => z.type === 'industrial').length
    
    const populationIncome = cityPopulation * 10 // $10 per person per month (taxes)
    const commercialIncome = commercialCount * 5000 // $5000 per commercial zone
    const industrialIncome = industrialCount * 8000 // $8000 per industrial zone
    
    const monthlyIncome = populationIncome + commercialIncome + industrialIncome
    const maintenanceCosts = totalRoads * 100 + totalSigns * 50 // Road and sign maintenance
    const zoneCosts = totalZones * 500 // Zone upkeep
    const monthlyExpenses = maintenanceCosts + zoneCosts
    const netIncome = monthlyIncome - monthlyExpenses

    // Update store with calculated values
    React.useEffect(() => {
        setEconomy(monthlyIncome, monthlyExpenses)
        setRoadEfficiency(roadEfficiency)
        setTrafficFlow(trafficFlow)
        setNetIncome(netIncome)
    }, [monthlyIncome, monthlyExpenses, roadEfficiency, trafficFlow, netIncome, setEconomy, setRoadEfficiency, setTrafficFlow, setNetIncome])

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border-l-2 border-white/20 z-50 overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 border-b border-white/10">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">📊 City Analytics</h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <p className="text-white/60 text-sm mt-1">Press TAB to toggle</p>
            </div>

            {/* Stats Grid */}
            <div className="p-4 space-y-4">
                {/* Financial Overview */}
                <StatSection title="💰 Financial">
                    <StatItem label="Current Funds" value={`$${funds.toLocaleString()}`} color="text-green-400" />
                    <StatItem label="Monthly Income" value={`$${monthlyIncome.toLocaleString()}`} color="text-blue-400" />
                    <StatItem label="Monthly Expenses" value={`$${monthlyExpenses.toLocaleString()}`} color="text-red-400" />
                    <StatItem
                        label="Net Income"
                        value={`$${netIncome.toLocaleString()}`}
                        color={netIncome >= 0 ? 'text-green-400' : 'text-red-400'}
                    />
                </StatSection>

                {/* Traffic & Transportation */}
                <StatSection title="🚗 Traffic">
                    <StatItem label="Traffic Flow" value={`${trafficFlow} veh/min`} color="text-yellow-400" />
                    <StatItem label="Road Efficiency" value={`${roadEfficiency}%`} color="text-cyan-400" />
                    <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Efficiency</span>
                            <span>{roadEfficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${roadEfficiency > 75 ? 'bg-green-500' :
                                        roadEfficiency > 50 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                    }`}
                                style={{ width: `${roadEfficiency}%` }}
                            />
                        </div>
                    </div>
                </StatSection>

                {/* City Statistics */}
                <StatSection title="🏙️ City">
                    <StatItem label="Population" value={cityPopulation.toLocaleString()} color="text-purple-400" />
                    <StatItem label="Buildings" value={totalBuildings.toString()} color="text-orange-400" />
                    <StatItem label="Zones" value={totalZones.toString()} color="text-pink-400" />
                </StatSection>

                {/* Infrastructure */}
                <StatSection title="🛣️ Infrastructure">
                    <StatItem label="Total Roads" value={totalRoads.toString()} color="text-gray-300" />
                    <StatItem label="Highway Signs" value={totalSigns.toString()} color="text-green-300" />
                    <StatItem label="Zones Designated" value={totalZones.toString()} color="text-blue-300" />
                </StatSection>

                {/* Zone Breakdown */}
                <StatSection title="📍 Zones">
                    <StatItem
                        label="Residential"
                        value={zones.filter(z => z.type === 'residential').length.toString()}
                        color="text-green-400"
                    />
                    <StatItem
                        label="Commercial"
                        value={zones.filter(z => z.type === 'commercial').length.toString()}
                        color="text-blue-400"
                    />
                    <StatItem
                        label="Industrial"
                        value={zones.filter(z => z.type === 'industrial').length.toString()}
                        color="text-yellow-400"
                    />
                </StatSection>

                {/* Performance Rating */}
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-bold mb-2">Overall Rating</h3>
                    <div className="text-4xl font-bold text-center">
                        {roadEfficiency > 75 ? '⭐⭐⭐' : roadEfficiency > 50 ? '⭐⭐' : '⭐'}
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">
                        {roadEfficiency > 75 ? 'Excellent!' : roadEfficiency > 50 ? 'Good' : 'Needs Improvement'}
                    </p>
                </div>
            </div>
        </div>
    )
}

const StatSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">{title}</h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    )
}

const StatItem: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    )
}
