import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import connectToMongoDB from "./db/connectToMongoDB.js";

import authRouters from "./routes/auth.routes.js";
import messageRouters from "./routes/message.routes.js";
import userRouters from "./routes/user.routes.js";
import { app,server } from "./socket/socket.js";


const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouters);
app.use("/api/message", messageRouters);
app.use("/api/users", userRouters);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
