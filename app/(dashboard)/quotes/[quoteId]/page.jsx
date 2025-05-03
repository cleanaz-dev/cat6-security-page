// app/quote/[quoteId]/page.tsx
import SingleQuotePage from '@/components/page/quotes/SingleQuotePage';
import { getAllActivityForContact } from '@/lib/hubspot';
import redis from '@/lib/redis';
import { notFound } from 'next/navigation';


export default async function Page({ params }) {
  const { quoteId } = await params;
  // 1. Construct the EXACT same key used when storing
  const redisKey = `invoice:${quoteId}`;
  
  // 2. Use redis.get() - this IS correct for key-value lookup
  const invoiceData = await redis.get(redisKey);

  if (!invoiceData) {
    console.error(`No data found for key: ${redisKey}`);
    return notFound();
  }

  // 3. Parse the JSON data
  const quote = JSON.parse(invoiceData);
  const contactEmail = quote.client.email
  const activities = await getAllActivityForContact(contactEmail);



  return <SingleQuotePage quote={quote} activities={activities}/>;
}