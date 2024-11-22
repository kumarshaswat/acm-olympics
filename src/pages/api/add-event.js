// pages/api/add-event.js

import pool from '../../lib/db'; // Ensure this path is correct
import Joi from 'joi';

/**
 * Validation schema for event data
 */
const eventSchema = Joi.object({
  event_name: Joi.string().min(3).max(255).required(),
  date: Joi.date().format('YYYY-MM-DD HH:mm:ss').required(),
  points_possible: Joi.number().integer().min(0).required(),
});

export default async function handler(req, res) {
  console.log(`Received ${req.method} request to /api/add-event`);

  if (req.method === 'POST') {
    console.log('Request body:', req.body);
    const { event_name, date, points_possible } = req.body;

    // Validate input data
    const { error } = eventSchema.validate({ event_name, date, points_possible });
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      // Insert the new event into the EVENTS table
      const [result] = await pool.query(
        'INSERT INTO EVENTS (event_name, date, points_possible) VALUES (?, ?, ?)',
        [event_name, date, points_possible]
      );

      console.log(`Event added with ID: ${result.insertId}`);

      // Respond with success message and the new event ID
      res.status(201).json({
        message: 'Event added successfully.',
        event_id: result.insertId,
      });
    } catch (error) {
      console.error('Error adding event:', error);

      // Handle specific database errors (e.g., duplicate entries)
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'An event with this name already exists.' });
      } else {
        res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  } else {
    // If not POST, respond with Method Not Allowed
    console.log(`Method ${req.method} not allowed on /api/add-event`);
    res.status(405).json({ error: 'Method Not Allowed. Use POST to add an event.' });
  }
}
