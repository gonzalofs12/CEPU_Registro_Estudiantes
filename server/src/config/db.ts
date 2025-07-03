import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, // Reduced for serverless environment
  queueLimit: 1, // Allow only one queued connection
  connectTimeout: 10000, // 10 seconds
  idleTimeout: 60000, // Close idle connections after 60 seconds (1 minute)
});

export default pool