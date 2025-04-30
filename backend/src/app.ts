import express, { Request, Response } from "express";
import mongoose from "mongoose";
import profileRouter from "./routes/profileRouter";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import problemRouter from "./routes/problemRouter";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/profile/", profileRouter);
app.use("/api/problem/", problemRouter);

const MONGODB_URI = "mongodb://localhost:27017/db_skillsbridge";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;
