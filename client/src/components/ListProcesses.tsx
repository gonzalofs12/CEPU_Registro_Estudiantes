import React, { useEffect } from 'react'
import { useProcessStore } from '../store/useProcessStore'
import { useUserData } from '../hooks/useUserData'
import { useAuthStore } from '../store/useAuthStore'


const ListProcesses = () => {

   const { processes, loading, error, refreshProcesses, removeProcess } = useProcessStore()
   const { user } = useUserData()

   useEffect(() => {
      refreshProcesses()
   }, [])

   if (loading) return <p>Cargando procesos...</p>
   if (error) return <p>Error al cargar los procesos: {error}</p>


   const handleDelete = async (processes_id: number) => {
      try {
         const isAdministrator = user?.role_id === 1
         const token = useAuthStore.getState().token
         if (!token || !isAdministrator) {
            return
         }
         await removeProcess(processes_id, token)
      } catch (error) {
         console.error('Error al eliminar procesow:', error)
      }
   }

   return (
      <>
         <div>
            <h3>Lista de Procesos</h3>
            {error && <p className="error">{error}</p>}
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
                              <button onClick={() => handleDelete(process.id)}>Eliminar</button>
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