import { Router } from "express"
import { createSede, listSedes, deleteSede } from "../controllers/sedesController"

const router = Router()

router.post("/create", createSede)
router.get("/list", listSedes)
router.delete("/delete/:id", deleteSede)

export default router