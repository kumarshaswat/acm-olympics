import pool from "../../lib/db"; // Adjust path to your DB connection

export default async function handler(req, res) {
  const { net_id } = req.query;

  if (!net_id) {
    return res.status(400).json({ error: "Missing net_id parameter." });
  }

  try {
    // Fetch student details
    const [student] = await pool.query("SELECT fname, lname FROM STUDENTS WHERE net_id = ?", [net_id]);

    if (!student.length) {
      return res.status(404).json({ error: "Student not found." });
    }

    const fullName = `${student[0].fname} ${student[0].lname}`;

    // Fetch event signups and calculate points
    const [events] = await pool.query(
      `
      SELECT 
        E.event_name AS name, 
        E.date, 
        E.points_possible AS totalPoints, 
        SR.position AS placement
      FROM EVENT_SIGNUP ES
      JOIN EVENTS E ON ES.event_id = E.event_id
      LEFT JOIN STUDENT_RESULT SR ON ES.event_id = SR.event_id AND ES.net_id = SR.net_id
      WHERE ES.net_id = ?
      `,
      [net_id]
    );

    // Calculate total points
    const totalPoints = events.reduce((acc, event) => acc + (event.pointsEarned || 0), 0);

    res.status(200).json({ name: fullName, netId: net_id, totalPoints, events });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
