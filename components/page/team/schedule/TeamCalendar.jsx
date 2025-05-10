"use client"
import { useState, useRef } from "react";


import { ChevronFirst, ChevronLast, Cctv, PlusCircle } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { NewInstallationDialog } from "../NewInstallationDialog";
import { SelectedInstallationDialog } from "../SelectedInstallationDialog";

export default function TeamCalendar({ installs }) {
  const calendarRef = useRef(null);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [installations, setInstallations] = useState(installs);
  const [selectedDate, setSelectedDate] = useState(new Date());

  
    const handleDateClick = (info) => {
      setSelectedDate(info.date); 
      setShowAddForm(true);
    }
  
    const handleEventClick = (info) => {
      const installation = installations.find(inst => inst.id === info.event.id); // Remove parseInt if IDs are strings
      setSelectedInstallation(installation);
      console.log("Selected installation:", installation); // Verify this logs correctly
    };
  
    const goToPreviousMonth = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentMonth(calendarApi.getDate());
    };
  
    const goToNextMonth = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentMonth(calendarApi.getDate());
    };
  
    const goToToday = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentMonth(calendarApi.getDate());
    };
  
  return (
    <>
      {/* Top Information */}
      <div className="py-4 px-4 space-y-4">
        {/* First Row: Date Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button onClick={goToPreviousMonth} size="icon">
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <Button onClick={goToNextMonth} size="icon">
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={goToToday}>Today</Button>
        </div>

        {/* Second Row: Actions and Stats */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setShowAddForm(true)}
            className=" bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Installation</span>
          </Button>

          <div className="text-sm text-muted-foreground">
          <Button variant="ghost">Pending Jobs: {installs.length}</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="w-full h-full p-4">
          <div className="bg-background rounded-lg shadow h-full">
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={false}
              height="100%"
              events={installations.map((install) => ({
                id: install.id,
                title: install.title,
                start: install.start,
                end: install.end,
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
                extendedProps: {
                  ...install,
                },
              }))}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventContent={(eventInfo) => (
                <div className="flex mx-auto justify-center items-center p-1 text-center">
                  <Cctv className="text-primary" />
                </div>
              )}
            />
          </div>
        </div>

        {/* Installation Details Panel */}
        {selectedInstallation && (
          <SelectedInstallationDialog
            selectedInstallation={selectedInstallation}
            setSelectedInstallation={setSelectedInstallation}
      
          />
        )}
      </div>

      {/* Add Installation Modal */}
      {showAddForm && (
        <NewInstallationDialog
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          selectedDate={selectedDate}
        />
      )}
    </>
  
  )
  
}
