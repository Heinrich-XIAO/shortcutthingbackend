const redis = require('redis');
const JSON5 = require('json5');

// Create a Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL, // Ensure you set this environment variable in Netlify
});

// Connect to Redis
client.connect().catch(console.error);

exports.handler = async (event, context) => {
  try {
    console.log('Event:', event.body);
    const { uuid } = JSON5.parse(event.body);

    // Fetch all items from the 'shortcuts' list
    const shortcuts = await client.lRange('shortcuts', 0, -1);

    // Find the shortcut with the matching uuid
    const matchingShortcut = shortcuts.find((shortcut) => {
      console.log('Checking shortcut:', shortcut);
      const parsedShortcut = JSON5.parse(shortcut);
      return parsedShortcut.uuid === uuid;
    });

    if (matchingShortcut) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({
          message: 'Shortcut found!',
          shortcut: JSON5.parse(matchingShortcut),
        }),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Shortcut not found' }),
      };
    }
  } catch (error) {
    console.error('Error reading from Redis:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Failed to read from Redis' }),
    };
  }
};
