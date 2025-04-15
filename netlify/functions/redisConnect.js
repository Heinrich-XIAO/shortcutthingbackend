const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL, // Ensure you set this environment variable in Netlify
});

// Connect to Redis
client.connect().catch(console.error);

exports.handler = async (event, context) => {
  try {
    // Initialize a list in Redis called 'shortcuts'
    await client.rPush('shortcuts', 'shortcut1', 'shortcut2', 'shortcut3');

    // Example: Get the value of the key from Redis
    const value = await client.get('exampleKey');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Connected to Redis successfully and initialized shortcuts list!',
        value,
      }),
    };
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to Redis' }),
    };
  }
};