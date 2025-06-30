import { Router } from "express"
import { createSalon, listSalons, deleteSalon } from "../controllers/salonsController"

const router = Router()

router.post("/create", createSalon)
router.get("/list", listSalons)
router.delete("/delete/:id", deleteSalon)

export default router