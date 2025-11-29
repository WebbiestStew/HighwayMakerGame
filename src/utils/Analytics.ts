// Analytics and Error Tracking Utilities
// Install @sentry/react if you want error tracking: npm install @sentry/react

export const initAnalytics = () => {
    // Initialize Google Analytics
    if (import.meta.env.PROD && import.meta.env.VITE_GA_ID) {
        const script = document.createElement('script')
        script.async = true
        script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`
        document.head.appendChild(script)

        const script2 = document.createElement('script')
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${import.meta.env.VITE_GA_ID}');
        `
        document.head.appendChild(script2)
    }
}

// Track custom events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        })
    }
}

// Track gameplay metrics
export const trackGameMetric = (metric: string, value: number) => {
    trackEvent('Game', metric, undefined, value)
}

// Track construction events
export const trackConstruction = (type: 'road' | 'zone' | 'sign' | 'building') => {
    trackEvent('Construction', `${type}_built`, type)
}

// Track mission completion
export const trackMissionComplete = (missionId: string, timeTaken: number) => {
    trackEvent('Missions', 'complete', missionId, timeTaken)
}

// Track achievement unlock
export const trackAchievement = (achievementId: string) => {
    trackEvent('Achievements', 'unlock', achievementId)
}

// Track errors
export const trackError = (error: Error, context?: string) => {
    console.error('[Highway Architect Error]', error, context)
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
            description: error.message,
            fatal: false
        })
    }
}
