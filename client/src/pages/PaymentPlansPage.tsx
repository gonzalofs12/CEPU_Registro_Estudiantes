import CreatePaymentPlanForm from "../components/CreatePaymentPlanForm"
import ListPaymentPlans from "../components/ListPaymentPlans"

const PaymentPlansPage = () => {
   return (
      <>
         <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">

               <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">Planes de Pago</h2>
               <CreatePaymentPlanForm />
               <h2 className="text-xl font-bold mb-4 text-sky-700">Lista de Planes de Pago</h2>

               <ListPaymentPlans />

            </div>
         </div>
      </>
   )
}

export default PaymentPlansPage