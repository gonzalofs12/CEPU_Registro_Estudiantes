import React from 'react'
import CreateTurnForm from '../components/CreateTurnForm'
import ListTurns from '../components/ListTurns'

const TurnsPage = () => {
  return (
    <>
      <div>
        <h2>Turnos</h2>
        <CreateTurnForm />
        <ListTurns />
      </div>
    </>
  )
}

export default TurnsPage