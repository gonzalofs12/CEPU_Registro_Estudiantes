import { Router } from "express"
import { createTurn, listTurns, deleteTurn } from "../controllers/turnsController"

const router = Router()

router.post("/create", createTurn)
router.get("/list", listTurns)
router.delete("/delete/:id", deleteTurn)

export default router