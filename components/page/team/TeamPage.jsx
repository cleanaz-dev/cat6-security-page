"use client"

import { Button } from '@/components/ui/button';
import { useTeam } from '@/lib/context/TeamProvider';
import Link from 'next/link';
import React from 'react';


export default function TeamPage() {
  const { members } = useTeam()
  console.log("members", members)
  return (
    <div className=" py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className='flex justify-between'>
        <h1 className="text-2xl font-bold  mb-12">Team</h1>
        <Button asChild>
          <Link href="/team/schedule">
            View Schedule
          </Link>
        </Button>
        </header>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {members && members.length > 0 ? (
            members.map((member) => {
         
              return (
                <div
                  key={member.id}
                  className="p-6 text-center"
                >
                  <img
                    src={member.imageUrl || 'https://via.placeholder.com/150'}
                    alt={member.fullName}
                    className="size-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h2 className="text-xl font-semibold">{member.fullName}</h2>
                  <h2 className="text-lg capitalize text-muted-foreground">{member.role}</h2>
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