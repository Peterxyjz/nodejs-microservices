import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import productRoutes from "./routes";
import { connectDB } from "./config/db";
import { AppError } from "./types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/products", productRoutes);

// Base route
app.get("/", (_req: Request, res: Response) => {
  res.send("Product Service is running");
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Product Service is healthy" });
});

// Error handling middleware
app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Handle mongoose errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Product Service is running on port ${PORT}`);
});
