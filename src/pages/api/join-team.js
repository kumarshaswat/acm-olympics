// pages/api/join-team.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { net_id, team_id } = req.body;

    // Input Validation
    if (!net_id || !team_id) {
      return res.status(400).json({ error: 'Net ID and Team ID are required.' });
    }

    try {
      const [result] = await pool.query(
        'UPDATE STUDENT_STATUS SET active_team = ?, active_status = TRUE WHERE net_id = ?',
        [team_id, net_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }

      res.status(200).json({ message: 'Team joined successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed.' });
  }
}
