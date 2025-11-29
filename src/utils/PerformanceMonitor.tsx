import React, { useState, useEffect, useRef } from 'react'

export const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
    const [fps, setFps] = useState(60)
    const [memory, setMemory] = useState(0)
    const frameCount = useRef(0)
    const lastTime = useRef(performance.now())

    useEffect(() => {
        if (!enabled) return

        let animationFrameId: number

        const updateStats = () => {
            const currentTime = performance.now()
            frameCount.current++

            // Update FPS every second
            if (currentTime >= lastTime.current + 1000) {
                setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)))
                frameCount.current = 0
                lastTime.current = currentTime

                // Update memory usage if available
                if ((performance as any).memory) {
                    const memoryInfo = (performance as any).memory
                    const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1048576)
                    setMemory(usedMB)
                }
            }

            animationFrameId = requestAnimationFrame(updateStats)
        }

        animationFrameId = requestAnimationFrame(updateStats)

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [enabled])

    if (!enabled) return null

    const fpsColor = fps >= 50 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'

    return (
        <div className="fixed bottom-6 left-6 z-50 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 font-mono text-sm">
            <div className="flex gap-4">
                <div>
                    <span className="text-gray-400">FPS: </span>
                    <span className={`font-bold ${fpsColor}`}>{fps}</span>
                </div>
                {memory > 0 && (
                    <div>
                        <span className="text-gray-400">MEM: </span>
                        <span className="text-blue-400 font-bold">{memory} MB</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export const useAnalytics = () => {
    const trackEvent = (eventName: string, properties?: Record<string, any>) => {
        // Hook for analytics providers
        console.log('[Analytics]', eventName, properties)
        
        // Example: Google Analytics
        if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', eventName, properties)
        }

        // Example: Custom analytics endpoint
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ event: eventName, properties, timestamp: Date.now() })
        // })
    }

    const trackPageView = (pageName: string) => {
        trackEvent('page_view', { page: pageName })
    }

    const trackGameEvent = (action: string, category: string, label?: string, value?: number) => {
        trackEvent('game_action', {
            action,
            category,
            label,
            value
        })
    }

    return {
        trackEvent,
        trackPageView,
        trackGameEvent
    }
}
