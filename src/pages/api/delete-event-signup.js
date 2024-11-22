import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { net_id, event_id } = req.body;

    if (!net_id || !event_id) {
      return res.status(400).json({ error: 'Both net_id and event_id are required.' });
    }

    try {
      const query = 'DELETE FROM EVENT_SIGNUP WHERE net_id = ? AND event_id = ?';
      const [result] = await pool.query(query, [net_id, event_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Event signup not found.' });
      }

      res.status(200).json({ message: 'Event signup deleted successfully.' });
    } catch (error) {
      console.error('Error deleting event signup:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
