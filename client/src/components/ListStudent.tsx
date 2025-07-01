import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useStudentStore } from "../store/useStudentStore"
import { useSedeStore } from "../store/useSedeStore"
import { useTurnStore } from "../store/useTurnStore"
import { useSalonStore } from "../store/useSalonStore"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"
import { useProcessStore } from "../store/useProcessStore"

const ListStudent = () => {
   const { students, refreshStudents, removeStudent } = useStudentStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [error, setError] = useState("")
   const [searchText, setSearchText] = useState("")
   const [filters, setFilters] = useState({
      payment_plan_id: "",
      need_to_pay: "",
      registration_process_id: "",
      sede_id: "",
      turn_id: "",
      salon_id: ""
   })
   const { sedes, refreshSedes } = useSedeStore()
   const { turns, refreshTurns } = useTurnStore()
   const { salons, refreshSalons } = useSalonStore()
   const { paymentPlans, refreshPaymentPlans } = usePaymentPlanStore()
   const { processes, refreshProcesses } = useProcessStore()

   useEffect(() => {
      refreshStudents()
      refreshSedes()
      refreshTurns()
      refreshSalons()
      refreshPaymentPlans()
      refreshProcesses()
   }, [])

   const handleDelete = async (studentId: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setError("No se encontró el token de autenticación.")
            return
         }
         await removeStudent(studentId, isAdministrator, token)
         setError("")
      } catch (error) {
         setError("Error al eliminar la sede.")
         console.log(error)
      }
   }

   const filteredStudents = students.filter(student => {
      const matchesSearch = (
         student.name.toLowerCase().includes(searchText.toLowerCase()) ||
         student.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
         student.dni.toString().includes(searchText.toLowerCase())
      )

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
         if (!value) return true
         if (key === 'need_to_pay') {
            return value === (student.need_to_pay ? 'true' : 'false')
         }
         return student[key as keyof typeof student]?.toString() === value
      })

      return matchesSearch && matchesFilters
   })

   return (
      <>
         <div>
            <h2>Listado de Estudiantes</h2>
            {error && <p className="error">{error}</p>}
            <div>
               <input
                  type="text"
                  placeholder="Buscar por nombre, apellido o DNI..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
               />
               <select
                  value={filters.payment_plan_id}
                  onChange={(e) => setFilters({ ...filters, payment_plan_id: e.target.value })}
               >
                  <option value="">Todos los planes de pago</option>
                  {paymentPlans.map(plan => (
                     <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
               </select>
               <select
                  value={filters.need_to_pay}
                  onChange={(e) => setFilters({ ...filters, need_to_pay: e.target.value })}
               >
                  <option value="">Todos los estados de pago</option>
                  <option value="true">Necesita pagar</option>
                  <option value="false">No necesita pagar</option>
               </select>
               <select
                  value={filters.registration_process_id}
                  onChange={(e) => setFilters({ ...filters, registration_process_id: e.target.value })}
               >
                  <option value="">Todos los procesos</option>
                  {processes.map(process => (
                     <option key={process.id} value={process.id}>{process.name}</option>
                  ))}
               </select>
               <select
                  value={filters.sede_id}
                  onChange={(e) => setFilters({ ...filters, sede_id: e.target.value })}
               >
                  <option value="">Todas las sedes</option>
                  {sedes.map(sede => (
                     <option key={sede.id} value={sede.id}>{sede.name}</option>
                  ))}
               </select>
               <select
                  value={filters.turn_id}
                  onChange={(e) => setFilters({ ...filters, turn_id: e.target.value })}
               >
                  <option value="">Todos los turnos</option>
                  {turns.map(turn => (
                     <option key={turn.id} value={turn.id}>{turn.name}</option>
                  ))}
               </select>
               <select
                  value={filters.salon_id}
                  onChange={(e) => setFilters({ ...filters, salon_id: e.target.value })}
               >
                  <option value="">Todos los salones</option>
                  {salons.map(salon => (
                     <option key={salon.id} value={salon.id}>{salon.name}</option>
                  ))}
               </select>
            </div>
            <table>
               <thead>
                  <tr>
                     <th>Numero de Registro</th>
                     <th>Nombre</th>
                     <th>Apellido</th>
                     <th>DNI</th>
                     <th>Fecha de Inscripcion</th>
                     <th>Plan de Pago</th>
                     <th>Necesita Pago</th>
                     <th>Proceso de Registro</th>
                     <th>Sede</th>
                     <th>Turno</th>
                     <th>Salon</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredStudents.map((student) => (
                     <tr key={student.id}>
                        <td>{student.record_number}</td>
                        <td>{student.name}</td>
                        <td>{student.last_name}</td>
                        <td>{student.dni}</td>
                        <td>{student.date_inscription.split('T')[0]}</td>
                        <td>{paymentPlans.find(plan => plan.id === student.payment_plan_id)?.name || student.payment_plan_id}</td>
                        <td>{student.need_to_pay ? 'Sí' : 'No'}</td>
                        <td>{processes.find(process => process.id === student.registration_process_id)?.name || student.registration_process_id}</td>
                        <td>{sedes.find(sede => sede.id === student.sede_id)?.name || student.sede_id}</td>
                        <td>{turns.find(turn => turn.id === student.turn_id)?.name || student.turn_id}</td>
                        <td>{salons.find(salon => salon.id === student.salon_id)?.name || student.salon_id}</td>
                        <td>
                           <button onClick={() => handleDelete(student.id, token)}>Eliminar</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListStudent