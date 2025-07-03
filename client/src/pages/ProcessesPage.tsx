import React from 'react'
import CreateProcessesForm from '../components/CreateProcessesForm'
import ListProcesses from '../components/ListProcesses'

const ProcessesPage = () => {
   return (
      <>
         <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
               <h2 className="text-xl font-bold mb-4 text-sky-700">Gestión de Procesos</h2>

               <CreateProcessesForm />
               <h2 className="text-xl font-bold mb-4 text-sky-700">Lista de Procesos</h2>

               <ListProcesses />
            </div>
         </div>
      </>
   )
}

export default ProcessesPage