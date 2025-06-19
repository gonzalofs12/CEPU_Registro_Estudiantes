import React, { useEffect, useState } from 'react'
import { listUser } from '../services/userApi'

interface User {
  id: number
  name: string
  dni: number
  role_id: number
}

const ListUser = () => {

  const [users, setUsers] = useState<User[]>([])

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

  return (
    <>
      <div>
        <h3>ListUser</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Rol</th>
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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ListUser