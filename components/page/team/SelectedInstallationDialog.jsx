"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTeam } from "@/lib/context/TeamProvider";
import { format } from "date-fns";
import Link from "next/link";

export function SelectedInstallationDialog({
  selectedInstallation,
  setSelectedInstallation,
}) {
  const {
    id,
    contactId,
    name,
    email,
    phone,
    address,
    technician,
    notes,
    status,
    jobType,
    title,
    start,
    end,
  } = selectedInstallation;
  const { members, getTechNames } = useTeam();

  return (
    <Dialog
      open={selectedInstallation}
      onOpenChange={() => setSelectedInstallation(null)}
    >
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Installation Details</DialogTitle>
          <DialogDescription>View information</DialogDescription>
        </DialogHeader>

        {selectedInstallation && (
          <div className="space-y-6">
            <div className="grid grid-cols-2">
              <div>
                <Label>Name</Label>
                <p className="text-muted-foreground">{name}</p>
                <Label>Address</Label>
                <p className="text-muted-foreground">{address}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-muted-foreground">{phone}</p>
                <Label>Email</Label>
                <p className="text-muted-foreground truncate">{email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                {" "}
                <Label>Job Type</Label>
                <p className="text-muted-foreground">{jobType}</p>
              </div>
              <div>
                <Label>
                  {jobType === "Site Inspection"
                    ? "Quote"
                    : jobType === "New Install"
                    ? "Invoice"
                    : jobType === "Repair"
                    ? "Ticket"
                    : "Job Type"}
                </Label>
                <p className="text-muted-foreground"></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <p className="text-muted-foreground">
                  {format(new Date(start), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <Label>Time</Label>
                <p className="text-muted-foreground">
                  {format(new Date(start), "h:mm a")} -
                  {format(new Date(end), 'h:mm a')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Technician(s)</Label>
                <div className="mt-1">
                  {getTechNames(technician, members).map((name, index) => (
                    <div key={index} className="text-muted-foreground">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  className={`capitalize ${
                    status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : status === "scheduled"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {status}
                </Badge>
              </div>
            </div>

            {notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="mt-1 p-2 bg-gray-50 rounded">{notes}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 cursor-pointer">
                <Link href={`/team/schedule/${id}`}>
                View Full Details
                </Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
