"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, Phone, Mail, User } from "lucide-react";

import Link from "next/link";
import { useContact } from "@/lib/context/ContactProvider";
import { Label } from "@/components/ui/label";
import { ClipboardList } from "lucide-react";
import { DollarSign } from "lucide-react";
import { LayoutGrid } from "lucide-react";
import { Camera } from "lucide-react";
import { Calendar } from "lucide-react";
import { Info } from "lucide-react";
import { Activity } from "lucide-react";

export default function SingleContactPage({ contactId }) {
  const { contacts } = useContact();

  // Filter contact by id
  const contact = contacts.find((c) => c.hs_object_id === contactId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
      {/* Back button */}
      <Button asChild variant="ghost" className="mb-6 pl-0 cursor-pointer">
        <Link href="/contacts">
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Contacts
        </Link>
      </Button>

      {/* Main Contact Card */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20 text-primary md:block hidden">
              <AvatarImage src="/" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg md:text-2xl font-bold ">{contact.firstname}</h1>
              <div className="mt-2 space-y-1">
                <p className="flex gap-2 items-center text-muted-foreground text-sm md:text-base">
                  <Mail className="size-5 text-primary-muted" />
                  {contact.email}
                </p>
                <p className="flex gap-2 items-center text-muted-foreground text-sm md:text-base">
                  <Phone className="size-5 text-primary-muted" />
                  {contact.phone}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex gap-2 items-center">
              <Info className="text-primary"/>
              <h1 className="text-lg md:text-2xl">Project Details</h1>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Budget */}
            <div className="flex flex-col p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <Label className="text-lg md:text-xl">Budget</Label>
              </div>
              <p className="mt-1 font-medium text-primary">
                {contact.budget || "Not specified"}
              </p>
            </div>

            {/* Project Type */}
            <div className="flex flex-col p-4  bg-muted/50">
              <div className="flex justify-between items-center">
                <Label className="text-lg md:text-xl">Type</Label>
              </div>
              <p className="mt-1 font-medium capitalize text-primary">
                {contact.project_type || "Not specified"}
              </p>
            </div>

            {/* Camera Count */}
            <div className="flex flex-col p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <Label className="text-lg md:text-xl">Cameras</Label>
              </div>
              <p className="mt-1  font-medium text-primary">
                {contact.camera_count || "Not specified"}
              </p>
            </div>

            {/* Timeline */}
            <div className="flex flex-col p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <Label className="text-lg md:text-xl">Timeline</Label>
              </div>
              <p className="mt-1 font-medium text-primary capitalize">
                {contact.timeline || "Flexible"}
              </p>
            </div>
            <div className="col-span-full p-4 bg-muted/50">
              <Label className="text-lg md:text-xl">CCTV Features</Label>
              {contact.cctv_features?.split(",").map((f, i) => (
                <p key={i} className="mt-1 text-primary capitalize">
                  {f.trim()}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            <span className="flex gap-2 items-center">
              <Activity className="text-primary" />
              <h1 className="text-lg md:text-2xl">Activity</h1>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No recent activity</p>
        </CardContent>
      </Card>
    </div>
  );
}
