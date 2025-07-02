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
         <div>
            <h3>List Salons</h3>
            {displayMessage && (
               <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>Capacidad</th>
                     <th>Sede</th>
                     <th>Turno</th>
                     <th>Proceso de Registro</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody id="salon-list">
                  {salons.map(salon => (
                     <tr key={salon.id}>
                        <td>{salon.id}</td>
                        <td>{salon.name}</td>
                        <td>{salon.capacity}</td>
                        <td>{sedes.find(sede => sede.id === salon.sede_id)?.name || salon.sede_id}</td>
                        <td>{turns.find(turn => turn.id === salon.turn_id)?.name || salon.turn_id}</td>
                        <td>{processes.find(process => process.id === salon.registration_process_id)?.name || salon.registration_process_id}</td>
                        <td>
                           <button onClick={() => console.log(`Edit salon with ID: ${salon.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(salon.id, token)} disabled={loading}>Eliminar</button>
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