import ThankYouPage from '@/components/page/thank-you/ThankYouPage'
import redis from '@/lib/redis'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page({params}) {
  const { id } = await params
  const data = await redis.json.get(`callRequest:${id}`)
  console.log("call request Thank you page data:", data)

  if (!data) {
    return notFound()
  }

  return (
    <div><ThankYouPage data={data} /></div>
  )
}
