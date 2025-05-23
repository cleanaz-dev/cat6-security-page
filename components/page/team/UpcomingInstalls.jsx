"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/lib/context/TeamProvider";
import { Wrench, MapPin, User } from "lucide-react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function UpcomingInstalls({ jobs, members }) {
  const { getTechNames } = useTeam();

  const columns = [
    columnHelper.accessor("title", {
      header: "Job Title",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{info.getValue()}</span>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{info.row.original.address}</span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("jobType", {
      header: "Type",
      cell: (info) => (
        <p className="capitalize font-medium">
          {info.getValue().toLowerCase()}
        </p>
      ),
    }),
    columnHelper.accessor("technician", {
      header: "Technicians",
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {getTechNames(info.getValue(), members).map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <span className="truncate max-w-[80px]">{tech.name}</span>
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue()?.toLowerCase();
        const isCancelled = status === "cancelled";

        return (
          <Badge
            variant={isCancelled ? "destructive" : "secondary"}
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href={`/team/schedule/${info.row.original.id}`}>View</Link>
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="bg-background border-none shadow-none">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex flex-col md:flex-row justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {" "}
              <Wrench className="h-5 w-5 text-primary" />
              <span className="text-xl sm:text-2xl">Upcoming Jobs</span>{" "}
              <Badge variant="outline" className="">
                {jobs.length} scheduled
              </Badge>
            </div>
            <div className="mt-4 md:mt-0 ">
              <Button asChild className="w-full md:w-auto">
                <Link href="/team/schedule">View Schedule</Link>
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
         {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg">No upcoming jobs scheduled</p>
            <p className="text-sm mt-2">Check back later or create a new job</p>
          </div>
        ) : (
          <>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-left border-b">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="pb-3 px-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-accent/20 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-lg border hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-medium text-primary">{job.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{job.address}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {job.status.toLowerCase()}
                </Badge>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {job.jobType.toLowerCase()}
                  </Badge>
                </div>

                {job.technician.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Techs:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {getTechNames(job.technician, members).map(
                        (tech, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs flex items-center gap-1"
                          >
                            <span className="truncate max-w-[80px]">
                              {tech.name}
                            </span>
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <Button asChild size="sm" className="w-full">
                  <Link href={`/team/schedule/${job.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
             </>
        )}
      </CardContent>
    </Card>
  );
}
