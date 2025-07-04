import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { generateStudentPDF } from "../scripts/createPDF";
import { transformObjectToUpperCase } from "../utils/textTransform";

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      const { name, last_name, dni, phone, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, turn_id } = transformObjectToUpperCase(req.body.studentData)
      const photo_base_64 = req.body.photo
      const [salonRows] = await pool.execute(
         `
         SELECT id, name, capacity
         FROM salons
         WHERE sede_id = ? AND turn_id = ? AND registration_process_id = ?
            AND (capacity - (
               SELECT COUNT(*)
               FROM students
               WHERE salon_id = salons.id
         )) > 0
         ORDER BY name ASC, (capacity - (
               SELECT COUNT(*)
               FROM students
               WHERE salon_id = salons.id
         )) DESC
         LIMIT 1;
         `,
         [sede_id, turn_id, registration_process_id]
      )

      if (!Array.isArray(salonRows) || salonRows.length === 0) {
         return res.status(400).json({
            success: false,
            message: 'No hay salones disponibles para esta sede, turno y proceso de inscripción',
         });
      }

      const salon = salonRows[0] as { id: number; name: string; capacity: number }
      // Obtener nombres de sede, salón y turno
      const [sedeRows] = await pool.execute('SELECT name FROM sedes WHERE id = ?', [sede_id]);
      const sedeData = (sedeRows as Array<{ name: string }>)[0]
      const [turnRows] = await pool.execute('SELECT name FROM turns WHERE id = ?', [turn_id]);
      const turnData = (turnRows as Array<{ name: string }>)[0]
      // Generar el PDF
      const pdfBuffer = await generateStudentPDF({
         name,
         last_name,
         dni,
         phone,
         record_number,
         sede: sedeData.name,
         salon: salon.name,
         turn: turnData.name,
      }, photo_base_64);

      // Insertar estudiante con el PDF
      const response = await pool.execute(
         'INSERT INTO students (name, last_name, dni, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, salon_id, turn_id, pdf_file) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
         [name, last_name, dni, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, salon.id, turn_id, pdfBuffer]
      )

      res.json({
         success: true,
         message: 'Estudiante creado exitosamente',
         data: {
            id: (response as any)[0].insertId,
            pdf_file: pdfBuffer.toString('base64')
         }
      })
   } catch (error) {
      next(error)
   }
}

export const listStudents = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute('SELECT id, name, last_name, dni, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, salon_id, turn_id FROM students')
      res.json({
         success: true,
         data: rows
      })
   } catch (error) {
      next(error)
   }
}

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      const student_id = req.params.id

      await pool.execute('DELETE FROM students WHERE id = ?', [student_id])

      res.json({
         success: true,
         message: 'Estudiante eliminado exitosamente.'
      })

   } catch (error) {
      next(error)
   }
}

export const downloadPdf = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const studentId = req.params.id;

      const [rows] = await pool.execute('SELECT pdf_file, dni FROM students WHERE dni = ?', [studentId]);

      if (!Array.isArray(rows) || rows.length === 0) {
         return res.status(404).json({
            success: false,
            message: 'PDF no encontrado para el estudiante especificado.',
         });
      }

      const student = rows[0] as { pdf_file: Buffer, dni: string };

      if (!student.pdf_file) {
         return res.status(404).json({
            success: false,
            message: 'El estudiante no tiene un PDF asociado.',
         });
      }

      return res.json({
         success: true,
         data: rows
      })

   } catch (error) {
      console.error('Error al descargar el PDF:', error);
      next(error);
   }
}