// pages/api/students/[net_id].js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { net_id } = req.query;

  if (req.method === 'PUT') {
    const { fname, lname, phone_number, diet } = req.body;

    // Input Validation
    if (!fname || !lname || !phone_number || !diet) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const [result] = await pool.query(
        'UPDATE STUDENTS SET fname = ?, lname = ?, phone_number = ?, diet = ? WHERE net_id = ?',
        [fname, lname, phone_number, diet, net_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }

      res.status(200).json({ message: 'Student updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM STUDENTS WHERE net_id = ?', [net_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }

      res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed.' });
  }
}
