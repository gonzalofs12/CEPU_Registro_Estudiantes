import React, { useState } from "react"
import { changePassword } from "../services/authApi"

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No se encontró el token de autenticación.')
        return
      }
      const response = await changePassword(token, currentPassword, newPassword)
      setSuccess(true)
      setError('')
      setCurrentPassword('')
      setNewPassword('')
      console.log('Contraseña cambiada exitosamente:', response)
    } catch (error) {
      setError('Error al cambiar la contraseña. Por favor, inténtalo de nuevo.')
      console.error('Error al cambiar la contraseña:', error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Cambiar Contraseña</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Contraseña cambiada exitosamente.</p>}
        <div>
          <label htmlFor="currentPassword">Contraseña Actual:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">Nueva Contraseña:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </>
  )
}

export default ChangePasswordForm