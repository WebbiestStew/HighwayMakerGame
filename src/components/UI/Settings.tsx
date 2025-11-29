import React, { useState } from 'react'
import { musicManager } from '../../utils/MusicManager'

export const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [graphicsQuality, setGraphicsQuality] = useState('high')
    const [shadowQuality, setShadowQuality] = useState('high')
    const [musicVolume, setMusicVolume] = useState(30)
    const [musicMuted, setMusicMuted] = useState(false)

    const handleSave = () => {
        // Apply music settings
        musicManager.setVolume(musicVolume / 100)
        musicManager.setMuted(musicMuted)

        alert('Settings saved!')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-white/20 p-8 w-[600px] shadow-2xl max-h-[90vh] overflow-y-auto">
                <h1 className="text-4xl font-bold text-white mb-6">⚙️ Settings</h1>

                {/* Graphics Settings */}
                <div className="mb-6">
                    <h2 className="text-white text-xl font-bold mb-4">🎨 Graphics</h2>

                    <div className="mb-4">
                        <label className="text-gray-300 text-sm block mb-2">Graphics Quality</label>
                        <select
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                            value={graphicsQuality}
                            onChange={(e) => setGraphicsQuality(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="ultra">Ultra</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 text-sm block mb-2">Shadow Quality</label>
                        <select
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                            value={shadowQuality}
                            onChange={(e) => setShadowQuality(e.target.value)}
                        >
                            <option value="off">Off</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* Audio Settings */}
                <div className="mb-6">
                    <h2 className="text-white text-xl font-bold mb-4">🎵 Audio</h2>

                    <div className="mb-4">
                        <label className="text-gray-300 text-sm block mb-2">Music Volume: {musicVolume}%</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                        <span className="text-gray-300">Mute Music</span>
                        <button
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${musicMuted ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                            onClick={() => setMusicMuted(!musicMuted)}
                        >
                            {musicMuted ? '🔇 MUTED' : '🔊 ON'}
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-3">Keyboard Shortcuts</h2>
                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                            <span>Select Tool</span>
                            <code className="bg-gray-900 px-2 py-1 rounded">Q</code>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Road Tool</span>
                            <code className="bg-gray-900 px-2 py-1 rounded">W</code>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Sign Tool</span>
                            <code className="bg-gray-900 px-2 py-1 rounded">E</code>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Zone Tool</span>
                            <code className="bg-gray-900 px-2 py-1 rounded">R</code>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Toggle Curve Mode</span>
                            <code className="bg-gray-900 px-2 py-1 rounded">C</code>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Save Game</span>
                            <code className="bg-gray-900 px-2 py-1 rounded">Ctrl+S</code>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <button
                        className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg text-white font-bold transition-all"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-bold transition-all"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
