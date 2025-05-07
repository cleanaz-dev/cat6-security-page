"use client"

import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SelectedInstallationDialog } from './SelectedInstallationDialog';
import { NewInstallationDialog } from './NewInstallationDialog';
import { Cctv } from 'lucide-react';
import { ChevronFirst } from 'lucide-react';
import { ChevronLast } from 'lucide-react';


// Sample installation technicians
const TECHNICIANS = [
  { id: 1, name: 'John Smith', color: '#3b82f6' },
  { id: 2, name: 'Maria Garcia', color: '#ef4444' },
  { id: 3, name: 'David Lee', color: '#10b981' },
  { id: 4, name: 'Emma Johnson', color: '#f59e0b' },
];

const jobTypes = [
  {id: 1, name: "New Install"},
  {id: 2, name: "Repair"}, 
]

export default function TeamSchedule() {
  const calendarRef = useRef(null);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());



  // Sample installation data
  const [installations, setInstallations] = useState([
    {
      id: 1,
      title: 'ABC Corp - 8 Cameras',
      client: 'ABC Corporation',
      address: '123 Business St, Suite 500',
      start: '2023-11-15T09:00:00',
      end: '2023-11-15T13:00:00',
      technicianId: 1,
      status: 'confirmed',
      cameras: 8,
      systemType: 'IP Network',
      notes: 'Need access to server room'
    },
    {
      id: 2,
      title: 'XYZ Retail - 12 Cameras',
      client: 'XYZ Retail',
      address: '456 Mall Drive',
      start: '2023-11-16T13:00:00',
      end: '2023-11-16T19:00:00',
      technicianId: 2,
      status: 'confirmed',
      cameras: 12,
      systemType: 'Analog HD',
      notes: 'After hours installation'
    },
    {
      id: 3,
      title: 'Thompson Residence - 4 Cameras',
      client: 'Residential - Thompson',
      address: '789 Oak Lane',
      start: '2023-11-17T11:00:00',
      end: '2023-11-17T14:00:00',
      technicianId: 3,
      status: 'pending',
      cameras: 4,
      systemType: 'Wireless',
      notes: 'Gate code required'
    },
  ]);

  const [newInstallation, setNewInstallation] = useState({
    title: '',
    client: '',
    address: '',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 2)),
    technicianId: 1,
    status: 'scheduled',
    notes: '',
    jobType: 'New Install'
  });

  const handleDateClick = (arg) => {
    setNewInstallation(prev => ({
      ...prev,
      start: arg.date,
      end: new Date(arg.date.getTime() + 2 * 60 * 60 * 1000) // Default 2 hour duration
    }));
    setShowAddForm(true);
  };

  const handleEventClick = (info) => {
    const installation = installations.find(inst => inst.id === parseInt(info.event.id));
    setSelectedInstallation(installation);
  };

  const handleAddInstallation = () => {
    const installation = {
      ...newInstallation,
      id: installations.length + 1,
      title: `${newInstallation.client} - ${newInstallation.cameras} Cameras`,
      start: newInstallation.start.toISOString(),
      end: newInstallation.end.toISOString()
    };
    
    setInstallations([...installations, installation]);
    setShowAddForm(false);
    setNewInstallation({
      title: '',
      client: '',
      address: '',
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 2)),
      technicianId: 1,
      status: 'scheduled',
      cameras: 1,
      systemType: 'IP Network',
      notes: ''
    });
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
    <div className="flex flex-col h-screen ">
      <header className='text-center py-6'>
        <h1 className='text-3xl'>CCTV Schedule</h1>
      </header>

      {/* Header */}
      <div className=" py-4 px-4 flex justify-between items-center">
       
        <div className="flex space-x-2">
        <Button onClick={goToPreviousMonth} size="icon">
          <ChevronFirst />
        </Button>
        
        <h2 className='my-2'>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        
        <Button onClick={goToNextMonth} size="icon">
          <ChevronLast />
        </Button>
        </div>
        <div>
        <Button onClick={goToToday} className="today-button">
          Today
          </Button> 
          </div>
          
       
      </div>
      <div>
      <Button
            onClick={() => setShowAddForm(true)}
            className="ml-4 px-4 py-2 bg-green-600 text-white  hover:bg-green-700 flex items-center"
          >
        
              <PlusCircle />
            Add Installation
          </Button>
          </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="w-full h-full p-4">
          <div className="bg-background rounded-lg shadow h-full">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              height="100%"
              events={installations.map(install => ({
                id: install.id,
                title: install.title,
                start: install.start,
                end: install.end,
                backgroundColor: TECHNICIANS.find(t => t.id === install.technicianId)?.color || '#3b82f6',
                borderColor: TECHNICIANS.find(t => t.id === install.technicianId)?.color || '#3b82f6',
                extendedProps: {
                  ...install
                }
              }))}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventContent={(eventInfo) => (
                <div className="flex mx-auto justify-center items-center p-1 text-center">
                 <Cctv className='text-primary'/>
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
            TECHNICIANS={TECHNICIANS}  />
        )}
      </div>

      {/* Add Installation Modal */}
      {showAddForm && (
        <NewInstallationDialog
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          newInstallation={newInstallation}
          setNewInstallation={setNewInstallation}
          handleAddInstallation={handleAddInstallation}
          TECHNICIANS={TECHNICIANS} 
          jobTypes={jobTypes}

        />
      )}
    </div>
  );
}