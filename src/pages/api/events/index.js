import pool from '../../../lib/db';

/**
 * Handler to fetch all events with pagination.
 * Method: GET
 * Query Parameters:
 * - page: number (optional, default: 1)
 * - limit: number (optional, default: 10)
 */
async function handler(req, res) {
  if (req.method === 'GET') {
    let { page, limit } = req.query;

    // Default pagination values
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
      // Fetch total count of events
      const [countResult] = await pool.query('SELECT COUNT(*) AS count FROM EVENTS');
      const total = countResult?.[0]?.count || 0;

      // Fetch paginated events
      const [rows] = await pool.query(
        'SELECT event_id, event_name, date, points_possible FROM EVENTS ORDER BY date DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      // Ensure rows is an array
      const events = Array.isArray(rows) ? rows : [];

      // Calculate total pages
      const totalPages = Math.ceil(total / limit) || 1;

      // Response payload
      res.status(200).json({
        events,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed. Use GET to fetch events.' });
  }
}

export default handler;
