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
         <div>
            <h3>List Sedes</h3>
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
               <tbody id="sede-list">
                  {sedes.map(sede => (
                     <tr key={sede.id}>
                        <td>{sede.code}</td>
                        <td>{sede.name}</td>
                        <td>
                           <button onClick={() => console.log(`Edit sede with ID: ${sede.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(sede.id, token)} disabled={loading}>Eliminar</button>
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