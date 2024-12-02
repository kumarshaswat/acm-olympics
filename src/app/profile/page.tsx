"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getOrdinal(n: number) {
  let suffix = "th";
  if (n % 10 == 1 && n % 100 != 11) {
    suffix = "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    suffix = "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    suffix = "rd";
  }
  return n + suffix;
}

export default function ProfilePage() {
  const netId = "fxj200003"; // Hardcoded net_id
  const [profileData, setProfileData] = React.useState<{
    name: string;
    netId: string;
    totalPoints: number;
    events: Array<{
      name: string;
      date: string;
      pointsEarned?: number;
      totalPoints: number;
      placement?: number;
      status?: string;
    }>;
  } | null>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/profile?net_id=${netId}`);
        const data = await response.json();

        if (response.ok) {
          setProfileData(data);
        } else {
          setError(data.error || "Failed to fetch profile data.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchProfileData();
  }, [netId]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!profileData) {
    return <p className="text-center">Loading profile data...</p>;
  }

  // Sort events: upcoming first, then by date
  const sortedEvents = [...profileData.events].sort((a, b) => {
    if (a.status === "upcoming" && b.status !== "upcoming") return -1;
    if (a.status !== "upcoming" && b.status === "upcoming") return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-4xl font-bold">{profileData.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl">{profileData.name}</CardTitle>
            <CardDescription>{profileData.netId}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Total Points</h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {profileData.totalPoints} points
            </Badge>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Events</h2>
            <div className="space-y-4">
              {sortedEvents.map((event, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    {event.status === "upcoming" ? (
                      <Badge variant="outline">Upcoming</Badge>
                    ) : (
                      <>
                        <Badge>
                          {event.pointsEarned} / {event.totalPoints} points
                        </Badge>
                        {event.placement && event.placement >= 1 && event.placement <= 3 && (
                          <Badge variant="secondary">
                            {getOrdinal(event.placement)} place
                          </Badge>
                        )}
                      </>
                    )}
                  </CardContent>

                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
