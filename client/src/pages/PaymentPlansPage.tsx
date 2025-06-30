import CreatePaymentPlanForm from "../components/CreatePaymentPlanForm"
import ListPaymentPlans from "../components/ListPaymentPlans"

const PaymentPlansPage = () => {
   return (
      <>
         <div>
            <h2>Planes de Pago</h2>
            <CreatePaymentPlanForm />
            <ListPaymentPlans />
         </div>
      </>
   )
}

export default PaymentPlansPage