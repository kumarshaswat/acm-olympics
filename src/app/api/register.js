// pages/api/register.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { net_id, fname, lname, phone_number, diet } = req.body;

    // Input Validation
    if (!net_id || !fname || !lname || !phone_number || !diet) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      // Begin transaction
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Insert into STUDENTS
        await connection.query(
          'INSERT INTO STUDENTS (net_id, fname, lname, phone_number, diet) VALUES (?, ?, ?, ?, ?)',
          [net_id, fname, lname, phone_number, diet]
        );

        // Insert into STUDENT_STATUS with default values
        await connection.query(
          'INSERT INTO STUDENT_STATUS (net_id) VALUES (?)',
          [net_id]
        );

        // Commit transaction
        await connection.commit();
        connection.release();

        res.status(201).json({ message: 'Student registered successfully.' });
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        connection.release();

        if (error.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ error: 'Net ID already exists.' });
        } else {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error.' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database Connection Error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed.' });
  }
}
