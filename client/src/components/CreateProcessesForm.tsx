import React, { useEffect, useState } from 'react'
import { useProcessStore } from '../store/useProcessStore'
import { useUserData } from '../hooks/useUserData'
import { useGetToken } from '../hooks/useGetToken'

const CreateProcessesForm = () => {

   const { user } = useUserData()
   const { token } = useGetToken()

   const isAdministrator = user?.role_id === 1

   const { addProcess, success, message, loading } = useProcessStore()

   const [formData, setFormData] = useState({
      name: '',
      code: '',
      is_administrator: false, // Verificar si el usuario es administrador
   })

   useEffect(() => {
      setFormData((prev) => ({
         ...prev,
         is_administrator: isAdministrator,
      }))
   }, [user])

   const [displayMessage, setDisplayMessage] = useState('')
   const [isSuccess, setIsSuccess] = useState(false)

   useEffect(() => {
      if (message) {
         setDisplayMessage(message)
         setIsSuccess(success)
         const timer = setTimeout(() => {
            setDisplayMessage('')
         }, 3000) // Clear message after 3 seconds
         return () => clearTimeout(timer)
      }
   }, [message, success])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
         await addProcess(formData, token || '')
         setFormData({ ...formData, name: '', code: '' })
      } catch (error) {
         console.error('Error al crear el proceso:', error)
      }
   }

   return (
      <>
         <form onSubmit={handleSubmit}>
            <h2>Crear Proceso de Inscripción</h2>
            {displayMessage && (
               <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <div>
               <label htmlFor="name">Nombre:</label>
               <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
               />
            </div>
            <div>
               <label htmlFor="code">Código:</label>
               <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
               />
            </div>
            <button type="submit" disabled={loading}>Crear Proceso</button>
         </form>
      </>
   )
}

export default CreateProcessesForm