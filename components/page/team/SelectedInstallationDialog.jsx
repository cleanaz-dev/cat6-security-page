'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export function SelectedInstallationDialog({ selectedInstallation, setSelectedInstallation, TECHNICIANS }) {
  return (
    <Dialog open={!!selectedInstallation} onOpenChange={() => setSelectedInstallation(null)}>
      <DialogContent className="max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Installation Details</DialogTitle>
          <DialogDescription>View information</DialogDescription>
          
        </DialogHeader>

        {selectedInstallation && (
          <div className="space-y-6">
            <div className='grid grid-cols-2'>
            <div>
              <Label>Name</Label>
              <p className='text-muted-foreground'>{selectedInstallation.client}</p>
              <Label>Address</Label>
              <p className="text-muted-foreground">{selectedInstallation.address}</p>
              </div>
            <div>
             
              <Label>Phone</Label>
              <p className='text-muted-foreground'>###-###-####</p>
              <Label>Email</Label>
              <p className='text-muted-foreground'>email@email.com</p>
         </div>
            </div>
            <div>
            <Label>Invoice</Label>
            <Link href="">
            <p className='decoration-primary underline italic text-sm'>Invoice URL</p>
            </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <p className='text-muted-foreground'>{format(new Date(selectedInstallation.start), 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <Label>Time</Label>
                <p className='text-muted-foreground'>
                  {format(new Date(selectedInstallation.start), 'h:mm a')} -{' '}
                  {format(new Date(selectedInstallation.end), 'h:mm a')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Technician</Label>
                <div className="flex items-center mt-1">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: TECHNICIANS.find(t => t.id === selectedInstallation.technicianId)?.color,
                    }}
                  ></div>
                  <p>{TECHNICIANS.find(t => t.id === selectedInstallation.technicianId)?.name}</p>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  className={`capitalize ${
                    selectedInstallation.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : selectedInstallation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedInstallation.status}
                </Badge>
              </div>
            </div>

           

            {selectedInstallation.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="mt-1 p-2 bg-gray-50 rounded">{selectedInstallation.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 cursor-pointer">
                View Full Details
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
