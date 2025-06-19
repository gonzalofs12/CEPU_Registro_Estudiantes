/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createUser = async (userData: any) => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("Token no encontrado")
  }

  const response = await axios.post(`${API_URL}/user/create`, userData, {
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