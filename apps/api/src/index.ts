import express, { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import stockRoutes from "./routes/stock";
import predictionRoutes from "./routes/prediction";
import userRoutes from "./routes/user";
import { initializeWebSocket } from "./websocket";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/user", userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(errorHandler);

// Initialize WebSocket
initializeWebSocket(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` WebSocket server initialized`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});

export { io };