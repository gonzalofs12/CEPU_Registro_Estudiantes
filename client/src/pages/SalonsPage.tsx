
import CreateSalonForm from '../components/CreateSalonForm'
import ListSalons from '../components/ListSalons'

const SalonsPage = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-sky-700">Salones</h1>
          <CreateSalonForm />
          <h2 className="text-xl font-bold mb-4 text-sky-700">Lista de Salones</h2>

          <ListSalons />
        </div>
      </div>
    </>
  )
}

export default SalonsPage