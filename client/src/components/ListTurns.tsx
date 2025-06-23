import { useEffect, useState } from "react"
import { useTurnStore } from "../store/useTurnStore"
import { useUserData } from "../hooks/useUserData"
import { useGetToken } from "../hooks/useGetToken"

const ListTurns = () => {
   const { turns, refreshTurns, removeTurn } = useTurnStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [error, setError] = useState("")

   useEffect(() => {
      refreshTurns()
   }, [])

   const handleDelete = async (turn_id: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setError("No se encontró el token de autenticación.")
            return
         }
         await removeTurn(turn_id, isAdministrator, token)
         setError("")
      } catch (error) {
         setError("Error al eliminar el turno. Por favor, inténtalo de nuevo.")
         console.error("Error al eliminar el turno:", error)
      }
   }

   return (
      <>
         <div>
            <h3>List Turns</h3>
            {error && <p className="error">{error}</p>}
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody id="turn-list">
                  {turns.map(turn => (
                     <tr key={turn.id}>
                        <td>{turn.id}</td>
                        <td>{turn.name}</td>
                        <td>
                           <button onClick={() => console.log(`Edit turn with ID: ${turn.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(turn.id, token)}>Eliminar</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListTurns