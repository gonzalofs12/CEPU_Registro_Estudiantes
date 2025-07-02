import React from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"
import { useEffect, useState } from "react"

const CreatePaymentPlanForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()

   const isAdministrator = user?.role_id === 1

   const { addPaymentPlan, success, message, loading } = usePaymentPlanStore()

   const [formData, setFormData] = useState({
      name: '',
      price: Number('')
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

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
         await addPaymentPlan(formData, isAdministrator, token || '')
         setFormData({ name: '', price: Number('') })
      } catch (error) {
         console.error('Error al crear el plan de pago:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <h2>Crear Plan de Pago</h2>
         {displayMessage && (
            <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
         )}
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
            <label htmlFor="price">Precio:</label>
            <input
               type="number"
               id="price"
               value={formData.price}
               onChange={handleChange}
               required
            />
         </div>
         <button type="submit" disabled={loading}>Crear Plan de Pago</button>
      </form>
   )
}

export default CreatePaymentPlanForm