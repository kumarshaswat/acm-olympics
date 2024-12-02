import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { team_name, year } = req.body;

    // Validate inputs
    if (!team_name || !year) {
      return res.status(400).json({ error: 'Team name and year are required.' });
    }

    try {
      const query = `
        INSERT INTO TEAMS (team_name, year)
        VALUES (?, ?)
      `;
      const [result] = await pool.query(query, [team_name, year]);

      res.status(201).json({
        message: 'Team created successfully.',
        team_id: result.insertId,
      });
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
