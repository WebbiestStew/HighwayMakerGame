import { useGameStore } from '../store/gameStore'

type Action = 
    | { type: 'ADD_ROAD', data: any }
    | { type: 'REMOVE_ROAD', data: any }
    | { type: 'ADD_ZONE', data: any }
    | { type: 'REMOVE_ZONE', data: any }
    | { type: 'ADD_SIGN', data: any }
    | { type: 'REMOVE_SIGN', data: any }
    | { type: 'ADD_BUILDING', data: any }
    | { type: 'REMOVE_BUILDING', data: any }

class UndoRedoManager {
    private undoStack: Action[] = []
    private redoStack: Action[] = []
    private maxStackSize = 50

    recordAction(action: Action) {
        this.undoStack.push(action)
        this.redoStack = [] // Clear redo stack when new action is performed
        
        // Limit stack size
        if (this.undoStack.length > this.maxStackSize) {
            this.undoStack.shift()
        }
    }

    undo() {
        const action = this.undoStack.pop()
        if (!action) return false

        this.redoStack.push(action)
        this.executeUndo(action)
        return true
    }

    redo() {
        const action = this.redoStack.pop()
        if (!action) return false

        this.undoStack.push(action)
        this.executeRedo(action)
        return true
    }

    private executeUndo(action: Action) {
        const store = useGameStore.getState()
        
        switch (action.type) {
            case 'ADD_ROAD':
                store.roads = store.roads.filter(r => r.id !== action.data.id)
                break
            case 'REMOVE_ROAD':
                store.roads = [...store.roads, action.data]
                break
            case 'ADD_ZONE':
                store.zones = store.zones.filter(z => z.id !== action.data.id)
                break
            case 'REMOVE_ZONE':
                store.zones = [...store.zones, action.data]
                break
            case 'ADD_SIGN':
                store.signs = store.signs.filter(s => s.id !== action.data.id)
                break
            case 'REMOVE_SIGN':
                store.signs = [...store.signs, action.data]
                break
            case 'ADD_BUILDING':
                store.buildings = store.buildings.filter(b => b.id !== action.data.id)
                break
            case 'REMOVE_BUILDING':
                store.buildings = [...store.buildings, action.data]
                break
        }
    }

    private executeRedo(action: Action) {
        const store = useGameStore.getState()
        
        switch (action.type) {
            case 'ADD_ROAD':
                store.roads = [...store.roads, action.data]
                break
            case 'REMOVE_ROAD':
                store.roads = store.roads.filter(r => r.id !== action.data.id)
                break
            case 'ADD_ZONE':
                store.zones = [...store.zones, action.data]
                break
            case 'REMOVE_ZONE':
                store.zones = store.zones.filter(z => z.id !== action.data.id)
                break
            case 'ADD_SIGN':
                store.signs = [...store.signs, action.data]
                break
            case 'REMOVE_SIGN':
                store.signs = store.signs.filter(s => s.id !== action.data.id)
                break
            case 'ADD_BUILDING':
                store.buildings = [...store.buildings, action.data]
                break
            case 'REMOVE_BUILDING':
                store.buildings = store.buildings.filter(b => b.id !== action.data.id)
                break
        }
    }

    canUndo(): boolean {
        return this.undoStack.length > 0
    }

    canRedo(): boolean {
        return this.redoStack.length > 0
    }

    clear() {
        this.undoStack = []
        this.redoStack = []
    }
}

export const undoRedoManager = new UndoRedoManager()
