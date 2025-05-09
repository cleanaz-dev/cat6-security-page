"use client";
import {
  CalendarClock,
  MapPin,
  Phone,
  User,
  Mail,
  Wrench,
  NotebookText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/lib/context/TeamProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { isToday, parseISO, formatDistanceToNow, isTomorrow } from "date-fns";
import { Clock } from "lucide-react";

export default function SingleSchedulePage({ install }) {
  const { getTechNames, members } = useTeam();
  const [isOnSite, setIsOnSite] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  console.log("install", install);

  // Format date and time
  const formattedDate = new Date(install.start).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(install.start).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Check if install date is today
  const isInstallToday = isToday(parseISO(install.start));

  // Unified info item component for consistent styling
  const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-3 ${className}`}>
      <Icon className="size-4 mt-0.5 text-foreround flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "Not specified"}</p>
      </div>
    </div>
  );

  const getTimeUntil = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleCheckIn = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/installs/${install.id}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Fix: proper header key and value
        },
        body: JSON.stringify({
          techId: user.id,
          installId: install.id,
        }),
      });

      if (!response.ok) {
        toast.error("Error checking in user");
      } else {
        toast.success("Checked in successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`); // ✅ Fix: correct toast syntax
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
        <Badge
          variant={install.status === "completed" ? "default" : "secondary"}
        >
          {install.status}
        </Badge>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex gap-3 justify-start mb-6">
          <div className="flex items-center">
            <Button
              onClick={() => {
                if (!isOnSite) {
                  setIsOnSite(true);
                  // TODO: Call check-in API here
                }
              }}
              disabled={isOnSite || !isInstallToday || loading}
              className="text-sm font-medium hover:bg-accent transition-colors text-primary-foreground"
            >
              Check In
            </Button>
            <div className="ml-2 flex items-center gap-2 text-primary-muted">
              <Clock className="size-4"/><p>{getTimeUntil(install.start)}</p>
            </div>
            
          </div>
          {isOnSite && (
            <Button
              onClick={() => {
                if (isOnSite) {
                  setIsOnSite(false);
                  // TODO: Call check-out API here
                }
              }}
              disabled={!isOnSite || loading}
              className="text-sm font-medium hover:bg-accent transition-colors bg-secondary text-secondary-foreground"
            >
              Check Out
            </Button>
          )}
        </div>
        {/* Action Buttons - Moved to the top */}
        <div className="flex gap-3  mb-6 justify-between">
          <Button variant="outline" className=" text-sm font-medium ">
            Edit Job
          </Button>
          <Button className="bg-primary  text-sm font-medium transition-colors">
            Mark as Complete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main Job Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <span className="underline decoration-secondary">
                Job Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={CalendarClock}
                label="Scheduled for"
                value={
                  <>
                    {formattedDate}
                    <br />
                    {formattedTime}
                  </>
                }
              />
              <InfoItem
                icon={Wrench}
                label="Job Type"
                value={install.jobType.toLowerCase()}
                className="capitalize"
              />
              <InfoItem
                icon={MapPin}
                label="Location"
                value={install.address}
                className="md:col-span-2"
              />
              <div className="w-full border-t items-start">
                <h1 className="text-sm text-muted-foreground">Technician(s)</h1>
                {getTechNames(install.technician, members).map(
                  (name, index) => (
                    <div key={index}>
                      {name} {name.imageUrl}
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="underline decoration-secondary">
                Customer Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={User} label="Name" value={install.name} />
              <InfoItem icon={Phone} label="Phone" value={install.phone} />
              <InfoItem icon={Mail} label="Email" value={install.email} />
              <InfoItem
                icon={NotebookText}
                label="Contact ID"
                value={install.contactId}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <NotebookText className="h-5 w-5 text-primary" />
              <span className="underline decoration-secondary">Job Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {install.notes ? (
              <div className="p-3 bg-muted/50 rounded-md whitespace-pre-wrap">
                {install.notes}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No notes available for this job
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
