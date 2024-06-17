import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectToMongoDB from "./db/connectToMongoDB.js";

import authRouters from "./routes/auth.routes.js";
import messageRouters from "./routes/message.routes.js";
import userRouters from "./routes/user.routes.js";
import { app,server } from "./socket/socket.js";


const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouters);
app.use("/api/message", messageRouters);
app.use("/api/users", userRouters);

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
