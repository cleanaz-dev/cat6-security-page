"use client";
import { useTeam } from "@/lib/context/TeamProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { NewTicketSchema } from "@/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClientSearch } from "../ClientSearch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { set } from "date-fns";

export default function NewTicketDialog() {
  const { contacts, installs, handleNewTicket } = useTeam();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(NewTicketSchema),
    defaultValues: {
      requester: "",
      priority: "medium",
      subject: "",
      issue: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await handleNewTicket(data);
      toast.success("Seen Ting Create");
      reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("Ting nuh work");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClientId = useWatch({
    control,
    name: "client.hs_object_id",
  });

  const clientInstalls =
    installs?.filter((install) => install.contactId === selectedClientId) || [];
  console.log("seleclt Install", clientInstalls);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">Create New Ticket</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Support Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
       
            <div className="space-y-2">
              <Label>Client</Label>
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
                <p className="text-sm text-red-500">{errors.client.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.priority && (
                <p className="text-sm text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </div>
 
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="installation">
                      Installation Issue
                    </SelectItem>
                    <SelectItem value="repair">Repair Request</SelectItem>
                    <SelectItem value="billing">Billing Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Install</Label>
            <Controller
              name="installId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Install" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {clientInstalls.map((install) => (
                      <SelectItem key={install.id} value={install.id}>
                        {install.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.installId && (
              <p className="text-sm text-red-500">{errors.installId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="issue" className="block text-sm font-medium">
              Issue Description
            </label>
            <Textarea
              id="issue"
              {...register("issue")}
              placeholder="Describe the issue in detail"
              className="min-h-[120px]"
            />
            {errors.issue && (
              <p className="text-sm text-red-500">{errors.issue.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isSubmitting ? "Saving..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
