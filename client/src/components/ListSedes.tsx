import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useSedeStore } from "../store/useSedeStore"

const ListSedes = () => {
   const { sedes, refreshSedes, removeSede } = useSedeStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [error, setError] = useState("")

   useEffect(() => {
      refreshSedes()
   }, [])

   const handleDelete = async (sedeId: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setError("No se encontró el token de autenticación.")
            return
         }
         await removeSede(sedeId, isAdministrator, token)
         setError("")
      } catch (error) {
         setError("Error al eliminar la sede. Por favor, inténtalo de nuevo.")
         console.error("Error al eliminar la sede:", error)
      }
   }

   return (
      <>
         <div>
            <h3>List Sedes</h3>
            {error && <p className="error">{error}</p>}
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody id="sede-list">
                  {sedes.map(sede => (
                     <tr key={sede.id}>
                        <td>{sede.id}</td>
                        <td>{sede.name}</td>
                        <td>
                           <button onClick={() => console.log(`Edit sede with ID: ${sede.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(sede.id, token)}>Eliminar</button>
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