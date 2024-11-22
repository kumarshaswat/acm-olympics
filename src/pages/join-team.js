// pages/join-team.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function JoinTeam() {
  const [net_id, setNetId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch available teams
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const data = await response.json();
        if (response.ok) {
          setTeams(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/join-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ net_id, team_id: teamId }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to join team.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Join a Team</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="net_id"
          value={net_id}
          onChange={(e) => setNetId(e.target.value)}
          placeholder="Your Net ID"
          required
          className="w-full p-2 border"
        />
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          required
          className="w-full p-2 border"
        >
          <option value="">Select a Team</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white p-2">
          Join Team
        </button>
      </form>
    </div>
  );
}
