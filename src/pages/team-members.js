import { useState, useEffect } from 'react';

export default function TeamMembersPage() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team-members');
        const data = await response.json();

        if (response.ok) {
          // Group team members by team_id
          const groupedTeams = data.reduce((acc, member) => {
            const teamId = member.team_id || 'Unassigned';
            if (!acc[teamId]) {
              acc[teamId] = {
                team_name: member.team_name || 'Unassigned Team',
                members: [],
              };
            }
            acc[teamId].members.push({
              net_id: member.student_net_id,
              active_status: member.active_status,
            });
            return acc;
          }, {});

          setTeams(Object.entries(groupedTeams));
        } else {
          setError(data.error || 'Failed to fetch team members.');
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('An error occurred while fetching team members.');
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Team Members</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(([teamId, team], index) => (
            <div
              key={index}
              className="border border-gray-300 shadow-md rounded-md p-4 bg-white"
            >
              <h2 className="text-xl font-bold mb-2">
                {team.team_name}
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                {team.members.map((member, idx) => (
                  <li key={idx}>
                    {member.net_id || 'N/A'} -{' '}
                    <span
                      className={`font-semibold ${
                        member.active_status ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {member.active_status ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>No team members found.</p>
      )}
    </div>
  );
}
