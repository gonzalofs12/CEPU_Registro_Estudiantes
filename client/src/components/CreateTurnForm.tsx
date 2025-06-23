import React, { useState } from 'react'
import { useUserData } from '../hooks/useUserData'
import { useGetToken } from '../hooks/useGetToken'
import { useTurnStore } from '../store/useTurnStore'

const CreateTurnForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const isAdministrator = user?.role_id === 1

   const { addTurn } = useTurnStore()

   const [formData, setFormData] = useState({
      name: ''
   })
   const [error, setError] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
         await addTurn(formData, isAdministrator, token || '')
         setFormData({ name: '' })
         setError('')
      } catch (error) {
         setError('Error al crear el turno. Inténtalo de nuevo.')
         console.error('Error al crear el turno:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <h2>Crear Turno</h2>
         {error && <p className="error">{error}</p>}
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
         <button type="submit">Crear Turno</button>
      </form>
   )
}

export default CreateTurnForm