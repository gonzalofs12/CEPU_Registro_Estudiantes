import { useEffect, useState } from "react";
import { useGetToken } from "../hooks/useGetToken";
import { useUserData } from "../hooks/useUserData";
import { useSalonStore } from "../store/useSalonStore";
import { useSedeStore } from "../store/useSedeStore";
import { useTurnStore } from "../store/useTurnStore";
import { useProcessStore } from "../store/useProcessStore";

const ListSalons = () => {
   const { salons, refreshSalons, removeSalon, success, message, loading } = useSalonStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [displayMessage, setDisplayMessage] = useState("")
   const [isSuccess, setIsSuccess] = useState(false)
   const { sedes, refreshSedes } = useSedeStore()
   const { turns, refreshTurns } = useTurnStore()
   const { processes, refreshProcesses } = useProcessStore()

   useEffect(() => {
      refreshSalons()
      refreshSedes()
      refreshTurns()
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

   const handleDelete = async (salon_id: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setDisplayMessage("No se encontró el token de autenticación.")
            setIsSuccess(false)
            return
         }
         await removeSalon(salon_id, isAdministrator, token)
      } catch (error) {
         console.error("Error al eliminar el salón:", error)
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
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Código</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacidad</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sede</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Turno</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Proceso de Registro</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
               </thead>
               <tbody id="salon-list">
                  {salons.map(salon => (
                     <tr key={salon.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b border-gray-200">{salon.code}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{salon.name}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{salon.capacity}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{sedes.find(sede => sede.id === salon.sede_id)?.code || salon.sede_id}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{turns.find(turn => turn.id === salon.turn_id)?.name || salon.turn_id}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{processes.find(process => process.id === salon.registration_process_id)?.name || salon.registration_process_id}</td>
                        <td>
                           <button onClick={() => console.log(`Edit salon with ID: ${salon.id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2">Editar</button>
                           <button onClick={() => handleDelete(salon.id, token)} disabled={loading} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Eliminar</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListSalons;