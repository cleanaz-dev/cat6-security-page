"use client"
import { CalendarClock, MapPin, Phone, User, Mail, Wrench, NotebookText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeam } from '@/lib/context/TeamProvider';

export default function SingleSchedulePage({ install }) {
  const { getTechNames, members } = useTeam()
  // Format date and time
  const formattedDate = new Date(install.start).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = new Date(install.start).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Unified info item component for consistent styling
  const InfoItem = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-start gap-3 ${className}`}>
    
      <Icon className="size-4 mt-0.5 text-foreround flex-shrink-0" />
      
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'Not specified'}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
        <Badge variant={install.status === 'completed' ? 'default' : 'secondary'}>
          {install.status}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Main Job Card - Now using same layout as customer card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <span className='underline decoration-secondary'>Job Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem 
                icon={CalendarClock} 
                label="Scheduled for" 
                value={<>{formattedDate}<br/>{formattedTime}</>} 
              />
              <InfoItem 
                icon={Wrench} 
                label="Job Type" 
                value={install.jobType.toLowerCase()} 
                className='capitalize'
              />
              <InfoItem 
                icon={MapPin} 
                label="Location" 
                value={install.address} 
                className="md:col-span-2" 
              />
              <div className='w-full border-t items-start'>
              <h1 className="text-sm text-muted-foreground">Technician(s)</h1>
                {getTechNames(install.technician, members).map((name, index) => (
                    <div key={index} className="">
                      {name} {name.imageUrl}
                    </div>
                  ))}

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information - Now perfectly matched to job card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className='underline decoration-secondary'>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={User} label="Name" value={install.name} />
              <InfoItem icon={Phone} label="Phone" value={install.phone} />
              <InfoItem icon={Mail} label="Email" value={install.email} />
              <InfoItem 
                icon={NotebookText} 
                label="Contact ID" 
                value={install.contactId} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes Section - Also standardized */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <NotebookText className="h-5 w-5 text-primary" />
              <span className='underline decoration-secondary'>Job Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {install.notes ? (
              <div className="p-3 bg-muted/50 rounded-md whitespace-pre-wrap">
                {install.notes}
              </div>
            ) : (
              <p className="text-muted-foreground">No notes available for this job</p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-accent transition-colors">
            Edit Job
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
}