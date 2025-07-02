import React from 'react'
import { useUserData } from '../hooks/useUserData'
import { useGetToken } from '../hooks/useGetToken'
import { useTurnStore } from '../store/useTurnStore'
import { useEffect, useState } from 'react'

const CreateTurnForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const isAdministrator = user?.role_id === 1

   const { addTurn, success, message, loading } = useTurnStore()

   const [formData, setFormData] = useState({
      name: ''
   })
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

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
         await addTurn(formData, isAdministrator, token || '')
         setFormData({ name: '' })
      } catch (error) {
         console.error('Error al crear el turno:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <h2>Crear Turno</h2>
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
         <button type="submit" disabled={loading}>Crear Turno</button>
      </form>
   )
}

export default CreateTurnForm