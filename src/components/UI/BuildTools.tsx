import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCitiesSkylinesSystem } from '../../systems/CitiesSkylinesSystemV4';
import type { ZoneType, ZoneDensity } from '../../systems/ZoningSystemV4';

interface BuildToolsProps {
    onToolSelect: (tool: string, data: any) => void;
}

const BuildTools: React.FC<BuildToolsProps> = ({ onToolSelect }) => {
    const { balance } = useCitiesSkylinesSystem();
    const [activeTab, setActiveTab] = useState<'zones' | 'utilities' | 'services' | 'transport' | 'districts'>('zones');
    const [selectedZone, setSelectedZone] = useState<{ type: ZoneType; density: ZoneDensity }>({ 
        type: 'residential', 
        density: 'low' 
    });
    const [selectedUtility, setSelectedUtility] = useState<string>('');
    const [selectedService, setSelectedService] = useState<string>('');

    const zoneTypes: { type: ZoneType; icon: string; color: string; name: string }[] = [
        { type: 'residential', icon: '🏠', color: 'from-green-500 to-emerald-600', name: 'Residential' },
        { type: 'commercial', icon: '🏢', color: 'from-blue-500 to-cyan-600', name: 'Commercial' },
        { type: 'industrial', icon: '🏭', color: 'from-yellow-500 to-orange-600', name: 'Industrial' },
        { type: 'office', icon: '🏛️', color: 'from-purple-500 to-pink-600', name: 'Office' }
    ];

    const densities: { density: ZoneDensity; name: string; cost: number }[] = [
        { density: 'low', name: 'Low', cost: 100 },
        { density: 'medium', name: 'Medium', cost: 200 },
        { density: 'high', name: 'High', cost: 300 }
    ];

    const utilities = [
        { id: 'coal', name: 'Coal Plant', icon: '⚡', cost: 5000, type: 'power' },
        { id: 'nuclear', name: 'Nuclear Plant', icon: '☢️', cost: 25000, type: 'power' },
        { id: 'wind', name: 'Wind Turbine', icon: '💨', cost: 3000, type: 'power' },
        { id: 'solar', name: 'Solar Farm', icon: '☀️', cost: 4000, type: 'power' },
        { id: 'pump', name: 'Water Pump', icon: '💧', cost: 2000, type: 'water' },
        { id: 'treatment', name: 'Water Treatment', icon: '🚰', cost: 5000, type: 'water' },
        { id: 'outlet', name: 'Sewage Outlet', icon: '🚽', cost: 1500, type: 'sewage' },
        { id: 'sewage-treatment', name: 'Sewage Treatment', icon: '♻️', cost: 6000, type: 'sewage' }
    ];

    const services = [
        { id: 'police-station', name: 'Police Station', icon: '🚓', cost: 3000, category: 'police' },
        { id: 'fire-station', name: 'Fire Station', icon: '🚒', cost: 2500, category: 'fire' },
        { id: 'clinic', name: 'Clinic', icon: '🏥', cost: 2000, category: 'healthcare' },
        { id: 'hospital', name: 'Hospital', icon: '🏨', cost: 8000, category: 'healthcare' },
        { id: 'elementary-school', name: 'Elementary School', icon: '🏫', cost: 3000, category: 'education' },
        { id: 'high-school', name: 'High School', icon: '🎓', cost: 6000, category: 'education' },
        { id: 'university', name: 'University', icon: '🏛️', cost: 15000, category: 'education' },
        { id: 'small-park', name: 'Small Park', icon: '🌳', cost: 500, category: 'parks' },
        { id: 'large-park', name: 'Large Park', icon: '🌲', cost: 1500, category: 'parks' }
    ];

    const transportStops = [
        { id: 'bus', name: 'Bus Stop', icon: '🚌', cost: 500 },
        { id: 'metro', name: 'Metro Station', icon: '🚇', cost: 5000 },
        { id: 'train', name: 'Train Station', icon: '🚂', cost: 8000 }
    ];

    const handleZoneSelect = (type: ZoneType, density: ZoneDensity) => {
        setSelectedZone({ type, density });
        onToolSelect('zone', { type, density });
    };

    const tabs = [
        { id: 'zones', icon: '🏗️', name: 'Zones' },
        { id: 'utilities', icon: '⚡', name: 'Utilities' },
        { id: 'services', icon: '🏥', name: 'Services' },
        { id: 'transport', icon: '🚌', name: 'Transport' },
        { id: 'districts', icon: '🏛️', name: 'Districts' }
    ];

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
                style={{ width: '800px' }}
            >
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 px-3 text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white/10 text-white border-b-2 border-blue-400'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span className="text-lg mr-2">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6" style={{ minHeight: '240px', maxHeight: '400px', overflowY: 'auto' }}>
                    <AnimatePresence mode="wait">
                        {/* ZONES TAB */}
                        {activeTab === 'zones' && (
                            <motion.div
                                key="zones"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <span>🏗️</span>
                                    Select Zone Type
                                </h3>
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    {zoneTypes.map((zone) => (
                                        <motion.button
                                            key={zone.type}
                                            onClick={() => handleZoneSelect(zone.type, selectedZone.density)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-4 rounded-2xl border-2 transition-all ${
                                                selectedZone.type === zone.type
                                                    ? `bg-gradient-to-br ${zone.color} border-white shadow-lg`
                                                    : 'bg-white/5 border-white/20 hover:border-white/40'
                                            }`}
                                        >
                                            <div className="text-3xl mb-2">{zone.icon}</div>
                                            <div className="text-xs text-white font-medium">{zone.name}</div>
                                        </motion.button>
                                    ))}
                                </div>

                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <span>📏</span>
                                    Select Density
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {densities.map((density) => (
                                        <motion.button
                                            key={density.density}
                                            onClick={() => handleZoneSelect(selectedZone.type, density.density)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                selectedZone.density === density.density
                                                    ? 'bg-blue-500/30 border-blue-400 shadow-lg'
                                                    : 'bg-white/5 border-white/20 hover:border-white/40'
                                            }`}
                                        >
                                            <div className="text-white font-bold mb-1">{density.name}</div>
                                            <div className="text-xs text-white/60">${density.cost}/cell</div>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                                    <p className="text-blue-200 text-xs">
                                        💡 Click and drag on the map to paint zones. Higher density = more population but requires better services.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* UTILITIES TAB */}
                        {activeTab === 'utilities' && (
                            <motion.div
                                key="utilities"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h3 className="text-white font-bold mb-4">⚡ Power Plants</h3>
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {utilities.filter(u => u.type === 'power').map((util) => (
                                        <motion.button
                                            key={util.id}
                                            onClick={() => {
                                                if (balance >= util.cost) {
                                                    setSelectedUtility(util.id);
                                                    onToolSelect('utility', { type: util.id, category: 'power' });
                                                }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={balance < util.cost}
                                            className={`p-3 rounded-xl border-2 transition-all ${
                                                selectedUtility === util.id
                                                    ? 'bg-yellow-500/30 border-yellow-400'
                                                    : balance < util.cost
                                                    ? 'bg-red-500/10 border-red-400/30 opacity-50 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/20 hover:border-white/40'
                                            }`}
                                        >
                                            <div className="text-2xl mb-1">{util.icon}</div>
                                            <div className="text-xs text-white font-medium mb-1">{util.name}</div>
                                            <div className="text-xs text-green-400">${util.cost.toLocaleString()}</div>
                                        </motion.button>
                                    ))}
                                </div>

                                <h3 className="text-white font-bold mb-4 mt-6">💧 Water & Sewage</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {utilities.filter(u => u.type === 'water' || u.type === 'sewage').map((util) => (
                                        <motion.button
                                            key={util.id}
                                            onClick={() => {
                                                if (balance >= util.cost) {
                                                    setSelectedUtility(util.id);
                                                    onToolSelect('utility', { type: util.id, category: util.type });
                                                }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={balance < util.cost}
                                            className={`p-3 rounded-xl border-2 transition-all ${
                                                selectedUtility === util.id
                                                    ? 'bg-blue-500/30 border-blue-400'
                                                    : balance < util.cost
                                                    ? 'bg-red-500/10 border-red-400/30 opacity-50 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/20 hover:border-white/40'
                                            }`}
                                        >
                                            <div className="text-2xl mb-1">{util.icon}</div>
                                            <div className="text-xs text-white font-medium mb-1">{util.name}</div>
                                            <div className="text-xs text-green-400">${util.cost.toLocaleString()}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* SERVICES TAB */}
                        {activeTab === 'services' && (
                            <motion.div
                                key="services"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="grid grid-cols-3 gap-3">
                                    {services.map((service) => (
                                        <motion.button
                                            key={service.id}
                                            onClick={() => {
                                                if (balance >= service.cost) {
                                                    setSelectedService(service.id);
                                                    onToolSelect('service', { type: service.id, category: service.category });
                                                }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={balance < service.cost}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                selectedService === service.id
                                                    ? 'bg-green-500/30 border-green-400'
                                                    : balance < service.cost
                                                    ? 'bg-red-500/10 border-red-400/30 opacity-50 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/20 hover:border-white/40'
                                            }`}
                                        >
                                            <div className="text-3xl mb-2">{service.icon}</div>
                                            <div className="text-xs text-white font-medium mb-1">{service.name}</div>
                                            <div className="text-xs text-green-400">${service.cost.toLocaleString()}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* TRANSPORT TAB */}
                        {activeTab === 'transport' && (
                            <motion.div
                                key="transport"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h3 className="text-white font-bold mb-4">🚌 Build Transport Stops</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {transportStops.map((stop) => (
                                        <motion.button
                                            key={stop.id}
                                            onClick={() => {
                                                if (balance >= stop.cost) {
                                                    onToolSelect('transport', { type: stop.id });
                                                }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={balance < stop.cost}
                                            className={`p-6 rounded-xl border-2 transition-all ${
                                                balance < stop.cost
                                                    ? 'bg-red-500/10 border-red-400/30 opacity-50 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="text-4xl mb-3">{stop.icon}</div>
                                            <div className="text-sm text-white font-bold mb-2">{stop.name}</div>
                                            <div className="text-xs text-green-400">${stop.cost.toLocaleString()}</div>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
                                    <p className="text-purple-200 text-xs mb-2">
                                        💡 Build at least 2 stops, then create a route to connect them!
                                    </p>
                                    <button className="mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-xs font-bold transition-all">
                                        📝 Manage Routes
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* DISTRICTS TAB */}
                        {activeTab === 'districts' && (
                            <motion.div
                                key="districts"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h3 className="text-white font-bold mb-4">🏛️ District Tools</h3>
                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onToolSelect('district-create', {})}
                                        className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400 text-white font-bold hover:from-purple-500/40 hover:to-pink-500/40 transition-all"
                                    >
                                        ➕ Create New District
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onToolSelect('district-paint', {})}
                                        className="w-full p-4 rounded-xl bg-white/10 border-2 border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                                    >
                                        🖌️ Paint District Boundaries
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onToolSelect('district-manage', {})}
                                        className="w-full p-4 rounded-xl bg-white/10 border-2 border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                                    >
                                        ⚙️ Manage Policies & Taxes
                                    </motion.button>
                                </div>

                                <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
                                    <p className="text-blue-200 text-sm">
                                        <strong>Districts</strong> let you customize areas with unique policies, tax rates, and specializations!
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Balance Display */}
                <div className="border-t border-white/10 px-6 py-3 bg-black/40">
                    <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Available Budget:</span>
                        <span className={`text-lg font-bold ${balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                            ${balance.toLocaleString()}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BuildTools;
