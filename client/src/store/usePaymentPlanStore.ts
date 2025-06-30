import { create } from "zustand"
import { createPaymentPlan, deletePaymentPlan, listPaymentPlans } from "../services/paymentPlansApi"

interface PaymentPlan {
   id: number
   name: string
   price: number
}

interface PaymentPlanState {
   paymentPlan: PaymentPlan | null
   paymentPlans: PaymentPlan[]
   error: string
   loading: boolean
   setPaymentPlan: (paymentPlan: PaymentPlan | null) => void
   clearPaymentPlan: () => void
   refreshPaymentPlans: () => Promise<void>
   addPaymentPlan: (paymentPlanData: Omit<PaymentPlan, 'id'>, is_administrator: boolean, token: string) => Promise<void>
   removePaymentPlan: (paymentPlanId: number, is_administrator: boolean, token: string) => Promise<void>
}

export const usePaymentPlanStore = create<PaymentPlanState>((set) => ({
   paymentPlans: [],
   paymentPlan: null,
   error: '',
   loading: false,
   setPaymentPlan: (paymentPlan) => set({ paymentPlan }),
   clearPaymentPlan: () => set({ paymentPlan: null }),

   refreshPaymentPlans: async () => {
      set({ loading: true, error: '' })
      try {
         const response = await listPaymentPlans()
         set({ paymentPlans: response.data, loading: false })
      } catch (error) {
         console.error('Error fetching payment plans:', error)
         set({ error: 'Error al cargar los planes de pago', loading: false })
      }
   },

   addPaymentPlan: async (paymentPlanData, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         const response = await createPaymentPlan(paymentPlanData, is_administrator, token)
         set((state) => ({
            paymentPlans: [...state.paymentPlans, { ...paymentPlanData, id: response.data.id }],
            loading: false
         }))
      } catch (error) {
         console.error('Error creating payment plan:', error)
         set({ error: 'Error al crear el plan de pago', loading: false })
      }
   },

   removePaymentPlan: async (paymentPlanId, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         await deletePaymentPlan(paymentPlanId, is_administrator, token)
         set((state) => ({
            paymentPlans: state.paymentPlans.filter((plan) => plan.id !== paymentPlanId),
            loading: false
         }))
      } catch (error) {
         console.error('Error deleting payment plan:', error)
         set({ error: 'Error al eliminar el plan de pago', loading: false })
      }
   }
}))