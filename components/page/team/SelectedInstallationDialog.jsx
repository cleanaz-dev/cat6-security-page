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
          <DialogTitle>
            <span className="underline decoration-primary">
              Installation Details
            </span>
          </DialogTitle>
          <DialogDescription>View information</DialogDescription>
        </DialogHeader>

        {selectedInstallation && (
          <div className="space-y-6">
            <div className="grid grid-cols-2">
              <div className="space-y-2">
                <div>
                  <Label>
                    <span className="text-primary-muted">Name</span>
                  </Label>
                  <p>{name}</p>
                </div>
                <div>
                  {" "}
                  <Label>
                    <span className="text-primary-muted">Address</span>
                  </Label>
                  <p>{address}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <Label>
                    <span className="text-primary-muted">Phone</span>
                  </Label>
                  <p>{phone}</p>
                </div>
                <div>
                  <Label>
                    <span className="text-primary-muted">Email</span>
                  </Label>
                  <p className="truncate">{email}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                {" "}
                <Label><span className="text-primary-muted">Job Type</span></Label>
                <p >{jobType}</p>
              </div>
              <div>
                <Label><span className="text-primary-muted">
                  {jobType === "Site Inspection"
                    ? "Quote"
                    : jobType === "New Install"
                    ? "Invoice"
                    : jobType === "Repair"
                    ? "Ticket"
                    : "Job Type"}
                    </span>
                </Label>
                <p className="text-muted-foreground"></p>
              </div>
            </div>
            <div className="grid grid-cols-2 ">
              <div>
                <Label><span className="text-primary-muted">Date</span></Label>
                <p >
                  {format(new Date(start), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <Label><span className="text-primary-muted">Time</span></Label>
                <p >
                  {format(new Date(start), "h:mm a")} -
                  {format(new Date(end), "h:mm a")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div>
                <Label><span className="text-primary-muted">Technician(s)</span></Label>
                <div className="mt-1">
                  {getTechNames(technician, members).map((name, index) => (
                    <div key={index} >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label><span className="text-primary-muted">Status</span></Label>
                <Badge
                  className="bg-secondary text-foreground capitalize">
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
              <Button
                asChild
                className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 cursor-pointer"
              >
                <Link href={`/team/schedule/${id}`}>View Full Details</Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
