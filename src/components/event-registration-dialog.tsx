import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Event {
  event_id: number
  event_name: string
  date: string | null
  points_possible: number | null
}

interface EventRegistrationDialogProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  onConfirm: () => void
}

export function EventRegistrationDialog({ isOpen, onClose, event, onConfirm }: EventRegistrationDialogProps) {
  if (!event) {
    return null
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to register for {event.event_name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
