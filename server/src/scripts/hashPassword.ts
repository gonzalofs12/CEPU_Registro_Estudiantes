import bcrypt from 'bcrypt'
import pool from '../config/db'
import mysql from 'mysql2/promise'

interface User {
  id: number;
  password: string;
}

async function hashPassword() {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>('SELECT id, password FROM users')

    if (!Array.isArray(rows) || rows.length === 0) {
      console.log('No users found')
      return
    }

    for (const user of rows as User[]) {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id])
      console.log(`Contraseña cifrada para el usuario con ID ${user.id}`)
    }

    console.log('Todas las contraseñas han sido cifradas exitosamente')
  } catch (error) {
    console.error('Error al cifrar las contraseñas:', error)
  }
}

hashPassword().then(() => {
  console.log('Proceso de cifrado de contraseñas completado')
}).catch((error) => {
  console.error('Error en el proceso de cifrado de contraseñas:', error)
})