import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"

const ListPaymentPlans = () => {
   const { paymentPlans, refreshPaymentPlans, removePaymentPlan } = usePaymentPlanStore()
   const { user } = useUserData()
   const { token } = useGetToken()
   const [error, setError] = useState("")

   useEffect(() => {
      refreshPaymentPlans()
   }, [])

   const handleDelete = async (paymentPlanId: number, token: string | null) => {
      try {
         const isAdministrator = user?.role_id === 1
         if (!token) {
            setError("No se encontró el token de autenticación.")
            return
         }
         await removePaymentPlan(paymentPlanId, isAdministrator, token)
         setError("")
      } catch (error) {
         setError("Error al eliminar el plan de pago. Por favor, inténtalo de nuevo.")
         console.error("Error al eliminar el plan de pago:", error)
      }
   }

   return (
      <>
         <div>
            <h3>List Payment Plans</h3>
            {error && <p className="error">{error}</p>}
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
                           <button onClick={() => handleDelete(paymentPlan.id, token)}>Eliminar</button>
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