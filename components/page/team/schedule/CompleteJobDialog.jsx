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

export default function CompleteJobDialog({ installId, isComplete, isCancelled }) {
  const [open, setOpen] = useState(false);
  const [sendSurvey, setSendSurvey] = useState(false);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter()
  

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/installs/${installId}/complete-install`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendSurvey }),
      });

      if (!res.ok) throw new Error("Failed to complete job");

      toast.success("Job marked as complete!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete job");
    } finally {
      setLoading(false);
      push("/team")
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={isComplete || isCancelled}>Mark as Complete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Job as Complete</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="send-survey"
            checked={sendSurvey}
            onCheckedChange={(val) => setSendSurvey(!!val)}
          />
          <Label htmlFor="send-survey">Send customer survey</Label>
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="secondary"
            onClick={handleComplete}
            disabled={loading || isComplete || isCancelled}
          >
            {loading ? "Completing..." : "Complete Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
