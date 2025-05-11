"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/lib/context/TeamProvider";
import { Calendar, List } from "lucide-react";
import TeamCalendar from "./schedule/TeamCalendar";
import TeamInstalls from "./schedule/TeamInstalls";


export default function TeamSchedule() {
  const { installs = [] } = useTeam();
  const [showCalendar, setShowCalendar] = useState(false);
const sortedInstalls = installs.sort((a, b) => 
  new Date(a.start) - new Date(b.start));
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-4 flex justify-between">
        <h1 className="text-3xl">Schedule</h1>
        <Button onClick={() => setShowCalendar((prev) => !prev)}>
          {showCalendar ? (
            <>
              Show Installations <List className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Calendar <Calendar className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </header>

      {/* Toggle content */}
      {showCalendar ? (
        <TeamCalendar installs={installs} />
      ) : (
        <TeamInstalls installs={sortedInstalls} />
      )}
    </div>
  );
}
