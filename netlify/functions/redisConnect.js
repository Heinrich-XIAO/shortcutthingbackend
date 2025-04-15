const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL, // Ensure you set this environment variable in Netlify
});

// Connect to Redis
client.connect().catch(console.error);

exports.handler = async (event, context) => {
  try {
    const { uuid } = JSON.parse(event.body);

    // Fetch all items from the 'shortcuts' list
    const shortcuts = await client.lRange('shortcuts', 0, -1);

    // Find the shortcut with the matching uuid
    const matchingShortcut = shortcuts.find((shortcut) => {
      const parsedShortcut = JSON.parse(shortcut);
      return parsedShortcut.uuid === uuid;
    });

    if (matchingShortcut) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Shortcut found!',
          shortcut: JSON.parse(matchingShortcut),
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Shortcut not found' }),
      };
    }
  } catch (error) {
    console.error('Error reading from Redis:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read from Redis' }),
    };
  }
};
