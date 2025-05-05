"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContact } from "@/lib/context/ContactProvider";
import Link from "next/link";
import React, { useState } from "react";
import AddContactDialog from "./AddContactDialog";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ContactsPage() {
  const { contacts } = useContact();
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      id: "contact", // required for filtering/sorting virtual columns
      header: "Contact",
      accessorFn: (row) =>
        `${row.firstname ?? ""} ${row.lastname ?? ""} ${row.email ?? ""}`,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>
            {row.original.firstname} {row.original.lastname}
          </span>
          <span className="text-muted-foreground">{row.original.email}</span>
        </div>
      ),
    },
 
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <span>{row.original.phone}</span>,
      },
      {
        accessorKey: "department",
        header: "Company",
        cell: ({ row }) => <span>{row.original.department}</span>,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button asChild size="sm">
              <Link href={`/contacts/${row.original.hs_object_id}`}>View</Link>
            </Button>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </div>
        ),
      },
  ]
 

  const table = useReactTable({
    data: contacts,
    columns,
    state: {
      globalFilter: searchTerm,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setSearchTerm,
  });

  return (
    <div className="container px-2 md:px-0 mx-auto py-4 md:py-8">
      <header className="mb-8">
        <div>
          <h1 className="text-lg md:text-3xl font-bold mb-4">Contacts</h1>
        </div>
        <div className="flex gap-4 w-full">
        <Input
            placeholder="Filter contacts..."
            value={table.getColumn("contact")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("contact")?.setFilterValue(event.target.value)
            }
          />
          <AddContactDialog />
        </div>
      </header>
      <main>
        {table.getRowModel().rows?.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max divide-y">
              <thead className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className={`px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          header.id === "email" || header.id === "phone"
                            ? "hidden sm:table-cell"
                            : header.id === "department"
                            ? "hidden md:table-cell"
                            : ""
                        }`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm ${
                          cell.column.id === "email" ||
                          cell.column.id === "phone"
                            ? "hidden sm:table-cell"
                            : cell.column.id === "department"
                            ? "hidden md:table-cell"
                            : "font-medium"
                        }`}
                      >
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
        ) : (
          <div className="text-center py-12 text-gray-500">
            No contacts found
          </div>
        )}
      </main>
    </div>
  );
}