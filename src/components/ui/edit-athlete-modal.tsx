import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  active: boolean;
  totalPoints: number;
}

type EditAthleteModalProps = {
  athlete: Athlete | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAthlete: Athlete) => void;
}

export function EditAthleteModal({ athlete, isOpen, onClose, onSave }: EditAthleteModalProps) {
  const [editedAthlete, setEditedAthlete] = useState<Athlete | null>(null)

  useEffect(() => {
    setEditedAthlete(athlete)
  }, [athlete])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedAthlete) {
      setEditedAthlete({
        ...editedAthlete,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    if (editedAthlete) {
      setEditedAthlete({
        ...editedAthlete,
        active: checked
      })
    }
  }

  const handleSave = () => {
    if (editedAthlete) {
      onSave(editedAthlete)
    }
    onClose()
  }

  if (!editedAthlete) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Athlete</DialogTitle>
          <DialogDescription>
            Make changes to the athlete here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={editedAthlete.firstName}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={editedAthlete.lastName}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">
              Team
            </Label>
            <Input
              id="team"
              name="team"
              value={editedAthlete.team}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalPoints" className="text-right">
              Total Points
            </Label>
            <Input
              id="totalPoints"
              name="totalPoints"
              type="number"
              value={editedAthlete.totalPoints}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Active
            </Label>
            <Switch
              id="active"
              checked={editedAthlete.active}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
