import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"

const ListPaymentPlans = () => {
   const { paymentPlans, refreshPaymentPlans, removePaymentPlan, success, message, loading } = usePaymentPlanStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [displayMessage, setDisplayMessage] = useState("")
   const [isSuccess, setIsSuccess] = useState(false)

   useEffect(() => {
      refreshPaymentPlans()
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

   const handleDelete = async (paymentPlanId: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setDisplayMessage("No se encontró el token de autenticación.")
            setIsSuccess(false)
            return
         }
         await removePaymentPlan(paymentPlanId, isAdministrator, token)
      } catch (error) {
         console.error("Error al eliminar el plan de pago:", error)
      }
   }

   return (
      <>
         <div>
            <h3>List Payment Plans</h3>
            {displayMessage && (
               <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>Precio</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody id="payment-plan-list">
                  {paymentPlans.map(paymentPlan => (
                     <tr key={paymentPlan.id}>
                        <td>{paymentPlan.id}</td>
                        <td>{paymentPlan.name}</td>
                        <td>{paymentPlan.price}</td>
                        <td>
                           <button onClick={() => console.log(`Edit payment plan with ID: ${paymentPlan.id}`)}>Editar</button>
                           <button onClick={() => handleDelete(paymentPlan.id, token)} disabled={loading}>Eliminar</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default ListPaymentPlans