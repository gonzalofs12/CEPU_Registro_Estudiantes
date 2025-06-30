import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

interface PaymentPlan {
   id: number
   name: string
   price: number
}

export const createPaymentPlan = async (paymentPlanData: Omit<PaymentPlan, 'id'>, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.post(`${API_URL}/payment-plans/create`, { paymentPlanData, is_administrator }, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const listPaymentPlans = async () => {
   const response = await axios.get(`${API_URL}/payment-plans/list`)
   return response.data
}

export const deletePaymentPlan = async (paymentPlanId: number, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.delete(`${API_URL}/payment-plans/delete/${paymentPlanId}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      data: {
         is_administrator: is_administrator // Assuming the user is an administrator
      }
   })
   return response.data
}