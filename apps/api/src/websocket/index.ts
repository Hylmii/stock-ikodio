import { Server, Socket } from "socket.io";

interface SubscriptionData {
  symbols: string[];
}

// Store active subscriptions
const subscriptions = new Map<string, Set<string>>();

export function initializeWebSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle subscription
    socket.on("subscribe", (data: SubscriptionData) => {
      const { symbols } = data;

      if (!Array.isArray(symbols) || symbols.length === 0) {
        socket.emit("error", { message: "Invalid symbols" });
        return;
      }

      // Add subscriptions
      if (!subscriptions.has(socket.id)) {
        subscriptions.set(socket.id, new Set());
      }

      const clientSubs = subscriptions.get(socket.id)!;
      symbols.forEach(symbol => {
        clientSubs.add(symbol.toUpperCase());
        socket.join(`stock:${symbol.toUpperCase()}`);
      });

      console.log(`Client ${socket.id} subscribed to: ${symbols.join(", ")}`);
      socket.emit("subscribed", { symbols });
    });

    // Handle unsubscription
    socket.on("unsubscribe", (data: SubscriptionData) => {
      const { symbols } = data;

      if (!Array.isArray(symbols) || symbols.length === 0) {
        return;
      }

      const clientSubs = subscriptions.get(socket.id);
      if (clientSubs) {
        symbols.forEach(symbol => {
          clientSubs.delete(symbol.toUpperCase());
          socket.leave(`stock:${symbol.toUpperCase()}`);
        });
      }

      console.log(
        `Client ${socket.id} unsubscribed from: ${symbols.join(", ")}`
      );
      socket.emit("unsubscribed", { symbols });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      subscriptions.delete(socket.id);
    });
  });

  // Start mock data streaming (for development)
  startMockDataStream(io);
}

// Mock data stream for development
function startMockDataStream(io: Server) {
  const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"];
  const basePrices: Record<string, number> = {
    AAPL: 178.32,
    GOOGL: 142.65,
    MSFT: 412.89,
    TSLA: 248.21,
    AMZN: 178.35,
  };

  setInterval(() => {
    symbols.forEach(symbol => {
      const basePrice = basePrices[symbol];
      const volatility = 2;
      const change = (Math.random() - 0.5) * volatility;
      const price = basePrice + change;
      const changePercent = (change / basePrice) * 100;

      const update = {
        symbol,
        price: Number(price.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        timestamp: Date.now(),
        open: Number((basePrice - Math.random() * 2).toFixed(2)),
        high: Number((price + Math.random() * 2).toFixed(2)),
        low: Number((price - Math.random() * 2).toFixed(2)),
      };

      // Broadcast to subscribers
      io.to(`stock:${symbol}`).emit("stock_update", update);
    });
  }, 2000); // Update every 2 seconds

  console.log(" Mock data stream started");
}
