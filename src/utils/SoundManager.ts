class SoundManager {
    private audioContext: AudioContext | null = null
    private volume: number = 0.5
    private muted: boolean = false

    async init() {
        if (this.audioContext) return

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            await this.loadSounds()
        } catch (error) {
            console.warn('Audio initialization failed:', error)
        }
    }

    private async loadSounds() {
        // We'll use generated oscillator sounds instead of loading files
        // This avoids needing audio files
        console.log('Sound system initialized')
    }

    private createBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.audioContext || this.muted) return

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = type

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + duration)
    }

    playUIClick() {
        this.createBeep(800, 0.05, 'sine')
    }

    playRoadPlaced() {
        this.createBeep(400, 0.1, 'square')
        setTimeout(() => this.createBeep(500, 0.1, 'square'), 50)
    }

    playSignPlaced() {
        this.createBeep(600, 0.15, 'triangle')
    }

    playZonePlaced() {
        this.createBeep(350, 0.2, 'sine')
    }

    playDemolish() {
        this.createBeep(300, 0.1, 'sawtooth')
        setTimeout(() => this.createBeep(200, 0.15, 'sawtooth'), 80)
    }

    playVehicleHorn() {
        this.createBeep(220, 0.08, 'square')
        setTimeout(() => this.createBeep(240, 0.08, 'square'), 100)
    }

    playConstruction() {
        // Hammering sound effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createBeep(150 + Math.random() * 50, 0.05, 'square'), i * 100)
        }
    }

    playTrafficAmbient() {
        // Low rumble for background traffic
        this.createBeep(80 + Math.random() * 20, 0.3, 'triangle')
    }

    playSuccess() {
        this.createBeep(523, 0.1, 'sine') // C5
        setTimeout(() => this.createBeep(659, 0.1, 'sine'), 100) // E5
        setTimeout(() => this.createBeep(784, 0.2, 'sine'), 200) // G5
    }

    playError() {
        this.createBeep(200, 0.15, 'square')
        setTimeout(() => this.createBeep(150, 0.15, 'square'), 150)
    }

    playSave() {
        this.createBeep(440, 0.08, 'sine')
        setTimeout(() => this.createBeep(554, 0.08, 'sine'), 80)
        setTimeout(() => this.createBeep(659, 0.15, 'sine'), 160)
    }

    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume))
    }

    setMuted(muted: boolean) {
        this.muted = muted
    }

    isMuted(): boolean {
        return this.muted
    }
}

export const soundManager = new SoundManager()

// Initialize on first user interaction
let initialized = false
export const initSoundOnInteraction = () => {
    if (initialized) return

    const init = () => {
        soundManager.init()
        initialized = true
        document.removeEventListener('click', init)
        document.removeEventListener('keydown', init)
    }

    document.addEventListener('click', init, { once: true })
    document.addEventListener('keydown', init, { once: true })
}
