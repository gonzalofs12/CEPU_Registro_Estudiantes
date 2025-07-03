import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useSedeStore } from "../store/useSedeStore"

const ListSedes = () => {
   const { sedes, refreshSedes, removeSede, success, message, loading } = useSedeStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [displayMessage, setDisplayMessage] = useState("")
   const [isSuccess, setIsSuccess] = useState(false)

   useEffect(() => {
      refreshSedes()
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

   const handleDelete = async (sedeId: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setDisplayMessage("No se encontró el token de autenticación.")
            setIsSuccess(false)
            return
         }
         await removeSede(sedeId, isAdministrator, token)
      } catch (error) {
         console.error("Error al eliminar la sede:", error)
      }
   }

   return (
      <>
         <div className="overflow-x-auto">
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
               <tbody id="sede-list">
                  {sedes.map(sede => (
                     <tr key={sede.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b border-gray-200">{sede.code}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{sede.name}</td>
                        <td className="py-2 px-4 border-b border-gray-200">
                           <button onClick={() => console.log(`Edit sede with ID: ${sede.id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2">Editar</button>
                           <button onClick={() => handleDelete(sede.id, token)} disabled={loading} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Eliminar</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListSedes