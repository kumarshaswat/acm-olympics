// pages/api/events/[id].js

import pool from '../../../lib/db'; // Adjust the path based on your project structure

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'DELETE') {
    try {
      // Check if the event exists
      const [eventResult] = await pool.query(
        'SELECT * FROM EVENTS WHERE event_id = ?',
        [id]
      );

      if (eventResult.length === 0) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Delete the event
      await pool.query('DELETE FROM EVENTS WHERE event_id = ?', [id]);

      res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
