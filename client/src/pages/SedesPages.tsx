import React from 'react'
import CreateSedeForm from '../components/CreateSedeForm'
import ListSedes from '../components/ListSedes'

const SedesPages = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-sky-700">Sedes</h1>

          <CreateSedeForm />
          <h2 className="text-xl font-bold mb-4 text-sky-700">Lista de Sedes</h2>

          <ListSedes />
        </div>
      </div>
    </>
  )
}

export default SedesPages