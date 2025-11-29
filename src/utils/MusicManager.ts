class MusicManager {
    private audioContext: AudioContext | null = null
    private currentOscillators: OscillatorNode[] = []
    private currentGains: GainNode[] = []
    private masterGain: GainNode | null = null
    private volume: number = 0.3
    private muted: boolean = false
    private _isPlaying: boolean = false
    private currentTrack: number = 0

    // Ambient music tracks (frequency patterns)
    private tracks = [
        // Track 1: Calm & Peaceful
        { name: 'Peaceful Morning', freqs: [220, 277, 330, 440], pattern: [0, 4, 7, 0] },
        // Track 2: Atmospheric
        { name: 'Urban Dreams', freqs: [196, 246, 294, 392], pattern: [0, 3, 7, 10] },
        // Track 3: Uplifting
        { name: 'City Lights', freqs: [262, 330, 392, 523], pattern: [0, 4, 7, 11] },
        // Track 4: Contemplative
        { name: 'Highway Horizons', freqs: [174, 220, 261, 349], pattern: [0, 5, 7, 12] }
    ]

    async init() {
        if (this.audioContext) return

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            this.masterGain = this.audioContext.createGain()
            this.masterGain.connect(this.audioContext.destination)
            this.masterGain.gain.value = this.volume
            console.log('Music system initialized')
        } catch (error) {
            console.warn('Music initialization failed:', error)
        }
    }

    private stopCurrentTrack() {
        // Fade out current track
        if (this.currentGains.length > 0 && this.audioContext) {
            this.currentGains.forEach(gain => {
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 1)
            })

            setTimeout(() => {
                this.currentOscillators.forEach(osc => {
                    try { osc.stop() } catch (e) { }
                })
                this.currentOscillators = []
                this.currentGains = []
            }, 1000)
        }
    }

    private playTrack(trackIndex: number) {
        if (!this.audioContext || !this.masterGain || this.muted) return

        this.stopCurrentTrack()

        const track = this.tracks[trackIndex % this.tracks.length]
        const now = this.audioContext.currentTime

        // Create ambient pad with multiple oscillators
        track.freqs.forEach((baseFreq, i) => {
            // Main oscillator
            const osc = this.audioContext!.createOscillator()
            const gain = this.audioContext!.createGain()

            osc.type = 'sine'
            osc.frequency.value = baseFreq

            // Fade in
            gain.gain.setValueAtTime(0, now)
            gain.gain.exponentialRampToValueAtTime(0.05, now + 2)

            // Subtle vibrato
            const lfo = this.audioContext!.createOscillator()
            const lfoGain = this.audioContext!.createGain()
            lfo.frequency.value = 0.2 + (i * 0.1)
            lfoGain.gain.value = 2
            lfo.connect(lfoGain)
            lfoGain.connect(osc.frequency)
            lfo.start(now)

            osc.connect(gain)
            gain.connect(this.masterGain!)
            osc.start(now)

            this.currentOscillators.push(osc, lfo)
            this.currentGains.push(gain)
        })
    }

    start() {
        this.init().then(() => {
            this._isPlaying = true
            this.playTrack(this.currentTrack)

            // Auto-change tracks every 3 minutes
            setInterval(() => {
                if (this._isPlaying && !this.muted) {
                    this.nextTrack()
                }
            }, 180000) // 3 minutes
        })
    }

    stop() {
        this._isPlaying = false
        this.stopCurrentTrack()
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length
        this.playTrack(this.currentTrack)
    }

    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume))
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume
        }
    }

    setMuted(muted: boolean) {
        this.muted = muted
        if (muted) {
            this.stopCurrentTrack()
        } else if (this._isPlaying) {
            this.playTrack(this.currentTrack)
        }
    }

    isMuted(): boolean {
        return this.muted
    }

    isPlaying(): boolean {
        return this._isPlaying
    }

    getCurrentTrackName(): string {
        return this.tracks[this.currentTrack].name
    }
}

export const musicManager = new MusicManager()

// Auto-start music on first interaction
let musicStarted = false
export const initMusicOnInteraction = () => {
    if (musicStarted) return

    const startMusic = () => {
        musicManager.start()
        musicStarted = true
        document.removeEventListener('click', startMusic)
        document.removeEventListener('keydown', startMusic)
    }

    document.addEventListener('click', startMusic, { once: true })
    document.addEventListener('keydown', startMusic, { once: true })
}
