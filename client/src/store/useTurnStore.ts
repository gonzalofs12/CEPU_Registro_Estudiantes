import { create } from "zustand"
import { createTurn, deleteTurn, listTurns } from "../services/turnsApi"

interface Turn {
   id: number
   name: string
}

interface TurnState {
   turn: Turn | null
   turns: Turn[]
   error: string
   loading: boolean
   setTurn: (turn: Turn | null) => void
   clearTurn: () => void
   refreshTurns: () => Promise<void>
   addTurn: (turnData: Omit<Turn, 'id'>, is_administrator: boolean, token: string) => Promise<void>
   removeTurn: (turnId: number, is_administrator: boolean, token: string) => Promise<void>
}

export const useTurnStore = create<TurnState>((set) => ({
   turns: [],
   turn: null,
   error: '',
   loading: false,
   setTurn: (turn) => set({ turn }),
   clearTurn: () => set({ turn: null }),

   refreshTurns: async () => {
      set({ loading: true, error: '' })
      try {
         const response = await listTurns()
         set({ turns: response.data, loading: false })
      } catch (error) {
         console.error('Error fetching turns:', error)
         set({ error: 'Error al cargar los turnos', loading: false })
      }
   },

   addTurn: async (turnData, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         const response = await createTurn(turnData, is_administrator, token)
         set((state) => ({
            turns: [...state.turns, { ...turnData, id: response.data.id }],
            loading: false
         }))
      } catch (error) {
         console.error('Error creating turn:', error)
         set({ error: 'Error al crear el turno', loading: false })
      }
   },

   removeTurn: async (turnId, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         await deleteTurn(turnId, is_administrator, token)
         set((state) => ({
            turns: state.turns.filter((turn) => turn.id !== turnId),
            loading: false
         }))
      } catch (error) {
         console.error('Error deleting turn:', error)
         set({ error: 'Error al eliminar el turno', loading: false })
      }
   }
}))