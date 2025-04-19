import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { ServiceRoute, AppError } from "./types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Cho phép CORS
app.use(helmet()); // Bảo mật headers
app.use(morgan("combined")); // Logger
app.use(express.json()); // Parse JSON request body

// Define service routes
const serviceRoutes: ServiceRoute[] = [
  {
    prefix: "/api/users", // Requests tới /api/users
    target: process.env.USER_SERVICE_URL || "http://localhost:3001", // Chuyển tiếp đến user service
    pathRewrite: {
      "^/api/users": "/api/users", // Giữ nguyên path khi chuyển tiếp
    },
  },
  {
    prefix: "/api/products", // Requests tới /api/products
    target: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002", // Chuyển tiếp đến product service
    pathRewrite: {
      "^/api/products": "/api/products", // Giữ nguyên path khi chuyển tiếp
    },
  },
];

// Set up proxy routes
serviceRoutes.forEach((route) => {
  app.use(
    route.prefix,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true, // Thay đổi origin header
      pathRewrite: route.pathRewrite,
    })
  );
});

// Base route
app.get("/", (_req: Request, res: Response) => {
  res.send("API Gateway is running");
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "API Gateway is healthy" });
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

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
