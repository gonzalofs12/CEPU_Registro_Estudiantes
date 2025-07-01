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

   return (
      <>
         <div>
            <h2>Listado de Estudiantes</h2>
            {error && <p className="error">{error}</p>}
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
                  {students.map((student) => (
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