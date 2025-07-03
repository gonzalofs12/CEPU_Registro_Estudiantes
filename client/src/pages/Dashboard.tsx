import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'
import { useUserData } from '../hooks/useUserData'
import ListStudent from '../components/ListStudent'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-10xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-sky-700">Inicio</h1>
          <p className="text-gray-700 text-lg mb-2">Bienvenido, {name}</p>
          <p className="text-gray-700 text-lg mb-4">
            {roleId === 1 ? 'Administrador' : 'Coordinador'}
          </p>
          <button onClick={handleLogout} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer mb-4">Cerrar Sesión</button>
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">Lista de Estudiantes</h2>

          <ListStudent />
        </div>
      </div>
    </>
  )
}

export default DashboardPage