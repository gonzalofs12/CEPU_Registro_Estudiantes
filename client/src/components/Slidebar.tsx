import React from 'react'
import { Link } from 'react-router-dom'

const Slidebar = () => {
  return (
    <>
      <aside style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <h3>Menu</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to='/'>Inicio</Link>
          </li>
          <li>
            <Link to='/turns'>Turnos</Link>
          </li>
          <li>
            <Link to='/sedes'>Sedes</Link>
          </li>
          <li>
            <Link to='/salons'>Salones</Link>
          </li>
          <li>
            <Link to='/processes'>Procesos de Inscripción</Link>
          </li>
          <li>
            <Link to='/inscriptions'>Inscripciones</Link>
          </li>
          <li>
            <Link to='/profile'>Perfil</Link>
          </li>
        </ul>
      </aside>
    </>
  )
}

export default Slidebar