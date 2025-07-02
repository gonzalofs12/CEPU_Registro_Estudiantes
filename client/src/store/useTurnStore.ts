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
   success: boolean
   message: string
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
   success: false,
   message: '',
   loading: false,
   setTurn: (turn) => set({ turn }),
   clearTurn: () => set({ turn: null }),

   refreshTurns: async () => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await listTurns()
         set({ turns: response.data, loading: false, success: true, message: 'Turnos cargados exitosamente.' })
      } catch (error) {
         console.error('Error fetching turns:', error)
         set({ error: 'Error al cargar los turnos', loading: false, success: false, message: 'Error al cargar los turnos.' })
      }
   },

   addTurn: async (turnData, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await createTurn(turnData, is_administrator, token)
         set((state) => ({
            turns: [...state.turns, { name: response.data.name, id: response.data.id }],
            loading: false,
            success: true,
            message: 'Turno creado exitosamente.'
         }))
      } catch (error) {
         console.error('Error creating turn:', error)
         set({ error: 'Error al crear el turno', loading: false, success: false, message: 'Error al crear el turno.' })
      }
   },

   removeTurn: async (turnId, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         await deleteTurn(turnId, is_administrator, token)
         set((state) => ({
            turns: state.turns.filter((turn) => turn.id !== turnId),
            loading: false,
            success: true,
            message: 'Turno eliminado exitosamente.'
         }))
      } catch (error) {
         console.error('Error deleting turn:', error)
         set({ error: 'Error al eliminar el turno', loading: false, success: false, message: 'Error al eliminar el turno.' })
      }
   }
}))