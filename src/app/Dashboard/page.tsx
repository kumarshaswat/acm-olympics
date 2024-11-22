import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EventRegistrationDialog } from "@/components/event-registration-dialog"

const events = [
  {
    title: "Tennis",
    date: "2023-07-15",
    time: "14:00",
    location: "Central Park, New York",
  },
  {
    title: "Soccer",
    date: "2023-08-22",
    time: "09:00",
    location: "Convention Center, San Francisco",
  },
  {
    title: "Basketball",
    date: "2023-09-05",
    time: "18:30",
    location: "Modern Art Gallery, London",
  },
  {
    title: "Sprint",
    date: "2023-10-10",
    time: "19:00",
    location: "Gourmet Hall, Paris",
  },
]

export default function Home() {
  return (
    <main className="w-full">
      <div className="flex flex-col w-full pt-20 justify-center items-center">
        <h1 className="text-bold text-3xl mb-10">Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {events.map((event, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Date: {event.date} at {event.time}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Location: {event.location}
                </p>
              </CardContent>
              <CardFooter>
                <EventRegistrationDialog event={event} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}