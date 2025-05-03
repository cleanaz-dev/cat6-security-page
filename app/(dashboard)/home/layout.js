import { DashboardProvider } from '@/lib/context/DashboardProvider'
import { getAllContacts } from '@/lib/hubspot'
import redis from '@/lib/redis';

import React from 'react'

export default async  function DashboardLayout({children}) {

    const contacts = await getAllContacts()
    const keys = await redis.keys('invoice:*');  
    const quotesRaw = await Promise.all(keys.map(key => redis.get(key)));
    const quotes = quotesRaw.map(q => JSON.parse(q));


  return (
    <div>
      <DashboardProvider data={{ contacts, quotes }}>
      {children}
      </DashboardProvider>
    </div>
  )
}
