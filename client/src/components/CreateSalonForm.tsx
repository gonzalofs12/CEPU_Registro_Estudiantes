import React, { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useSalonStore } from "../store/useSalonStore"
import { useTurnStore } from "../store/useTurnStore"
import { useSedeStore } from "../store/useSedeStore"
import { useProcessStore } from "../store/useProcessStore"

const CreateSalonForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const { turns, refreshTurns } = useTurnStore()
   const { sedes, refreshSedes } = useSedeStore()
   const { processes, refreshProcesses } = useProcessStore()

   useEffect(() => {
      refreshTurns()
      refreshSedes()
      refreshProcesses()
   }, [])

   const isAdministrator = user?.role_id === 1

   const { addSalon } = useSalonStore()

   const [formData, setFormData] = useState({
      name: '',
      capacity: 0,
      sede_id: 0,
      turn_id: 0,
      registration_process_id: 0
   })
   const [error, setError] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData(prevState => ({
         ...prevState,
         [id]: id === 'capacity' || id === 'sede_id' || id === 'turn_id' || id === 'registration_process_id' ? Number(value) : value
      }))
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
         await addSalon(formData, isAdministrator, token || '')
         setFormData({
            name: '',
            capacity: 0,
            sede_id: 0,
            turn_id: 0,
            registration_process_id: 0
         })
         setError('')
      } catch (error) {
         setError('Error al crear el salón. Inténtalo de nuevo.')
         console.error('Error al crear el salón:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <h2>Crear Salón</h2>
         {error && <p className="error">{error}</p>}
         <div>
            <label htmlFor="name">Nombre:</label>
            <input
               type="text"
               id="name"
               value={formData.name}
               onChange={handleChange}
               required
            />
         </div>
         <div>
            <label htmlFor="capacity">Capacidad:</label>
            <input
               type="number"
               id="capacity"
               value={formData.capacity}
               onChange={handleChange}
               required
            />
         </div>
         <div>
            <label htmlFor="sede_id">Sede ID:</label>
            <select
               id="sede_id"
               value={formData.sede_id}
               onChange={handleChange}
               required
            >
               <option value="">Seleccione una sede</option>
               {sedes.map(sede => (
                  <option key={sede.id} value={sede.id}>
                     {sede.name}
                  </option>
               ))}
            </select>
         </div>
         <div>
            <label htmlFor="turn_id">Turno ID:</label>
            <select
               id="turn_id"
               value={formData.turn_id}
               onChange={handleChange}
               required
            >
               <option value="">Seleccione un turno</option>
               {turns.map(turn => (
                  <option key={turn.id} value={turn.id}>
                     {turn.name}
                  </option>
               ))}
            </select>
         </div>
         <div>
            <label htmlFor="registration_process_id">Proceso de Registro ID:</label>
            <select
               id="registration_process_id"
               value={formData.registration_process_id}
               onChange={handleChange}
               required
            >
               <option value="">Seleccione un proceso de registro</option>
               {processes.map(process => (
                  <option key={process.id} value={process.id}>
                     {process.name}
                  </option>
               ))}
            </select>
         </div>
         <button type="submit">Crear Salón</button>
      </form>
   )
}

export default CreateSalonForm