import pool from '../../lib/db'; // Adjust the path based on your project structure
import Joi from 'joi';

/**
 * Validation schema for deleting a student
 */
const deleteStudentSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { firstName, lastName } = req.body;

    // Validate input
    const { error } = deleteStudentSchema.validate({ firstName, lastName });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      // Check if the student exists
      const [studentResult] = await pool.query(
        'SELECT * FROM STUDENTS WHERE fname = ? AND lname = ?',
        [firstName, lastName]
      );

      if (studentResult.length === 0) {
        return res.status(404).json({ error: 'Student not found.' });
      }

      // Delete the student
      await pool.query('DELETE FROM STUDENTS WHERE fname = ? AND lname = ?', [
        firstName,
        lastName,
      ]);

      return res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (error) {
      console.error('Error deleting student:', error);
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
