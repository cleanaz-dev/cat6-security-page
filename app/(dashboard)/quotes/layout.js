// app/(dashboard)/quotes/layout.js
import { QuoteProvider } from "@/lib/context/QuoteProvider";
import { getStripeProducts } from "@/lib/stripe";
import { getAllContacts } from "@/lib/hubspot";
import redis from "@/lib/redis";

export default async function QuoteLayout({ children }) {
  // Fetch all data in parallel
  const [stripeProducts, hubspotContacts, quotes] = await Promise.all([
    getStripeProducts(),
    getAllContacts(),
    (async () => {
    
      const keys = await redis.keys('quoteId:*');
      const quotes = await Promise.all(keys.map(key => redis.json.get(key)))
      return quotes
    })()
  ]);

  return (
    <QuoteProvider data={{ stripeProducts, hubspotContacts, quotes }}>
      <div>{children}</div>
    </QuoteProvider>
  );
}