"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [isOpen, setIsOpen] = useState(true)
  const [username, setUsername] = useState("")
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [phone, setPhone] = useState("")
  const [diet, setDiet] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const dietaryRestrictions = [
    { value: "none", label: "No restrictions" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten-free" },
    { value: "halal", label: "Halal" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // For demo purposes, let's consider the login successful if both fields are filled
      if (username) {
        setIsOpen(false)
        router.push("/dashboard") // Redirect to dashboard after successful login
      } else {
        setError("Invalid username")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to Your Account</DialogTitle>
          <DialogDescription>
            Enter your credentials to access the application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">First Name</Label>
            <Input
              id="username"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Last Name</Label>
            <Input
              id="username"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Phone Number</Label>
            <Input
              id="username"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diet">Dietary Restrictions</Label>
            <Select
              value={diet}
              onValueChange={setDiet}
              disabled={isLoading}
            >
              <SelectTrigger id="diet" className="w-full">
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
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
