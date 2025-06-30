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

   const { addStudent } = useStudentStore()

   const [formData, setFormData] = useState({
      name: '',
      last_name: '',
      dni: Number(''),
      record_number: Number(''),
      date_inscription: '',
      payment_plan_id: Number(''),
      need_to_pay: false,
      registration_process_id: Number(''),
      sede_id: Number(''),
      turn_id: Number('')
   })
   const [error, setError] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
         if (!token) {
            setError("No se encontró el token de autenticación.")
            return
         }
         const payment_plan = paymentPlans.find(plan => plan.id == formData.payment_plan_id)
         const need_to_pay = payment_plan?.name.includes('Plan 2') || false
         const process = processes.find(process => process.id == formData.registration_process_id)
         const record_number = Number(`${process?.code}${formData.dni}`)
         const date_inscription = new Date().toISOString().split('T')[0]
         const updatedFormData = {
            ...formData,
            need_to_pay: need_to_pay,
            record_number: record_number,
            date_inscription: date_inscription
         }
         console.log(updatedFormData)
         const response = await addStudent(updatedFormData, isAdministrator, token);

         // Descargar el PDF
         if (response.pdf) {
            const blob = new Blob([Uint8Array.from(atob(response.pdf), c => c.charCodeAt(0))], { type: 'application/pdf' });
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
            record_number: Number(''),
            date_inscription: '',
            payment_plan_id: Number(''),
            need_to_pay: false,
            registration_process_id: Number(''),
            sede_id: Number(''),
            turn_id: Number('')
         })
         setError('')
      } catch (error) {
         setError("Error al crear el estudiante.")
         console.log('Error al crear el estudiante.', error)
      }
   }

   return (
      <div>
         <h2>Crear Estudiante</h2>
         <form onSubmit={handleSubmit}>
            <label>
               Nombre:
               <input type="text" id="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
               Apellido:
               <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} />
            </label>
            <label>
               DNI:
               <input type="text" id="dni" value={formData.dni} onChange={handleChange} />
            </label>
            <label>
               Plan de Pago:
               <select id="payment_plan_id" value={formData.payment_plan_id} onChange={handleChange}>
                  <option value="">Seleccione un plan de pago</option>
                  {paymentPlans.map(plan => (
                     <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
               </select>
            </label>
            <label>
               Proceso de Registro:
               <select id="registration_process_id" value={formData.registration_process_id} onChange={handleChange}>
                  <option value="">Seleccione un proceso de registro</option>
                  {processes.map(process => (
                     <option key={process.id} value={process.id}>{process.name}</option>
                  ))}
               </select>
            </label>
            <label>
               Sede:
               <select id="sede_id" value={formData.sede_id} onChange={handleChange}>
                  <option value="">Seleccione una sede</option>
                  {sedes.map(sede => (
                     <option key={sede.id} value={sede.id}>{sede.name}</option>
                  ))}
               </select>
            </label>
            <label>
               Turno:
               <select id="turn_id" value={formData.turn_id} onChange={handleChange}>
                  <option value="">Seleccione un turno</option>
                  {turns.map(turn => (
                     <option key={turn.id} value={turn.id}>{turn.name}</option>
                  ))}
               </select>
            </label>
            <button type="submit">Crear Estudiante</button>
         </form>
         {error && <p>{error}</p>}
      </div>
   )
}

export default CreateStudentForm