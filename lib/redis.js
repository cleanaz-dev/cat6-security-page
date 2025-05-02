//lib/redis.js

import { createClient } from 'redis';

const redis = createClient({url: process.env.REDIS_URL});

redis.on('error', (err) => console.log('Redis Client Error:', err));

await redis.connect()

export async function getQuote(quoteId) {
  const quoteData = await redis.get(`invoice:${quoteId}`);
  return quoteData ? JSON.parse(quoteData) : null;
}

export async function getData(invoiceId) {
  const data = await redis.get(invoiceId);
  return data ? JSON.parse(data) : null;
}

export default redis;