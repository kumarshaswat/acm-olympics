"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Team {
  id: string; // Use string because team_id could be 'Unassigned'
  name: string;
  members: { net_id: string; active_status: boolean }[];
}

const currentUser = {
  name: "Farhan Jamil",
  net_id: "fxj200003"
};

export default function TeamsPage() {
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState(currentUser.team);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/team-members");
        const data = await response.json();

        if (response.ok) {
          // Group members by team_id
          const groupedTeams = data.reduce((acc, member) => {
            const teamId = member.team_id || "Unassigned";
            if (!acc[teamId]) {
              acc[teamId] = {
                id: teamId,
                name: member.team_name || "Unassigned Team",
                members: [],
              };
            }
            acc[teamId].members.push({
              net_id: member.student_net_id,
              active_status: member.active_status,
            });
            return acc;
          }, {});

          setTeamsData(Object.values(groupedTeams));
        } else {
          setError(data.error || "Failed to fetch teams.");
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("An error occurred while fetching teams.");
      }
    };

    fetchTeams();
  }, []);

  const handleJoinTeam = async (teamName: string, teamId: string) => {
    setError("");
    try {
      const response = await fetch("/api/join-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ net_id: currentUser.net_id, team_id: teamId }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserTeam(teamName); // Update the UI
      } else {
        setError(data.error || "Failed to join team.");
      }
    } catch (err) {
      setError("An error occurred while joining the team.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {teamsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsData.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {team.name}
                  {userTeam === team.name && <Badge variant="secondary">Your Team</Badge>}
                </CardTitle>
                <CardDescription>
                  {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[100px]">
                  <ul className="space-y-2">
                    {team.members.map((member, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.net_id}`}
                            alt={member.net_id}
                          />
                          <AvatarFallback>{member.net_id}</AvatarFallback>
                        </Avatar>
                        <span className={member.active_status ? "text-green-600" : "text-red-600"}>
                          {member.net_id} - {member.active_status ? "Active" : "Inactive"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleJoinTeam(team.name, team.id)}
                  disabled={userTeam === team.name}
                  className="w-full"
                >
                  {userTeam === team.name ? "Current Team" : "Join Team"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No teams found.</p>
      )}
    </div>
  );
}
