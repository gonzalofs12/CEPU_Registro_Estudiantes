import React, { useState } from 'react'
import ChangePasswordForm from '../components/ChangePasswordForm'
import CreateUserForm from '../components/CreateUserForm'
import ListUser from '../components/ListUser'
import { useUserData } from '../hooks/useUserData'


const ProfilePage = () => {

  const { user } = useUserData()

  const name = user?.name || 'Usuario'
  const roleId = user?.id || 0

  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">

        <h1 className="text-2xl font-bold text-center mb-6 text-sky-700">Perfil de Usuario</h1>
        <p className="text-gray-700 text-lg mb-2">Bienvenido, <span className="font-semibold">{name}</span></p>
        <p className="text-gray-700 text-lg mb-4">Rol: <span className="font-semibold">{roleId === 1 ? 'Administrador' : 'Coordinador'}</span></p>
        <button
          onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer mb-4"
        >
          {showChangePasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
        </button>
        {showChangePasswordForm && <ChangePasswordForm />}
        {roleId === 1 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-sky-700">Gestión de Usuarios</h2>
            <CreateUserForm />
            <h2 className="text-xl font-bold mb-4 text-sky-700">Lista de Usuarios</h2>
            <ListUser />
          </div>
        )}
      </div>
    </div>


  )
}

export default ProfilePage