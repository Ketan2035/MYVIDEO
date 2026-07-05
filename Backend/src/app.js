import express from "express";
import { createServer } from "node:http";
import { connectToSocket } from "./controllers/socketManager.js";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import meetingRoutes from "./routes/meetings.routes.js";
import { env } from "./config/env.js";

const app = express();
const server = createServer(app);

connectToSocket(server, env.corsOrigins);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || env.corsOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express.json({ limit: env.jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: env.jsonLimit }));

let databaseStatus = {
    state: "disconnected",
    host: null,
    lastError: null
};

app.get("/", (req, res) => {
    res.status(200).json({
        message: "MyVideo API is running",
        health: "/health"
    });
});

app.get("/health", (req, res) => {
    const mongoState = mongoose.connection.readyState;
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        database: {
            ...databaseStatus,
            readyState: mongoState
        }
    });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meetings", meetingRoutes);

const PORT = env.port;

const connectToDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const connectionDb = await mongoose.connect(env.mongodbUri, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });
        databaseStatus = {
            state: "connected",
            host: connectionDb.connection.host,
            lastError: null
        };
        console.log(`MongoDB Connected: ${connectionDb.connection.host}`);
    } catch (err) {
        databaseStatus = {
            state: "error",
            host: null,
            lastError: err.message
        };
        console.error("MongoDB Connection Error:", err.message);
    }
};

mongoose.connection.on("disconnected", () => {
    databaseStatus = {
        ...databaseStatus,
        state: "disconnected"
    };
});

mongoose.connection.on("reconnected", () => {
    databaseStatus = {
        state: "connected",
        host: mongoose.connection.host,
        lastError: null
    };
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the other server or set a different PORT.`);
        process.exit(1);
    }

    console.error("Server error:", err);
    process.exit(1);
});

const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        await mongoose.connection.close(false);
        process.exit(0);
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToDatabase();
});
