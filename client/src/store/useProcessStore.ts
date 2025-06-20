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
   loading: boolean
   refreshProcesses: () => Promise<void>
   addProcess: (processData: Omit<Process, 'id'>) => Promise<void>
   removeProcess: (processId: number) => Promise<void>
}

export const useProcessStore = create<ProcessStore>((set) => ({
   processes: [],
   loading: false,
   error: '',

   refreshProcesses: async () => {
      set({ loading: true, error: '' })
      try {
         const response = await listProcesses()
         set({ processes: response.data, loading: false })
      } catch (error) {
         console.error('Error fetching processes:', error)
         set({ error: 'Error al cargar los procesos', loading: false })
      }
   },

   addProcess: async (processData) => {
      set({ loading: true, error: '' })
      try {
         const response = await createProcesses(processData)
         set((state) => ({
            processes: [...state.processes, { ...processData, id: response.data.id }],
            loading: false
         }))
      } catch (error) {
         console.error('Error creating process:', error)
         set({ error: 'Error al crear el proceso', loading: false })
      }
   },

   removeProcess: async (processId) => {
      set({ loading: true, error: '' })
      try {
         await deleteProcesses(processId, true) // Assuming the user is an administrator
         set((state) => ({
            processes: state.processes.filter((process) => process.id !== processId),
            loading: false
         }))
      } catch (error) {
         console.error('Error deleting process:', error)
         set({ error: 'Error al eliminar el proceso', loading: false })
      }
   }
}))