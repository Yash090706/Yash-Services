const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || process.env.INTERNAL_REDIS_URL,
    socket: {
        // We remove 'tls: true' here because rediss:// in the URL handles it.
        // But we keep 'rejectUnauthorized' for cloud compatibility.
        rejectUnauthorized: false, 
        keepAlive: 5000
    }
});

redisClient.on("connect", () => console.log("Redis Connected Successfully"));
redisClient.on("error", (err) => console.log("Redis Client Error:", err.message));

redisClient.connect().catch(console.error);

module.exports = redisClient;