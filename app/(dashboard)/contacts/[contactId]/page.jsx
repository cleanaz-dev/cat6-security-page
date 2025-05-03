import SingleContactPage from '@/components/page/contacts/SingleContactPage';
import React from 'react'

export default async function page({ params }) {
  const { contactId } = await params;

  return (
    <div><SingleContactPage contactId={contactId}/></div>
  )
}
