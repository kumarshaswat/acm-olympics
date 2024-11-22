// pages/api/sign-up-event.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { event_id, net_id } = req.body;

    // Input Validation
    if (!event_id || !net_id) {
      return res.status(400).json({ error: 'Event ID and Net ID are required.' });
    }

    try {
      // Begin transaction
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // 1. Verify if the event exists
        const [eventRows] = await connection.query('SELECT * FROM EVENTS WHERE event_id = ?', [event_id]);
        if (eventRows.length === 0) {
          await connection.rollback();
          connection.release();
          return res.status(404).json({ error: 'Event not found.' });
        }

        // 2. Fetch the active_team from STUDENT_STATUS
        const [statusRows] = await connection.query(
          'SELECT active_team, active_status FROM STUDENT_STATUS WHERE net_id = ?',
          [net_id]
        );

        if (statusRows.length === 0) {
          await connection.rollback();
          connection.release();
          return res.status(404).json({ error: 'Student not found.' });
        }

        const { active_team, active_status } = statusRows[0];

        if (!active_status) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({ error: 'Student is not active. Please join a team first.' });
        }

        // 3. Optionally, verify if the student is already signed up for the event
        const [signupRows] = await connection.query(
          'SELECT * FROM EVENT_SIGNUP WHERE event_id = ? AND net_id = ?',
          [event_id, net_id]
        );

        if (signupRows.length > 0) {
          await connection.rollback();
          connection.release();
          return res.status(409).json({ error: 'Already signed up for this event.' });
        }

        // 4. Insert into EVENT_SIGNUP with the fetched active_team
        await connection.query(
          'INSERT INTO EVENT_SIGNUP (event_id, net_id, team_id) VALUES (?, ?, ?)',
          [event_id, net_id, active_team]
        );

        // 5. Optionally, update active_status if necessary (e.g., remains TRUE)

        // Commit transaction
        await connection.commit();
        connection.release();

        res.status(201).json({ message: 'Signed up for event successfully.' });
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        connection.release();

        console.error('Transaction Error:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
      }
    } catch (error) {
      console.error('Database Connection Error:', error);
      res.status(500).json({ error: 'Database Connection Error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed.' });
  }
}
