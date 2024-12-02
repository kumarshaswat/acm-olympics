// pages/api/results.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [studentResults] = await pool.query(`
        SELECT sr.net_id, s.fname, s.lname, sr.event_id, e.event_name, sr.position
        FROM STUDENT_RESULT sr
        JOIN STUDENTS s ON sr.net_id = s.net_id
        JOIN EVENTS e ON sr.event_id = e.event_id
      `);

      const [teamResults] = await pool.query(`
        SELECT tr.team_id, t.team_name, tr.event_id, e.event_name, tr.position
        FROM TEAM_RESULT tr
        JOIN TEAMS t ON tr.team_id = t.team_id
        JOIN EVENTS e ON tr.event_id = e.event_id
      `);

      res.status(200).json({ studentResults, teamResults });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed.' });
  }
}
