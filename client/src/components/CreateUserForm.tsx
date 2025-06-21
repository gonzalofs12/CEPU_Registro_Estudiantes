import React, { useState } from 'react'
import { useUserData } from '../hooks/useUserData'
import { useGetToken } from '../hooks/useGetToken'
import { useUserStore } from '../store/useUserStore'


const CreateUserForm = () => {

   const { user } = useUserData()
   const { token } = useGetToken()
   const { addUser } = useUserStore()

   const isAdministrator = user?.role_id === 1

   const [formData, setFormData] = useState({
      name: '',
      dni: '',
      password: '',
      role_id: 2, // Por defecto, rol de Administrador
   })
   const [error, setError] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData({
         ...formData,
         [id]: value,
      })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
         const response = await addUser(formData, isAdministrator, token || '')
         console.log('Usuario creado exitosamente:', response)
         setFormData({
            name: '',
            dni: '',
            password: '',
            role_id: 2, // Reiniciar a rol de Coordinador
         })
         setError('')
      } catch (error) {
         setError('Error al crear el usuario. Inténtalo de nuevo.')
         console.error('Error al crear el usuario:', error)
      }
   }


   return (
      <>
         <form onSubmit={handleSubmit}>
            <h2>Crear Usuario</h2>
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
               <label htmlFor="dni">DNI:</label>
               <input
                  type="text"
                  id="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
               />
            </div>
            <div>
               <label htmlFor="password">Contraseña:</label>
               <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
               />
            </div>
            <div>
               <label htmlFor="role_id">Rol:</label>
               <select
                  id="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
               >
                  <option value={1}>Administrador</option>
                  <option value={2}>Coordinador</option>
               </select>
            </div>
            <button type="submit">Crear Usuario</button>
         </form>
      </>
   )
}

export default CreateUserForm