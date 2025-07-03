import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaClock, FaBuilding, FaChair, FaClipboardList, FaMoneyBillWave, FaUserGraduate, FaUser } from 'react-icons/fa'

const Slidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <aside
        className={`bg-gray-900 text-white p-4 fixed h-full overflow-y-auto shadow-lg z-10 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'
          }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <h3 className={`text-2xl font-bold mb-6 text-center`}>{isExpanded ? 'Menu' : '|||'}</h3>
        <ul className="space-y-4">
          <li>
            <Link to='/' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaHome className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Inicio</span>
            </Link>
          </li>
          <li>
            <Link to='/turns' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaClock className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Turnos</span>
            </Link>
          </li>
          <li>
            <Link to='/sedes' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaBuilding className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Sedes</span>
            </Link>
          </li>
          <li>
            <Link to='/salons' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaChair className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Salones</span>
            </Link>
          </li>
          <li>
            <Link to='/processes' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaClipboardList className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Procesos de Inscripción</span>
            </Link>
          </li>
          <li>
            <Link to='/payment-plans' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaMoneyBillWave className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Planes de Pago</span>
            </Link>
          </li>
          <li>
            <Link to='/inscriptions' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaUserGraduate className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Inscripciones</span>
            </Link>
          </li>
          <li>
            <Link to='/profile' className="flex items-center space-x-3 text-lg hover:text-blue-400 transition duration-200">
              <FaUser className={`${isExpanded ? '' : 'mx-auto'}`} />
              <span className={`${isExpanded ? '' : 'hidden'}`}>Perfil</span>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  )
}

export default Slidebar