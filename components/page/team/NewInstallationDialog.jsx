"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InstallSchema } from "@/lib/schemas";
import { format, addHours } from "date-fns";
import { useTeam } from "@/lib/context/TeamProvider";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ClientSearch } from "./ClientSearch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TechnicianSelect } from "./TechnicianSelect";

export function NewInstallationDialog({
  showAddForm,
  setShowAddForm,
  selectedDate,
}) {
  const { contacts, members, quotes, jobTypes, handleAddInstallation } =
    useTeam();
  const [loading, setLoading] = useState(false);
  const { refresh } = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(InstallSchema),
    defaultValues: {
      start: selectedDate,
      end: addHours(selectedDate, 2),
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const submissionData = {
        ...data,
        title: `${data.client.name} - ${format(data.start, "MMM d, yyyy")}`,
      };
      const response = await handleAddInstallation(submissionData);

      if (response?.success) {
        toast.success("Installation scheduled successfully!", {
          description: `For ${data.client.name} on ${format(
            data.start,
            "PPp"
          )}`,
        });
        reset();
        setShowAddForm(false);
      } else {
        throw new Error(response?.message || "Failed to create installation");
      }
    } catch (error) {
      toast.error("Failed to schedule installation", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      refresh();
    }
  };

  return (
    <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Installation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Controller
                  name="client"
                  control={control}
                  render={({ field }) => (
                    <ClientSearch
                      clients={contacts}
                      onSelect={(client) =>
                        field.onChange({
                          hs_object_id: client.hs_object_id,
                          name: `${client.firstname} ${client.lastname || ""}`,
                          email: client.email,
                          phone: client.phone,
                        })
                      }
                    />
                  )}
                />
                {errors.client && (
                  <p className="text-red-500 text-sm">
                    {errors.client.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input {...register("address")} placeholder="123 Business St" />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Controller
                  name="start"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="datetime-local"
                        value={
                          field.value
                            ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                      {errors.start && (
                        <p className="text-red-500 text-sm">
                          {errors.start.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Installation Details Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {jobTypes.map((job) => (
                          <SelectItem key={job.id} value={job.name}>
                            {job.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jobType && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Technician</Label>
                <Controller
                  name="technician"
                  control={control}
                  render={({ field }) => (
                    <TechnicianSelect
                      value={field.value}
                      onChange={field.onChange}
                      members={members}
                    />
                  )}
                />
                {errors.technician && (
                  <p className="text-red-500 text-sm">
                    {errors.technician.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  {...register("notes")}
                  placeholder="Special instructions..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="submit" disabled={!isValid}>
              {loading ? "Scheduling..." : "Schedule Installation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
