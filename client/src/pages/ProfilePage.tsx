import React, { useState } from 'react'
import ChangePasswordForm from '../components/ChangePasswordForm'
import CreateUserForm from '../components/CreateUserForm'
import ListUser from '../components/ListUser'

const ProfilePage = () => {

  const name = localStorage.getItem('name') || 'Usuario'
  const roleId = Number(localStorage.getItem('role_id')) || 0

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