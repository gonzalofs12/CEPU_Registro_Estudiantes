import { Response, Request, NextFunction } from "express"
import pool from '../config/db'
import { transformObjectToUpperCase } from "../utils/textTransform"

export const createProcesses = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator

      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden crear usuarios.'
         })
      }

      const { name, code } = transformObjectToUpperCase(req.body)

      const response = await pool.execute(
         'INSERT INTO registration_processes (name, code) VALUES (?, ?)',
         [name, Number(code)]
      )

      res.json({
         success: true,
         message: 'Proceso creado exitosamente.',
         data: {
            id: (response as any)[0].insertId,
            name,
            code: Number(code)
         }
      })

   } catch (error) {
      next(error)
   }
}

export const listProcesses = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute('SELECT id, name, code FROM registration_processes')

      res.json({
         success: true,
         data: rows
      })
   } catch (error) {
      next(error)
   }
}

export const deleteProcesses = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden eliminar usuarios.'
         })
      }
      const process_id = req.params.id

      await pool.execute('DELETE FROM registration_processes WHERE id = ?', [process_id])
      res.json({
         success: true,
         message: 'Usuario eliminado exitosamente.'
      })
   } catch (error) {
      next(error)
   }
}