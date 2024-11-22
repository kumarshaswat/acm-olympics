import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { net_id } = req.body;

    if (!net_id) {
      return res.status(400).json({ error: 'Student net_id is required.' });
    }

    try {
      const query = 'DELETE FROM STUDENTS WHERE net_id = ?';
      const [result] = await pool.query(query, [net_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }

      res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
