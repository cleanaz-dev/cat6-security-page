"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContact } from "@/lib/context/ContactProvider";
import Link from "next/link";
import React, { useState } from "react";
import AddContactDialog from "./AddContactDialog";

export default function ContactsPage() {
  const { contacts } = useContact()
  const [searchTerm, setSearchTerm] = useState("");



  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
      
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div>
          <h1 className="text-lg md:text-3xl font-bold mb-4">Contacts</h1>
        </div>
        <div className="flex gap-4 w-full">
          <Input
            type="text"
            placeholder="Search contacts..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddContactDialog />
        </div>
      </header>
      <main>
        {filteredContacts.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max divide-y divide-gray-200">
              <thead className="bg-muted sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-foreground divide-y divide-gray-200">
                {filteredContacts.map((contact,index) => (
                  <tr key={index}>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contact.firstname} {contact.lastname}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {contact.email}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {contact.phone}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {contact.department}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button asChild size="sm">
                        <Link href={`/contacts/${contact.hs_object_id}`}>
                        View
                        </Link>
                        </Button>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </td>
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
