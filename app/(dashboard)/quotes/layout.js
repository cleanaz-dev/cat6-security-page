// app/(dashboard)/quotes/layout.js
import { QuoteProvider } from "@/lib/context/QuoteProvider";
import { getStripeProducts } from "@/lib/stripe";
import { getAllContacts } from "@/lib/hubspot";
import redis from "@/lib/redis";

export default async function QuoteLayout({ children }) {
  const stripeProducts = await getStripeProducts();
  const hubspotContacts = await getAllContacts();
  
  const keys = await redis.keys('invoice:*');  
  const quotesRaw = await Promise.all(keys.map(key => redis.get(key)));
  const quotes = quotesRaw.map(q => JSON.parse(q));

  // console.log("Quotes:", quotes);



  return (
    <QuoteProvider data={{ stripeProducts, hubspotContacts, quotes }}>
      <div>{children}</div>
    </QuoteProvider>
  );
}