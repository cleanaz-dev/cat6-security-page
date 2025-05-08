import SingleSchedulePage from '@/components/page/team/SingleSchedulePage'
import { getSchedule } from '@/lib/redis'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page({ params }) {
  const { scheduleId } = await params
  const install = await getSchedule(scheduleId)
  if (!install) {
    return notFound
  }

  return (
    <div><SingleSchedulePage install={install} /></div>
  )
}
