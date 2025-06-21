import { create } from "zustand"

interface User {
   id: number
   username: number
   role_id: number
   name: string
}

interface UserState {
   user: User | null
   setUser: (user: User | null) => void
   clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
   user: null,
   setUser: (user) => set({ user }),
   clearUser: () => set({ user: null }),
}))
