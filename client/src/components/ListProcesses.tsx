import React, { useEffect, useState } from 'react'
import { useProcessStore } from '../store/useProcessStore'
import { useUserData } from '../hooks/useUserData'
import { useAuthStore } from '../store/useAuthStore'


const ListProcesses = () => {

   const { processes, loading, success, message, refreshProcesses, removeProcess } = useProcessStore()
   const { user } = useUserData()
   const [displayMessage, setDisplayMessage] = useState("")
   const [isSuccess, setIsSuccess] = useState(false)

   useEffect(() => {
      refreshProcesses()
   }, [])

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

   if (loading) return <p>Cargando procesos...</p>


   const handleDelete = async (processes_id: number) => {
      try {
         const isAdministrator = user?.role_id === 1
         const token = useAuthStore.getState().token
         if (!token || !isAdministrator) {
            setDisplayMessage("No tienes permisos para eliminar procesos.")
            setIsSuccess(false)
            return
         }
         await removeProcess(processes_id, token)
      } catch (error) {
         console.error('Error al eliminar proceso:', error)
      }
   }

   return (
      <>
         <div>
            <h3>Lista de Procesos</h3>
            {displayMessage && (
               <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody id="user-list">
                  {
                     processes.map(process => (
                        <tr key={process.id}>
                           <td>{process.code}</td>
                           <td>{process.name}</td>
                           <td>
                              <button onClick={() => console.log(`Edit user with ID: ${process.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(process.id)} disabled={loading}>Eliminar</button>
                        </td>
                        </tr>
                     ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListProcesses