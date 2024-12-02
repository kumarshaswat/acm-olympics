"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddStudentModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    net_id: "",
    fname: "",
    lname: "",
    phone_number: "",
    diet: "",
  });
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const dietaryRestrictions = [
    { value: "none", label: "No restrictions" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten-free" },
    { value: "halal", label: "Halal" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, diet: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOpen(false);
        alert("Student added successfully!"); // Replace with a better success handler if needed
        setFormData({
          net_id: "",
          fname: "",
          lname: "",
          phone_number: "",
          diet: "",
        });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to add student.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the details for the new student here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="net_id" className="text-right">
                Net ID
              </Label>
              <Input
                id="net_id"
                name="net_id"
                value={formData.net_id}
                onChange={handleChange}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fname" className="text-right">
                First Name
              </Label>
              <Input
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lname" className="text-right">
                Last Name
              </Label>
              <Input
                id="lname"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diet" className="text-right">
                Dietary Restrictions
              </Label>
              <Select
                value={formData.diet}
                onValueChange={handleSelectChange}
                disabled={isLoading}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select dietary restrictions" />
                </SelectTrigger>
                <SelectContent>
                  {dietaryRestrictions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
