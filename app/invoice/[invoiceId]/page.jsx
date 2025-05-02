import React from 'react'

export default async function page({ params}) {
  const { invoiceId } = await params;
  return (
    <div>{invoiceId}</div>
  )
}
