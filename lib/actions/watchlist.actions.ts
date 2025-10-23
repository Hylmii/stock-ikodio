'use server';

import prisma from '@/database/prisma';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (!user) return [];

    // Get watchlist items for this user
    const items = await prisma.watchlist.findMany({
      where: { userId: user.id },
      select: { symbol: true }
    });

    return items.map((item: { symbol: string }) => item.symbol);
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}