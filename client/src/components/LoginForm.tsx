import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { useUserStore } from "../store/useUserStore"
import { login } from '../services/authApi'

const LoginForm = () => {
  const navigate = useNavigate()
  const [dni, setdni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data } = await login(dni, password)
      useAuthStore.getState().setToken(data.token)
      useUserStore.getState().setUser(data.user)
      navigate('/dashboard')
    } catch (error) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
      console.error('Error de inicio de sesión:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">Iniciar Sesión</h2>
        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</p>}
        <div className="mb-4">
          <label htmlFor="dni" className="block text-gray-700 text-sm font-bold mb-2">Nombre del usuario:</label>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setdni(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  )
}

export default LoginForm