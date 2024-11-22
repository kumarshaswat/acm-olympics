"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EventRegistrationDialog } from "@/components/event-registration-dialog";
import { format } from "date-fns";

interface Event {
  event_id: number;
  event_name: string;
  date: string | null;
  points_possible: number | null;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events?page=${pagination.page}&limit=${pagination.limit}`);
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events || []);
          setPagination(data.pagination || { page: 1, totalPages: 1 });
          setError("");
        } else {
          setError(data.error || "Failed to fetch events.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [pagination.page]);

  const handlePrevious = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  };

  const handleNext = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages),
    }));
  };

  return (
    <main className="w-full">
      <div className="flex flex-col w-full pt-20 justify-center items-center">
        <h1 className="text-bold text-3xl mb-10">Events</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {events.map((event) => (
              <Card key={event.event_id} className="w-full">
                <CardHeader>
                  <CardTitle>{event.event_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Date: {event.date ? format(new Date(event.date), "MMMM do, yyyy 'at' h:mm a") : "TBA"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Points Possible: {event.points_possible || "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-6 max-w-4xl w-full">
          <Button
            onClick={handlePrevious}
            disabled={pagination.page === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={pagination.page === pagination.totalPages}
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
