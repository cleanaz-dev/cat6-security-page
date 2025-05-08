"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useState } from 'react';

export function ClientSearch({ clients, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    const searchString = `${client.firstname} ${client.lastname || ''} ${client.email} ${client.phone}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative ">
    
      <div className='flex gap-1'>
      <Input
        type="text"
        placeholder="Search clients..."
        className="w-full p-2  "
        value={selectedClient ? `${selectedClient.firstname} ${selectedClient.lastname || ''}` : searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(e.target.value.length > 0);
        }}
      />
      <Button
        disabled={!selectedClient}
        onClick={() => setSelectedClient(null)}
      >
        <X/>
      </Button>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border max-h-60 overflow-auto">
          {filteredClients.length === 0 ? (
            <div className="p-2 text-gray-500">No clients found</div>
          ) : (
            filteredClients.map(client => (
              <div
                key={client.hs_object_id}
                className="p-2 hover:bg-accent-muted cursor-pointer"
                onClick={() => {
                  setSelectedClient(client);
                  onSelect(client);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <div className="font-medium">
                  {client.firstname} {client.lastname || ''}
                </div>
                <div className="text-sm text-gray-600">
                  {client.email} · {client.phone}
                </div>
                <div className="text-xs text-gray-500">
                  {client.project_type} · {client.budget}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

