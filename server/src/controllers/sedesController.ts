import { Response, Request, NextFunction } from "express"
import pool from "../config/db"
import { transformObjectToUpperCase } from "../utils/textTransform"

export const createSede = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: "Acceso denegado. Solo los administradores pueden crear sedes.",
         })
      }

      const { name, code } = transformObjectToUpperCase(req.body.sedeData)

      const response = await pool.execute(
         "INSERT INTO sedes (name, code) VALUES (?, ?)",
         [name, code]
      )
      res.json({
         success: true,
         message: "Sede creada exitosamente.",
         data: {
            id: (response as any)[0].insertId,
            name,
            code: code,
         },
      })
   } catch (error) {
      next(error)
   }
}

export const listSedes = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute("SELECT id, name, code FROM sedes")
      res.json({
         success: true,
         data: rows,
      })
   } catch (error) {
      next(error)
   }
}

export const deleteSede = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: "Acceso denegado. Solo los administradores pueden eliminar sedes.",
         })
      }
      const sede_id = req.params.id

      await pool.execute("DELETE FROM sedes WHERE id = ?", [sede_id])
      res.json({
         success: true,
         message: "Sede eliminada exitosamente.",
      })
   } catch (error) {
      next(error)
   }
}

// * Esta función no está implementada en producción, pero se puede usar para actualizar sedes
export const updateSede = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: "Acceso denegado. Solo los administradores pueden actualizar sedes.",
         })
      }
      const sede_id = req.params.id
      const { name, code } = transformObjectToUpperCase(req.body)
      const response = await pool.execute(
         "UPDATE sedes SET name = ?, code = ? WHERE id = ?",
         [name, code, sede_id]
      )
      if ((response as any)[0].affectedRows === 0) {
         return res.status(404).json({
            success: false,
            message: "Sede no encontrada.",
         })
      }
      res.json({
         success: true,
         message: "Sede actualizada exitosamente.",
         data: {
            id: sede_id,
            name,
            code: code,
         },
      })
   } catch (error) {
      next(error)
   }
}