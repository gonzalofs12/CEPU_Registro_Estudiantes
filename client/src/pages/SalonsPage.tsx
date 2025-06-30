import React from 'react'
import CreateSalonForm from '../components/CreateSalonForm'
import ListSalons from '../components/ListSalons'

const SalonsPage = () => {
  return (
    <>
      <div>
        <h2>Salones</h2>
        <CreateSalonForm />
        <ListSalons />
      </div>
    </>
  )
}

export default SalonsPage