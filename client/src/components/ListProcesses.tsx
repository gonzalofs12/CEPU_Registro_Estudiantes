import { useEffect, useState } from 'react'
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
            {displayMessage && (
               <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <table className="min-w-full bg-white border border-gray-200">
               <thead>
                  <tr>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
               </thead>
               <tbody id="user-list">
                  {
                     processes.map(process => (
                        <tr key={process.id} className="hover:bg-gray-100">
                           <td className="py-2 px-4 border-b border-gray-200">{process.code}</td>
                           <td className="py-2 px-4 border-b border-gray-200">{process.name}</td>
                           <td className="py-2 px-4 border-b border-gray-200">
                              <button onClick={() => console.log(`Edit user with ID: ${process.id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2">Editar</button>
                              <button onClick={() => handleDelete(process.id)} disabled={loading} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Eliminar</button>
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