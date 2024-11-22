// pages/results.js
import { useEffect, useState } from 'react';

export default function Results() {
  const [studentResults, setStudentResults] = useState([]);
  const [teamResults, setTeamResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results');
        const data = await response.json();

        if (response.ok) {
          setStudentResults(data.studentResults);
          setTeamResults(data.teamResults);
        } else {
          setError(data.error || 'Failed to fetch results.');
        }
      } catch (err) {
        setError('An error occurred.');
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Results</h1>
      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-xl mt-6 mb-2">Student Results</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Net ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Event</th>
            <th className="border px-4 py-2">Position</th>
          </tr>
        </thead>
        <tbody>
          {studentResults.map((result) => (
            <tr key={`${result.net_id}-${result.event_id}`}>
              <td className="border px-4 py-2">{result.net_id}</td>
              <td className="border px-4 py-2">
                {result.fname} {result.lname}
              </td>
              <td className="border px-4 py-2">{result.event_name}</td>
              <td className="border px-4 py-2">{result.position}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl mt-6 mb-2">Team Results</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Team ID</th>
            <th className="border px-4 py-2">Team Name</th>
            <th className="border px-4 py-2">Event</th>
            <th className="border px-4 py-2">Position</th>
          </tr>
        </thead>
        <tbody>
          {teamResults.map((result) => (
            <tr key={`${result.team_id}-${result.event_id}`}>
              <td className="border px-4 py-2">{result.team_id}</td>
              <td className="border px-4 py-2">{result.team_name}</td>
              <td className="border px-4 py-2">{result.event_name}</td>
              <td className="border px-4 py-2">{result.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
