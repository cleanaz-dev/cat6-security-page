import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeam } from "@/lib/context/TeamProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeamInstalls({ installs }) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("scheduled");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { getTechNames, members } = useTeam();

  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") return installs;
    return installs.filter((install) => install.status === statusFilter);
  }, [installs, statusFilter]);

  const columns = [
    {
      accessorKey: "name",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{row.original.name}</div>
          <p className="text-muted-foreground text-xs">
            Install ID: {row.original.id.slice(0, 6)}
          </p>
        </div>
      ),
    },

    {
      accessorKey: "jobDetails",
      header: "Job Details",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium capitalize">
            {row.original.jobType}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">
            {new Date(row.original.start).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "techs",
      header: "Techs",
      cell: ({ row }) => {
        const techDetails = getTechNames(row.original.technician, members);

        return (
          <div>
            <div className="flex flex-wrap gap-1">
              {techDetails.map((tech, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Badge
            variant={
              row.original.status === "complete"
                ? "success"
                : row.original.status === "scheduled"
                ? "secondary"
                : "warning"
            }
            className="w-fit text-xs capitalize mt-1"
          >
            {row.original.status}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/team/schedule/${row.original.id}`}>
            <span className="text-xs">View</span>
          </Link>
        </Button>
      ),
    },
  ];
  const table = useReactTable({
    data: filteredData, // Use the filtered data
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchStr = filterValue.toLowerCase();
      return (
        row.original.name.toLowerCase().includes(searchStr) ||
        row.original.jobType.toLowerCase().includes(searchStr) ||
        row.original.technician.some((t) => t.toLowerCase().includes(searchStr))
      );
    },
  });

  return (
    <div className="py-4 px-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search installs..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter} // Fixed this line
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isMobile ? (
        // Mobile Card View
        <div className="grid gap-4">
          {table.getRowModel().rows?.map((row) => (
            <div key={row.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{row.original.name}</div>
                <Badge
                  variant={
                    row.original.status === "complete"
                      ? "success"
                      : row.original.status === "scheduled"
                      ? "default"
                      : "warning"
                  }
                  className="capitalize"
                >
                  {row.original.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {row.original.jobType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(row.original.start).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {row.original.technician.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      Tech {i + 1}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/team/schedule/${row.original.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        // Desktop Table View
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination (works for both views) */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
