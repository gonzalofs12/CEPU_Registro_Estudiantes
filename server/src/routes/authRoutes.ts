import { Router } from "express"
import { authenticateToken } from "../middlewares/authMiddleware"
import { login, changePassword, getUserFromToken } from "../controllers/authController"
const router = Router()

router.post("/login", login)
router.post("/change-password", changePassword, authenticateToken)
router.get("/me", getUserFromToken)

export default router