//lib/redis.js

import { createClient } from 'redis';

const redis = createClient({url: process.env.REDIS_URL});

redis.on('error', (err) => console.log('Redis Client Error:', err));

await redis.connect()

export async function getQuote(quoteId) {
  try {
    const quoteData = await redis.json.get(`quoteId:${quoteId}`);
    if (!quoteData) {
      console.warn(`No quote found for ID: ${quoteId}`);
      return null;
    }
    return quoteData;
  } catch (error) {
    console.error(`Error retrieving quote ${quoteId}:`, error);
    throw error;
  }
}

export async function setQuoteStatus(quoteId, status) {
  const key = `quoteId:${quoteId}`;

  // 1. Ensure the quote exists before updating
  const exists = await redis.exists(key);
  if (!exists) {
    throw new Error(`Quote with ID ${quoteId} not found`);
  }

  // 2. Set just the `status` field in the JSON document
  await redis.json.set(key, '.status', status);

  // 3. Optionally return the updated status
  return { quoteId, status };
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