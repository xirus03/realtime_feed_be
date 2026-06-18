import { createClient } from "redis";

// Create a Redis client for publishing messages
export const pubClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

// Create a duplicate client for subscribing to channels
export const subClient = pubClient.duplicate();

pubClient.on("error", (err) => console.error("Redis Pub Error", err));
subClient.on("error", (err) => console.error("Redis Sub Error", err));

export const connectRedis = async () => {

  if (!pubClient.isOpen) await pubClient.connect();
  if (!subClient.isOpen) await subClient.connect();

  console.log("Redis connected (pub + sub)");
};