import React, { useState } from 'react'

const tutorialSteps = [
    {
        title: 'Welcome to Highway Architect!',
        description: 'Build realistic highway systems and manage urban growth. Let\'s learn the basics.',
        image: '🎮'
    },
    {
        title: 'Building Roads',
        description: 'Select the ROAD tool (Q key), then click to set start point and click again for end point. Toggle CURVE mode (C key) for curved roads.',
        image: '🛣️'
    },
    {
        title: 'Highway Signs',
        description: 'Use the SIGN tool (E key) to place highway signs. Choose from EXIT, WARNING, INFO, SPEED, and DISTANCE types.',
        image: '🪧'
    },
    {
        title: 'Zoning & City Growth',
        description: 'Place zones with the ZONE tool (R key). Buildings will automatically spawn near roads in your zones!',
        image: '🏢'
    },
    {
        title: 'Traffic Monitoring',
        description: 'Use HEATMAP to see traffic density and NOISE to visualize pollution. Optimize your highways!',
        image: '📊'
    },
    {
        title: 'Save Your Progress',
        description: 'Your game auto-saves every 30 seconds. Use 💾 SAVE and 📂 LOAD buttons anytime. Press Ctrl+S to quick save.',
        image: '💾'
    },
    {
        title: 'You\'re Ready!',
        description: 'Start building your highway empire! Check Settings (⚙️) for keyboard shortcuts.',
        image: '🚀'
    }
]

export const Tutorial: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0)
    const step = tutorialSteps[currentStep]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl border-2 border-white/20 p-8 w-[700px] shadow-2xl">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex gap-2 mb-2">
                        {tutorialSteps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded ${i <= currentStep ? 'bg-white' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>
                    <p className="text-white/60 text-sm">Step {currentStep + 1} of {tutorialSteps.length}</p>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">{step.image}</div>
                    <h2 className="text-3xl font-bold text-white mb-4">{step.title}</h2>
                    <p className="text-xl text-white/90 leading-relaxed">{step.description}</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                    {currentStep > 0 && (
                        <button
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all"
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            ← Previous
                        </button>
                    )}

                    {currentStep < tutorialSteps.length - 1 ? (
                        <button
                            className="flex-1 bg-white hover:bg-white/90 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all"
                            onClick={() => setCurrentStep(currentStep + 1)}
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                            onClick={onClose}
                        >
                            Start Building! 🚀
                        </button>
                    )}

                    <button
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                        onClick={onClose}
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    )
}
