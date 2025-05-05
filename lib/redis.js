//lib/redis.js

import { createClient } from 'redis';

const redis = createClient({url: process.env.REDIS_URL});

redis.on('error', (err) => console.log('Redis Client Error:', err));

await redis.connect()

export async function getQuote(quoteId) {
  const quoteData = await redis.get(`invoice:${quoteId}`);
  return quoteData ? JSON.parse(quoteData) : null;
}

export async function setQuoteStatus(quoteId, status, url) {
  // 1. Get the existing quote
  const quote = JSON.parse(await redis.get(`invoice:${quoteId}`));
  
  // 2. Update only what changed
  quote.status = status;
  if (url) quote.url = url;
  
  // 3. Save back to Redis
  await redis.set(`invoice:${quoteId}`, JSON.stringify(quote));
  
  return quote; // Return the updated quote
}

export async function getData(invoiceId) {
  const data = await redis.get(invoiceId);
  return data ? JSON.parse(data) : null;
}

export async function archiveQuote(quoteId, status = "archive") {

const hSetResult = await redis.hSet(`invoice:${quoteId}`, {
  status: status
})

return hSetResult
}

export default redis;