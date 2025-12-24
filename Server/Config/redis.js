const { createClient } = require("redis");

const redisClient = createClient({
    // 1. Ensure your .env URL starts with rediss://
    url: process.env.REDIS_URL || "rediss://127.0.0.1:6379",
    socket: {
        // 2. These settings help prevent unexpected socket closures
        tls: true,
        rejectUnauthorized: false, // Often needed for cloud-managed instances
        keepAlive: 5000, 
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
});

redisClient.on("connect", () => {
    console.log("Redis Connected Successfully");
});

// It is critical to log the full error to see if it's an IP whitelist issue
redisClient.on("error", (err) => {
    console.log("Redis Client Error:", err.message);
});

redisClient.connect().catch(console.error);

module.exports = redisClient;