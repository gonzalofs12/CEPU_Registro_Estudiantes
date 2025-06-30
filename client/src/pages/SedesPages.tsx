import React from 'react'
import CreateSedeForm from '../components/CreateSedeForm'
import ListSedes from '../components/ListSedes'

const SedesPages = () => {
  return (
    <>
      <div>
        <h2>Sedes</h2>
        <CreateSedeForm />
        <ListSedes />
      </div>
    </>
  )
}

export default SedesPages