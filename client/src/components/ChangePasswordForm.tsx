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
      const dni = localStorage.getItem('dni') || ''
      if (!token) {
        setError('No se encontró el token de autenticación.')
        return
      }
      const response = await changePassword(token, currentPassword, newPassword, dni)
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
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Contraseña cambiada exitosamente.</p>}
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">Contraseña Actual:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer mb-4">Cambiar Contraseña</button>
      </form>
    </>
  )
}

export default ChangePasswordForm