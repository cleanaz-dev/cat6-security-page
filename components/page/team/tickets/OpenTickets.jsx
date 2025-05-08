import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Clock, MessageSquare, User, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Tags } from 'lucide-react';

export default function OpenTickets({ openTickets }) {
  // Group tickets by priority for the overview cards
  const priorityCounts = {
    high: openTickets.filter(t => t.priority === 'high').length,
    medium: openTickets.filter(t => t.priority === 'medium').length,
    low: openTickets.filter(t => t.priority === 'low').length
  };

  return (
    <div className="px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Tags className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
            Open Tickets
          </h1>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/tickets/new">
            Create New Ticket
          </Link>
        </Button>
      </div>

      {/* Priority Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PriorityCard 
          priority="high" 
          count={priorityCounts.high} 
          icon={<AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
        <PriorityCard 
          priority="medium" 
          count={priorityCounts.medium} 
          icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
        <PriorityCard 
          priority="low" 
          count={priorityCounts.low} 
          icon={<CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">All Open Tickets</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Ticket ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">Subject</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Requester</TableHead>
                  <TableHead className="text-xs sm:text-sm">Priority</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Last Updated</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs sm:text-sm">#{ticket.id.slice(0, 6)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        {ticket.comments > 0 && (
                          <span className="flex items-center text-muted-foreground text-xs">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {ticket.comments}
                          </span>
                        )}
                        {ticket.subject}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        {ticket.requester}
                      </div>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link aantal href={`/tickets/${ticket.id}`} className="flex items-center gap-1 text-xs sm:text-sm">
                          View <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {openTickets.length === 0 && (
            <div className="py-8 sm:py-12 text-center text-muted-foreground text-sm sm:text-base">
              No open tickets found. Everything looks good!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
function PriorityCard({ priority, count, icon }) {
  const priorityStyles = {
    high: 'bg-red-50/10 text-red-600',
    medium: 'bg-amber-50/10 text-amber-600',
    low: 'bg-green-50/10 text-green-600'
  };

  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  };

  return (
    <Card className={`border ${priorityStyles[priority]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium flex items-center justify-between">
          <span>{priorityLabels[priority]}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {count === 1 ? 'ticket' : 'tickets'} requiring attention
        </p>
      </CardContent>
    </Card>
  );
}

function PriorityBadge({ priority }) {
  const badgeStyles = {
    high: 'bg-red-100 text-red-800 hover:bg-red-100',
    medium: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    low: 'bg-green-100 text-green-800 hover:bg-green-100'
  };

  return (
    <Badge variant="outline" className={`capitalize text-xs sm:text-sm ${badgeStyles[priority]}`}>
      {priority}
    </Badge>
  );
}