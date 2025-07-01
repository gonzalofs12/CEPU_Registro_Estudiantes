import { create } from "zustand"
import { createUser, deleteUser, listUser } from "../services/userApi"

interface User {
   id: number
   dni: number | string
   role_id: number | string
   name: string
}

interface UserState {
   user: User | null
   users: User[]
   error: string
   loading: boolean
   setUser: (user: User | null) => void
   clearUser: () => void
   refreshUser: () => Promise<void>
   addUser: (userData: Omit<User, 'id'>, is_administrator: boolean, token: string) => Promise<void>
   removeUser: (userId: number, is_administrator: boolean, token: string) => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
   users: [],
   user: null,
   error: '',
   loading: false,
   setUser: (user) => set({ user }),
   clearUser: () => set({ user: null }),

   refreshUser: async () => {
      set({ loading: true, error: '' })
      try {
         const response = await listUser()
         set({ users: response.data, loading: false })
      } catch (error) {
         console.error('Error fetching user:', error)
         set({ error: 'Error al cargar el usuario', loading: false })
      }
   },

   addUser: async (userData, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         const response = await createUser(userData, is_administrator, token)
         set((state) => ({
            users: [...state.users, { ...userData, id: response.data.id }],
            loading: false
         }))
      } catch (error) {
         console.error('Error creating user:', error)
         set({ error: 'Error al crear el usuario', loading: false })
      }
   },


   removeUser: async (userId, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         await deleteUser(userId, is_administrator, token)
         set((state) => ({
            users: state.users.filter((user) => user.id !== userId),
            loading: false
         }))
      } catch (error) {
         console.error('Error deleting user:', error)
         set({ error: 'Error al eliminar el usuario', loading: false })
      }
   },

}))
