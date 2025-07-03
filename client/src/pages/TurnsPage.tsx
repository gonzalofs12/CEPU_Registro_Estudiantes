import React from 'react'
import CreateTurnForm from '../components/CreateTurnForm'
import ListTurns from '../components/ListTurns'

const TurnsPage = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-sky-700">Turnos</h1>

          <CreateTurnForm />
          <h2 className="text-xl font-bold mb-4 text-sky-700">Lista de Turnos</h2>

          <ListTurns />
        </div>
      </div>
    </>
  )
}

export default TurnsPage