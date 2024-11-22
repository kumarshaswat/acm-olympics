"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
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

// Updated schema for additional fields
const FormSchema = z.object({
  netid: z.string().min(9, {
    message: "NetID must be at least 9 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone Number must be at least 10 digits.",
  }),
  dietaryPreference: z.string().optional(),
})

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      netid: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dietaryPreference: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {/* NetID Field */}
        <FormField
          control={form.control}
          name="netid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net ID</FormLabel>
              <FormControl>
                <Input placeholder="Net ID" {...field} />
              </FormControl>
              <FormDescription>
                This is your unique NetID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Name Field */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name Field */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number Field */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" type="tel" {...field} />
              </FormControl>
              <FormDescription>
                This will be used for contact purposes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dietary Preference Field */}
        <FormField
          control={form.control}
          name="dietaryPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preference</FormLabel>
              <FormControl>
                <Input placeholder="Dietary Preference" {...field} />
                {/* Alternatively, you can replace with a select input for specific options */}
              </FormControl>
              <FormDescription>
                Specify any dietary restrictions or preferences.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default InputForm;
