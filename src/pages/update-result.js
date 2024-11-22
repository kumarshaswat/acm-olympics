import { useState } from 'react';

export default function UpdateResultsPage() {
  const [studentResult, setStudentResult] = useState({ net_id: '', event_id: '', position: '' });
  const [teamResult, setTeamResult] = useState({ team_id: '', event_id: '', position: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/update-student-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentResult),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Student result updated successfully.');
        setStudentResult({ net_id: '', event_id: '', position: '' });
      } else {
        setErrorMessage(data.error || 'Failed to update student result.');
      }
    } catch (error) {
      console.error('Error updating student result:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/update-team-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamResult),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Team result updated successfully.');
        setTeamResult({ team_id: '', event_id: '', position: '' });
      } else {
        setErrorMessage(data.error || 'Failed to update team result.');
      }
    } catch (error) {
      console.error('Error updating team result:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Update Results</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Student Result Form */}
      <form onSubmit={handleStudentSubmit} className="space-y-4">
        <h2 className="text-xl">Update Student Result</h2>
        <input
          type="text"
          placeholder="Student Net ID"
          value={studentResult.net_id}
          onChange={(e) => setStudentResult({ ...studentResult, net_id: e.target.value })}
          required
          className="w-full p-2 border"
        />
        <input
          type="number"
          placeholder="Event ID"
          value={studentResult.event_id}
          onChange={(e) => setStudentResult({ ...studentResult, event_id: e.target.value })}
          required
          className="w-full p-2 border"
        />
        <input
          type="number"
          placeholder="Position (1-4)"
          value={studentResult.position}
          onChange={(e) => setStudentResult({ ...studentResult, position: e.target.value })}
          required
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Student Result
        </button>
      </form>

      {/* Team Result Form */}
      <form onSubmit={handleTeamSubmit} className="space-y-4 mt-8">
        <h2 className="text-xl">Update Team Result</h2>
        <input
          type="number"
          placeholder="Team ID"
          value={teamResult.team_id}
          onChange={(e) => setTeamResult({ ...teamResult, team_id: e.target.value })}
          required
          className="w-full p-2 border"
        />
        <input
          type="number"
          placeholder="Event ID"
          value={teamResult.event_id}
          onChange={(e) => setTeamResult({ ...teamResult, event_id: e.target.value })}
          required
          className="w-full p-2 border"
        />
        <input
          type="number"
          placeholder="Position (1-4)"
          value={teamResult.position}
          onChange={(e) => setTeamResult({ ...teamResult, position: e.target.value })}
          required
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Team Result
        </button>
      </form>
    </div>
  );
}
