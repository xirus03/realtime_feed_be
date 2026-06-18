import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";


import app from "./app.js";
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware.js";
import registerSocketEvents from "./socket/index.js";
import { waitForDb } from "./db/index.js";
import { pubClient, subClient, connectRedis } from "./lib/redis.js";

dotenv.config();

const PORT = process.env.PORT || 9000;

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);

// Create Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Start the server with database and Redis setup
async function start() {
  try {
    // Wait for the database to be ready before starting the server
    await waitForDb();
    console.log("Database is ready");

    // redis connection and Socket.IO adapter setup
    await connectRedis();
    console.log("Connected to Redis");

    // attach Redis adapter to Socket.IO
    io.adapter(createAdapter(pubClient, subClient));
    console.log("Socket.IO Redis adapter configured");

    // Socket.IO authentication middleware and event registration
    io.use(socketAuthMiddleware);
    registerSocketEvents(io);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
}

start();
