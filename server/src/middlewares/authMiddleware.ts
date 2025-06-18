import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.SECRET_KEY

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' })
  }

  jwt.verify(token, SECRET_KEY as string, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token inválido' })
    }
    req.body.userId = (user as { userId: number }).userId
    next()
  })
}