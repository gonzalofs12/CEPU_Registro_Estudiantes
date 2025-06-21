import { useAuthStore } from "../store/useAuthStore"

export const useGetToken = () => {
   const token = useAuthStore((state) => state.token)

   return {
      token
   }
}