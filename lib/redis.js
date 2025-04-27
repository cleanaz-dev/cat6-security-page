//lib/redis.js
// import { createClient } from "redis"

// const redis =  await createClient({ url: process.env.REDIS_URL }).connect();
// redis.on("error", (err) => console.error(`Error connecting to Redis: ${err}`));

// await redis.connect();

// export default redis


import { createClient } from 'redis';

const redis = createClient({url: process.env.REDIS_URL});

redis.on('error', (err) => console.log('Redis Client Error:', err));

await redis.connect()

export default redis;