import { useUserStore } from "../store/useUserStore"

export const useUserData = () => {
   const user = useUserStore((state) => state.user)

   return {
      user
   }
}