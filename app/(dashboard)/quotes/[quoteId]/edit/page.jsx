import EditQuotePage from '@/components/page/quotes/EditQuotePage'
import { getQuoteById } from '@/lib/redis'
import React from 'react'

export default async function page({params}) {
  const { quoteId } = await params
  const quote = await getQuoteById(quoteId)

  return (
    <div><EditQuotePage quote={quote} /></div>
  )
}
