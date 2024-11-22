import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = `
        SELECT 
          T.team_id AS team_id,
          T.team_name AS team_name,
          S.net_id AS student_net_id,
          S.active_status AS active_status
        FROM 
          TEAMS T
        LEFT JOIN 
          STUDENT_STATUS S ON T.team_id = S.active_team
        ORDER BY 
          T.team_id, S.net_id;
      `;
      const [results] = await pool.query(query);

      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
