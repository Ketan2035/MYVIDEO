import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = 8000;
const DEFAULT_MONGODB_URI = "mongodb://localhost:27017/videoMeet";
const DEFAULT_CLIENT_URL = "http://localhost:3000";

const parsePort = (value) => {
    const port = Number(value);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        return DEFAULT_PORT;
    }

    return port;
};

const normalizeList = (value, fallback) => {
    if (!value) return fallback;

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parsePort(process.env.PORT),
    mongodbUri: process.env.MONGODB_URI || DEFAULT_MONGODB_URI,
    corsOrigins: normalizeList(process.env.CORS_ORIGIN, [DEFAULT_CLIENT_URL]),
    jsonLimit: process.env.JSON_LIMIT || "40kb",
    isProduction: process.env.NODE_ENV === "production"
};
