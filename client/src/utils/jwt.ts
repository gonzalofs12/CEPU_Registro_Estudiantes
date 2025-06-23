export const isTokenValid = (token: string): boolean => {
   try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expire = payload.exp
      const now = Math.floor(Date.now() / 1000)
      return expire > now
   } catch (e) {
      console.error('Error decoding token:', e)
      return false
   }
}