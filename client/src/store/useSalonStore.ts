import { create } from "zustand"
import { createSalon, deleteSalon, listSalons } from "../services/salonsApi"

interface Salon {
   id: number
   name: string
   capacity: number
   sede_id: number
   turn_id: number
   registration_process_id: number
}

interface SalonState {
   salon: Salon | null
   salons: Salon[]
   error: string
   loading: boolean
   setSalon: (salon: Salon | null) => void
   clearSalon: () => void
   refreshSalons: () => Promise<void>
   addSalon: (salonData: Omit<Salon, 'id'>, is_administrator: boolean, token: string) => Promise<void>
   removeSalon: (salonId: number, is_administrator: boolean, token: string) => Promise<void>
}

export const useSalonStore = create<SalonState>((set) => ({
   salons: [],
   salon: null,
   error: '',
   loading: false,
   setSalon: (salon) => set({ salon }),
   clearSalon: () => set({ salon: null }),

   refreshSalons: async () => {
      set({ loading: true, error: '' })
      try {
         const response = await listSalons()
         set({ salons: response.data, loading: false })
      } catch (error) {
         console.error('Error fetching salons:', error)
         set({ error: 'Error al cargar los salones', loading: false })
      }
   },

   addSalon: async (salonData, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         const response = await createSalon(salonData, is_administrator, token)
         set((state) => ({
            salons: [...state.salons, { name: response.data.name, capacity: response.data.capacity, sede_id: response.data.sede_id, turn_id: response.data.turn_id, registration_process_id: response.data.registration_process_id, id: response.data.id }],
            loading: false
         }))
      } catch (error) {
         console.error('Error creating salon:', error)
         set({ error: 'Error al crear el salón', loading: false })
      }
   },

   removeSalon: async (salonId, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         await deleteSalon(salonId, is_administrator, token)
         set((state) => ({
            salons: state.salons.filter((salon) => salon.id !== salonId),
            loading: false
         }))
      } catch (error) {
         console.error('Error deleting salon:', error)
         set({ error: 'Error al eliminar el salón', loading: false })
      }
   }
}))