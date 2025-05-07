"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

export function NewInstallationDialog({
  showAddForm,
  setShowAddForm,
  newInstallation,
  setNewInstallation,
  handleAddInstallation,
  TECHNICIANS,
  jobTypes,
}) {
  return (
    <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Installation</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input
                type="text"
                value={newInstallation.client}
                onChange={(e) =>
                  setNewInstallation({
                    ...newInstallation,
                    client: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ABC Corporation"
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                type="text"
                value={newInstallation.address}
                onChange={(e) =>
                  setNewInstallation({
                    ...newInstallation,
                    address: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Business St"
              />
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                value={format(newInstallation.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setNewInstallation({
                    ...newInstallation,
                    start: new Date(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours)
              </Label>
              <Input
                type="number"
                min="1"
                value={Math.round(
                  (newInstallation.end - newInstallation.start) /
                    (1000 * 60 * 60)
                )}
                onChange={(e) => {
                  const hours = parseInt(e.target.value);
                  setNewInstallation({
                    ...newInstallation,
                    end: new Date(
                      newInstallation.start.getTime() + hours * 60 * 60 * 1000
                    ),
                  });
                }}
                className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
         
              <div className="grid grid-cols-2">
                <div className="space-y-2">
                  {" "}
                  <Label>Job Type</Label>
                  <Select
                    value={String(newInstallation.jobType)}
                    onValueChange={(val) =>
                      setNewInstallation({ ...newInstallation, jobType: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {jobTypes.map((job) => (
                        <SelectItem key={job.id} value={String(job.name)}>
                          {job.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  {newInstallation.jobType === "New Install" ? (
                    <div>
                      <Label>Invoice</Label>
                    </div>
                  ) : (
                    <div>
                      <Label>Ticket</Label>
                    </div>
                  )}
                </div>
              </div>
         

            <div className="space-y-2">
              <Label>Technician</Label>
              <Select
                value={String(newInstallation.technicianId)}
                onValueChange={(val) =>
                  setNewInstallation({
                    ...newInstallation,
                    technicianId: parseInt(val),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {TECHNICIANS.map((tech) => (
                    <SelectItem key={tech.id} value={String(tech.id)}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={newInstallation.status}
                onValueChange={(val) =>
                  setNewInstallation({ ...newInstallation, status: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <Textarea
                value={newInstallation.notes}
                onChange={(e) =>
                  setNewInstallation({
                    ...newInstallation,
                    notes: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Access instructions, special requirements..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={handleAddInstallation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!newInstallation.client || !newInstallation.address}
          >
            Schedule Installation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
