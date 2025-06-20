import { Router } from "express"
import { createProcesses, listProcesses, deleteProcesses } from "../controllers/processesController"
const router = Router()

router.post("/create", createProcesses)
router.get("/list", listProcesses)
router.delete("/delete/:id", deleteProcesses)

export default router