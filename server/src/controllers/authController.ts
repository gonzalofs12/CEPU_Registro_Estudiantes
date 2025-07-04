import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

export const login = async (req: Request, res: Response, next: NextFunction) => {
   const { dni, password } = req.body
   try {
      // Buscar si el usuario existe
      const [rows] = await pool.execute('SELECT * FROM users WHERE dni = ?', [dni])

      if (!Array.isArray(rows) || rows.length === 0) {
         return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' })
      }

      const user = rows[0] as { id: number, dni: string, password: string, role_id: number, name: string }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password.toString(), user.password)
      if (!isPasswordValid) {
         return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' })
      }

      // Crear el token JWT
      const token = jwt.sign({ id: user.id, dni: user.dni, role_id: user.role_id }, SECRET_KEY as string, {
         expiresIn: '1200h',
      })

      res.json({
         success: true,
         message: 'Inicio de sesión exitoso',
         data: {
            token,
            user: { id: user.id, dni: user.dni, role_id: user.role_id, name: user.name }
         },
      });
   } catch (error) {
      next(error)
   }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
   const { dni } = req.body
   const { currentPassword, newPassword } = req.body

   try {
      // Buscar el usuario en la base de datos
      const [rows] = await pool.execute('SELECT * FROM users WHERE dni = ?', [dni])

      if (!Array.isArray(rows) || rows.length === 0) {
         return res.status(401).json({ success: false, message: 'Usuario no encontrado' })
      }

      const user = rows[0] as { id: number, password: string }

      // Verificar la contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
         return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' })
      }

      // Hashear la nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)

      // Actualizar la contraseña en la base de datos
      await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, user.id])

      res.json({ success: true, message: 'Contraseña actualizada exitosamente' })

   } catch (error) {
      next(error)
   }
}

export const getUserFromToken = async (req: Request, res: Response, next: NextFunction) => {
   const token = req.headers['authorization']?.split(' ')[1]

   if (!token) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' })
   }

   try {
      const decoded = jwt.verify(token, SECRET_KEY as string) as { id: number, dni: string, role_id: number }

      // Buscar el usuario en la base de datos
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.id])

      if (!Array.isArray(rows) || rows.length === 0) {
         return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
      }

      const user = rows[0] as { id: number, dni: string, role_id: number, name: string }

      res.json({ success: true, user: { id: user.id, dni: user.dni, role_id: user.role_id, name: user.name } })
   } catch (error) {
      next(error)
   }
}