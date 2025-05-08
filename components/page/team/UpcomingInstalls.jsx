"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/lib/context/TeamProvider";
import { Wrench, MapPin, User } from "lucide-react";
import Link from "next/link";

export default function UpcomingInstalls() {
  const { installs, getTechNames, members } = useTeam();
  const jobs = installs.filter((install) => install.status !== "completed");

  return (
    <Card className="bg-background border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="text-xl sm:text-2xl">Upcoming Jobs</span>
          </div>
          <Badge variant="outline" className="sm:ml-auto bg-accent/20 mt-2 sm:mt-0">
            {jobs.length} scheduled
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="group relative p-3 sm:p-4 rounded-lg border hover:border-primary/30 transition-all"
          >
            {/* Mobile-optimized layout */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <div className="flex justify-between">
                  <h3 className="font-medium text-primary">{job.title}</h3>
                  <Button asChild size="sm">
                    <Link href={`/team/schedule/${job.id}`}>
                    View
                    </Link>
                  </Button>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {job.jobType}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.address}</span>
                </div>
              </div>

              <Badge variant="secondary" className="sm:self-start mt-1 sm:mt-0">
                {job.status}
              </Badge>
            </div>

            {/* Technician Tags - Only show if space allows */}
            {job.technician.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <h4 className="text-xs font-medium text-muted-foreground mb-1.5">
                  Assigned Techs:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getTechNames(job.technician, members).map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1"
                    >
                      <User className="h-3 w-3 mr-1 text-primary" />
                      <span className="truncate max-w-[100px]">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}