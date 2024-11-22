import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required.' });
    }

    try {
      const query = 'DELETE FROM EVENTS WHERE event_id = ?';
      const [result] = await pool.query(query, [event_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
