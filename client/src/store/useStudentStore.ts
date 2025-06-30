import { create } from "zustand"
import { createStudent, deleteStudent, listStudents } from "../services/studentsApi"

interface Student {
   id: number
   name: string,
   last_name: string,
   dni: number
   record_number: number,
   date_inscription: string,
   payment_plan_id: number,
   need_to_pay: boolean,
   registration_process_id: number,
   sede_id: number
   turn_id: number
   salon_id?: number
   pdf?: string
}

interface StudentState {
   student: Student | null
   students: Student[]
   error: string
   loading: boolean
   setStudent: (student: Student | null) => void
   clearStudent: () => void
   refreshStudents: () => Promise<void>
   // addStudent: (studentData: Omit<Student, 'id'>, is_administrator: boolean, token: string) => Promise<>
   addStudent: (studentData: Omit<Student, 'id'>, is_administrator: boolean, token: string) => Promise<Student>
   removeStudent: (studentId: number, is_administrator: boolean, token: string) => Promise<void>
}

export const useStudentStore = create<StudentState>((set) => ({
   students: [],
   student: null,
   error: '',
   loading: false,
   setStudent: (student) => set({ student }),
   clearStudent: () => set({ student: null }),
   refreshStudents: async () => {
      set({ loading: true, error: '' })
      try {
         const students = await listStudents()
         set({ students, loading: false })
      } catch (error) {
         console.error('Error fetching students:', error)
         set({ error: 'Error al obtener los estudiantes', loading: false })
      }
   },
   addStudent: async (studentData, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         const response = await createStudent(studentData, is_administrator, token)
         set((state) => ({
            students: [...state.students, { ...studentData, id: response.data.id }],
            loading: false
         }))
         return response.data
      } catch (error) {
         console.error('Error creating student:', error)
         set({ error: 'Error al crear el estudiante', loading: false })
      }
   },
   removeStudent: async (studentId, is_administrator, token) => {
      set({ loading: true, error: '' })
      try {
         await deleteStudent(studentId, is_administrator, token)
         set((state) => ({
            students: state.students.filter((student) => student.id !== studentId),
            loading: false
         }))
      } catch (error) {
         console.error('Error deleting student:', error)
         set({ error: 'Error al eliminar el estudiante', loading: false })
      }
   }
}))