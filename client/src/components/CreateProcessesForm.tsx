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
         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
            {displayMessage && (
               <p className='text-sm mb-4' style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <div className='mb-4'>
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
            <div className='mb-4'>
               <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">Código:</label>
               <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <button type="submit" disabled={loading} className='bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer mb-4'>Crear Proceso</button>
         </form>
      </>
   )
}

export default CreateProcessesForm