import React, { useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useSedeStore } from "../store/useSedeStore"

const CreateSedeForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const isAdministrator = user?.role_id === 1

   const { addSede } = useSedeStore()

   const [formData, setFormData] = useState({
      name: '',
      code: ''
   })
   const [error, setError] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
         await addSede(formData, isAdministrator, token || '')
         setFormData({ name: '', code: '' })
         setError('')
      }
      catch (error) {
         setError('Error al crear la sede. Inténtalo de nuevo.')
         console.error('Error al crear la sede:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <h2>Crear Sede</h2>
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
         <button type="submit">Crear Sede</button>
      </form>
   )
}

export default CreateSedeForm