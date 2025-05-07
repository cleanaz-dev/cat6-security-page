import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';


export default function TeamPage({ members = [] }) {
  return (
    <div className=" py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className='flex justify-between'>
        <h1 className="text-3xl font-bold  mb-12">Team</h1>
        <Button asChild>
          <Link href="/team/schedule">
            View Schedule
          </Link>
        </Button>
        </header>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {members && members.length > 0 ? (
            members.map((member) => {
              const role = member.publicMetadata?.role || 'No role assigned';
              return (
                <div
                  key={member.id}
                  className="shadow-md p-6 text-center"
                >
                  <img
                    src={member.imageUrl || 'https://via.placeholder.com/150'}
                    alt={member.fullName}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h2 className="text-xl font-semibold">{member.fullName}</h2>
                  <h2 className="text-lg capitalize">{role}</h2>
                </div>
              );
            })
          ) : (
            <p className="text-center col-span-full">No team members found.</p>
          )}
        </div>
        <div>
         
        </div>
      </div>
    </div>
  );
}