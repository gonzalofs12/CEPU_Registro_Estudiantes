import { Router } from "express"
import { authenticateToken } from "../middlewares/authMiddleware"
import { login, changePassword } from "../controllers/authController"
const router = Router()

router.post("/login", login)
router.post("/change-password", changePassword, authenticateToken)

export default router