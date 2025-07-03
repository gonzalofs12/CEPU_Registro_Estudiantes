import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useStudentStore } from "../store/useStudentStore"
import { useTurnStore } from "../store/useTurnStore"
import { useSedeStore } from "../store/useSedeStore"
import { useProcessStore } from "../store/useProcessStore"
import { useSalonStore } from "../store/useSalonStore"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"

const CreateStudentForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const isAdministrator = user?.role_id === 1

   const { turns, refreshTurns } = useTurnStore()
   const { sedes, refreshSedes } = useSedeStore()
   const { processes, refreshProcesses } = useProcessStore()
   const { refreshSalons } = useSalonStore()
   const { paymentPlans, refreshPaymentPlans } = usePaymentPlanStore()

   useEffect(() => {
      refreshTurns()
      refreshSedes()
      refreshProcesses()
      refreshSalons()
      refreshPaymentPlans()
   }, [])

   const { addStudent, success, message, loading } = useStudentStore()

   const [formData, setFormData] = useState({
      name: '',
      last_name: '',
      dni: Number(''),
      phone: Number(''),
      record_number: Number(''),
      date_inscription: '',
      payment_plan_id: Number(''),
      need_to_pay: false,
      registration_process_id: Number(''),
      sede_id: Number(''),
      turn_id: Number('')
   })
   const [displayMessage, setDisplayMessage] = useState('')
   const [isSuccess, setIsSuccess] = useState(false)

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

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
         if (!token) {
            setDisplayMessage("No se encontró el token de autenticación.")
            setIsSuccess(false)
            return
         }
         const payment_plan = paymentPlans.find(plan => plan.id == formData.payment_plan_id)
         const need_to_pay = payment_plan?.name.toLowerCase().includes('plan 2') || false
         const process = processes.find(process => process.id == formData.registration_process_id)
         const record_number = Number(`${process?.code}${formData.dni}`)
         const date_inscription = new Date().toISOString().split('T')[0]
         const updatedFormData = {
            ...formData,
            need_to_pay: need_to_pay,
            record_number: record_number,
            date_inscription: date_inscription
         }
         const response = await addStudent(updatedFormData, isAdministrator, token)

         // Descargar el PDF
         if (response && response.pdf_file) {
            const blob = new Blob([Uint8Array.from(atob(response.pdf_file), c => c.charCodeAt(0))], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `registro_${updatedFormData.dni}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
         }

         setFormData({
            name: '',
            last_name: '',
            dni: Number(''),
            phone: Number(''),
            record_number: Number(''),
            date_inscription: '',
            payment_plan_id: Number(''),
            need_to_pay: false,
            registration_process_id: Number(''),
            sede_id: Number(''),
            turn_id: Number('')
         })
      } catch (error) {
         console.error('Error al crear el estudiante.', error)
      }
   }

   return (
      <div>
         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
            <div className="mb-4">
               <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
               <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <div className="mb-4">
               <label htmlFor="last_name" className="block text-gray-700 text-sm font-bold mb-2">Apellido:</label>
               <input
                  type="text"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <div className="mb-4">
               <label htmlFor="dni" className="block text-gray-700 text-sm font-bold mb-2">DNI:</label>
               <input
                  type="text"
                  id="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <div className="mb-4">
               <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Celular:</label>
               <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               />
            </div>
            <div className="mb-4">
               <label htmlFor="payment_plan_id" className="block text-gray-700 text-sm font-bold mb-2">Plan de Pago:</label>
               <select
                  id="payment_plan_id"
                  value={formData.payment_plan_id}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Seleccione un plan de pago</option>
                  {paymentPlans.map(plan => (
                     <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
               </select>
            </div>
            <div className="mb-4">
               <label htmlFor="registration_process_id" className="block text-gray-700 text-sm font-bold mb-2">Proceso de Registro:</label>
               <select
                  id="registration_process_id"
                  value={formData.registration_process_id}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Seleccione un proceso de registro</option>
                  {processes.map(process => (
                     <option key={process.id} value={process.id}>{process.name}</option>
                  ))}
               </select>
            </div>
            <div className="mb-4">
               <label htmlFor="sede_id" className="block text-gray-700 text-sm font-bold mb-2">Sede:</label>
               <select
                  id="sede_id"
                  value={formData.sede_id}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Seleccione una sede</option>
                  {sedes.map(sede => (
                     <option key={sede.id} value={sede.id}>{sede.name}</option>
                  ))}
               </select>
            </div>
            <div className="mb-4">
               <label htmlFor="turn_id" className="block text-gray-700 text-sm font-bold mb-2">Turno:</label>
               <select
                  id="turn_id"
                  value={formData.turn_id}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               >
                  <option value="">Seleccione un turno</option>
                  {turns.map(turn => (
                     <option key={turn.id} value={turn.id}>{turn.name}</option>
                  ))}
               </select>
            </div>
            <button type="submit" disabled={loading} className='bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer mb-4'>Crear Estudiante</button>
         </form>
         {displayMessage && (
            <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
         )}
      </div>
   )
}

export default CreateStudentForm