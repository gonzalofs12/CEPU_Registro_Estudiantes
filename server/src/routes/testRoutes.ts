import { Router } from 'express';
import pool from '../config/db';

const router = Router();

router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    res.json({
      success: true,
      message: 'Consulta exitosa',
      data: rows,
    });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ success: false, message: 'Error al conectar con la base de datos' });
  }
});

export default router;