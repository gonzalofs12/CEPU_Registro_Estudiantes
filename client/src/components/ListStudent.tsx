import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useStudentStore } from "../store/useStudentStore"
import { useSedeStore } from "../store/useSedeStore"
import { useTurnStore } from "../store/useTurnStore"
import { useSalonStore } from "../store/useSalonStore"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"
import { useProcessStore } from "../store/useProcessStore"
import { MdNavigateBefore, MdNavigateNext, MdDeleteForever, MdEdit, MdDownload } from "react-icons/md"

const ListStudent = () => {
   const { students, refreshStudents, removeStudent, success, message, loading } = useStudentStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [displayMessage, setDisplayMessage] = useState("")
   const [isSuccess, setIsSuccess] = useState(false)
   const [searchText, setSearchText] = useState("")
   const [filters, setFilters] = useState({
      payment_plan_id: "",
      need_to_pay: "",
      registration_process_id: "",
      sede_id: "",
      turn_id: "",
      salon_id: "",
      date_inscription_start: "",
      date_inscription_end: ""
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

   useEffect(() => {
      if (message) {
         setDisplayMessage(message)
         setIsSuccess(success)
         const timer = setTimeout(() => {
            setDisplayMessage('')
         }, 3000) // Clear message after 3 seconds
         return () => clearTimeout(timer)
      }
   }, [message, success])

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
         if (key === 'date_inscription_start') {
            if (!value) return true
            return student.date_inscription.split('T')[0] >= value
         }
         if (key === 'date_inscription_end') {
            if (!value) return true
            return student.date_inscription.split('T')[0] <= value
         }
         return student[key as keyof typeof student]?.toString() === value
      })

      return matchesSearch && matchesFilters
   })

   // * Paginación
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 40

   useEffect(() => {
      setCurrentPage(1)
   }, [searchText, filters])

   const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1
   const indexOfLastItem = currentPage * itemsPerPage
   const indexOfFirstItem = indexOfLastItem - itemsPerPage
   const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)

   const handleDownloadPdf = (studentId: number) => {
      console.log(students)
      const student = students.find(s => s.id === studentId)
      console.log(student?.pdf_file)
      if (student && student.pdf_file) {
         const byteArray = new Uint8Array(student.pdf_file.data)

         const blob = new Blob([byteArray], { type: 'application/pdf' })
         const url = URL.createObjectURL(blob)
         const link = document.createElement('a')
         link.href = url
         link.setAttribute('download', `inscripcion_${student.dni}.pdf`)
         document.body.appendChild(link)
         link.click()
         document.body.removeChild(link)
         URL.revokeObjectURL(url)
      } else {
         setDisplayMessage("PDF no disponible para este estudiante.")
         setIsSuccess(false)
      }
   }

   const handleDelete = async (studentId: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setDisplayMessage("No se encontró el token de autenticación.")
            setIsSuccess(false)
            return
         }
         await removeStudent(studentId, isAdministrator, token)
      } catch (error) {
         console.error('Error al eliminar el estudiante:', error)
      }
   }

   return (
      <>
         <div>
            {displayMessage && (
               <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <div className="mb-4 flex flex-wrap gap-4 items-center">
               <input
                  type="text"
                  placeholder="Buscar por nombre, apellido o DNI..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
               />
               <select
                  value={filters.payment_plan_id}
                  onChange={(e) => setFilters({ ...filters, payment_plan_id: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Todos los planes de pago</option>
                  {paymentPlans.map(plan => (
                     <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
               </select>
               <select
                  value={filters.need_to_pay}
                  onChange={(e) => setFilters({ ...filters, need_to_pay: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Todos los estados de pago</option>
                  <option value="true">Necesita pagar</option>
                  <option value="false">No necesita pagar</option>
               </select>
               <select
                  value={filters.registration_process_id}
                  onChange={(e) => setFilters({ ...filters, registration_process_id: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Todos los procesos</option>
                  {processes.map(process => (
                     <option key={process.id} value={process.id}>{process.name}</option>
                  ))}
               </select>
               <select
                  value={filters.sede_id}
                  onChange={(e) => setFilters({ ...filters, sede_id: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Todas las sedes</option>
                  {sedes.map(sede => (
                     <option key={sede.id} value={sede.id}>{sede.name}</option>
                  ))}
               </select>
               <select
                  value={filters.turn_id}
                  onChange={(e) => setFilters({ ...filters, turn_id: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Todos los turnos</option>
                  {turns.map(turn => (
                     <option key={turn.id} value={turn.id}>{turn.name}</option>
                  ))}
               </select>
               <select
                  value={filters.salon_id}
                  onChange={(e) => setFilters({ ...filters, salon_id: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Todos los salones</option>
                  {salons.map(salon => (
                     <option key={salon.id} value={salon.id}>{salon.name}</option>
                  ))}
               </select>
               <input
                  type="date"
                  value={filters.date_inscription_start}
                  onChange={(e) => setFilters({ ...filters, date_inscription_start: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
               <input
                  type="date"
                  value={filters.date_inscription_end}
                  onChange={(e) => setFilters({ ...filters, date_inscription_end: e.target.value })}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <table className="min-w-full bg-white border border-gray-200">
               <thead>
                  <tr>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expediente</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Apellido</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Inscripcion</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan de Pago</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deuda</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sede</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Turno</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salon</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
               </thead>
               <tbody>
                  {currentStudents.map((student) => (
                     <tr key={student.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b border-gray-200">{student.record_number}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{student.name}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{student.last_name}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{student.dni}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{student.date_inscription.split('T')[0]}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{paymentPlans.find(plan => plan.id === student.payment_plan_id)?.code || student.payment_plan_id}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{student.need_to_pay ? 'SI' : 'NO'}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{sedes.find(sede => sede.id === student.sede_id)?.code || student.sede_id}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{turns.find(turn => turn.id === student.turn_id)?.name.split('')[0] || student.turn_id}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{salons.find(salon => salon.id === student.salon_id)?.name || student.salon_id}</td>
                        <td className="py-2 px-4 border-b border-gray-200">
                           <button onClick={() => handleDelete(student.id, token)} disabled={loading} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded text-xs m-1">
                              <MdDeleteForever className="w-5 h-5" />
                           </button>
                           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded text-xs">
                              <MdEdit className="w-5 h-5" />
                           </button>
                           <button onClick={() => handleDownloadPdf(student.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded text-xs m-1">
                              <MdDownload className="w-5 h-5" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            <div className="flex justify-center mt-4">
               <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <MdNavigateBefore />
               </button>

               <span className="bg-gray-200 py-2 px-4 text-gray-800 font-bold"> Página {currentPage} de {totalPages} </span>

               <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <MdNavigateNext />
               </button>
            </div>
            <div>
               <span>
                  Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredStudents.length)} de {filteredStudents.length} registros
               </span>
            </div>
         </div>
      </>
   )
}

export default ListStudent