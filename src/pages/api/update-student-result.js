import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { net_id, event_id, position } = req.body;

    // Validate input
    if (!net_id || !event_id || !position || position < 1 || position > 4) {
      return res.status(400).json({ error: 'Invalid input. Check net_id, event_id, and position.' });
    }

    try {
      const query = `
        INSERT INTO STUDENT_RESULT (net_id, event_id, position)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE position = VALUES(position)
      `;
      await pool.query(query, [net_id, event_id, position]);
      res.status(200).json({ message: 'Student result updated successfully.' });
    } catch (error) {
      console.error('Error updating student result:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
