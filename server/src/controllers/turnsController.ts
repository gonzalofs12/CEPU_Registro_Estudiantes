import { Request, Response, NextFunction } from "express"
import pool from '../config/db'

export const createTurn = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator

      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden crear turnos.'
         })
      }

      const { name } = req.body.turnData

      const response = await pool.execute(
         'INSERT INTO turns (name) VALUES (?)',
         [name]
      )

      res.json({
         success: true,
         message: 'Turno creado exitosamente.',
         data: {
            id: (response as any)[0].insertId
         }
      })

   } catch (error) {
      next(error)
   }
}

export const listTurns = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute('SELECT id, name FROM turns')
      res.json({
         success: true,
         data: rows
      })
   } catch (error) {
      next(error)
   }
}

export const deleteTurn = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden eliminar turnos.'
         })
      }
      const turn_id = req.params.id

      await pool.execute('DELETE FROM turns WHERE id = ?', [turn_id])

      res.json({
         success: true,
         message: 'Turno eliminado exitosamente.'
      })

   } catch (error) {
      next(error)
   }
}