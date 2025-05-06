// app/quote/[quoteId]/page.tsx
import SingleQuotePage from '@/components/page/quotes/SingleQuotePage';

import redis from '@/lib/redis';
import { notFound } from 'next/navigation';


export default async function Page({ params }) {
  const { quoteId } = await params;

  const redisKey = `quoteId:${quoteId}`;
  const quote = await redis.json.get(redisKey);

  if (!quote) {
    console.error(`No data found for key: ${redisKey}`);
    return notFound();
  }


  return <SingleQuotePage quote={quote} />;
}