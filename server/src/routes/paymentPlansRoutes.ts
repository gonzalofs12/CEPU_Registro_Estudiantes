import { Router } from "express"
import { createPaymentPlan, listPaymentPlans, deletePaymentPlan } from "../controllers/paymentPlansController"

const router = Router()

router.post("/create", createPaymentPlan)
router.get("/list", listPaymentPlans)
router.delete("/delete/:id", deletePaymentPlan)

export default router