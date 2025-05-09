"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";
import NewNoteDialog from "./NewNoteDialog";
import NoteComponent from "./NoteComponent";
import CloseTicketDialog from "./CloseTicketDialog";

export default function SingleTicketsPage({ ticket, notes }) {
  if (!ticket)
    return <p className="text-muted-foreground">No ticket data provided.</p>;

  return (
    <div className="container mx-auto max-w-3xl py-6 px-2 ">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex gap-2 items-center">
              <Construction className="text-primary" />{" "}
              <span className="capitalize">{ticket.subject}</span>
            </CardTitle>
            <Badge
              variant={ticket.status === "closed" ? "destructive" : "secondary"}
            >
              <span className="capitalize">{ticket.status}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">Client</p>
            <p className="font-medium">{ticket.client}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p>{ticket.email || "Not provided"}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">Phone</p>
              <p>{ticket.phone || "Not provided"}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">Priority</p>
              <Badge variant="secondary" className="capitalize">
                {ticket.priority}
              </Badge>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">Install ID</p>
              <p>{ticket.installId}</p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Issue Description</p>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
              {ticket.issue}
            </div>
          </div>
          <div
            className={`relative ${
              ticket.status === "closed" ? "pointer-events-none" : ""
            }`}
          >
            {/* Light overlay (z-index only) */}
            {ticket.status === "closed" && (
              <div className="absolute inset-0 z-10 bg-background/50" />
            )}

            {/* Your existing content (no changes needed) */}
            <div className="border-t">
              <NoteComponent notes={notes} />
            </div>
            <div>
              <NewNoteDialog ticketId={ticket.id} />
            </div>
            <div className="pt-4 flex justify-end">
              <CloseTicketDialog ticketId={ticket.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
