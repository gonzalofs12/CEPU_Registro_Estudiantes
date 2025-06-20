import { Router } from "express"
import { createUser, listUser, deleteUser } from "../controllers/userController"
const router = Router()

router.post("/create", createUser)
router.get("/list", listUser)
router.delete("/delete/:id", deleteUser)

export default router