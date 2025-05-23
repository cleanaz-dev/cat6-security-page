"use client";

import { useTeam } from "@/lib/context/TeamProvider";

import React from "react";
import Members from "./Members";
import UpcomingInstalls from "./UpcomingInstalls";
import OpenTickets from "./tickets/OpenTickets";

export default function TeamPage() {
  const { installs, getTechNames, members, openTickets } = useTeam();


  return (
    <>
      <Members members={members} />
      <UpcomingInstalls
        members={members}
        jobs={installs.filter(i => i.status !== "complete" && i.status !== "cancelled")}
      />
      <OpenTickets openTickets={openTickets} />
    </>
  );
}
