import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useStudentStore } from "../store/useStudentStore"

const ListStudent = () => {
   const { students, refreshStudents, removeStudent } = useStudentStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [error, setError] = useState("")

   useEffect(() => {
      refreshStudents()
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
                     <th>Nececita Pago</th>
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
                        <td>{student.payment_plan_id}</td>
                        <td>{student.need_to_pay}</td>
                        <td>{student.registration_process_id}</td>
                        <td>{student.sede_id}</td>
                        <td>{student.turn_id}</td>
                        <td>{student.salon_id}</td>
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