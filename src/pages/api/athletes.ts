// pages/api/athletes.ts

import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db'; // Ensure this path is correct
import JoiBase from 'joi';
import JoiDate from '@joi/date';

// Extend Joi with the date extension (if needed in future validations)
const Joi = JoiBase.extend(JoiDate);

/**
 * Athlete Data Type
 */
type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  active: boolean;
  totalPoints: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received ${req.method} request to /api/athletes`);

  if (req.method === 'GET') {
    try {
      // Updated SQL Query to fetch athlete data with active status
      const [rows] = await pool.query(`
        SELECT 
          S.net_id AS id,
          S.fname AS firstName,
          S.lname AS lastName,
          T.team_name AS team,
          IFNULL(SS.active_status, FALSE) AS active,
          IFNULL(SR.totalPoints, 0) AS totalPoints
        FROM STUDENTS S
        LEFT JOIN STUDENT_STATUS SS ON S.net_id = SS.net_id
        LEFT JOIN TEAMS T ON SS.active_team = T.team_id
        LEFT JOIN (
          SELECT 
            ES.net_id, 
            SUM(E.points_possible) AS totalPoints
          FROM EVENT_SIGNUP ES
          JOIN EVENTS E ON ES.event_id = E.event_id
          GROUP BY ES.net_id
        ) SR ON S.net_id = SR.net_id
        GROUP BY S.net_id, S.fname, S.lname, T.team_name, SS.active_status, SR.totalPoints
        ORDER BY totalPoints DESC
      `);

      // Type assertion since mysql2 returns any[]
      const athletes: Athlete[] = (rows as any[]).map(row => ({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        team: row.team ? row.team.toLowerCase() : 'unknown', // Ensuring consistency
        active: row.active === 1, // MySQL returns BOOLEAN as 1 or 0
        totalPoints: row.totalPoints,
      }));

      res.status(200).json(athletes);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed. Use GET to fetch athletes.' });
  }
}
