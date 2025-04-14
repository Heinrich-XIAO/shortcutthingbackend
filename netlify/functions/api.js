const express = require("express");
const serverless = require("serverless-http");
const redis = require("redis");
require("dotenv").config();

const app = express();
const router = express.Router();

// Connect to Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379" // Default to localhost if not set in env
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();

// Define routes
router.get("/hello", (req, res) => {
  res.send("Hello World!");
});

router.get("/redis-test", async (req, res) => {
  try {
    await redisClient.set("test-key", "Hello from Redis!");
    const value = await redisClient.get("test-key");
    res.send({ message: value });
  } catch (err) {
    res.status(500).send({ error: "Redis error", details: err.message });
  }
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);