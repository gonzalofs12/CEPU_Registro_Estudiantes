import { Request, Response, NextFunction } from "express"
import pool from '../config/db'
import { transformObjectToUpperCase } from "../utils/textTransform"

export const createPaymentPlan = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden crear planes de pago.'
         })
      }

      const { name, code, price } = transformObjectToUpperCase(req.body.paymentPlanData)

      const response = await pool.execute(
         'INSERT INTO payment_plans (name, code, price) VALUES (?, ?, ?)',
         [name, code, price]
      )
      res.json({
         success: true,
         message: 'Plan de pago creado exitosamente.',
         data: {
            id: (response as any)[0].insertId,
            name,
            code,
            price
         }
      })
   } catch (error) {
      next(error)
   }
}

export const listPaymentPlans = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute('SELECT id, name, code, price FROM payment_plans')
      res.json({
         success: true,
         data: rows
      })
   } catch (error) {
      next(error)
   }
}

export const deletePaymentPlan = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden eliminar planes de pago.'
         })
      }
      const paymentPlanId = req.params.id

      await pool.execute('DELETE FROM payment_plans WHERE id = ?', [paymentPlanId])
      res.json({
         success: true,
         message: 'Plan de pago eliminado exitosamente.'
      })
   } catch (error) {
      next(error)
   }
}