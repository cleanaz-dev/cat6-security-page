"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/lib/context/TeamProvider";
import { Calendar, List } from "lucide-react";
import TeamCalendar from "./schedule/TeamCalendar";
import TeamInstalls from "./schedule/TeamInstalls";
import { BicepsFlexed } from "lucide-react";

export default function TeamSchedule() {
  const { installs = [] } = useTeam();
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <header className="py-6 px-4 flex justify-between">
        <h1 className="text-3xl">CCTV Schedule</h1>
        <Button onClick={() => setShowCalendar((prev) => !prev)}>
          {showCalendar ? (
            <>
              Show Installations <BicepsFlexed className="ml-2 h-4 w-4" />
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
        <TeamInstalls installs={installs} />
      )}
    </div>
  );
}
