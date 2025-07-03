import React from 'react'
import CreateStudentForm from '../components/CreateStudentForm'

const InscriptionsPage = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-sky-700">Inscripciones</h1>

          <CreateStudentForm />
        </div>
      </div>
    </>
  )
}

export default InscriptionsPage