import axios from "axios"
import { useAuthStore } from "../store/useAuthStore"

const API_URL = import.meta.env.VITE_API_URL

export const login = async (dni: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { dni, password })
  return response.data
}

export const changePassword = async (token: string, currentPassword: string, newPassword: string, dni: string) => {
  const response = await axios.post(
    `${API_URL}/auth/change-password`,
    { currentPassword, newPassword, dni },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const getUserFromToken = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`
      }
    })
    return response.data.user
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error)
    throw error
  }
}