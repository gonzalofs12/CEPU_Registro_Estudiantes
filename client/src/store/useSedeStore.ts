import { create } from "zustand"
import { createSede, deleteSede, listSedes } from "../services/sedesApi"

interface Sede {
   id: number
   name: string
   code: string
}

interface SedeState {
   sede: Sede | null
   sedes: Sede[]
   error: string
   loading: boolean
   setSede: (sede: Sede | null) => void
   clearSede: () => void
   refreshSedes: () => Promise<void>
   addSede: (sedeData: Omit<Sede, 'id'>, is_administrator: boolean, token: string) => Promise<void>
   removeSede: (sedeId: number, is_administrator: boolean, token: string) => Promise<void>
}

export const useSedeStore = create<SedeState>((set) => ({
   sedes: [],
   sede: null,
   error: '',
   loading: false,
   setSede: (sede) => set({ sede }),
   clearSede: () => set({ sede: null }),
   refreshSedes: async () => {
      set({ loading: true, error: '' })
      try {
         const response = await listSedes()
         set({ sedes: response.data, loading: false })
      } catch (error) {
         console.error('Error fetching sedes:', error)
         set({ error: 'Error al cargar las sedes', loading: false })
      }
   },

   addSede: async (sedeData, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         const response = await createSede(sedeData, is_administrator, token)
         set((state) => ({
            sedes: [...state.sedes, { name: response.data.name, code: response.data.code, id: response.data.id }],
            loading: false
         }))
      } catch (error) {
         console.error('Error creating sede:', error)
         set({ error: 'Error al crear la sede', loading: false })
      }
   },

   removeSede: async (sedeId, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         await deleteSede(sedeId, is_administrator, token)
         set((state) => ({
            sedes: state.sedes.filter((sede) => sede.id !== sedeId),
            loading: false
         }))
      } catch (error) {
         console.error('Error deleting sede:', error)
         set({ error: 'Error al eliminar la sede', loading: false })
      }
   }
}))