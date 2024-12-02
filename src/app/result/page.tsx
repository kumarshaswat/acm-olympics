"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  eventType: z.enum(["individual", "team"], {
    required_error: "Please select an event type.",
  }),
  eventId: z.string().min(1, {
    message: "Event ID is required.",
  }),
  participantName: z.string().min(2, {
    message: "Participant name or team name must be at least 2 characters.",
  }),
  position: z
    .string()
    .regex(/^[1-4]$/, {
      message: "Position must be a number between 1 and 4.",
    })
    .transform(Number),
});

function ResultsManagement() {
  const [eventType, setEventType] = React.useState<"individual" | "team">("individual");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "individual",
      eventId: "",
      participantName: "",
      position: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const endpoint =
      values.eventType === "individual"
        ? "/api/update-student-result"
        : "/api/update-team-result";

    const payload =
      values.eventType === "individual"
        ? { net_id: values.participantName, event_id: values.eventId, position: values.position }
        : { team_id: values.participantName, event_id: values.eventId, position: values.position };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`${values.eventType === "individual" ? "Student" : "Team"} result updated successfully.`);
        form.reset();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update result.");
      }
    } catch (error) {
      console.error("Error submitting result:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Type Field */}
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setEventType(value as "individual" | "team");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose whether this is an individual or team event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event ID Field */}
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Event ID (e.g., EVT001)" {...field} />
              </FormControl>
              <FormDescription>
                Enter the unique identifier for the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Participant or Team Name Field */}
        <FormField
          control={form.control}
          name="participantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{eventType === "individual" ? "Participant Name" : "Team Name"}</FormLabel>
              <FormControl>
                <Input
                  placeholder={eventType === "individual" ? "John Doe" : "Team Alpha"}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the name of the {eventType === "individual" ? "participant" : "team"}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Position Field */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Enter Position (1-4)" {...field} />
              </FormControl>
              <FormDescription>
                Enter the position (1st, 2nd, 3rd, or 4th).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Result</Button>
      </form>
    </Form>
  );
}

export default function ResultPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Results Management</h1>
      <ResultsManagement />
    </div>
  );
}
