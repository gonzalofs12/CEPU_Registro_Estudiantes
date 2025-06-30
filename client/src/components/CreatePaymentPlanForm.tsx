import React, { useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"

const CreatePaymentPlanForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()

   const isAdministrator = user?.role_id === 1

   const { addPaymentPlan } = usePaymentPlanStore()

   const [formData, setFormData] = useState({
      name: '',
      price: Number('')
   })
   const [error, setError] = useState('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
         await addPaymentPlan(formData, isAdministrator, token || '')
         setFormData({ name: '', price: Number('') })
         setError('')
      } catch (error) {
         setError('Error al crear el plan de pago. Inténtalo de nuevo.')
         console.error('Error al crear el plan de pago:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <h2>Crear Plan de Pago</h2>
         {error && <p className="error">{error}</p>}
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
         <button type="submit">Crear Plan de Pago</button>
      </form>
   )
}

export default CreatePaymentPlanForm