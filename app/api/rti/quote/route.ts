import { NextRequest, NextResponse } from "next/server";
import { getRTIQuote } from "@/lib/services/rti-business.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }
  try {
    const data = await getRTIQuote(symbol);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch RTI data" }, { status: 500 });
  }
}
