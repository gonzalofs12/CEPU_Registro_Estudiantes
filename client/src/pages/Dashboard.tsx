import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'
import { useUserData } from '../hooks/useUserData'

const DashboardPage = () => {
  const { user } = useUserData()
  const name = user?.name || 'Usuario'
  const roleId = Number(user?.role_id) || 0

  const handleLogout = () => {
    useAuthStore.getState().clearToken()
    useUserStore.getState().clearUser()
    window.location.href = '/login'
  }

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <p>Bienvenido, {name}</p>
        {roleId === 1 ? <p>Administrador</p> : <p>Coordinador</p>}
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </>
  )
}

export default DashboardPage