"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [netId, setNetId] = useState(""); // Track user's Net ID

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/events?page=${pagination.page}&limit=${pagination.limit}`
        );
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events || []);
          setPagination({
            ...pagination,
            total: data.pagination.total || 0,
            totalPages: data.pagination.totalPages || 1,
          });
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

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setIsRegistrationDialogOpen(true);
  };

  const confirmRegistration = async () => {
    if (!netId) {
      setError("Net ID is required.");
      return;
    }

    try {
      const response = await fetch("/api/sign-up-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ net_id: netId, event_id: selectedEvent?.event_id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Successfully registered for ${selectedEvent?.event_name}.`);
        setError("");
      } else {
        setError(data.error || "Failed to register for the event.");
      }
    } catch (err) {
      console.error("Error signing up for event:", err);
      setError("An unexpected error occurred.");
    }

    setIsRegistrationDialogOpen(false);
    setSelectedEvent(null);
    setNetId("");
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEvent) {
      try {
        const response = await fetch(`/api/events/${selectedEvent.event_id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setEvents((prev) => prev.filter((e) => e.event_id !== selectedEvent.event_id));
          setSuccessMessage("Event deleted successfully.");
        } else {
          const data = await response.json();
          setError(data.error || "Failed to delete event.");
        }
      } catch (err) {
        console.error("Error deleting event:", err);
        setError("An unexpected error occurred while deleting the event.");
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedEvent(null);
      }
    }
  };

  return (
    <main className="w-full">
      <div className="flex flex-col w-full pt-20 justify-center items-center">
        <h1 className="text-bold text-3xl mb-10">Events</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {isLoading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {events.map((event) => (
              <Card key={event.event_id} className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>{event.event_name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(event)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Date: {event.date ? format(new Date(event.date), "MMMM do, yyyy 'at' h:mm a") : "TBA"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Points Possible: {event.points_possible || "N/A"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleRegister(event)}>Register</Button>
                </CardFooter>
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

      {/* Registration Dialog */}
      <Dialog open={isRegistrationDialogOpen} onOpenChange={setIsRegistrationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {selectedEvent?.event_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Please enter your Net ID to register for <strong>{selectedEvent?.event_name}</strong>.
            </p>
            <Input
              type="text"
              placeholder="Enter your Net ID"
              value={netId}
              onChange={(e) => setNetId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRegistrationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRegistration}>Confirm Registration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedEvent?.event_name}</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
