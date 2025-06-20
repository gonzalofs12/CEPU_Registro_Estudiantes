import React, { useEffect, useState } from 'react'
import { listUser, deleteUser } from '../services/userApi'

interface User {
  id: number
  name: string
  dni: number
  role_id: number
}

const ListUser = () => {

  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await listUser()
        console.log('Users fetched successfully:', response)
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (user_id: number) => {
    try {
      const isAdministrator = localStorage.getItem('role_id') === '1'
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No se encontró el token de autenticación.')
        return
      }
      await deleteUser(user_id, isAdministrator)
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
                    <button onClick={() => handleDelete(user.id)}>Eliminar</button>
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