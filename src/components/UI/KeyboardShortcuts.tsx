import React from 'react'

export const KeyboardShortcuts: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const shortcuts = [
        { category: 'Building Tools', items: [
            { key: 'Q', description: 'Select Tool' },
            { key: 'W', description: 'Road Tool' },
            { key: 'E', description: 'Sign Tool' },
            { key: 'R', description: 'Zone Tool' },
            { key: 'D', description: 'Demolish Tool' },
            { key: 'C', description: 'Toggle Curve Mode' },
        ]},
        { category: 'Camera Controls', items: [
            { key: 'W/A/S/D', description: 'Pan Camera' },
            { key: 'Shift + WASD', description: 'Fast Pan' },
            { key: 'Mouse Wheel', description: 'Zoom In/Out' },
            { key: 'Home', description: 'Reset Camera' },
        ]},
        { category: 'UI & Menus', items: [
            { key: 'Tab', description: 'Toggle Stats Panel' },
            { key: 'ESC', description: 'Pause Menu' },
            { key: '?', description: 'Show This Help' },
            { key: 'F3', description: 'Performance Monitor' },
        ]},
        { category: 'Game Management', items: [
            { key: 'Ctrl+S', description: 'Quick Save' },
            { key: 'Space', description: 'Advance Time' },
        ]},
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-white/20 p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">⌨️ Keyboard Shortcuts</h2>
                    <p className="text-white/60">Master these shortcuts to build faster!</p>
                </div>

                {/* Shortcuts Grid */}
                <div className="space-y-6">
                    {shortcuts.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-xl font-bold text-blue-400 mb-3 border-b border-white/20 pb-2">
                                {section.category}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {section.items.map((shortcut, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                                        <kbd className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-3 py-2 rounded font-mono text-sm font-bold shadow-lg min-w-[80px] text-center">
                                            {shortcut.key}
                                        </kbd>
                                        <span className="text-white/80">{shortcut.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                        onClick={onClose}
                    >
                        Got It! 👍
                    </button>
                </div>
            </div>
        </div>
    )
}
