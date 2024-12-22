const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// Add error handling
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis and handle asynchronous connection
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("Redis client connected");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      process.exit(1); // Exit the process if the connection fails
    }
  }
};

// Call the connection function immediately
connectRedis();

// Export the connected client
module.exports = redisClient;
