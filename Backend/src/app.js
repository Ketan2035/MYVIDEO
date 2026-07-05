import express from "express";
import { createServer } from "node:http";
import { connectToSocket } from "./controllers/socketManager.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);

connectToSocket(server);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT || 8000;

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${connectionDb.connection.host}`);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

start();