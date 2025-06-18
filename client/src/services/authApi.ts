import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password })
  return response.data
}

export const changePassword = async (token: string, currentPassword: string, newPassword: string) => {
  const response = await axios.post(
    `${API_URL}/auth/change-password`,
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}