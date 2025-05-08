//lib/redis.js

import { createClient } from 'redis';
import { quotelessJson } from 'zod';

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

export async function getAllQuotes() {
  try {
    // Get all quote keys
    const keys = await redis.keys('quoteId:*');
    
    if (!keys || keys.length === 0) {
      console.warn("No quotes found");
      return null;
    }

    // Fetch all quotes in one call
    const quotes = await redis.json.mGet(keys, '$');
    return quotes.flat(); // Flatten the array structure
    
  } catch (error) {
    console.error("Error getting quotes:", error);
    throw error; // Re-throw after logging
  }
}

export async function getAllInstalls(){
  try {
    const keys = await redis.keys('install:*')
    if (!keys || keys.length === 0) {
      console.warn("No installs found");
      return [];
    }

    // Fetch all quotes in one call
    const installs = await redis.json.mGet(keys, '$');
    return installs.flat(); // Flatten the array structure
  
  } catch (error) {
    console.error("Error getting quotes:", error);
    throw error; // Re-throw after logging
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

export async function getSchedule(id) {
  try {
    const install = await redis.json.get(`install:${id}`)
    return install
  } catch (error) {
    console.error(error)
    return null
  }
}

export default redis;