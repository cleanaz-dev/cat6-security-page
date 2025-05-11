"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CloseTicketDialog({ ticketId }) {
  const [sendSurvey, setSendSurvey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const { push } = useRouter()

  const handleCloseTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/team/tickets/${ticketId}/close-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sendSurvey }),
      });

      const result = await res.json()

      if (!result.success) throw new Error("Failed to close ticket");

      toast.success("Ticket closed successfully");
      setOpen(false);
      push("/team/tickets")
    } catch (error) {
      console.error(error);
      toast.error("Error closing ticket");
    } finally {
      setLoading(false);
      setSendSurvey(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Close Ticket</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Ticket</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id="survey"
            checked={sendSurvey}
            onCheckedChange={setSendSurvey}
          />
          <Label htmlFor="survey">Send customer satisfaction survey</Label>
        </div>

        <DialogFooter>
         
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
           <Button
            onClick={handleCloseTicket}
            variant="default"
            disabled={loading}
          >
            {loading ? "Closing..." : "Close Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
