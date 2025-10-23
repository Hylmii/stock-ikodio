import { Router, Request, Response } from "express";

const router = Router();

// GET /api/user/profile
router.get("/profile", async (req: Request, res: Response) => {
  try {
    // TODO: Get user from authenticated session
    const user = {
      id: "mock-user-id",
      email: "user@example.com",
      name: "John Doe",
      createdAt: new Date().toISOString(),
      subscription: {
        plan: "pro",
        status: "active",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/user/watchlist
router.get("/watchlist", async (req: Request, res: Response) => {
  try {
    // TODO: Fetch from database
    const watchlist = [
      { symbol: "AAPL", addedAt: new Date().toISOString() },
      { symbol: "GOOGL", addedAt: new Date().toISOString() },
      { symbol: "MSFT", addedAt: new Date().toISOString() },
      { symbol: "TSLA", addedAt: new Date().toISOString() },
    ];

    res.json({ watchlist, count: watchlist.length });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/user/watchlist
router.post("/watchlist", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol is required" });
    }

    // TODO: Add to database
    res.status(201).json({
      message: "Added to watchlist",
      symbol: symbol.toUpperCase(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/user/watchlist/:symbol
router.delete("/watchlist/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    // TODO: Remove from database
    res.json({
      message: "Removed from watchlist",
      symbol: symbol.toUpperCase(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/user/alerts
router.get("/alerts", async (req: Request, res: Response) => {
  try {
    // TODO: Fetch from database
    const alerts = [
      {
        id: "alert-1",
        symbol: "AAPL",
        condition: "price_above",
        targetPrice: 180.0,
        currentPrice: 178.32,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ];

    res.json({ alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/user/alerts
router.post("/alerts", async (req: Request, res: Response) => {
  try {
    const { symbol, condition, targetPrice } = req.body;

    if (!symbol || !condition || !targetPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // TODO: Save to database
    res.status(201).json({
      message: "Alert created",
      alert: {
        id: "new-alert-id",
        symbol: symbol.toUpperCase(),
        condition,
        targetPrice,
        status: "active",
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;