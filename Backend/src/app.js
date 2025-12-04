import express from "express";

import mongoose from "mongoose";

import { connectToSoket } from "./controllers/socketManager.js";

import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = connectToSoket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb" ,extended:"true"}));

app.get("/", (req, res) => {
  res.send("hello ");
});

const start = async () => {
  const connectionDb = await mongoose.connect(
    "mongodb+srv://ketanrs59_db_user:NQ2ZC6AZdcLVTvwq@cluster0.ncc2qkl.mongodb.net/"
  );
  console.log(`mongoose connected to db Host: ${connectionDb.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("listening on port 8000");
  });
};
start();
