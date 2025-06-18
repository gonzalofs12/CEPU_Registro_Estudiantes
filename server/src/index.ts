import app from './app'
import pool from './config/db'

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection()
    console.log('Conexión a la base de datos exitosa')
    connection.release()
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
    process.exit(1) // Terminar el proceso si no se puede conectar a la base de datos
  }
}

initializeDatabase().then(() => {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

