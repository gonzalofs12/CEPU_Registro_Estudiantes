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
            {displayMessage && (
               <p className="text-sm mb-4" style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
            )}
            <table className="min-w-full bg-white border border-gray-200">
               <thead>
                  <tr>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Código</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                     <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
               </thead>
               <tbody id="payment-plan-list">
                  {paymentPlans.map(paymentPlan => (
                     <tr key={paymentPlan.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b border-gray-200">{paymentPlan.name}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{paymentPlan.code}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{paymentPlan.price}</td>
                        <td className="py-2 px-4 border-b border-gray-200">
                           <button onClick={() => console.log(`Edit payment plan with ID: ${paymentPlan.id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2">Editar</button>
                           <button onClick={() => handleDelete(paymentPlan.id, token)} disabled={loading} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Eliminar</button>
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