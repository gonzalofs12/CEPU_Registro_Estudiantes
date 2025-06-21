// client/src/hooks/useFetchUserOnLoad.ts
import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'
import { getUserFromToken } from '../services/authApi'

export const useFetchUserOnLoad = () => {
   const token = useAuthStore((state) => state.token)
   const user = useUserStore((state) => state.user)
   const setUser = useUserStore((state) => state.setUser)

   useEffect(() => {
      const fetchUser = async () => {
         if (token && !user) {
            try {
               const userData = await getUserFromToken()
               setUser(userData)
            } catch (error) {
               console.error('Error al cargar datos del usuario:', error)
            }
         }
      }

      fetchUser()
   }, [token, user])
}