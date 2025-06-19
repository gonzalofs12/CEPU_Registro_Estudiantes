import { Response, Request, NextFunction } from "express"
import bcrypt from "bcrypt"
import pool from '../config/db'

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const userRole = req.body.is_administrator

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo los administradores pueden crear usuarios.'
      })
    }

    const { name, dni, password, role_id } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.execute(
      'INSERT INTO users (name, dni, password, role_id) VALUES (?, ?, ?, ?)',
      [name, Number(dni), hashedPassword, role_id]
    )

    res.json
      ({
        success: true,
        message: 'Usuario creado exitosamente.'
      })

  } catch (error) {
    next(error)
  }
}