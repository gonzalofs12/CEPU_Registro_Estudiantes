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
    <>
      <div>
        <h1>ProfilePage</h1>
        <p>Bienvenido, {name}</p>
        {roleId === 1 ? <p>Administrador</p> : <p>Coordinador</p>}
        <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>
          {showChangePasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
        </button>
        {showChangePasswordForm ? <ChangePasswordForm /> : null}
        {roleId === 1 && <CreateUserForm />}
        {roleId === 1 && <ListUser />}
      </div>
    </>

  )
}

export default ProfilePage