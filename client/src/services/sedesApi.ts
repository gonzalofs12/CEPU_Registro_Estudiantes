import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

interface Sede {
   id: number
   name: string
   code: string
}

export const createSede = async (sedeData: Omit<Sede, 'id'>, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }

   const response = await axios.post(`${API_URL}/sedes/create`, { sedeData, is_administrator }, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const listSedes = async () => {
   const response = await axios.get(`${API_URL}/sedes/list`)
   return response.data
}

export const deleteSede = async (sedeId: number, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.delete(`${API_URL}/sedes/delete/${sedeId}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      data: {
         is_administrator: is_administrator // Assuming the user is an administrator
      }
   })
   return response.data
}