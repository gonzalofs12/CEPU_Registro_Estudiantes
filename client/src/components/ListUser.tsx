import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/useUserStore'
import { useUserData } from '../hooks/useUserData'
import { useGetToken } from '../hooks/useGetToken'

const ListUser = () => {
   const { users, refreshUser, removeUser } = useUserStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [error, setError] = useState('')


   useEffect(() => {
      refreshUser()
   }, [])

   const handleDelete = async (user_id: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setError('No se encontró el token de autenticación.')
            return
         }
         await removeUser(user_id, isAdministrator, token)
         setError('')
      } catch (error) {
         setError('Error al cambiar la contraseña. Por favor, inténtalo de nuevo.')
         console.error('Error al cambiar la contraseña:', error)
      }
   }

   return (
      <>
         <div>
            <h3>ListUser</h3>
            {error && <p className="error">{error}</p>}
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>DNI</th>
                     <th>Rol</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody id="user-list">
                  {
                     users.map(user => (
                        <tr key={user.id}>
                           <td>{user.id}</td>
                           <td>{user.name}</td>
                           <td>{user.dni}</td>
                           <td>{user.role_id === 1 ? 'Administrador' : 'Coordinador'}</td>
                           <td>
                              <button onClick={() => console.log(`Edit user with ID: ${user.id}`)}>Editar</button>
                              <button onClick={() => handleDelete(user.id, token)}>Eliminar</button>
                           </td>
                        </tr>
                     ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListUser