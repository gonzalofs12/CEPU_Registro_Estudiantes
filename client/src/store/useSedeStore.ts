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
   success: boolean
   message: string
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
   success: false,
   message: '',
   loading: false,
   setSede: (sede) => set({ sede }),
   clearSede: () => set({ sede: null }),
   refreshSedes: async () => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await listSedes()
         set({ sedes: response.data, loading: false, success: true, message: 'Sedes cargadas exitosamente.' })
      } catch (error) {
         console.error('Error fetching sedes:', error)
         set({ error: 'Error al cargar las sedes', loading: false, success: false, message: 'Error al cargar las sedes.' })
      }
   },

   addSede: async (sedeData, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await createSede(sedeData, is_administrator, token)
         set((state) => ({
            sedes: [...state.sedes, { name: response.data.name, code: response.data.code, id: response.data.id }],
            loading: false,
            success: true,
            message: 'Sede creada exitosamente.'
         }))
      } catch (error) {
         console.error('Error creating sede:', error)
         set({ error: 'Error al crear la sede', loading: false, success: false, message: 'Error al crear la sede.' })
      }
   },

   removeSede: async (sedeId, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         await deleteSede(sedeId, is_administrator, token)
         set((state) => ({
            sedes: state.sedes.filter((sede) => sede.id !== sedeId),
            loading: false,
            success: true,
            message: 'Sede eliminada exitosamente.'
         }))
      } catch (error) {
         console.error('Error deleting sede:', error)
         set({ error: 'Error al eliminar la sede', loading: false, success: false, message: 'Error al eliminar la sede.' })
      }
   }
}))