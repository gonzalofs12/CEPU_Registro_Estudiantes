import React from 'react'
import CreateProcessesForm from '../components/CreateProcessesForm'
import ListProcesses from '../components/ListProcesses'

const ProcessesPage = () => {
   return (
      <>
         <div>
            <h2>Procesos de Inscripción</h2>
            <CreateProcessesForm />
            <ListProcesses />
         </div>
      </>
   )
}

export default ProcessesPage