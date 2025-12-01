/**
 * Weather and Day/Night Cycle System
 * Affects traffic behavior, visibility, and atmosphere
 */

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog'
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'

export interface WeatherState {
    type: WeatherType
    intensity: number // 0-1
    timeOfDay: TimeOfDay
    hour: number // 0-23
}

export interface WeatherEffects {
    skyColor: string
    fogDensity: number
    trafficSpeedMultiplier: number
    lightIntensity: number
    ambientColor: string
}

export const WEATHER_CONFIGS: Record<WeatherType, { duration: number; probability: number }> = {
    clear: { duration: 3600, probability: 0.5 }, // 1 hour game time
    cloudy: { duration: 1800, probability: 0.25 },
    rain: { duration: 900, probability: 0.15 },
    snow: { duration: 1200, probability: 0.05 },
    fog: { duration: 600, probability: 0.05 }
}

export class WeatherSystem {
    private currentWeather: WeatherType = 'clear'
    private weatherIntensity: number = 0
    private weatherDuration: number = 0
    private weatherTimer: number = 0
    
    private hour: number = 12 // Start at noon
    private timeScale: number = 0.1 // 1 real second = 6 game minutes

    updateWeather(deltaTime: number) {
        this.weatherTimer += deltaTime
        
        // Check if weather should change
        if (this.weatherTimer >= this.weatherDuration) {
            this.changeWeather()
            this.weatherTimer = 0
        }
    }

    private changeWeather() {
        const rand = Math.random()
        let cumulative = 0
        
        for (const [weather, config] of Object.entries(WEATHER_CONFIGS)) {
            cumulative += config.probability
            if (rand <= cumulative) {
                this.currentWeather = weather as WeatherType
                this.weatherDuration = config.duration
                this.weatherIntensity = 0.5 + Math.random() * 0.5 // 50-100%
                break
            }
        }
    }

    updateTime(deltaTime: number) {
        this.hour += deltaTime * this.timeScale
        if (this.hour >= 24) {
            this.hour = 0
        }
    }

    getTimeOfDay(): TimeOfDay {
        if (this.hour >= 5 && this.hour < 7) return 'dawn'
        if (this.hour >= 7 && this.hour < 17) return 'day'
        if (this.hour >= 17 && this.hour < 19) return 'dusk'
        return 'night'
    }

    getWeatherEffects(): WeatherEffects {
        const timeOfDay = this.getTimeOfDay()
        
        // Base effects by time of day
        const timeEffects = {
            dawn: { skyColor: '#ff9966', ambientColor: '#ffccaa', lightIntensity: 0.6 },
            day: { skyColor: '#87CEEB', ambientColor: '#ffffff', lightIntensity: 1.0 },
            dusk: { skyColor: '#ff7f50', ambientColor: '#ffaa88', lightIntensity: 0.5 },
            night: { skyColor: '#191970', ambientColor: '#4d4d7f', lightIntensity: 0.3 }
        }[timeOfDay]

        // Weather modifications
        const weatherMods = {
            clear: { fogDensity: 0, trafficSpeed: 1.0 },
            cloudy: { fogDensity: 0.02, trafficSpeed: 0.95 },
            rain: { fogDensity: 0.05, trafficSpeed: 0.7 },
            snow: { fogDensity: 0.08, trafficSpeed: 0.6 },
            fog: { fogDensity: 0.15, trafficSpeed: 0.5 }
        }[this.currentWeather]

        return {
            skyColor: timeEffects.skyColor,
            fogDensity: weatherMods.fogDensity * this.weatherIntensity,
            trafficSpeedMultiplier: weatherMods.trafficSpeed,
            lightIntensity: timeEffects.lightIntensity * (1 - weatherMods.fogDensity),
            ambientColor: timeEffects.ambientColor
        }
    }

    getWeatherState(): WeatherState {
        return {
            type: this.currentWeather,
            intensity: this.weatherIntensity,
            timeOfDay: this.getTimeOfDay(),
            hour: Math.floor(this.hour)
        }
    }

    setWeather(weather: WeatherType, intensity: number = 1.0) {
        this.currentWeather = weather
        this.weatherIntensity = intensity
        this.weatherDuration = WEATHER_CONFIGS[weather].duration
        this.weatherTimer = 0
    }

    setTime(hour: number) {
        this.hour = Math.max(0, Math.min(23, hour))
    }

    setTimeScale(scale: number) {
        this.timeScale = scale
    }
}

export const weatherSystem = new WeatherSystem()
