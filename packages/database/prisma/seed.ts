import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(" Starting database seed...");

  // Create test user
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
    },
  });

  console.log(" Created user:", user.email);

  // Create subscription
  const subscription = await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      plan: "pro",
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  console.log(" Created subscription:", subscription.plan);

  // Create watchlist
  const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"];
  for (const symbol of symbols) {
    await prisma.watchlist.upsert({
      where: {
        userId_symbol: {
          userId: user.id,
          symbol,
        },
      },
      update: {},
      create: {
        userId: user.id,
        symbol,
      },
    });
  }

  console.log(` Created watchlist with ${symbols.length} symbols`);

  // Create some alerts
  await prisma.alert.create({
    data: {
      userId: user.id,
      symbol: "AAPL",
      condition: "price_above",
      targetPrice: 180.0,
      status: "active",
    },
  });

  await prisma.alert.create({
    data: {
      userId: user.id,
      symbol: "TSLA",
      condition: "price_below",
      targetPrice: 240.0,
      status: "active",
    },
  });

  console.log(" Created 2 price alerts");

  // Create prediction history
  const predictions = [];
  for (let i = 0; i < 10; i++) {
    const daysAgo = i;
    const predictedPrice = 175 + Math.random() * 10;
    const actualPrice = 175 + Math.random() * 10;
    const accuracy = 100 - Math.abs(((predictedPrice - actualPrice) / actualPrice) * 100);

    predictions.push({
      userId: user.id,
      symbol: "AAPL",
      timeframe: "1d",
      predictedPrice,
      actualPrice,
      confidence: Math.floor(Math.random() * 20) + 70,
      accuracy,
      indicators: {
        rsi: 58.3,
        macd: 2.45,
        bollinger: 0.78,
      },
      aiAnalysis: {
        sentiment: "bullish",
        reasoning: "Strong momentum detected",
      },
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      validatedAt: new Date(Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000),
    });
  }

  await prisma.predictionHistory.createMany({
    data: predictions,
  });

  console.log(` Created ${predictions.length} prediction history records`);

  console.log(" Database seed completed!");
}

main()
  .catch((e) => {
    console.error(" Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });