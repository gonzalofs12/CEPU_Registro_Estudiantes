import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

interface Process {
   name: string
   code: string
   is_administrator: boolean
}

export const createProcesses = async (processesData: Process) => {
   const token = localStorage.getItem("token")
   if (!token) {
      throw new Error("Token no encontrado")
   }

   const response = await axios.post(`${API_URL}/processes/create`, processesData, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const listProcesses = async () => {
   const response = await axios.get(`${API_URL}/processes/list`)
   return response.data
}

export const deleteProcesses = async (processesId: number, is_administrator: boolean) => {
   const token = localStorage.getItem("token")
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.delete(`${API_URL}/processes/delete/${processesId}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      data: {
         is_administrator: is_administrator // Assuming the user is an administrator
      }
   })
   return response.data
}