import React from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useSedeStore } from "../store/useSedeStore"
import { useEffect, useState } from "react"

const CreateSedeForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const isAdministrator = user?.role_id === 1

   const { addSede, success, message, loading } = useSedeStore()

   const [formData, setFormData] = useState({
      name: '',
      code: ''
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
         await addSede(formData, isAdministrator, token || '')
         setFormData({ name: '', code: '' })
      }
      catch (error) {
         console.error('Error al crear la sede:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <h2>Crear Sede</h2>
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
         <button type="submit" disabled={loading}>Crear Sede</button>
      </form>
   )
}

export default CreateSedeForm