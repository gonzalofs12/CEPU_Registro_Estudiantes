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
         await addUser(formData, isAdministrator, token || '')
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
         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
               <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
               <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <div className="mb-4">
               <label htmlFor="dni" className="block text-gray-700 text-sm font-bold mb-2">DNI:</label>
               <input
                  type="text"
                  id="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <div className="mb-4">
               <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
               <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <div className="mb-6">
               <label htmlFor="role_id" className="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
               <select
                  id="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value={1}>Administrador</option>
                  <option value={2}>Coordinador</option>
               </select>
            </div>
            <button type="submit" className='bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer mb-4'>Crear Usuario</button>
         </form>
      </>
   )
}

export default CreateUserForm