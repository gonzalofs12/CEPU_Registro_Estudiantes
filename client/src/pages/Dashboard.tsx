import React from 'react'

const DashboardPage = () => {

  const name = localStorage.getItem('name') || 'Usuario'
  const roleId = Number(localStorage.getItem('role_id')) || 0

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role_id')
    localStorage.removeItem('name')
    window.location.href = '/login'
  }

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <p>Bienvenido, {name}</p>
        {roleId == 1 ? <p>Administrador</p> : <p>Coordinador</p>}

        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </>
  )
}

export default DashboardPage