// components/AddEventModal.tsx

"use client";

import * as React from "react";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

export function AddEventModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [eventName, setEventName] = React.useState("");
  const [eventDate, setEventDate] = React.useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = React.useState("");
  const [pointsPossible, setPointsPossible] = React.useState<number>(0);

  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (!eventName || !eventDate || !eventTime || pointsPossible <= 0) {
      setError("All fields are required and points must be greater than 0.");
      return;
    }

    // Combine date and time into a single Date object
    const combinedDateTime = new Date(eventDate);
    const [hours, minutes] = eventTime.split(":").map(Number);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);

    // Format date for MySQL ('YYYY-MM-DD HH:mm:ss')
    const formattedDate = format(combinedDateTime, "yyyy-MM-dd HH:mm:ss");

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          date: formattedDate,
          points_possible: pointsPossible,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Event added successfully!');
        // Reset form fields
        setEventName("");
        setEventDate(undefined);
        setEventTime("");
        setPointsPossible(0);
        // Optionally, close the modal after a delay
        setTimeout(() => {
          setSuccess("");
          setIsOpen(false);
        }, 2000);
      } else {
        setError(data.error || 'Failed to add event.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Enter the details for the new event here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Event Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-name" className="text-right">
                Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="col-span-3"
                placeholder="Enter event name"
                required
              />
            </div>
            {/* Event Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                Date<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="event-date"
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Event Time */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-time" className="text-right">
                Time<span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {/* Points Possible */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points-possible" className="text-right">
                Points Possible<span className="text-red-500">*</span>
              </Label>
              <Input
                id="points-possible"
                type="number"
                value={pointsPossible}
                onChange={(e) => setPointsPossible(Number(e.target.value))}
                className="col-span-3"
                placeholder="Enter points possible"
                min="0"
                required
              />
            </div>
          </div>
          {/* Display Error and Success Messages */}
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-2 text-center">{success}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Event...' : 'Save Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
