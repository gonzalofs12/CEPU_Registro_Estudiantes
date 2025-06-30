// client/src/hooks/useFetchUserOnLoad.ts
import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'
import { getUserFromToken } from '../services/authApi'
import { isTokenValid } from '../utils/jwt'
import { usePaymentPlanStore } from '../store/usePaymentPlanStore'
import { useProcessStore } from '../store/useProcessStore'
import { useSalonStore } from '../store/useSalonStore'
import { useSedeStore } from '../store/useSedeStore'
import { useTurnStore } from '../store/useTurnStore'

export const useFetchUserOnLoad = () => {
   const token = useAuthStore((state) => state.token)
   const user = useUserStore((state) => state.user)
   const setUser = useUserStore((state) => state.setUser)
   const { clearToken } = useAuthStore()
   const { refreshPaymentPlans } = usePaymentPlanStore()
   const { refreshProcesses } = useProcessStore()
   const { refreshSalons } = useSalonStore()
   const { refreshSedes } = useSedeStore()
   const { refreshTurns } = useTurnStore()


   useEffect(() => {
      const fetchUser = async () => {
         if (!token || !isTokenValid(token)) {
            clearToken()
            return
         }

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

   useEffect(() => {
      refreshPaymentPlans()
      refreshProcesses()
      refreshSalons()
      refreshSedes()
      refreshTurns()
   }, [])
}