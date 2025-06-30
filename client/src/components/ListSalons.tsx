import { useEffect, useState } from "react";
import { useGetToken } from "../hooks/useGetToken";
import { useUserData } from "../hooks/useUserData";
import { useSalonStore } from "../store/useSalonStore";

const ListSalons = () => {
   const { salons, refreshSalons, removeSalon } = useSalonStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [error, setError] = useState("")

   useEffect(() => {
      refreshSalons()
   }, [])

   const handleDelete = async (salon_id: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            console.error("No se encontró el token de autenticación.")
            return
         }
         await removeSalon(salon_id, isAdministrator, token)
         setError("")
      } catch (error) {
         setError("Error al eliminar el salón. Por favor, inténtalo de nuevo.")
         console.error("Error al eliminar el salón:", error)
      }
   }

   return (
      <>
         <div>
            <h3>List Salons</h3>
            {error && <p className="error">{error}</p>}
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
                        <td>{salon.sede_id}</td>
                        <td>{salon.turn_id}</td>
                        <td>{salon.registration_process_id}</td>
                        <td>
                           <button onClick={() => console.log(`Edit salon with ID: ${salon.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(salon.id, token)}>Eliminar</button>
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