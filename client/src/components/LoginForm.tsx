import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { useUserStore } from "../store/useUserStore"
import { login } from '../services/authApi'

const LoginForm = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data } = await login(username, password)
      useAuthStore.getState().setToken(data.token)
      useUserStore.getState().setUser(data.user)
      navigate('/dashboard')
    } catch (error) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
      console.error('Error de inicio de sesión:', error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="username">Nombre del usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </>
  )
}

export default LoginForm