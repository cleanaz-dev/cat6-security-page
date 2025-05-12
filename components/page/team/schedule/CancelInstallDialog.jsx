"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoAlertSharp } from "react-icons/io5";
export default function CancelInstallDialog({ installId, isCancelled, isComplete }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const handleCancel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api//installs/${installId}/cancel-install`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Failed to cancel job");
        return;
      }

      toast.success("Job cancelled successfully");
      push("/team");
    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={isComplete || isCancelled}>Cancel Job</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><span className="flex underline decoration-rose-500">Cancel Job <IoAlertSharp className="text-rose-500" /></span></DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this job?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end mt-6">
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Close
          </Button>
          <Button onClick={handleCancel} variant="destructive" disabled={loading}>
            {loading ? "Cancelling..." : "Cancel Job"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
