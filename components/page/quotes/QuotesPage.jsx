"use client";
import { useQuote } from "@/lib/context/QuoteProvider";
import Link from "next/link";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


export default function QuotesPage() {
  const { quotes = [], badgeVariant } = useQuote();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);


  

  const columns = [
    {
      accessorKey: "id",
      header: "Quote #",
      cell: ({ row }) => {
        const index = quotes.findIndex((q) => q.id === row.original.id) + 1;
        return `#${index}`;
      },
    },
    {
      id: "client_name", // Use a valid column ID
      accessorFn: (row) => row.client?.name || "No client", // Extract nested property
      header: "Client",
      cell: ({ row }) => row.getValue("client_name") || "No client",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={badgeVariant[row.original.status]}>
         <span className="capitalize">{row.original.status}</span> 
        </Badge>
      ),
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => `$${(row.original.total || 0).toFixed(2)}`,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/quotes/${row.original.id}`}>View</Link>
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: quotes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="container px-2 md:px-0 mx-auto py-4 md:py-8">
      <header className="mb-8">
        <div>
          <h1 className="text-lg md:text-3xl font-bold mb-4">Quotes</h1>
        </div>
        <div className="flex gap-4 w-full">
          <Input
            placeholder="Filter quotes..."
            value={table.getColumn("client_name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("client_name")?.setFilterValue(event.target.value)
            }
          />
          <Link href="/quotes/create-quote">
            <Button  variant="outline">+ New Quote</Button>
          </Link>
        </div>
      </header>

      {/* Table for desktop */}
      <div className="hidden md:block rounded-md border ">
        <Table>
          <TableHeader className="bg-muted" >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const colId = header.column.id;
                  const isHiddenMobile =
                    colId === "status" || colId === "createdAt";
                  return (
                    <TableHead
                      key={header.id}
                      className={isHiddenMobile ? "hidden md:table-cell" : ""}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const colId = cell.column.id;
                    const isHiddenMobile =
                      colId === "status" || colId === "createdAt";
                    return (
                      <TableCell
                        key={cell.id}
                        className={isHiddenMobile ? "hidden md:table-cell" : ""}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No quotes available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards for mobile */}
      <div className="md:hidden space-y-3">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="border rounded-md  shadow-sm text-sm "
            >
              <header className="flex justify-between items-start mb-1 border-b px-2 py-3 bg-accent-muted">
                <span className="text-gray-500">
                  Quote: #
                  {quotes.findIndex((q) => q.id === row.original.id) + 1}
                </span>
                <Badge variant={badgeVariant[row.original.status]}>
                <span className="capitalize">{row.original.status}</span>  
                </Badge>
              </header>
              <main className="px-2 py-3">
              <div className="font-medium text-base mb-1 truncate text-primary ">
                {row.original.client?.name || "No client"}
              </div>
              <div className="text-sm mb-1">
                ${(row.original.total || 0).toFixed(2)}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 mb-2">
                  Created at:{" "}
                  {new Date(row.original.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 text-right">
                  <Link href={`/quotes/${row.original.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                  {row.original.url && (
                    <Button asChild size="sm">
                      <Link href={row.original.url}>
                        PDF
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              </main>
             
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No quotes available
          </div>
        )}
      </div>

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
