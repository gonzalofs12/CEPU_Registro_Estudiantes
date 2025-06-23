import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

interface Turn {
   id: number
   name: string
}

export const createTurn = async (turnData: Omit<Turn, 'id'>, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }

   const response = await axios.post(`${API_URL}/turns/create`, { turnData, is_administrator }, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const listTurns = async () => {
   const response = await axios.get(`${API_URL}/turns/list`)
   return response.data
}

export const deleteTurn = async (turnId: number, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.delete(`${API_URL}/turns/delete/${turnId}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      data: {
         is_administrator: is_administrator // Assuming the user is an administrator
      }
   })
   return response.data
}