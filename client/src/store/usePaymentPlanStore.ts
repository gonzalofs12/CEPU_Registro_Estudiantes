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
   success: boolean
   message: string
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
   success: false,
   message: '',
   loading: false,
   setPaymentPlan: (paymentPlan) => set({ paymentPlan }),
   clearPaymentPlan: () => set({ paymentPlan: null }),

   refreshPaymentPlans: async () => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await listPaymentPlans()
         set({ paymentPlans: response.data, loading: false, success: true, message: 'Planes de pago cargados exitosamente.' })
      } catch (error) {
         console.error('Error fetching payment plans:', error)
         set({ error: 'Error al cargar los planes de pago', loading: false, success: false, message: 'Error al cargar los planes de pago.' })
      }
   },

   addPaymentPlan: async (paymentPlanData, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await createPaymentPlan(paymentPlanData, is_administrator, token)
         set((state) => ({
            paymentPlans: [...state.paymentPlans, { name: response.data.name, price: response.data.price, id: response.data.id }],
            loading: false,
            success: true,
            message: 'Plan de pago creado exitosamente.'
         }))
      } catch (error) {
         console.error('Error creating payment plan:', error)
         set({ error: 'Error al crear el plan de pago', loading: false, success: false, message: 'Error al crear el plan de pago.' })
      }
   },

   removePaymentPlan: async (paymentPlanId, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         await deletePaymentPlan(paymentPlanId, is_administrator, token)
         set((state) => ({
            paymentPlans: state.paymentPlans.filter((plan) => plan.id !== paymentPlanId),
            loading: false,
            success: true,
            message: 'Plan de pago eliminado exitosamente.'
         }))
      } catch (error) {
         console.error('Error deleting payment plan:', error)
         set({ error: 'Error al eliminar el plan de pago', loading: false, success: false, message: 'Error al eliminar el plan de pago.' })
      }
   }
}))