const express = require("express");
const serverless = require("serverless-http");
const redis = require("redis");

const app = express();
const router = express.Router();

// Connect to Redis
const redisClient = redis.createClient({
  url: "redis://localhost:6379" // Replace with your Redis connection string
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