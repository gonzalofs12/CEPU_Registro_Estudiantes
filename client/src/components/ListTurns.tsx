import { useEffect, useState } from "react"
import { useTurnStore } from "../store/useTurnStore"
import { useUserData } from "../hooks/useUserData"
import { useGetToken } from "../hooks/useGetToken"

const ListTurns = () => {
   const { turns, refreshTurns, removeTurn, success, message, loading } = useTurnStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [displayMessage, setDisplayMessage] = useState("")
   const [isSuccess, setIsSuccess] = useState(false)

   useEffect(() => {
      refreshTurns()
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

   const handleDelete = async (turn_id: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setDisplayMessage("No se encontró el token de autenticación.")
            setIsSuccess(false)
            return
         }
         await removeTurn(turn_id, isAdministrator, token)
      } catch (error) {
         console.error("Error al eliminar el turno:", error)
      }
   }

   return (
      <>
         <div>
            <h3>List Turns</h3>
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
               <tbody id="turn-list">
                  {turns.map(turn => (
                     <tr key={turn.id}>
                        <td>{turn.id}</td>
                        <td>{turn.name}</td>
                        <td>
                           <button onClick={() => console.log(`Edit turn with ID: ${turn.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(turn.id, token)} disabled={loading}>Eliminar</button>
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