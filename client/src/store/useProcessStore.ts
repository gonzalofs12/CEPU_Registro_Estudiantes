import { create } from 'zustand'
import { createProcesses, deleteProcesses, listProcesses } from '../services/processesApi'

interface Process {
   id: number
   name: string
   code: string
   is_administrator: boolean
}

interface ProcessStore {
   processes: Process[]
   error: string
   success: boolean
   message: string
   loading: boolean
   refreshProcesses: () => Promise<void>
   addProcess: (processData: Omit<Process, 'id'>, token: string) => Promise<void>
   removeProcess: (processId: number, token: string) => Promise<void>
}

export const useProcessStore = create<ProcessStore>((set) => ({
   processes: [],
   loading: false,
   error: '',
   success: false,
   message: '',

   refreshProcesses: async () => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await listProcesses()
         set({ processes: response.data, loading: false, success: true, message: 'Procesos cargados exitosamente.' })
      } catch (error) {
         console.error('Error fetching processes:', error)
         set({ error: 'Error al cargar los procesos', loading: false, success: false, message: 'Error al cargar los procesos.' })
      }
   },

   addProcess: async (processData, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await createProcesses(processData, token)
         set((state) => ({
            processes: [...state.processes, { name: response.data.name, code: response.data.code, id: response.data.id, is_administrator: processData.is_administrator }],
            loading: false,
            success: true,
            message: 'Proceso creado exitosamente.'
         }))
      } catch (error) {
         console.error('Error creating process:', error)
         set({ error: 'Error al crear el proceso', loading: false, success: false, message: 'Error al crear el proceso.' })
      }
   },

   removeProcess: async (processId, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         await deleteProcesses(processId, true, token) // Assuming the user is an administrator
         set((state) => ({
            processes: state.processes.filter((process) => process.id !== processId),
            loading: false,
            success: true,
            message: 'Proceso eliminado exitosamente.'
         }))
      } catch (error) {
         console.error('Error deleting process:', error)
         set({ error: 'Error al eliminar el proceso', loading: false, success: false, message: 'Error al eliminar el proceso.' })
      }
   }
}))