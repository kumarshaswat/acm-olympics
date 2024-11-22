import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// This would come from a database or API
const profileData = {
  name: "John Doe",
  netId: "jxd123123",
  totalPoints: 250,
  events: [
    { name: "100m Sprint", date: "2023-06-15", pointsEarned: 40, totalPoints: 50, placement: 2 },
    { name: "Long Jump", date: "2023-06-16", pointsEarned: 65, totalPoints: 75, placement: 3 },
    { name: "4x100m Relay", date: "2023-06-17", pointsEarned: 95, totalPoints: 100, placement: 1 },
    { name: "High Jump", date: "2023-06-18", pointsEarned: 20, totalPoints: 25, placement: 5 },
    { name: "200m Sprint", date: "2023-06-20", totalPoints: 50, status: "upcoming" },
    { name: "Javelin Throw", date: "2023-06-22", totalPoints: 75, status: "upcoming" },
  ],
}

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
            <AvatarFallback className="text-4xl font-bold">J</AvatarFallback>
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
                        <Badge variant="secondary">
                          {getOrdinal(event.placement ?? 0)} place
                        </Badge>
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
  )
}

