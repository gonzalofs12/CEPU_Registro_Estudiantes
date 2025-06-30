import { Router } from "express"
import { createStudent, listStudents, deleteStudent } from "../controllers/inscriptionStudentController"

const router = Router()

router.post("/create", createStudent)
router.get("/list", listStudents)
router.post("/delete/:id", deleteStudent)

export default router