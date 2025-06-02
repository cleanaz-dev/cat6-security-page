
import TimelinePage from '@/components/page/contacts/TimelinePage'
import { getContactById } from '@/lib/hubspot'
import React from 'react'

export default async function page({ params }) {
  const { contactId } = await params
  const contact = await getContactById(contactId)

  
  return (
    <div><TimelinePage contact={contact}/></div>
  )
}
