/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createUser = async (userData: any, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }

   const response = await axios.post(`${API_URL}/user/create`, { userData, is_administrator }, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const listUser = async () => {
   const response = await axios.get(`${API_URL}/user/list`)
   return response.data
}

export const deleteUser = async (userId: number, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.delete(`${API_URL}/user/delete/${userId}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      data: {
         is_administrator: is_administrator // Assuming the user is an administrator
      }
   })
   return response.data
}