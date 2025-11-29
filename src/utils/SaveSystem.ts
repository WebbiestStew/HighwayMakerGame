import { useGameStore } from '../store/gameStore'

interface SaveData {
    version: string
    timestamp: number
    gameState: {
        funds: number
        roads: any[]
        zones: any[]
        buildings: any[]
        signs: any[]
    }
}

export class SaveSystem {
    private static SAVE_KEY_PREFIX = 'highway_architect_save_'
    private static AUTO_SAVE_KEY = 'highway_architect_autosave'
    private static VERSION = '1.0.0'

    static save(slotName: string = 'autosave'): boolean {
        try {
            const store = useGameStore.getState()

            const saveData: SaveData = {
                version: this.VERSION,
                timestamp: Date.now(),
                gameState: {
                    funds: store.funds,
                    roads: store.roads,
                    zones: store.zones,
                    buildings: store.buildings,
                    signs: store.signs
                }
            }

            const key = slotName === 'autosave' ? this.AUTO_SAVE_KEY : `${this.SAVE_KEY_PREFIX}${slotName}`
            localStorage.setItem(key, JSON.stringify(saveData))

            console.log(`Game saved to slot: ${slotName}`)
            return true
        } catch (error) {
            console.error('Failed to save game:', error)
            return false
        }
    }

    static load(slotName: string = 'autosave'): boolean {
        try {
            const key = slotName === 'autosave' ? this.AUTO_SAVE_KEY : `${this.SAVE_KEY_PREFIX}${slotName}`
            const data = localStorage.getItem(key)

            if (!data) {
                console.log(`No save found in slot: ${slotName}`)
                return false
            }

            const saveData: SaveData = JSON.parse(data)

            // Version check
            if (saveData.version !== this.VERSION) {
                console.warn('Save file version mismatch, attempting to load anyway')
            }

            // Restore game state
            const store = useGameStore.getState()
            store.addFunds(saveData.gameState.funds - store.funds) // Set funds

            // Clear and restore arrays
            useGameStore.setState({
                roads: saveData.gameState.roads,
                zones: saveData.gameState.zones,
                buildings: saveData.gameState.buildings,
                signs: saveData.gameState.signs
            })

            console.log(`Game loaded from slot: ${slotName}`)
            return true
        } catch (error) {
            console.error('Failed to load game:', error)
            return false
        }
    }

    static getSaveSlots(): Array<{ name: string, timestamp: number }> {
        const slots: Array<{ name: string, timestamp: number }> = []

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key?.startsWith(this.SAVE_KEY_PREFIX) || key === this.AUTO_SAVE_KEY) {
                try {
                    const data = localStorage.getItem(key)
                    if (data) {
                        const saveData: SaveData = JSON.parse(data)
                        const name = key === this.AUTO_SAVE_KEY ? 'autosave' : key.replace(this.SAVE_KEY_PREFIX, '')
                        slots.push({ name, timestamp: saveData.timestamp })
                    }
                } catch (e) {
                    console.error('Error reading save slot:', e)
                }
            }
        }

        return slots.sort((a, b) => b.timestamp - a.timestamp)
    }

    static deleteSave(slotName: string): boolean {
        try {
            const key = slotName === 'autosave' ? this.AUTO_SAVE_KEY : `${this.SAVE_KEY_PREFIX}${slotName}`
            localStorage.removeItem(key)
            console.log(`Deleted save slot: ${slotName}`)
            return true
        } catch (error) {
            console.error('Failed to delete save:', error)
            return false
        }
    }

    static startAutoSave(intervalMs: number = 30000): number {
        return window.setInterval(() => {
            this.save('autosave')
        }, intervalMs)
    }

    static stopAutoSave(intervalId: number): void {
        clearInterval(intervalId)
    }
}
