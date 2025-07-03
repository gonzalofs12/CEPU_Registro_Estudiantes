import { useEffect, useState } from 'react'
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
         <div className="overflow-x-auto">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <table className="min-w-full bg-white border border-gray-200">
               <thead>
                  <tr>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
               </thead>
               <tbody id="user-list">
                  {
                     users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-100">
                           <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
                           <td className="py-2 px-4 border-b border-gray-200">{user.dni}</td>
                           <td className="py-2 px-4 border-b border-gray-200">{user.role_id === 1 ? 'Administrador' : 'Coordinador'}</td>
                           <td className="py-2 px-4 border-b border-gray-200">
                              <button onClick={() => console.log(`Edit user with ID: ${user.id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2">Editar</button>
                              <button onClick={() => handleDelete(user.id, token)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Eliminar</button>
                           </td>
                        </tr>
                     ))
                  }
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListUser